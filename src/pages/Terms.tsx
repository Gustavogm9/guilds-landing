import { SEOHead } from '@/components/seo/SEOHead';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, Clock, Mail, Phone, MapPin, AlertTriangle } from 'lucide-react';

export default function Terms() {
  const lastUpdated = '03 de Janeiro de 2025';
  const effectiveDate = '03 de Janeiro de 2025';

  return (
    <>
      <SEOHead 
        title="Termos de Uso - Guilds"
        description="Termos de Uso da Guilds. Condições para utilização de nossos serviços de desenvolvimento de software, automação, IA e workshops corporativos."
        canonicalUrl="/termos"
      />
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <FileText className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">
                  Termos de Uso
                </h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Condições para utilização de nossos serviços e plataforma digital
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Atualização: {lastUpdated}</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Vigência: {effectiveDate}</span>
                </div>
              </div>
            </div>

            {/* Aceitação */}
            <Card className="p-6 bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h2 className="text-lg font-semibold mb-2">Aceitação dos Termos</h2>
                  <p className="text-sm text-muted-foreground">
                    Ao acessar e utilizar este website e nossos serviços, você concorda automaticamente com estes 
                    Termos de Uso. Se não concordar com qualquer condição, não utilize nossos serviços.
                  </p>
                </div>
              </div>
            </Card>

            {/* Seções dos Termos */}
            <div className="space-y-8">
              
              {/* 1. Definições */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Definições</h2>
                <div className="grid gap-3">
                  {[
                    { term: 'Guilds', definition: 'Guilds Tecnologia e Inovação Ltda., empresa prestadora dos serviços' },
                    { term: 'Usuário/Cliente', definition: 'Pessoa física ou jurídica que utiliza nossos serviços ou acessa nossa plataforma' },
                    { term: 'Serviços', definition: 'Desenvolvimento de software, automação, IA, jogos corporativos e workshops oferecidos pela Guilds' },
                    { term: 'Plataforma', definition: 'Website, sistemas e demais canais digitais da Guilds' },
                    { term: 'Conteúdo', definition: 'Textos, imagens, vídeos, código-fonte e demais materiais disponibilizados' }
                  ].map((item) => (
                    <Card key={item.term} className="p-3">
                      <div className="flex gap-3">
                        <span className="font-medium text-sm min-w-fit">{item.term}:</span>
                        <span className="text-sm text-muted-foreground">{item.definition}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>

              <Separator />

              {/* 2. Serviços Oferecidos */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Serviços Oferecidos</h2>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="p-4">
                      <h3 className="font-medium mb-2">Guilds (Desenvolvimento)</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Desenvolvimento de software sob medida</li>
                        <li>Aplicações web e mobile</li>
                        <li>Automação de processos</li>
                        <li>Integração com IA</li>
                        <li>Consultoria técnica</li>
                      </ul>
                    </Card>
                    <Card className="p-4">
                      <h3 className="font-medium mb-2">Guilds Lab (Educação)</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Workshops corporativos</li>
                        <li>Treinamentos in-company</li>
                        <li>Cursos de tecnologia</li>
                        <li>Mentoria especializada</li>
                        <li>Certificações</li>
                      </ul>
                    </Card>
                  </div>
                  <Card className="p-4">
                    <h3 className="font-medium mb-2">Guilds Craft (Parcerias)</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Programa de parcerias estratégicas</li>
                      <li>Desenvolvimento conjunto de soluções</li>
                      <li>Jogos corporativos e gamificação</li>
                      <li>Pesquisa e desenvolvimento (P&D)</li>
                    </ul>
                  </Card>
                </div>
              </section>

              <Separator />

              {/* 3. Condições de Uso */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Condições de Uso da Plataforma</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">3.1 Uso Permitido</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                      <li>Acessar informações sobre nossos serviços</li>
                      <li>Solicitar orçamentos e propostas comerciais</li>
                      <li>Participar de workshops e treinamentos</li>
                      <li>Utilizar formulários de contato e qualificação</li>
                      <li>Baixar materiais educacionais disponibilizados</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">3.2 Uso Proibido</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                      <li>Atividades ilegais, fraudulentas ou prejudiciais</li>
                      <li>Violação de direitos autorais ou propriedade intelectual</li>
                      <li>Distribuição de malware, vírus ou código malicioso</li>
                      <li>Tentativas de acesso não autorizado a sistemas</li>
                      <li>Spam, phishing ou comunicações não solicitadas</li>
                      <li>Uso comercial não autorizado do conteúdo</li>
                      <li>Engenharia reversa de nossas soluções</li>
                    </ul>
                  </div>
                </div>
              </section>

              <Separator />

              {/* 4. Propriedade Intelectual */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Propriedade Intelectual</h2>
                <div className="space-y-4">
                  <Card className="p-4">
                    <h3 className="font-medium mb-2">4.1 Direitos da Guilds</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Todos os direitos de propriedade intelectual sobre a plataforma, conteúdo, código-fonte, 
                      metodologias e soluções desenvolvidas pela Guilds permanecem de nossa exclusiva propriedade.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                      <li>Marca "Guilds" e variações</li>
                      <li>Logotipos, design e identidade visual</li>
                      <li>Conteúdo do website e materiais educacionais</li>
                      <li>Metodologias e frameworks proprietários</li>
                      <li>Código-fonte e arquitetura de soluções</li>
                    </ul>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="font-medium mb-2">4.2 Direitos do Cliente</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Em projetos de desenvolvimento sob medida, o cliente adquire direitos específicos conforme contrato:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                      <li>Direito de uso da solução desenvolvida</li>
                      <li>Código-fonte quando especificado em contrato</li>
                      <li>Direitos sobre dados e conteúdo fornecidos</li>
                      <li>Licenças de uso conforme acordado</li>
                    </ul>
                  </Card>

                  <Card className="p-4">
                    <h3 className="font-medium mb-2">4.3 Uso de Conteúdo</h3>
                    <p className="text-sm text-muted-foreground">
                      O conteúdo disponibilizado pode ser utilizado para fins educacionais e informativos, 
                      sempre com atribuição adequada. Uso comercial requer autorização expressa.
                    </p>
                  </Card>
                </div>
              </section>

              <Separator />

              {/* 5. Contratos e Condições Comerciais */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Condições Comerciais</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">5.1 Processo de Contratação</h3>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-4">
                      <li>Qualificação inicial através de formulários</li>
                      <li>Reunião de descoberta e levantamento de requisitos</li>
                      <li>Elaboração de proposta comercial detalhada</li>
                      <li>Negociação e ajustes da proposta</li>
                      <li>Assinatura de contrato específico</li>
                      <li>Início da execução conforme cronograma</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">5.2 Prazos e Entregas</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                      <li>Prazos serão estabelecidos em contrato específico</li>
                      <li>Entregas seguem metodologia ágil com marcos definidos</li>
                      <li>Atrasos por fatores externos não imputáveis à Guilds não geram penalidades</li>
                      <li>Mudanças de escopo podem impactar cronograma e custos</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">5.3 Pagamentos</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                      <li>Condições de pagamento conforme contrato específico</li>
                      <li>Parcelamento em marcos de entrega quando aplicável</li>
                      <li>Multa de 2% ao mês sobre valores em atraso</li>
                      <li>Suspensão de serviços em caso de inadimplência</li>
                    </ul>
                  </div>
                </div>
              </section>

              <Separator />

              {/* 6. Garantias e Limitações */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Garantias e Limitações de Responsabilidade</h2>
                <div className="space-y-4">
                  <Card className="p-4 bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800">
                    <h3 className="font-medium mb-2">6.1 Nossas Garantias</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                      <li>Execução dos serviços conforme especificações contratuais</li>
                      <li>Qualidade técnica e boas práticas de desenvolvimento</li>
                      <li>Garantia de correção de bugs por 90 dias após entrega</li>
                      <li>Confidencialidade e sigilo das informações</li>
                      <li>Conformidade com LGPD e demais regulamentações</li>
                    </ul>
                  </Card>

                  <Card className="p-4 bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
                    <h3 className="font-medium mb-2">6.2 Limitações de Responsabilidade</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                      <li>Responsabilidade limitada ao valor do contrato</li>
                      <li>Não responsabilidade por danos indiretos ou lucros cessantes</li>
                      <li>Dependências de terceiros (APIs, serviços externos) fora de nosso controle</li>
                      <li>Resultados de negócio dependem de fatores além do escopo técnico</li>
                      <li>Uso inadequado ou modificação não autorizada das soluções</li>
                    </ul>
                  </Card>

                  <Card className="p-4">
                    <h3 className="font-medium mb-2">6.3 Força Maior</h3>
                    <p className="text-sm text-muted-foreground">
                      Não nos responsabilizamos por atrasos ou impossibilidade de cumprimento causados por 
                      eventos de força maior, incluindo desastres naturais, pandemias, guerras, greves, 
                      ou falhas em infraestrutura de terceiros.
                    </p>
                  </Card>
                </div>
              </section>

              <Separator />

              {/* 7. Política de Cancelamento */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Política de Cancelamento e Reembolso</h2>
                <div className="grid gap-4">
                  <Card className="p-4">
                    <h3 className="font-medium mb-2">7.1 Projetos de Desenvolvimento</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                      <li>Cancelamento até 7 dias após assinatura: reembolso integral</li>
                      <li>Cancelamento após início: cobrança proporcional ao trabalho executado</li>
                      <li>Entrega de todo trabalho desenvolvido até a data do cancelamento</li>
                      <li>Código-fonte entregue conforme acordado em contrato</li>
                    </ul>
                  </Card>

                  <Card className="p-4">
                    <h3 className="font-medium mb-2">7.2 Workshops e Treinamentos</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                      <li>Cancelamento até 7 dias antes: reembolso de 100%</li>
                      <li>Cancelamento de 3-7 dias antes: reembolso de 50%</li>
                      <li>Cancelamento com menos de 3 dias: sem reembolso</li>
                      <li>Reagendamento possível uma vez sem custos adicionais</li>
                    </ul>
                  </Card>

                  <Card className="p-4">
                    <h3 className="font-medium mb-2">7.3 Cancelamento pela Guilds</h3>
                    <p className="text-sm text-muted-foreground">
                      Reservamo-nos o direito de cancelar contratos em caso de inadimplência, 
                      violação destes termos, ou impossibilidade técnica/legal de execução, 
                      com reembolso proporcional quando aplicável.
                    </p>
                  </Card>
                </div>
              </section>

              <Separator />

              {/* 8. Privacidade e Dados */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Privacidade e Proteção de Dados</h2>
                <p className="text-muted-foreground mb-4">
                  O tratamento de dados pessoais é regido por nossa{' '}
                  <a href="/privacidade" className="text-primary hover:underline">Política de Privacidade</a>
                  , em conformidade com a LGPD. Principais pontos:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Coleta apenas de dados necessários para prestação dos serviços</li>
                  <li>Consentimento explícito para uso em marketing</li>
                  <li>Segurança e criptografia de dados sensíveis</li>
                  <li>Direito de acesso, retificação e exclusão</li>
                  <li>Compartilhamento limitado a parceiros essenciais</li>
                </ul>
              </section>

              <Separator />

              {/* 9. Modificações */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Alterações dos Termos</h2>
                <p className="text-muted-foreground mb-4">
                  Estes Termos de Uso podem ser atualizados periodicamente. Alterações significativas 
                  serão comunicadas com antecedência mínima de 30 dias através de:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Notificação por email aos usuários cadastrados</li>
                  <li>Aviso destacado no website</li>
                  <li>Atualização da data de última modificação</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  O uso continuado dos serviços após as alterações constitui aceitação dos novos termos.
                </p>
              </section>

              <Separator />

              {/* 10. Lei Aplicável */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Lei Aplicável e Foro</h2>
                <Card className="p-4">
                  <div className="space-y-2">
                    <p className="text-muted-foreground">
                      Estes Termos são regidos pela legislação brasileira. Eventuais disputas serão 
                      dirimidas pelo foro da Comarca de São Paulo - SP, com exclusão de qualquer outro, 
                      por mais privilegiado que seja.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Mediação:</strong> Priorizamos a resolução amigável de conflitos através de mediação antes de processos judiciais.
                    </p>
                  </div>
                </Card>
              </section>

              <Separator />

              {/* 11. Contato */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">11. Contato e Suporte</h2>
                <Card className="p-6 bg-muted/30">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Guilds Tecnologia e Inovação Ltda.</h3>
                      <p className="text-sm text-muted-foreground">CNPJ: XX.XXX.XXX/0001-XX</p>
                    </div>
                    
                    <div className="grid gap-2 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-primary" />
                          <span>contato@guilds.com.br</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-primary" />
                          <span>(11) 99999-9999</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>São Paulo - SP, Brasil</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        Para dúvidas sobre estes Termos de Uso, entre em contato conosco através dos canais acima.
                      </p>
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