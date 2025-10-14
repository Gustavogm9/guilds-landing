import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function generatePDFFromHTML(html: string, proposal: any, version: any): Promise<Uint8Array> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '24mm', bottom: '24mm', left: '20mm', right: '20mm' },
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-size: 10px; width: 100%; text-align: center; color: #666; padding: 0 20mm;">
          <strong>Guilds</strong>
        </div>
      `,
      footerTemplate: `
        <div style="font-size: 10px; width: 100%; text-align: center; color: #666; padding: 0 20mm;">
          Proposta — ${proposal.title} | v${version.version_number} | ${new Date().toLocaleDateString('pt-BR')} | Confidencial
          <span style="float: right; margin-right: 20mm;">Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
        </div>
      `
    });

    return new Uint8Array(pdfBuffer);
  } finally {
    await browser.close();
  }
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(value);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { proposalId, versionNumber } = await req.json();
    console.log('Generating proposal PDF:', { proposalId, versionNumber });

    // 1. Buscar proposta + versão
    const { data: version, error: versionError } = await supabase
      .from('proposal_versions')
      .select('*, proposal:proposals(*)')
      .eq('proposal_id', proposalId)
      .eq('version_number', versionNumber)
      .single();

    if (versionError || !version) {
      throw new Error('Versão da proposta não encontrada');
    }

    const proposal = version.proposal;
    const variables = version.variables || {};
    const pricing = version.pricing || {};

    // 2. Gerar HTML completo
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            
            body {
              font-family: 'Inter', 'Roboto', sans-serif;
              font-size: 13px;
              line-height: 1.6;
              color: #111827;
            }
            
            h1 {
              font-size: 24px;
              font-weight: 700;
              color: #111827;
              margin-bottom: 1em;
            }
            
            h2 {
              font-size: 18px;
              font-weight: 600;
              color: #374151;
              margin-top: 1.5em;
              margin-bottom: 0.75em;
              border-bottom: 2px solid #E5E7EB;
              padding-bottom: 0.5em;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 1em 0;
            }
            
            th, td {
              border: 1px solid #E5E7EB;
              padding: 8px;
              text-align: left;
            }
            
            th {
              background: #F9FAFB;
              font-weight: 600;
            }
            
            tbody tr:nth-child(even) {
              background: #F9FAFB;
            }
          </style>
        </head>
        <body>
          <h1>${proposal.title}</h1>
          
          <h2>Cliente</h2>
          <p><strong>${variables.cliente?.razaoSocial || 'N/A'}</strong></p>
          <p>CNPJ: ${variables.cliente?.cnpj || 'N/A'}</p>
          <p>Contato: ${variables.cliente?.contato?.nome || ''} (${variables.cliente?.contato?.email || ''})</p>
          
          <h2>Investimento</h2>
          <p>Valor Total: <strong>${formatCurrency(variables.investimento?.valor || 0)}</strong></p>
          
          ${pricing.parcelas?.length ? `
          <h3>Parcelas (${variables.pagamento?.modelo || 'custom'})</h3>
          <table>
            <thead>
              <tr>
                <th>Descrição</th>
                <th style="text-align: right;">%</th>
                <th style="text-align: right;">Valor</th>
                <th>Vencimento</th>
              </tr>
            </thead>
            <tbody>
              ${pricing.parcelas.map((p: any) => `
              <tr>
                <td>${p.descricao}</td>
                <td style="text-align: right;">${p.percentual}%</td>
                <td style="text-align: right;">${formatCurrency(p.valor)}</td>
                <td>${p.vencimento}</td>
              </tr>
              `).join('')}
            </tbody>
          </table>
          ` : ''}
          
          ${variables.prazos?.sprints?.length ? `
          <h2>Sprints</h2>
          <p>Duração: ${variables.prazos.diasExecucao} dias úteis</p>
          ${variables.prazos.sprints.map((sprint: any) => `
          <div style="margin: 1em 0; padding: 1em; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h4 style="font-weight: 600;">${sprint.nome}</h4>
            <p>Período: ${new Date(sprint.inicio).toLocaleDateString('pt-BR')} a ${new Date(sprint.fim).toLocaleDateString('pt-BR')}</p>
            <ul>
              ${sprint.entregas?.map((e: string) => `<li>${e}</li>`).join('') || ''}
            </ul>
          </div>
          `).join('')}
          ` : ''}
        </body>
      </html>
    `;

    // 3. Gerar PDF com Puppeteer
    const pdfBuffer = await generatePDFFromHTML(html, proposal, version);

    // 4. Upload para Supabase Storage
    const fileName = `proposals/${proposalId}/v${versionNumber}/proposal-${Date.now()}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from('assets')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (uploadError) throw uploadError;

    // 5. Obter URL pública
    const { data: publicUrlData } = supabase.storage
      .from('assets')
      .getPublicUrl(fileName);

    const pdfUrl = publicUrlData.publicUrl;

    // 6. Atualizar proposal_version
    await supabase
      .from('proposal_versions')
      .update({ pdf_url: pdfUrl })
      .eq('id', version.id);

    console.log('PDF generated successfully:', pdfUrl);

    return new Response(JSON.stringify({ 
      success: true,
      pdf_url: pdfUrl,
      message: 'PDF gerado com sucesso'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error generating proposal:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
