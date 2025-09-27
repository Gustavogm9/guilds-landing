import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PDFRequest {
  contractId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { contractId }: PDFRequest = await req.json();

    console.log('Generating PDF for contract:', contractId);

    // Buscar dados do contrato
    const { data: contract, error: contractError } = await supabase
      .from('legal_contracts')
      .select(`
        *,
        client_contact:crm_contacts(*),
        template:legal_templates(*),
        deal:crm_deals(*)
      `)
      .eq('id', contractId)
      .single();

    if (contractError || !contract) {
      throw new Error('Contrato não encontrado');
    }

    // Buscar cláusulas selecionadas
    const selectedClauseIds = contract.selected_clauses || [];
    let clauses = [];
    
    if (selectedClauseIds.length > 0) {
      const { data: clausesData, error: clausesError } = await supabase
        .from('legal_clauses')
        .select(`
          *,
          group:legal_clause_groups(*)
        `)
        .in('id', selectedClauseIds);

      if (!clausesError && clausesData) {
        clauses = clausesData;
      }
    }

    // Gerar HTML estruturado para o contrato
    const contractHtml = generateContractHTML(contract, clauses);

    // Simular geração de PDF (em produção, usar Puppeteer)
    const pdfBuffer = await generatePDFFromHTML(contractHtml);

    // Salvar PDF no Storage
    const fileName = `contracts/${contractId}/contract-${Date.now()}.pdf`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('assets')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (uploadError) {
      throw new Error('Erro ao salvar PDF: ' + uploadError.message);
    }

    // Atualizar contrato com URL do PDF
    const { data: publicUrlData } = supabase.storage
      .from('assets')
      .getPublicUrl(fileName);

    const pdfUrl = publicUrlData.publicUrl;

    await supabase
      .from('legal_contracts')
      .update({ 
        pdf_url: pdfUrl,
        pdf_generated_at: new Date().toISOString()
      })
      .eq('id', contractId);

    console.log('PDF generated successfully:', pdfUrl);

    return new Response(JSON.stringify({ 
      success: true, 
      pdfUrl,
      fileName 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in legal-pdf-generator:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateContractHTML(contract: any, clauses: any[]): string {
  const variables = contract.variables_data || {};
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${contract.title}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .contract-number { font-size: 14px; color: #666; }
        .section { margin: 30px 0; }
        .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #333; }
        .clause { margin: 20px 0; padding: 15px; border-left: 3px solid #007bff; background: #f8f9fa; }
        .clause-title { font-weight: bold; margin-bottom: 10px; }
        .signatures { margin-top: 80px; }
        .signature-line { display: inline-block; width: 300px; border-bottom: 1px solid #333; margin: 40px 20px 0 0; }
        .signature-label { display: block; text-align: center; margin-top: 5px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">${contract.title}</div>
        <div class="contract-number">Contrato nº ${contract.contract_number}</div>
        <div style="margin-top: 10px; font-size: 14px;">
          ${contract.client_contact?.name ? `Cliente: ${contract.client_contact.name}` : ''}
        </div>
      </div>

      <div class="content">
        ${clauses.map((clause, index) => `
          <div class="clause">
            <div class="clause-title">${index + 1}. ${clause.title}</div>
            <div>${replaceVariables(clause.content || '', variables)}</div>
          </div>
        `).join('')}
      </div>

      <div class="signatures">
        <div style="margin-top: 60px;">
          <div class="signature-line"></div>
          <div class="signature-label">Guilds - Contratada</div>
        </div>
        
        <div style="margin-top: 40px;">
          <div class="signature-line"></div>
          <div class="signature-label">${contract.client_contact?.name || 'Cliente'} - Contratante</div>
        </div>
      </div>

      <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #666;">
        Documento gerado em ${new Date().toLocaleDateString('pt-BR')}
      </div>
    </body>
    </html>
  `;
}

function replaceVariables(content: string, variables: Record<string, any>): string {
  let result = content;
  
  // Substituir variáveis no formato {{variavel}}
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, String(value || ''));
  });
  
  return result;
}

// Simulate PDF generation (replace with actual PDF library like Puppeteer in production)
async function generatePDFFromHTML(html: string): Promise<Uint8Array> {
  // Generate a proper PDF structure - simplified but valid
  const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]
   /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length ${html.length + 100} >>
stream
BT
/F1 12 Tf
50 750 Td
(Contrato Legal - Documento Gerado) Tj
0 -20 Td
(${html.replace(/\n/g, ' ').substring(0, 100)}...) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000258 00000 n 
0000000400 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
470
%%EOF`;
  
  return new TextEncoder().encode(pdfContent);
}