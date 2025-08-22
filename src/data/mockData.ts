// Realistic mock data for Guilds website

export const clientLogos = [
  {
    name: "Ambev",
    src: "/api/placeholder/120/60",
    alt: "Ambev - Cliente Guilds"
  },
  {
    name: "Magazine Luiza",
    src: "/api/placeholder/120/60", 
    alt: "Magazine Luiza - Cliente Guilds"
  },
  {
    name: "Nubank",
    src: "/api/placeholder/120/60",
    alt: "Nubank - Cliente Guilds"
  },
  {
    name: "iFood",
    src: "/api/placeholder/120/60",
    alt: "iFood - Cliente Guilds"
  },
  {
    name: "Stone",
    src: "/api/placeholder/120/60",
    alt: "Stone - Cliente Guilds"
  },
  {
    name: "Mercado Livre",
    src: "/api/placeholder/120/60",
    alt: "Mercado Livre - Cliente Guilds"
  }
];

export const stackLogos = [
  {
    name: "React",
    src: "/api/placeholder/80/40",
    alt: "React"
  },
  {
    name: "Next.js", 
    src: "/api/placeholder/80/40",
    alt: "Next.js"
  },
  {
    name: "Bubble",
    src: "/api/placeholder/80/40", 
    alt: "Bubble"
  },
  {
    name: "n8n",
    src: "/api/placeholder/80/40",
    alt: "n8n"
  },
  {
    name: "Supabase",
    src: "/api/placeholder/80/40",
    alt: "Supabase"
  },
  {
    name: "OpenAI",
    src: "/api/placeholder/80/40",
    alt: "OpenAI"
  },
  {
    name: "WhatsApp Business",
    src: "/api/placeholder/80/40",
    alt: "WhatsApp Business"
  },
  {
    name: "Kommo CRM",
    src: "/api/placeholder/80/40",
    alt: "Kommo CRM"
  }
];

export const testimonials = [
  {
    id: "1",
    quote: "A Guilds transformou completamente nosso processo de vendas. Automatizamos 80% das tarefas manuais e aumentamos a conversão em 35%. Equipe excepcional!",
    author: {
      name: "Carlos Mendes",
      role: "Diretor Comercial",
      company: "TechFlow Solutions",
      avatar: "/api/placeholder/64/64"
    }
  },
  {
    id: "2", 
    quote: "O jogo corporativo desenvolvido pela Guilds revolucionou nossa integração de funcionários. O engajamento dos novos colaboradores subiu 90% e o tempo de onboarding caiu pela metade.",
    author: {
      name: "Ana Paula Santos",
      role: "Gerente de RH",
      company: "Grupo Innova",
      avatar: "/api/placeholder/64/64"
    }
  },
  {
    id: "3",
    quote: "Precisávamos de uma solução de IA para análise de dados em tempo real. A Guilds entregou um sistema que superou nossas expectativas, processando 10x mais informações com precisão impressionante.",
    author: {
      name: "Roberto Silva",
      role: "CTO",
      company: "DataCorp",
      avatar: "/api/placeholder/64/64"
    }
  }
];

export const featuredCases = [
  {
    title: "Sistema de Automação Comercial",
    company: "TechFlow Solutions",
    problem: "Processo manual de vendas demorado e propenso a erros",
    solution: "Automação completa com IA e integração CRM",
    metric: "+35%",
    metricLabel: "conversão",
    description: "Automatizamos 80% das tarefas manuais de vendas",
    image: "/api/placeholder/400/250"
  },
  {
    title: "Jogo de Onboarding Corporativo", 
    company: "Grupo Innova",
    problem: "Baixo engajamento na integração de funcionários",
    solution: "Gamificação do processo de onboarding",
    metric: "+90%",
    metricLabel: "engajamento",
    description: "Revolucionamos a experiência de novos colaboradores",
    image: "/api/placeholder/400/250"
  },
  {
    title: "Plataforma de IA para Análise",
    company: "DataCorp", 
    problem: "Necessidade de análise de dados em tempo real",
    solution: "Sistema de IA com processamento avançado",
    metric: "10x",
    metricLabel: "mais dados",
    description: "Processamento em tempo real com precisão excepcional",
    image: "/api/placeholder/400/250"
  }
];

export const workflowSteps = [
  {
    number: "01",
    title: "Descoberta",
    description: "Entendemos metas, restrições e métricas do seu negócio",
    icon: "search"
  },
  {
    number: "02", 
    title: "Arquitetura",
    description: "Definimos escopo, integrações e roadmap detalhado",
    icon: "blueprint"
  },
  {
    number: "03",
    title: "Entrega iterativa", 
    description: "Ciclos curtos de desenvolvimento com feedback constante",
    icon: "code"
  },
  {
    number: "04",
    title: "Validação",
    description: "Medimos uso, engajamento e ROI real da solução",
    icon: "chart"
  },
  {
    number: "05",
    title: "Escala & suporte",
    description: "Suporte contínuo, otimização e evolução do sistema",
    icon: "rocket"
  }
];

export const painPoints = [
  {
    title: "Processos manuais lentos",
    description: "que travam o crescimento da empresa",
    icon: "clock"
  },
  {
    title: "Sistemas que não conversam",
    description: "gerando retrabalho e perda de dados",
    icon: "unlink"
  },
  {
    title: "Baixa adesão de usuários",
    description: "a ferramentas e sistemas internos",
    icon: "users"
  },
  {
    title: "Treinamentos que não viram prática",
    description: "desperdiçando tempo e recursos",
    icon: "brain"
  }
];

export const services = [
  {
    title: "Desenvolvimento de Software & Apps",
    description: "Produtos digitais sob medida, do zero ao lançamento",
    features: ["Web Apps", "Mobile", "APIs", "Integrações"],
    href: "/servicos/software-apps"
  },
  {
    title: "Automação & IA", 
    description: "Automatize fluxos. Decida melhor com IA",
    features: ["RPA", "Chatbots", "Análise de dados", "Predições"],
    href: "/servicos/automacao-ia"
  },
  {
    title: "Jogos Corporativos & Gamificação",
    description: "Aprendizado que engaja. Cultura que fica",
    features: ["Serious Games", "Onboarding", "Treinamentos", "Cultura"],
    href: "/servicos/jogos-gamificacao"
  },
  {
    title: "Consultoria & Discovery",
    description: "Mapeamento de oportunidades e arquitetura estratégica",
    features: ["Diagnóstico", "Roadmaps", "Viabilidade", "Planejamento"],
    href: "/servicos/consultoria"
  }
];

export const valuePillars = [
  {
    title: "Sob medida",
    description: "Soluções personalizadas para seu contexto específico"
  },
  {
    title: "ROI em foco", 
    description: "Projetos sempre alinhados ao retorno do investimento"
  },
  {
    title: "Time sênior",
    description: "Equipe especializada com anos de experiência"
  },
  {
    title: "Entrega ágil",
    description: "Metodologia que garante rapidez sem comprometer qualidade"
  }
];