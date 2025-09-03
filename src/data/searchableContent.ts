import type { SearchableContent } from "@/lib/searchEngine";

export const searchableContent: SearchableContent[] = [
  // Home Page
  {
    id: "home",
    type: "page",
    title: "Guilds - Sistemas inteligentes, resultados reais",
    description: "Soluções digitais sob medida com foco em ROI. Desenvolvemos software, apps, automação, IA e jogos corporativos para PMEs e médias empresas.",
    content: "Guilds oferece soluções digitais personalizadas para empresas que buscam inovação e resultados reais. Nossa equipe sênior desenvolve sistemas inteligentes, automação de processos, inteligência artificial, aplicativos móveis e jogos corporativos. Focamos em ROI mensurável e entrega ágil.",
    url: "/",
    tags: ["guilds", "desenvolvimento", "software", "automação", "ia", "jogos corporativos", "inovação"],
    category: "empresa",
    locale: "pt-BR",
    priority: 10
  },

  // Services Pages
  {
    id: "services-software",
    type: "service",
    title: "Desenvolvimento de Software e Aplicativos",
    description: "Criamos software sob medida e aplicativos móveis que otimizam processos e geram resultados mensuráveis para seu negócio.",
    content: "Desenvolvimento de software personalizado, aplicativos móveis nativos e web apps. Utilizamos tecnologias modernas como React, Node.js, Python e frameworks mobile. Integrações com APIs, sistemas legados e soluções em nuvem. Metodologia ágil com entregas incrementais.",
    url: "/servicos/software-apps",
    tags: ["software", "aplicativos", "mobile", "web", "react", "nodejs", "python", "apis"],
    category: "servicos",
    locale: "pt-BR",
    priority: 9
  },

  {
    id: "services-automation",
    type: "service", 
    title: "Automação e Inteligência Artificial",
    description: "Automatizamos processos repetitivos e implementamos IA para aumentar produtividade e reduzir custos operacionais.",
    content: "Automação de processos com RPA, chatbots inteligentes, machine learning, processamento de linguagem natural, computer vision. Integrações com WhatsApp, sistemas ERP, CRM. Análise preditiva e otimização de workflows.",
    url: "/servicos/automacao-ia",
    tags: ["automação", "ia", "rpa", "chatbots", "machine learning", "nlp", "computer vision"],
    category: "servicos",
    locale: "pt-BR",
    priority: 9
  },

  {
    id: "services-games",
    type: "service",
    title: "Jogos Corporativos e Gamificação",
    description: "Desenvolvemos jogos corporativos e sistemas de gamificação para engajar equipes e melhorar resultados de treinamento.",
    content: "Jogos corporativos para treinamento, onboarding, team building. Sistemas de gamificação para vendas, produtividade, engajamento. Serious games, simuladores, realidade virtual. Métricas de engagement e performance.",
    url: "/servicos/jogos-gamificacao",
    tags: ["jogos", "gamificação", "treinamento", "engagement", "serious games", "vr"],
    category: "servicos",
    locale: "pt-BR",
    priority: 8
  },

  {
    id: "services-consulting",
    type: "service",
    title: "Consultoria em Transformação Digital",
    description: "Consultoria estratégica para acelerar sua jornada de transformação digital com foco em resultados práticos.",
    content: "Diagnóstico digital, estratégia de transformação, roadmap tecnológico, arquitetura de soluções, gestão de mudança. Análise de processos, identificação de oportunidades de automação, implementação de novas tecnologias.",
    url: "/servicos/consultoria",
    tags: ["consultoria", "transformação digital", "estratégia", "diagnóstico", "roadmap"],
    category: "servicos",
    locale: "pt-BR",
    priority: 7
  },

  // Guilds Lab
  {
    id: "lab-home",
    type: "page",
    title: "Guilds Lab - Pessoas no centro. Habilidades que escalam",
    description: "Workshops práticos B2B em tecnologia, inovação e transformação digital. Capacitação hands-on para equipes e lideranças.",
    content: "Guilds Lab oferece workshops corporativos focados em capacitação prática. Nossos programas cobrem desenvolvimento de software, automação, IA, metodologias ágeis, liderança digital. Formato presencial e online, com projetos reais.",
    url: "/lab",
    tags: ["workshops", "treinamento", "capacitação", "b2b", "tecnologia", "hands-on"],
    category: "lab",
    locale: "pt-BR",
    priority: 8
  },

  {
    id: "workshop-ai-fundamentals",
    type: "workshop",
    title: "Workshop: Fundamentos de IA para Negócios",
    description: "Workshop prático sobre como implementar inteligência artificial em processos empresariais, com cases reais e ROI mensurável.",
    content: "Workshop de 16 horas sobre fundamentos de IA aplicada aos negócios. Inclui machine learning, processamento de linguagem natural, computer vision, automação inteligente. Hands-on com ferramentas no-code e low-code.",
    url: "/lab/workshop/ia-fundamentos",
    tags: ["workshop", "ia", "machine learning", "automação", "no-code", "roi"],
    category: "workshops",
    locale: "pt-BR",
    priority: 7,
    date: "2024-03-15"
  },

  // Guilds Craft
  {
    id: "craft-home",
    type: "page", 
    title: "Guilds Craft - Da ideia ao impacto",
    description: "P&D colaborativo e parcerias estratégicas. Transformamos ideias inovadoras em soluções de mercado através de co-criação.",
    content: "Guilds Craft é nossa vertical de pesquisa e desenvolvimento colaborativo. Fazemos parcerias com empresas para co-criar soluções inovadoras, desde MVPs até produtos escaláveis. Foco em tecnologias emergentes e modelos de negócio disruptivos.",
    url: "/craft",
    tags: ["craft", "p&d", "inovação", "parcerias", "co-criação", "mvp"],
    category: "craft",
    locale: "pt-BR",
    priority: 6
  },

  // Company Pages
  {
    id: "about",
    type: "page",
    title: "Sobre a Guilds - Nossa história e valores",
    description: "Conheça a história da Guilds, nossos valores, equipe e missão de democratizar tecnologia para empresas brasileiras.",
    content: "A Guilds nasceu da paixão por tecnologia e do desejo de democratizar soluções digitais para empresas brasileiras. Nossa equipe multidisciplinar combina expertise técnica com visão de negócios, entregando resultados mensuráveis.",
    url: "/sobre",
    tags: ["sobre", "empresa", "história", "valores", "equipe", "missão"],
    category: "empresa",
    locale: "pt-BR",
    priority: 5
  },

  {
    id: "team",
    type: "page",
    title: "Nossa Equipe - Especialistas em tecnologia",
    description: "Conheça os especialistas da Guilds: desenvolvedores seniores, cientistas de dados, designers UX e consultores em transformação digital.",
    content: "Nossa equipe é formada por profissionais seniores com vasta experiência em desenvolvimento, IA, automação, games e consultoria. Cada membro traz expertise específica para entregar soluções de alta qualidade.",
    url: "/equipe",
    tags: ["equipe", "especialistas", "desenvolvedores", "cientistas de dados", "designers"],
    category: "empresa",
    locale: "pt-BR",
    priority: 4
  },

  {
    id: "contact",
    type: "page",
    title: "Contato - Fale com a Guilds",
    description: "Entre em contato conosco para discutir seu projeto. Atendimento personalizado com foco em entender suas necessidades específicas.",
    content: "Fale conosco para discutir como podemos ajudar em seu projeto de transformação digital. Oferecemos consultoria gratuita para entender suas necessidades e propor soluções adequadas.",
    url: "/contato",
    tags: ["contato", "consultoria", "projeto", "atendimento"],
    category: "contato",
    locale: "pt-BR",
    priority: 6
  },

  // Technology Content
  {
    id: "tech-react",
    type: "content",
    title: "React.js - Desenvolvimento de interfaces modernas",
    description: "Utilizamos React.js para criar interfaces de usuário responsivas, performáticas e com excelente experiência do usuário.",
    content: "React é nossa principal tecnologia para desenvolvimento frontend. Criamos SPAs, PWAs e aplicações web complexas com componentes reutilizáveis, gerenciamento de estado avançado e integração com APIs.",
    url: "/tecnologias/react",
    tags: ["react", "frontend", "spa", "pwa", "javascript", "typescript"],
    category: "tecnologias",
    locale: "pt-BR",
    priority: 5
  },

  {
    id: "tech-nodejs",
    type: "content",
    title: "Node.js - Backend escalável e performático",
    description: "Desenvolvemos APIs REST e GraphQL com Node.js, garantindo escalabilidade e performance para suas aplicações.",
    content: "Node.js é nossa escolha para desenvolvimento backend. Criamos APIs robustas, microserviços, integrações com bancos de dados SQL e NoSQL, autenticação JWT, real-time com WebSockets.",
    url: "/tecnologias/nodejs",
    tags: ["nodejs", "backend", "api", "graphql", "microservicos", "websockets"],
    category: "tecnologias",
    locale: "pt-BR",
    priority: 5
  },

  {
    id: "tech-ai",
    type: "content",
    title: "Inteligência Artificial - Soluções práticas para negócios",
    description: "Implementamos IA de forma prática e escalável: chatbots, análise preditiva, automação inteligente e processamento de dados.",
    content: "Nossa abordagem de IA foca em resultados práticos: chatbots com NLP, análise preditiva para vendas, automação de processos com ML, computer vision para qualidade, recomendação personalizada.",
    url: "/tecnologias/inteligencia-artificial", 
    tags: ["ia", "machine learning", "nlp", "chatbots", "computer vision", "análise preditiva"],
    category: "tecnologias",
    locale: "pt-BR",
    priority: 8
  },

  // Use Cases / Industries
  {
    id: "case-retail",
    type: "case",
    title: "Automação para E-commerce - 300% de aumento em conversões",
    description: "Case de sucesso: implementamos automação inteligente que aumentou conversões em 300% e reduziu abandono de carrinho em 45%.",
    content: "Desenvolvemos sistema de automação para e-commerce com chatbot inteligente, remarketing personalizado, análise preditiva de comportamento e recomendações em tempo real. Resultado: 300% aumento em conversões.",
    url: "/cases/ecommerce-automation",
    tags: ["case", "ecommerce", "automação", "chatbot", "conversões", "remarketing"],
    category: "cases",
    locale: "pt-BR",
    priority: 9,
    date: "2024-02-20"
  },

  {
    id: "case-manufacturing",
    type: "case", 
    title: "IA para Indústria - 40% redução em defeitos de qualidade",
    description: "Implementamos computer vision e machine learning que reduziu defeitos em 40% e aumentou eficiência da linha de produção.",
    content: "Projeto de computer vision para controle de qualidade em linha de produção. Sistema detecta defeitos automaticamente, analisa padrões e sugere melhorias. Redução de 40% em defeitos e 25% aumento em produtividade.",
    url: "/cases/manufacturing-ai",
    tags: ["case", "indústria", "computer vision", "qualidade", "machine learning", "produção"],
    category: "cases",
    locale: "pt-BR",
    priority: 8,
    date: "2024-01-10"
  }
];

// Helper function to get content by category
export const getContentByCategory = (category: string): SearchableContent[] => {
  return searchableContent.filter(item => item.category === category);
};

// Helper function to get content by type
export const getContentByType = (type: string): SearchableContent[] => {
  return searchableContent.filter(item => item.type === type);
};

// Helper function to get recent content
export const getRecentContent = (days: number = 30): SearchableContent[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return searchableContent.filter(item => 
    item.date && new Date(item.date) >= cutoffDate
  );
};