import { SEOHead } from '@/components/seo/SEOHead';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Shield, Mail, Phone, MapPin, Clock, User } from 'lucide-react';

export default function Privacy() {
  const lastUpdated = '03 de Janeiro de 2025';

  return (
    <>
      <SEOHead 
        title="Política de Privacidade - Guilds"
        description="Política de Privacidade da Guilds. Saiba como coletamos, utilizamos e protegemos seus dados pessoais em conformidade com a LGPD."
        canonicalUrl="/privacidade"
      />
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Shield className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">
                  Política de Privacidade
                </h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Transparência total sobre como tratamos seus dados pessoais em conformidade com a LGPD
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Última atualização: {lastUpdated}</span>
              </div>
            </div>

            {/* Introdução */}
            <Card className="p-6 bg-primary/5 border-primary/20">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Seus direitos são nossa prioridade
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                A Guilds está comprometida com a proteção da sua privacidade e dos seus dados pessoais. 
                Esta Política de Privacidade explica como coletamos, utilizamos, armazenamos e protegemos 
                suas informações pessoais, em total conformidade com a Lei Geral de Proteção de Dados (LGPD) 
                e demais regulamentações aplicáveis.
              </p>
            </Card>

            {/* Seções da Política */}
            <div className="space-y-8">
              
              {/* 1. Informações Coletadas */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Informações que Coletamos</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">1.1 Dados Pessoais Fornecidos</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                      <li>Nome completo e dados de contato (email, telefone)</li>
                      <li>Informações profissionais (empresa, cargo, área de atuação)</li>
                      <li>Dados fornecidos em formulários de contato e qualificação</li>
                      <li>Informações de inscrição em workshops e eventos</li>
                      <li>Conteúdo de comunicações conosco</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">1.2 Dados Coletados Automaticamente</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                      <li>Informações de navegação (páginas visitadas, tempo de permanência)</li>
                      <li>Dados técnicos (endereço IP, navegador, sistema operacional)</li>
                      <li>Cookies e tecnologias similares de rastreamento</li>
                      <li>Dados de interação com nosso conteúdo e campanhas</li>
                    </ul>
                  </div>
                </div>
              </section>

              <Separator />

              {/* 2. Finalidades */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Como Utilizamos suas Informações</h2>
                <div className="grid gap-4">
                  {[
                    {
                      title: 'Prestação de Serviços',
                      items: [
                        'Responder às suas solicitações e fornecer suporte',
                        'Desenvolver e entregar soluções personalizadas',
                        'Gerenciar sua participação em workshops e eventos',
                        'Processar e acompanhar propostas comerciais'
                      ]
                    },
                    {
                      title: 'Comunicação e Marketing',
                      items: [
                        'Enviar newsletters e conteúdos educacionais',
                        'Informar sobre novos serviços e workshops',
                        'Personalizar nossa comunicação com você',
                        'Realizar pesquisas de satisfação'
                      ]
                    },
                    {
                      title: 'Melhorias e Analytics',
                      items: [
                        'Analisar o uso do site para melhorias',
                        'Desenvolver novos produtos e serviços',
                        'Realizar estudos de mercado e tendências',
                        'Otimizar nossa estratégia digital'
                      ]
                    },
                    {
                      title: 'Cumprimento Legal',
                      items: [
                        'Cumprir obrigações legais e regulatórias',
                        'Responder a solicitações de autoridades',
                        'Proteger nossos direitos legais',
                        'Prevenir fraudes e atividades ilegais'
                      ]
                    }
                  ].map((category) => (
                    <Card key={category.title} className="p-4">
                      <h3 className="font-medium mb-2">{category.title}</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                        {category.items.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </Card>
                  ))}
                </div>
              </section>

              <Separator />

              {/* 3. Base Legal */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Base Legal para Tratamento</h2>
                <div className="grid gap-4">
                  <Card className="p-4">
                    <h3 className="font-medium mb-2">Consentimento</h3>
                    <p className="text-sm text-muted-foreground">
                      Para envio de newsletters, comunicações de marketing e uso de cookies não essenciais.
                    </p>
                  </Card>
                  <Card className="p-4">
                    <h3 className="font-medium mb-2">Execução Contratual</h3>
                    <p className="text-sm text-muted-foreground">
                      Para prestação de serviços, desenvolvimento de soluções e gestão de workshops.
                    </p>
                  </Card>
                  <Card className="p-4">
                    <h3 className="font-medium mb-2">Interesse Legítimo</h3>
                    <p className="text-sm text-muted-foreground">
                      Para analytics, melhorias do site, segurança e desenvolvimento de negócios.
                    </p>
                  </Card>
                  <Card className="p-4">
                    <h3 className="font-medium mb-2">Cumprimento Legal</h3>
                    <p className="text-sm text-muted-foreground">
                      Para cumprimento de obrigações fiscais, trabalhistas e outras exigências legais.
                    </p>
                  </Card>
                </div>
              </section>

              <Separator />

              {/* 4. Compartilhamento */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Compartilhamento de Dados</h2>
                <p className="text-muted-foreground mb-4">
                  Não vendemos, alugamos ou comercializamos seus dados pessoais. Compartilhamos informações apenas nas seguintes situações:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li><strong>Prestadores de Serviços:</strong> Com parceiros que nos auxiliam na operação (hospedagem, email marketing, analytics)</li>
                  <li><strong>Obrigações Legais:</strong> Quando exigido por lei ou ordem judicial</li>
                  <li><strong>Proteção de Direitos:</strong> Para proteger nossos direitos, propriedade ou segurança</li>
                  <li><strong>Transações Comerciais:</strong> Em caso de fusão, aquisição ou venda de ativos (com suas devidas proteções)</li>
                </ul>
              </section>

              <Separator />

              {/* 5. Seus Direitos */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Seus Direitos (LGPD)</h2>
                <div className="grid gap-3">
                  {[
                    { right: 'Acesso', description: 'Confirmar e obter cópia dos seus dados pessoais' },
                    { right: 'Retificação', description: 'Corrigir dados incompletos, inexatos ou desatualizados' },
                    { right: 'Exclusão', description: 'Solicitar a eliminação dos dados desnecessários ou excessivos' },
                    { right: 'Portabilidade', description: 'Receber seus dados em formato estruturado' },
                    { right: 'Oposição', description: 'Opor-se ao tratamento baseado em interesse legítimo' },
                    { right: 'Revogação', description: 'Revogar seu consentimento a qualquer momento' },
                    { right: 'Informação', description: 'Obter informações sobre compartilhamento com terceiros' },
                    { right: 'Não Discriminação', description: 'Não sofrer discriminação por exercer seus direitos' }
                  ].map((item) => (
                    <Card key={item.right} className="p-3">
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <h3 className="font-medium text-sm">{item.right}</h3>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <Card className="mt-4 p-4 bg-primary/5 border-primary/20">
                  <h3 className="font-medium mb-2">Como exercer seus direitos</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>Email: contato@guilds.com.br</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>Telefone: (11) 99999-9999</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>Formulário online: <a href="/contact" className="text-primary hover:underline">guilds.com.br/contact</a></span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Prazo de resposta: até 15 dias úteis conforme LGPD
                  </p>
                </Card>
              </section>

              <Separator />

              {/* 6. Segurança */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Segurança dos Dados</h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Implementamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado, 
                    alteração, divulgação ou destruição:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Criptografia de dados em trânsito e em repouso</li>
                    <li>Controles de acesso e autenticação multi-fator</li>
                    <li>Monitoramento contínuo de segurança</li>
                    <li>Backups regulares e plano de recuperação de desastres</li>
                    <li>Treinamento regular da equipe sobre segurança da informação</li>
                    <li>Auditorias periódicas de segurança</li>
                  </ul>
                </div>
              </section>

              <Separator />

              {/* 7. Retenção */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Retenção de Dados</h2>
                <div className="grid gap-3">
                  <Card className="p-3">
                    <h3 className="font-medium text-sm">Dados de Clientes Ativos</h3>
                    <p className="text-xs text-muted-foreground">Mantidos durante a prestação do serviço + 5 anos (prazo legal)</p>
                  </Card>
                  <Card className="p-3">
                    <h3 className="font-medium text-sm">Leads e Prospects</h3>
                    <p className="text-xs text-muted-foreground">Até 2 anos sem interação ou revogação do consentimento</p>
                  </Card>
                  <Card className="p-3">
                    <h3 className="font-medium text-sm">Newsletter</h3>
                    <p className="text-xs text-muted-foreground">Até o descadastro ou 1 ano de inatividade</p>
                  </Card>
                  <Card className="p-3">
                    <h3 className="font-medium text-sm">Dados de Analytics</h3>
                    <p className="text-xs text-muted-foreground">Dados anonimizados mantidos por até 26 meses (Google Analytics)</p>
                  </Card>
                </div>
              </section>

              <Separator />

              {/* 8. Cookies */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Cookies e Tecnologias Similares</h2>
                <p className="text-muted-foreground mb-4">
                  Para informações detalhadas sobre nosso uso de cookies, consulte nossa{' '}
                  <a href="/cookies" className="text-primary hover:underline">Política de Cookies</a>.
                </p>
              </section>

              <Separator />

              {/* 9. Menores */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Proteção de Menores</h2>
                <p className="text-muted-foreground">
                  Nossos serviços são direcionados a profissionais e empresas. Não coletamos intencionalmente 
                  dados de menores de 18 anos. Caso identifiquemos tal coleta, removeremos os dados imediatamente.
                </p>
              </section>

              <Separator />

              {/* 10. Alterações */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Alterações nesta Política</h2>
                <p className="text-muted-foreground">
                  Esta Política pode ser atualizada periodicamente. Alterações significativas serão comunicadas 
                  por email ou aviso no site com 30 dias de antecedência. A data da última revisão estará sempre 
                  disponível no topo desta página.
                </p>
              </section>

              <Separator />

              {/* 11. Contato DPO */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">11. Encarregado de Proteção de Dados (DPO)</h2>
                <Card className="p-4 bg-muted/30">
                  <div className="space-y-2">
                    <p className="font-medium">Guilds Tecnologia e Inovação Ltda.</p>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>DPO: contato@guilds.com.br</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>Telefone: (11) 99999-9999</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>São Paulo, SP - Brasil</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </section>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}