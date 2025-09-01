import { useMemo } from 'react';

// SEO validation utilities
export const validateTitle = (title: string): { isValid: boolean; warning?: string } => {
  if (!title) return { isValid: false, warning: 'Title is required' };
  if (title.length > 60) return { isValid: false, warning: `Title too long: ${title.length}/60 chars` };
  return { isValid: true };
};

export const validateDescription = (description: string): { isValid: boolean; warning?: string } => {
  if (!description) return { isValid: false, warning: 'Description is required' };
  if (description.length > 155) return { isValid: false, warning: `Description too long: ${description.length}/155 chars` };
  if (description.length < 120) return { isValid: false, warning: `Description too short: ${description.length}/155 chars (aim for 120-155)` };
  return { isValid: true };
};

// Page-specific SEO defaults
export interface PageSEODefaults {
  title: string;
  description: string;
  keywords: string[];
  type?: string;
  structuredDataType?: 'WebPage' | 'Service' | 'Course' | 'Organization' | 'Product';
}

export const SEO_DEFAULTS: Record<string, PageSEODefaults> = {
  '/': {
    title: 'Sistemas inteligentes, resultados reais | Guilds',
    description: 'Software, automação, IA e gamificação sob medida para gerar impacto e ROI. Parceiro estratégico em transformação digital.',
    keywords: ['software sob medida', 'automação', 'inteligência artificial', 'gamificação', 'transformação digital'],
    type: 'website',
    structuredDataType: 'Organization'
  },
  '/sobre': {
    title: 'Nossa história e missão | Guilds',
    description: 'Conheça a Guilds: nossa missão de criar sistemas inteligentes que geram resultados reais para empresas inovadoras.',
    keywords: ['sobre guilds', 'missão', 'história', 'empresa tecnologia'],
    type: 'website',
    structuredDataType: 'Organization'
  },
  '/equipe': {
    title: 'Conheça nosso time de especialistas | Guilds',
    description: 'Time sênior de desenvolvedores, designers e estrategistas especializado em soluções digitais sob medida.',
    keywords: ['equipe guilds', 'time sênior', 'especialistas tecnologia', 'desenvolvedores'],
    type: 'website',
    structuredDataType: 'Organization'
  },
  '/carreiras': {
    title: 'Vagas em tecnologia e inovação | Guilds',
    description: 'Junte-se ao nosso time! Oportunidades para desenvolvedores, designers e especialistas em tecnologia.',
    keywords: ['vagas guilds', 'carreiras tecnologia', 'trabalhe conosco', 'oportunidades'],
    type: 'website',
    structuredDataType: 'WebPage'
  },
  '/servicos': {
    title: 'Soluções digitais sob medida | Guilds',
    description: 'Software, apps, automação, IA e gamificação. Soluções completas com ROI comprovado e time sênior.',
    keywords: ['serviços guilds', 'soluções digitais', 'software', 'consultoria'],
    type: 'website',
    structuredDataType: 'Service'
  },
  '/servicos/software-apps': {
    title: 'Desenvolvimento de Software e Apps | Guilds',
    description: 'Software e aplicativos personalizados com tecnologia moderna. Sistemas web, mobile e desktop sob medida.',
    keywords: ['desenvolvimento software', 'apps personalizados', 'sistemas web', 'aplicativos móveis'],
    type: 'website',
    structuredDataType: 'Service'
  },
  '/servicos/automacao-ia': {
    title: 'Automação & IA | Fluxos que escalam decisões',
    description: 'Automação inteligente e IA para otimizar processos. Chatbots, RPA e machine learning que geram resultados.',
    keywords: ['automação', 'inteligência artificial', 'chatbots', 'machine learning', 'RPA'],
    type: 'website',
    structuredDataType: 'Service'
  },
  '/servicos/jogos-gamificacao': {
    title: 'Jogos Corporativos e Gamificação | Guilds',
    description: 'Jogos corporativos e sistemas de gamificação para engajamento, treinamento e motivação de equipes.',
    keywords: ['jogos corporativos', 'gamificação', 'engajamento', 'treinamento', 'motivação'],
    type: 'website',
    structuredDataType: 'Product'
  },
  '/servicos/consultoria': {
    title: 'Consultoria em Transformação Digital | Guilds',
    description: 'Consultoria estratégica em tecnologia e transformação digital. Diagnóstico, planejamento e execução.',
    keywords: ['consultoria digital', 'transformação digital', 'estratégia tecnologia', 'consultoria TI'],
    type: 'website',
    structuredDataType: 'Service'
  },
  '/lab': {
    title: 'Workshops de tecnologia, jogos e apps | Guilds Lab',
    description: 'Pessoas no centro. Habilidades que escalam. Workshops práticos em desenvolvimento, UX/UI e inovação.',
    keywords: ['workshops tecnologia', 'treinamento', 'capacitação', 'guilds lab'],
    type: 'website',
    structuredDataType: 'Course'
  },
  '/craft': {
    title: 'Parcerias & P&D | Da ideia ao impacto',
    description: 'Guilds Craft: parcerias estratégicas em P&D. Transformamos ideias inovadoras em soluções de impacto.',
    keywords: ['parcerias', 'P&D', 'inovação', 'guilds craft', 'desenvolvimento'],
    type: 'website',
    structuredDataType: 'Service'
  },
  '/contato': {
    title: 'Entre em contato | Guilds',
    description: 'Fale conosco para discutir seu projeto. Orçamento gratuito e consultoria especializada em soluções digitais.',
    keywords: ['contato guilds', 'orçamento', 'consultoria', 'projetos'],
    type: 'website',
    structuredDataType: 'WebPage'
  }
};

// Hook for getting page SEO defaults
export const usePageSEODefaults = (pathname: string) => {
  return useMemo(() => {
    // Try exact match first
    let defaults = SEO_DEFAULTS[pathname];
    
    // If no exact match, try to find a parent route match
    if (!defaults) {
      const pathSegments = pathname.split('/').filter(Boolean);
      for (let i = pathSegments.length; i > 0; i--) {
        const parentPath = '/' + pathSegments.slice(0, i).join('/');
        if (SEO_DEFAULTS[parentPath]) {
          defaults = SEO_DEFAULTS[parentPath];
          break;
        }
      }
    }
    
    // Final fallback to home page defaults
    return defaults || SEO_DEFAULTS['/'];
  }, [pathname]);
};

// Utility to generate meta keywords from content
export const generateKeywordsFromContent = (content: string, maxKeywords = 10): string[] => {
  if (!content) return [];
  
  const words = content.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3);
    
  const wordCount = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
};

// URL slug generation
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove duplicate hyphens
    .trim()
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

// Performance hints utility
export const getPerformanceHints = (pathname: string) => {
  const hints = {
    preload: [] as string[],
    prefetch: [] as string[],
    preconnect: [] as string[]
  };
  
  // Add common preconnects
  hints.preconnect.push(
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  );
  
  // Page-specific optimizations
  if (pathname === '/') {
    hints.prefetch.push('/sobre', '/servicos');
  } else if (pathname === '/servicos') {
    hints.prefetch.push('/servicos/software-apps', '/servicos/automacao-ia');
  }
  
  return hints;
};