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

// Software & Apps specific data
import { 
  AlertTriangle, 
  Unplug, 
  Users, 
  Zap,
  Globe,
  Smartphone,
  Database,
  MonitorSpeaker,
  Workflow,
  Link,
  TestTube,
  GitBranch,
  Lock,
  BarChart3
} from "lucide-react";

export const softwareProblems = [
  {
    title: "Sistemas legados obsoletos",
    description: "Tecnologias desatualizadas que limitam o crescimento e aumentam custos",
    icon: AlertTriangle
  },
  {
    title: "Falta de integração",
    description: "Plataformas isoladas gerando retrabalho e inconsistência de dados",
    icon: Unplug
  },
  {
    title: "Interface pouco intuitiva",
    description: "Usuários frustrados com sistemas complexos e difíceis de usar",
    icon: Users
  },
  {
    title: "Escalabilidade limitada",
    description: "Aplicações que não suportam o crescimento do negócio",
    icon: Zap
  }
];

export const softwareDeliverables = [
  {
    title: "Web Apps Responsivos",
    description: "Aplicações web modernas que funcionam perfeitamente em qualquer dispositivo",
    icon: Globe,
    features: ["React/Next.js", "PWA", "SEO otimizado", "Performance"]
  },
  {
    title: "Apps Mobile",
    description: "Aplicativos nativos e PWAs para iOS e Android com experiência fluida",
    icon: Smartphone,
    features: ["React Native", "PWA", "App Store", "Push notifications"]
  },
  {
    title: "Portais Corporativos",
    description: "Plataformas internas para gestão de funcionários, clientes e processos",
    icon: MonitorSpeaker,
    features: ["Dashboard", "Relatórios", "Permissões", "Multi-tenant"]
  },
  {
    title: "APIs & Microserviços",
    description: "Arquiteturas robustas e escaláveis para integração de sistemas",
    icon: Database,
    features: ["REST/GraphQL", "Documentação", "Versionamento", "Monitoramento"]
  },
  {
    title: "Automação de Processos",
    description: "Workflows automatizados que otimizam operações e reduzem erros",
    icon: Workflow,
    features: ["RPA", "Triggers", "Notificações", "Logs detalhados"]
  },
  {
    title: "Integrações Complexas",
    description: "Conexão entre sistemas diversos para unificar operações",
    icon: Link,
    features: ["ERPs", "CRMs", "APIs terceiros", "ETL/Pipelines"]
  }
];

export const softwareProcess = [
  {
    number: "01",
    title: "Discovery & Requisitos",
    duration: "1-2 semanas",
    description: "Mapeamento detalhado de necessidades, personas, jornadas e requisitos técnicos",
    deliverables: ["Documento de requisitos", "Wireframes", "Arquitetura técnica", "Cronograma"]
  },
  {
    number: "02", 
    title: "Design & Prototipação",
    duration: "2-3 semanas",
    description: "Criação de interfaces intuitivas e prototipação interativa para validação",
    deliverables: ["UI/UX Design", "Protótipo interativo", "Design System", "Aprovação cliente"]
  },
  {
    number: "03",
    title: "Desenvolvimento",
    duration: "4-12 semanas",
    description: "Desenvolvimento ágil com entregas semanais e feedback constante",
    deliverables: ["Sprints semanais", "Demos", "Código versionado", "Testes unitários"]
  },
  {
    number: "04",
    title: "Testes & Deploy",
    duration: "1-2 semanas", 
    description: "Testes completos, otimização de performance e deploy em produção",
    deliverables: ["Testes automatizados", "Deploy produção", "Monitoramento", "Documentação"]
  },
  {
    number: "05",
    title: "Suporte & Evolução",
    duration: "Contínuo",
    description: "Suporte técnico, correções, atualizações e novas funcionalidades",
    deliverables: ["Suporte 24/7", "Updates", "Melhorias", "Relatórios mensais"]
  }
];

export const softwareQuality = [
  {
    title: "Testes Automatizados",
    description: "Cobertura completa com testes unitários, integração e end-to-end",
    icon: TestTube,
    features: ["Jest/Cypress", "90%+ cobertura", "Testes regressivos", "Performance tests"]
  },
  {
    title: "CI/CD Pipeline",
    description: "Deploy automatizado com validações e rollback instantâneo",
    icon: GitBranch,
    features: ["GitHub Actions", "Deploy automático", "Rollback seguro", "Environment staging"]
  },
  {
    title: "Segurança LGPD",
    description: "Compliance total com LGPD/GDPR e melhores práticas de segurança",
    icon: Lock,
    features: ["Criptografia", "Auditoria", "Backup seguro", "Políticas de acesso"]
  },
  {
    title: "Monitoramento",
    description: "Observabilidade completa com métricas, logs e alertas em tempo real",
    icon: BarChart3,
    features: ["APM", "Error tracking", "Performance", "Dashboards"]
  }
];

export const softwareCases = [
  {
    title: "Plataforma de E-commerce B2B",
    company: "Distribuidora Nacional",
    problem: "Sistema legado lento com checkout complexo e baixa conversão",
    solution: "Nova plataforma React com checkout otimizado e integração ERP",
    technologies: ["React", "Node.js", "PostgreSQL", "AWS"],
    metric: "+45%",
    metricLabel: "conversão",
    image: "/api/placeholder/600/300"
  },
  {
    title: "App de Gestão de Frotas",
    company: "Logística Premium",
    problem: "Controle manual de veículos causando perdas e ineficiências",
    solution: "App mobile com GPS tracking e dashboard gerencial em tempo real",
    technologies: ["React Native", "Python", "MongoDB", "Maps API"],
    metric: "30%",
    metricLabel: "redução custos",
    image: "/api/placeholder/600/300"
  },
  {
    title: "Portal de Treinamento Corporativo",
    company: "Multinacional Tech",
    problem: "Baixo engajamento em treinamentos online tradicionais",
    solution: "Portal gamificado com trilhas personalizadas e certificações",
    technologies: ["Next.js", "Supabase", "Stripe", "Vercel"],
    metric: "+80%",
    metricLabel: "conclusão cursos",
    image: "/api/placeholder/600/300"
  }
];

export const softwareFAQ = [
  {
    question: "Quanto tempo leva para desenvolver um app?",
    answer: "O prazo varia conforme a complexidade. Apps simples ficam prontos em 8-12 semanas, enquanto sistemas complexos podem levar 16-24 semanas. Fornecemos cronograma detalhado após o discovery inicial."
  },
  {
    question: "Qual a diferença entre web app e mobile app?",
    answer: "Web apps rodam no navegador e são acessíveis em qualquer dispositivo. Mobile apps são específicos para smartphones/tablets, oferecendo melhor performance e recursos nativos como câmera e GPS."
  },
  {
    question: "Como garantem a segurança dos dados?",
    answer: "Implementamos criptografia end-to-end, autenticação robusta, compliance LGPD/GDPR, backups automáticos e auditoria completa. Todos os dados são protegidos seguindo melhores práticas internacionais."
  },
  {
    question: "Oferecem suporte após o lançamento?",
    answer: "Sim! Oferecemos suporte técnico 24/7, correção de bugs, atualizações de segurança e novas funcionalidades. Temos planos mensais adaptados às necessidades de cada cliente."
  },
  {
    question: "Posso fazer mudanças durante o desenvolvimento?",
    answer: "Claro! Nossa metodologia ágil permite ajustes durante o projeto. Realizamos demos semanais para coleta de feedback e refinamento. Mudanças maiores podem impactar prazo e orçamento."
  }
];