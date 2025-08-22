
// Realistic mock data for Guilds website

const clientLogos = [
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

const stackLogos = [
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

const testimonials = [
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

const featuredCases = [
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

const workflowSteps = [
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

const painPoints = [
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

const services = [
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

const valuePillars = [
  {
    title: "Sob medida",
    description: "Soluções personalizadas para seu contexto específico"
  },
  {
    title: "ROI em foco", 
    description: "Projetos sempre alinhados ao retorno do investimento"
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

const softwareProblems = [
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

const softwareDeliverables = [
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

const softwareProcess = [
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

const softwareQuality = [
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

const softwareCases = [
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

const softwareFAQ = [
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

// Automation & IA Specific Data
const automationUseCases = [
  {
    title: "Workflows n8n",
    description: "Automação visual de processos complexos com interface drag-and-drop.",
    category: "Automação",
    icon: "workflow",
    benefits: [
      "Conecta qualquer API",
      "Interface visual intuitiva",
      "Execução em tempo real",
      "Monitoramento completo"
    ]
  },
  {
    title: "RPA - Automação Robótica",
    description: "Bots que executam tarefas repetitivas com precisão e velocidade.",
    category: "RPA",
    icon: "bot",
    benefits: [
      "Reduz erros humanos",
      "Trabalha 24/7",
      "Escalável rapidamente",
      "ROI em semanas"
    ]
  },
  {
    title: "Agentes de IA",
    description: "Assistentes inteligentes para atendimento e processos complexos.",
    category: "IA",
    icon: "brain",
    benefits: [
      "Entende linguagem natural",
      "Aprende continuamente",
      "Resposta instantânea",
      "Integração WhatsApp"
    ]
  },
  {
    title: "Análise de Conversas",
    description: "IA extrai insights de calls, chats e e-mails automaticamente.",
    category: "Analytics",
    icon: "message",
    benefits: [
      "Sentimento dos clientes",
      "Palavras-chave automáticas",
      "Relatórios inteligentes",
      "Melhoria contínua"
    ]
  },
  {
    title: "Previsões e Analytics",
    description: "Machine learning para prever vendas, demanda e comportamentos.",
    category: "ML",
    icon: "analytics",
    benefits: [
      "Previsões precisas",
      "Dados em tempo real",
      "Alertas automáticos",
      "Dashboards inteligentes"
    ]
  },
  {
    title: "Automação de Relatórios",
    description: "Geração automática de KPIs, relatórios e dashboards executivos.",
    category: "BI",
    icon: "chart",
    benefits: [
      "Atualizações automáticas",
      "Múltiplas fontes",
      "Formatos personalizados",
      "Distribuição automática"
    ]
  }
];

const automationIntegrations = [
  {
    name: "CRM & Vendas",
    description: "Automações para pipeline de vendas, follow-ups e nutrição de leads.",
    icon: "users",
    tools: ["Kommo", "HubSpot", "Pipedrive", "Salesforce"],
    useCases: ["Lead scoring", "Follow-ups automáticos", "Relatórios de vendas"]
  },
  {
    name: "WhatsApp Business",
    description: "Chatbots inteligentes e automação de atendimento via WhatsApp.",
    icon: "message", 
    tools: ["WhatsApp API", "Twilio", "Chatwoot", "Typebot"],
    useCases: ["Atendimento 24/7", "Qualificação de leads", "Suporte técnico"]
  },
  {
    name: "ERPs & Sistemas",
    description: "Sincronização de dados entre sistemas legados e modernos.",
    icon: "database",
    tools: ["SAP", "Protheus", "Senior", "Omie"],
    useCases: ["Sincronização de dados", "Relatórios consolidados", "Alertas de estoque"]
  },
  {
    name: "Google Workspace",
    description: "Automação de documentos, planilhas e fluxos colaborativos.",
    icon: "workflow",
    tools: ["Google Sheets", "Gmail", "Drive", "Calendar"],
    useCases: ["Relatórios automáticos", "Agendamentos", "Backup de dados"]
  },
  {
    name: "APIs & Conectores",
    description: "Integrações personalizadas com qualquer sistema via API REST.",
    icon: "zap",
    tools: ["REST APIs", "GraphQL", "Webhooks", "SDK Custom"],
    useCases: ["Sincronização personalizada", "Eventos em tempo real", "Microserviços"]
  },
  {
    name: "Ferramentas de BI",
    description: "Automação de dashboards e relatórios executivos.",
    icon: "chart",
    tools: ["Power BI", "Tableau", "Looker", "Metabase"],
    useCases: ["Dashboards automáticos", "Alertas de KPI", "Relatórios executivos"]
  }
];

const automationDeliverables = [
  {
    title: "Pipelines de Automação",
    description: "Workflows visuais completos, prontos para produção.",
    icon: "workflow",
    features: [
      "Fluxos n8n documentados",
      "Tratamento de erros",
      "Logs detalhados",
      "Monitoramento 24/7"
    ]
  },
  {
    title: "Chatbots & Agentes",
    description: "Assistentes inteligentes para atendimento multicanal.",
    icon: "bot",
    features: [
      "Treinamento personalizado",
      "Integração WhatsApp/Web",
      "Base de conhecimento",
      "Analytics de conversas"
    ]
  },
  {
    title: "Modelos de IA",
    description: "Algoritmos treinados para suas necessidades específicas.",
    icon: "brain",
    features: [
      "Classificação automática",
      "Previsões precisas",
      "API para integração",
      "Retreinamento contínuo"
    ]
  },
  {
    title: "Dashboards Inteligentes",
    description: "Painéis com atualizações automáticas e alertas.",
    icon: "chart",
    features: [
      "Métricas em tempo real",
      "Alertas personalizados",
      "Exportação automática",
      "Acesso mobile/web"
    ]
  }
];

const automationCases = [
  {
    title: "Automação Administrativa",
    company: "Consultoria RH",
    problem: "Time gastava 15h/semana em tarefas manuais de relatórios e follow-ups.",
    solution: "Implementamos workflows n8n para automatizar criação de relatórios, envio de e-mails e atualização de planilhas.",
    metric: "70%",
    metricLabel: "redução tempo administrativo",
    testimonial: "Liberamos nossa equipe para focar no que realmente importa: atender nossos clientes."
  },
  {
    title: "Otimização de Custos",
    company: "E-commerce B2B",
    problem: "Processos manuais geravam custos operacionais altos e erros frequentes.",
    solution: "Desenvolvemos RPA para automatizar entrada de pedidos, atualização de estoque e geração de faturas.",
    metric: "40%",
    metricLabel: "economia em operações",
    testimonial: "O ROI foi alcançado em apenas 3 meses. Não conseguimos mais imaginar trabalhar sem automação."
  },
  {
    title: "Qualidade e Precisão",
    company: "Fintech",
    problem: "Erros manuais em processos críticos causavam retrabalho e insatisfação.",
    solution: "Criamos agentes de IA para validação automática de dados e chatbot para suporte aos clientes.",
    metric: "85%",
    metricLabel: "redução de erros",
    testimonial: "A qualidade dos nossos processos melhorou drasticamente. Nossos clientes notaram a diferença."
  }
];

const automationSecurity = [
  {
    title: "Dados Seguros",
    description: "Criptografia end-to-end e compliance total com LGPD.",
    icon: "shield",
    features: [
      "Criptografia AES-256",
      "Compliance LGPD/GDPR",
      "Auditoria completa",
      "Backup automático"
    ]
  },
  {
    title: "IA Ética",
    description: "Transparência e auditabilidade em todos os modelos de IA.",
    icon: "eye",
    features: [
      "Explicabilidade de decisões",
      "Bias detection",
      "Versionamento de modelos",
      "Métricas de fairness"
    ]
  },
  {
    title: "Integração Segura",
    description: "APIs protegidas com autenticação robusta e monitoramento.",
    icon: "lock",
    features: [
      "OAuth 2.0/JWT",
      "Rate limiting",
      "Logs de segurança",
      "Penetration testing"
    ]
  },
  {
    title: "Backup & Recovery",
    description: "Continuidade garantida com backup e recuperação automática.",
    icon: "refresh",
    features: [
      "Backup incremental",
      "RTO < 4 horas",
      "Disaster recovery",
      "Testes regulares"
    ]
  }
];

const automationFAQ = [
  {
    question: "Quanto custa implementar automação na minha empresa?",
    answer: "Os custos variam conforme a complexidade e escopo. Projetos simples de automação começam em R$ 15.000, enquanto soluções completas com IA podem variar de R$ 50.000 a R$ 200.000. Oferecemos um diagnóstico gratuito para estimar o investimento e ROI específico para sua empresa."
  },
  {
    question: "Como vocês garantem a segurança dos dados na automação?",
    answer: "Seguimos rigorosamente as normas LGPD/GDPR com criptografia AES-256, autenticação robusta, logs de auditoria completos e backups automáticos. Todos os fluxos passam por testes de segurança e penetration testing antes de entrarem em produção."
  },
  {
    question: "A automação vai substituir meus funcionários?",
    answer: "Não, a automação elimina tarefas repetitivas e libera sua equipe para atividades estratégicas e criativas. Nossos clientes relatam que os funcionários ficam mais motivados ao focar em trabalho de maior valor agregado, resultando em crescimento da empresa e novas oportunidades."
  },
  {
    question: "Qual o ROI típico de projetos de automação?",
    answer: "Nossos clientes veem ROI entre 200% e 500% no primeiro ano. Em média, a economia de tempo administrativo é de 60-80%, redução de erros de 70-90%, e economia de custos operacionais de 30-50%. O payback típico ocorre entre 3-8 meses."
  },
  {
    question: "Quanto tempo leva para ver os primeiros resultados?",
    answer: "Automações simples podem estar funcionando em 2-4 semanas. Projetos mais complexos com IA levam 6-12 semanas. Implementamos sempre em fases, então você começa a ver benefícios parciais já nas primeiras semanas, com melhorias contínuas ao longo do projeto."
  }
];

// Gamification & Games Specific Data
const gamificationFormats = [
  {
    title: "Workshops Gamificados",
    description: "Dinâmicas interativas presenciais ou online que transformam treinamentos em experiências memoráveis.",
    icon: "Users",
    features: ["Facilitação especializada", "Dinâmicas customizadas", "Materiais interativos", "Certificação digital"]
  },
  {
    title: "Simulações Empresariais",
    description: "Cenários realistas de negócios onde equipes praticam tomada de decisão em ambiente seguro.",
    icon: "BarChart3",
    features: ["Cenários personalizados", "Métricas em tempo real", "Debriefing estruturado", "Relatórios de performance"]
  },
  {
    title: "Serious Games",
    description: "Jogos digitais desenvolvidos especificamente para objetivos de aprendizado e desenvolvimento.",
    icon: "Gamepad2",
    features: ["Narrativa envolvente", "Mecânicas adaptativas", "Analytics detalhado", "Multiplataforma"]
  },
  {
    title: "Plataformas L&D",
    description: "Learning & Development gamificado com trilhas personalizadas e reconhecimento por conquistas.",
    icon: "Trophy",
    features: ["Sistema de pontos", "Badges e conquistas", "Ranking social", "Trilhas personalizadas"]
  }
];

const gamificationObjectives = [
  {
    title: "Onboarding",
    description: "Integração envolvente de novos colaboradores com a cultura e processos da empresa.",
    icon: "UserPlus",
    benefits: ["90% retenção talentos", "50% tempo integração", "95% satisfação processo"]
  },
  {
    title: "Treinamento de Vendas",
    description: "Simulação de clientes, objeções e técnicas de vendas em ambiente gamificado.",
    icon: "TrendingUp",
    benefits: ["35% conversão", "60% engajamento", "80% aplicação prática"]
  },
  {
    title: "Segurança do Trabalho",
    description: "Cenários de risco e prevenção de acidentes através de simulações realistas.",
    icon: "Shield",
    benefits: ["70% redução acidentes", "85% retenção normas", "90% participação"]
  },
  {
    title: "Compliance",
    description: "Normas e regulamentações apresentadas de forma interativa e memorável.",
    icon: "FileCheck",
    benefits: ["95% conclusão", "80% retenção", "60% menos infrações"]
  },
  {
    title: "Cultura Organizacional",
    description: "Valores e comportamentos da empresa vivenciados através de experiências práticas.",
    icon: "Heart",
    benefits: ["85% engajamento cultural", "70% melhoria clima", "50% turnover"]
  },
  {
    title: "Liderança",
    description: "Desenvolvimento de soft skills e tomada de decisão através de simulações de gestão.",
    icon: "Crown",
    benefits: ["80% melhoria gestão", "65% satisfação equipe", "40% promoções internas"]
  }
];

const gamificationMetrics = [
  {
    title: "85% vs 23%",
    description: "Taxa de retenção: gamificação vs métodos tradicionais",
    icon: "TrendingUp",
    highlight: "3.7x mais eficaz"
  },
  {
    title: "3.2x",
    description: "Mais tempo de engajamento com conteúdo de treinamento",
    icon: "Clock",
    highlight: "Aprendizado profundo"
  },
  {
    title: "92%",
    description: "Taxa de conclusão dos treinamentos gamificados",
    icon: "CheckCircle",
    highlight: "vs 45% tradicional"
  },
  {
    title: "67%",
    description: "Melhoria na aplicação prática do conhecimento",
    icon: "Target",
    highlight: "ROI comprovado"
  }
];

const gamificationProcess = [
  {
    number: "01",
    title: "Diagnóstico & Análise",
    description: "Mapeamento de necessidades, público-alvo e objetivos de aprendizagem.",
    duration: "1 semana",
    deliverables: ["Análise de gap de competências", "Personas de aprendizagem", "Objetivos SMART"]
  },
  {
    number: "02", 
    title: "Game Design",
    description: "Criação das mecânicas de jogo, narrativa e estrutura de recompensas.",
    duration: "2-3 semanas",
    deliverables: ["Game Design Document", "Wireframes interativos", "Sistema de pontuação"]
  },
  {
    number: "03",
    title: "Desenvolvimento",
    description: "Construção do protótipo, testes de usabilidade e refinamentos.",
    duration: "3-4 semanas", 
    deliverables: ["Protótipo funcional", "Testes com usuários", "Manual do facilitador"]
  },
  {
    number: "04",
    title: "Piloto & Validação",
    description: "Teste com grupo controle, coleta de feedback e ajustes finais.",
    duration: "1 semana",
    deliverables: ["Relatório de piloto", "Métricas de engajamento", "Versão ajustada"]
  },
  {
    number: "05",
    title: "Lançamento & Suporte",
    description: "Deploy completo, treinamento de facilitadores e acompanhamento contínuo.",
    duration: "Contínuo",
    deliverables: ["Plataforma ativa", "Dashboard analytics", "Suporte técnico"]
  }
];

const gamificationCases = [
  {
    title: "Onboarding Gamificado - TechCorp",
    company: "Empresa de Tecnologia",
    problem: "Alta rotatividade de novos funcionários (40%) e processo de integração de 3 meses pouco eficaz.",
    solution: "Jornada gamificada de 30 dias com missões, badges e mentoria peer-to-peer integrada.",
    technologies: ["Unity", "React", "Node.js", "MongoDB"],
    metrics: [
      { label: "Retenção de talentos", value: "90%", improvement: "+50%" },
      { label: "Tempo de integração", value: "15 dias", improvement: "-50%" },
      { label: "Satisfação do processo", value: "4.8/5", improvement: "+60%" }
    ],
    testimonial: {
      quote: "Transformamos completamente nosso onboarding. Os novos colaboradores chegam mais engajados e produtivos em tempo recorde.",
      author: "Marina Santos",
      role: "Head de People & Culture",
      avatar: "/api/placeholder/60/60"
    }
  },
  {
    title: "Treinamento de Vendas - RetailMax",
    company: "Rede de Varejo Nacional", 
    problem: "Baixa conversão de vendas (12%) e treinamentos teóricos sem aplicação prática efetiva.",
    solution: "Simulador de vendas com IA, cenários realistas e gamificação por equipes regionais.",
    technologies: ["OpenAI", "React Native", "Python", "PostgreSQL"],
    metrics: [
      { label: "Conversão de vendas", value: "18.5%", improvement: "+35%" },
      { label: "Engajamento treinamento", value: "87%", improvement: "+60%" },
      { label: "Aplicação técnicas", value: "92%", improvement: "+45%" }
    ],
    testimonial: {
      quote: "Nossos vendedores agora praticam situações reais antes de enfrentar os clientes. O resultado foi imediato nas vendas.",
      author: "Carlos Mendes",
      role: "Diretor Comercial",
      avatar: "/api/placeholder/60/60"
    }
  },
  {
    title: "Segurança Industrial - ManufacturingPro",
    company: "Indústria Metalúrgica",
    problem: "15 acidentes/ano e baixa adesão (30%) aos treinamentos obrigatórios de segurança.",
    solution: "Realidade virtual para simulação de riscos e gamificação de práticas seguras no dia a dia.",
    technologies: ["Unity VR", "Oculus", "C#", "Analytics"],
    metrics: [
      { label: "Redução de acidentes", value: "80%", improvement: "-80%" },
      { label: "Participação treinamentos", value: "95%", improvement: "+65%" },
      { label: "Retenção normas", value: "88%", improvement: "+55%" }
    ],
    testimonial: {
      quote: "A simulação em VR fez nossos funcionários vivenciarem situações de risco sem perigo real. Revolucionou nossa cultura de segurança.",
      author: "Ana Rodrigues",
      role: "Gerente de Segurança",
      avatar: "/api/placeholder/60/60"
    }
  }
];

const gamificationFAQ = [
  {
    question: "Como funciona a gamificação em treinamentos corporativos?",
    answer: "Aplicamos elementos de jogos (pontos, badges, rankings, narrativas) em contextos de aprendizagem. Isso inclui missões estruturadas, feedback imediato, progressão clara e recompensas significativas que mantêm o engajamento e facilitam a retenção do conhecimento."
  },
  {
    question: "Qual o investimento necessário para gamificar nossos treinamentos?", 
    answer: "O investimento varia conforme complexidade e escopo. Workshops gamificados começam em R$ 25.000, simulações empresariais de R$ 60.000 a R$ 150.000, e serious games customizados de R$ 120.000 a R$ 400.000. Oferecemos diagnóstico gratuito para calcular ROI específico."
  },
  {
    question: "Funcionários mais velhos se adaptam bem à gamificação?",
    answer: "Sim! Nossos dados mostram 85%+ de engajamento em todas as faixas etárias. O segredo está em focar na narrativa e desafios relevantes ao invés de elementos infantis. Colaboradores experientes valorizam especialmente simulações realistas e reconhecimento por expertise."
  },
  {
    question: "Como medir o ROI da gamificação corporativa?",
    answer: "Medimos através de KPIs específicos: taxa de conclusão (+90% vs 45% tradicional), retenção de conhecimento (+67%), aplicação prática (+80%), engajamento (+200%), e métricas de negócio como redução de acidentes, aumento de vendas e diminuição de turnover."
  },
  {
    question: "Quanto tempo leva para desenvolver um serious game customizado?",
    answer: "Serious games simples ficam prontos em 8-12 semanas, enquanto simulações complexas podem levar 16-24 semanas. Workshops gamificados são desenvolvidos em 4-6 semanas. Sempre entregamos em fases para você começar a ver resultados rapidamente."
  }
];

// ============= CONSULTORIA & DISCOVERY DATA =============
const consultoriaServices = [
  {
    title: "Diagnóstico Digital",
    description: "Mapeamento completo de gaps e oportunidades em processos, tecnologias e estratégia digital da empresa.",
    icon: "Search",
    features: [
      "Auditoria completa de sistemas atuais",
      "Análise de processos e gargalos",
      "Identificação de oportunidades de melhoria",
      "Benchmarking com mercado"
    ]
  },
  {
    title: "Arquitetura de Soluções",
    description: "Design técnico e estratégico de sistemas escaláveis, considerando performance, segurança e futuro crescimento.",
    icon: "FileText",
    features: [
      "Desenho de arquitetura técnica",
      "Seleção de tecnologias adequadas",
      "Planejamento de integração",
      "Documentação detalhada"
    ]
  },
  {
    title: "Análise de Viabilidade",
    description: "Estudo detalhado de ROI, custos, riscos e cronograma para tomada de decisão fundamentada sobre projetos.",
    icon: "MapPin",
    features: [
      "Análise de ROI e payback",
      "Mapeamento de riscos técnicos",
      "Estimativa de investimento",
      "Cenários de implementação"
    ]
  },
  {
    title: "Roadmaps Trimestrais",
    description: "Planejamento estratégico detalhado com marcos, prioridades e cronograma para os próximos 12 meses.",
    icon: "TrendingUp",
    features: [
      "Priorização por impacto/esforço",
      "Marcos e dependências",
      "Cronograma realista",
      "KPIs e métricas de sucesso"
    ]
  }
];

const consultoriaDeliverables = [
  {
    title: "Documento Estratégico",
    description: "Relatório completo com diagnóstico atual, recomendações estratégicas e plano de ação detalhado.",
    duration: "20-30 páginas",
    icon: "FileText",
    components: [
      "Executive Summary",
      "Diagnóstico detalhado",
      "Recomendações estratégicas",
      "Análise de ROI",
      "Plano de implementação"
    ]
  },
  {
    title: "Backlog Priorizado",
    description: "Lista detalhada de features e melhorias ordenadas por impacto no negócio vs esforço de implementação.",
    duration: "50-100 itens",
    icon: "Target",
    components: [
      "User stories detalhadas",
      "Critérios de aceitação",
      "Estimativas de esforço",
      "Priorização por valor",
      "Dependências mapeadas"
    ]
  },
  {
    title: "Plano de Marcos",
    description: "Timeline detalhada com milestones, entregas, dependências e recursos necessários para cada fase.",
    duration: "12 meses",
    icon: "Calendar",
    components: [
      "Cronograma macro",
      "Marcos por trimestre",
      "Recursos necessários",
      "Dependências críticas",
      "Planos de contingência"
    ]
  },
  {
    title: "Relatório de Viabilidade",
    description: "Análise financeira e técnica completa com cenários, riscos e recomendações de investimento.",
    duration: "15-20 páginas",
    icon: "Shield",
    components: [
      "Análise de investimento",
      "Cenários de ROI",
      "Mapeamento de riscos",
      "Recomendações técnicas",
      "Plano de mitigação"
    ]
  }
];

const consultoriaProcess = [
  {
    number: 1,
    title: "Discovery Intensivo",
    description: "Workshops colaborativos, entrevistas com stakeholders e análise profunda dos processos atuais da empresa.",
    duration: "1-2 semanas",
    deliverables: ["Mapeamento de processos", "Entrevistas stakeholders", "Análise competitiva", "Audit técnico"]
  },
  {
    number: 2,
    title: "Análise & Arquitetura",
    description: "Processamento das informações coletadas e desenho da arquitetura de soluções mais adequada.",
    duration: "1 semana",
    deliverables: ["Arquitetura proposta", "Stack tecnológico", "Integrações", "Documentação técnica"]
  },
  {
    number: 3,
    title: "Roadmap & Priorização",
    description: "Definição de marcos, cronograma e priorização baseada em impacto no negócio vs esforço de implementação.",
    duration: "1 semana",
    deliverables: ["Roadmap trimestral", "Backlog priorizado", "Cronograma macro", "KPIs definidos"]
  },
  {
    number: 4,
    title: "Apresentação & Handoff",
    description: "Entrega dos documentos finais e alinhamento completo com stakeholders para próximos passos.",
    duration: "2-3 dias",
    deliverables: ["Apresentação executiva", "Documentação completa", "Plano de implementação", "Próximos passos"]
  }
];

const consultoriaCases = [
  {
    title: "Startup FinTech",
    company: "PayFlow",
    situation: "Startup com MVP funcional precisava de roadmap para escalar e captar investimento Série A.",
    solution: "Diagnóstico completo da arquitetura, roadmap de 12 meses focado em escalabilidade e compliance financeiro.",
    result: "Série A de R$ 15M captados"
  },
  {
    title: "Transformação Digital",
    company: "Indústria MegaCorp",
    situation: "Empresa tradicional com processos manuais e sistemas legados precisava se digitalizar.",
    solution: "Mapeamento de 47 processos, arquitetura híbrida cloud/on-premise e roadmap de transformação em fases.",
    result: "40% economia de custos operacionais"
  },
  {
    title: "Scale-up E-commerce",
    company: "ComercioMax",
    situation: "E-commerce crescendo 300% ao ano com arquitetura não escalável e problemas de performance.",
    solution: "Redesign completo da arquitetura, migração para microserviços e roadmap de otimização.",
    result: "Suportou crescimento de 500%"
  }
];

const consultoriaFAQ = [
  {
    question: "Como funciona o processo de diagnóstico?",
    answer: "Nosso diagnóstico envolve 4 etapas: workshops colaborativos com stakeholders, análise técnica dos sistemas atuais, benchmarking com mercado e mapeamento completo dos processos. Todo o processo leva de 1-2 semanas e resulta em um documento estratégico completo com recomendações priorizadas."
  },
  {
    question: "Qual o investimento necessário para uma consultoria completa?",
    answer: "O investimento varia conforme o escopo e complexidade do projeto. Para diagnósticos simples, a partir de R$ 15.000. Para consultorias completas com roadmap trimestral, entre R$ 25.000 e R$ 50.000. Oferecemos sempre uma proposta customizada após conversa inicial gratuita."
  },
  {
    question: "Vocês ajudam na implementação do roadmap?",
    answer: "Sim! Após a consultoria, podemos acompanhar a implementação do roadmap através de nossos serviços de desenvolvimento. Muitos clientes optam por essa continuidade para garantir que as recomendações sejam implementadas corretamente e dentro do prazo planejado."
  },
  {
    question: "Como garantem a confidencialidade dos dados?",
    answer: "Levamos a confidencialidade muito a sério. Todos os projetos são cobertos por NDA rigoroso, dados são processados em ambiente seguro, e nossa equipe assina termos de confidencialidade específicos. Temos certificações de segurança e nunca compartilhamos informações entre clientes."
  },
  {
    question: "Quanto tempo leva para ter os primeiros insights?",
    answer: "Os primeiros insights aparecem já na primeira semana, durante os workshops de discovery. Ao final da segunda semana, você terá o diagnóstico completo com todas as recomendações. O roadmap detalhado fica pronto em até 4 semanas do início do projeto."
  }
];

export {
  clientLogos,
  stackLogos,
  testimonials,
  featuredCases,
  workflowSteps,
  painPoints,
  services,
  valuePillars,
  softwareProblems,
  softwareDeliverables,
  softwareProcess,
  softwareQuality,
  softwareCases,
  softwareFAQ,
  automationUseCases,
  automationIntegrations,
  automationDeliverables,
  automationCases,
  automationSecurity,
  automationFAQ,
  gamificationFormats,
  gamificationObjectives,  
  gamificationMetrics,
  gamificationProcess,
  gamificationCases,
  gamificationFAQ,
  consultoriaServices,
  consultoriaDeliverables,
  consultoriaProcess,
  consultoriaCases,
  consultoriaFAQ
};
