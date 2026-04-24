export interface PortfolioCase {
  id: string;
  title: string;
  sector: string;
  shortDesc: string;
  impact: string;
  techStack: string[];
  isLive: boolean;
  realProjectLink?: string;
}

export const portfolioCases: PortfolioCase[] = [
  {
    id: "lexflow",
    title: "CRM Jurídico + Qualificação via IA",
    sector: "LegalTech",
    shortDesc: "Plataforma comercial para escritórios de advocacia. Qualificação de leads 24/7 via WhatsApp bot, geração automática de propostas e integração de e-sign.",
    impact: "Redução de 3 assinaturas SaaS para 1. Atendimento de novos clientes 24/7 sem intervenção humana inicial.",
    techStack: ["React", "Node.js", "PostgreSQL", "n8n", "OpenAI"],
    isLive: false
  },
  {
    id: "nutrimatch",
    title: "Motor de Engajamento de Pacientes",
    sector: "HealthTech",
    shortDesc: "Portal completo de gestão para profissionais de saúde com agente de IA no WhatsApp que envia lembretes diários personalizados e mede aderência.",
    impact: "Prevenção direta do abandono precoce de pacientes. Aumento massivo na taxa de retorno no 3º mês.",
    techStack: ["React", "Node.js", "PostgreSQL", "n8n", "OpenAI"],
    isLive: false
  },
  {
    id: "urban-ai",
    title: "Inteligência de Mercado e Dados Imobiliários",
    sector: "PropTech",
    shortDesc: "Pipeline de dados que extrai informações de portais imobiliários e aplica modelos matemáticos para prever tendências do mercado.",
    impact: "Extração automatizada de milhares de pontos de dados sem intervenção humana. Tomada de decisão em tempo real.",
    techStack: ["NestJS", "Next.js", "Python", "Prefect", "AWS"],
    isLive: true
  },
  {
    id: "neosaude",
    title: "Plataforma White-label B2B2C",
    sector: "Saúde Ocupacional",
    shortDesc: "SaaS de gestão onde clínicas administram empresas corporativas, médicos e funcionários. Questionários dinâmicos e relatórios de conformidade.",
    impact: "Centralização da operação. Maior velocidade na entrega de atestados e relatórios corporativos.",
    techStack: ["React", "Node.js", "PostgreSQL", "AWS"],
    isLive: true,
    realProjectLink: "https://neosystem.guilds.com.br"
  },
  {
    id: "psicolab",
    title: "SaaS White-label para Psicologia Corporativa",
    sector: "HealthTech",
    shortDesc: "Sistema operacional para consultorias de saúde mental rodarem programas corporativos B2B completos, do assessment aos relatórios de ROI.",
    impact: "Profissionalização da entrega B2B para consultorias com faturamento automatizado.",
    techStack: ["React", "Node.js", "PostgreSQL", "Asaas API"],
    isLive: true,
    realProjectLink: "https://psicosystem.guilds.com.br"
  },
  {
    id: "doavya",
    title: "Automação de Filantropia e Seguros",
    sector: "InsurTech",
    shortDesc: "Plataforma E-commerce para venda de produtos ligados a sorteios filantrópicos. Automação completa do processamento do sorteio com a seguradora.",
    impact: "Processamento de até 300 sorteios automatizados mensais sem operação manual.",
    techStack: ["Bubble", "APIs de Pagamento", "RPA"],
    isLive: true
  },
  {
    id: "orbita-educa",
    title: "Plataforma EAD com IA de Áudio",
    sector: "EdTech",
    shortDesc: "Plataforma gamificada de idiomas. Análise em tempo real de pronúncia via IA, acesso rápido por QR code e missões diárias.",
    impact: "Engajamento contínuo dos alunos fora da sala de aula com correção de pronúncia assíncrona.",
    techStack: ["React", "IA Áudio", "Cloud"],
    isLive: true
  },
  {
    id: "conshub",
    title: "Hub de Imóveis e Consórcios com IA",
    sector: "Imobiliário",
    shortDesc: "Ecossistema digital conectando carteiras de consórcio, inventário de imóveis e um assistente de WhatsApp para qualificação de interessados.",
    impact: "Fim das planilhas dispersas. Visibilidade total de cross-sell entre consórcio e imóvel.",
    techStack: ["React", "Node.js", "PostgreSQL", "n8n", "WhatsApp API"],
    isLive: true
  },
  {
    id: "ourogest",
    title: "Gestão de Operações e Commodities",
    sector: "Financeiro",
    shortDesc: "Sistema fechado para traders de fomento, gerindo inventário em tempo real, cálculo de comissões automático e posição de caixa.",
    impact: "De 60 horas de trabalho manual administrativo para posições de caixa atualizadas em 5 segundos.",
    techStack: ["React", "Node.js", "PostgreSQL"],
    isLive: false
  },
  {
    id: "geomapper",
    title: "Mapeamento Urbano Gamificado",
    sector: "GovTech",
    shortDesc: "Plataforma que transforma cidadãos/estudantes em coletores de dados urbanos através de mecânicas de jogos e missões diárias.",
    impact: "Redução de 70% no tempo de mapeamento urbano em relação às pesquisas tradicionais da prefeitura.",
    techStack: ["React", "Node.js", "Mapbox", "IA Classification"],
    isLive: false
  },
  {
    id: "eduflow",
    title: "Automação Operacional para Educadores",
    sector: "EdTech",
    shortDesc: "Substituição do trabalho braçal de cobrança e envio de links de aula por automações, evoluindo para um CRM completo do aluno.",
    impact: "Elimina de 6 a 8 horas por semana de trabalho administrativo para professores e mentores.",
    techStack: ["n8n", "React", "Node.js", "WhatsApp API"],
    isLive: false
  },
  {
    id: "pharmabot",
    title: "Automação de Comunicação para Varejo",
    sector: "Varejo",
    shortDesc: "Sistema no WhatsApp que notifica automaticamente clientes sobre status de pedidos, receitas prontas e lembretes.",
    impact: "Redução do tempo de comunicação manual em 80%. Tempos de resposta abaixo de 1 segundo.",
    techStack: ["n8n", "WhatsApp API"],
    isLive: false
  },
  {
    id: "pharmsync",
    title: "Sincronização de E-commerce e Back-office",
    sector: "Varejo",
    shortDesc: "Camada de automação que puxa pedidos do Nuvemshop direto para o sistema interno da operação, imprimindo etiquetas sem toque humano.",
    impact: "Eliminação da margem de erro de digitação de pedidos (que era de 5%) para zero absoluto.",
    techStack: ["n8n", "Nuvemshop API", "Webhooks"],
    isLive: false
  },
  {
    id: "psiconsult",
    title: "CRM e Avaliações para Consultores B2B",
    sector: "Recursos Humanos",
    shortDesc: "Sistema operacional para consultores individuais. Geração de propostas, faturamento automático e construção de assessments para clientes.",
    impact: "Consultores independentes com infraestrutura e segurança de dados de uma grande agência.",
    techStack: ["React", "Node.js", "PostgreSQL", "APIs de Pagamento"],
    isLive: false
  },
  {
    id: "bizops",
    title: "CRM e Operações para PME B2B",
    sector: "B2B Services",
    shortDesc: "Plataforma unificada gerindo o funil de vendas, emissão de propostas PDF e disparos de alertas de reposição de estoque dos clientes.",
    impact: "Visibilidade imediata sobre margens reais de lucro por projeto e taxa de conversão.",
    techStack: ["React", "Node.js", "PostgreSQL"],
    isLive: false
  },
  {
    id: "brandlaunch",
    title: "Fundação de Presença Digital",
    sector: "Marketing",
    shortDesc: "Setup arquitetônico completo: site institucional otimizado, configuração de funis de Ads (Meta/Google), trackeamento avançado (GA4 + Pixel).",
    impact: "Empresas com tráfego e dados 100% monitorados e prontos para escalar investimento com segurança.",
    techStack: ["Webflow", "Meta Ads API", "GA4", "GTM"],
    isLive: true
  }
];
