// JSON-LD Schema.org helpers for Guilds

interface BaseSchema {
  "@context": string;
  "@type": string;
  [key: string]: any;
}

// Organization schema for Guilds
export const generateOrganizationSchema = (seoSettings?: any): BaseSchema => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Guilds",
  "alternateName": "Guilds - Sistemas Inteligentes",
  "description": "Software, automação, IA e gamificação sob medida para gerar impacto e ROI.",
  "url": seoSettings?.canonical_base_url || "https://guilds.com.br",
  "logo": {
    "@type": "ImageObject",
    "url": `${seoSettings?.canonical_base_url || "https://guilds.com.br"}/assets/guilds-logo-full.svg`,
    "width": 200,
    "height": 60
  },
  "sameAs": [
    "https://linkedin.com/company/guilds-br",
    "https://instagram.com/guilds.br"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+55-11-99999-9999",
    "contactType": "Customer Service",
    "availableLanguage": ["Portuguese", "English"]
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "BR",
    "addressRegion": "SP",
    "addressLocality": "São Paulo"
  },
  "foundingDate": "2020",
  "numberOfEmployees": {
    "@type": "QuantitativeValue",
    "value": 15
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "50",
    "worstRating": "1",
    "bestRating": "5"
  }
});

// Service schema for service pages
export const generateServiceSchema = (service: {
  name: string;
  description: string;
  url: string;
  category: string;
  provider?: string;
}): BaseSchema => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": service.name,
  "description": service.description,
  "url": service.url,
  "serviceType": service.category,
  "provider": {
    "@type": "Organization",
    "name": service.provider || "Guilds"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Brazil"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": service.category,
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": service.name
        }
      }
    ]
  }
});

// Product schema for games and apps
export const generateProductSchema = (product: {
  name: string;
  description: string;
  category: string;
  image?: string;
  url: string;
}): BaseSchema => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": product.name,
  "description": product.description,
  "applicationCategory": product.category,
  "operatingSystem": "Web, iOS, Android",
  "url": product.url,
  "image": product.image,
  "author": {
    "@type": "Organization",
    "name": "Guilds"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "BRL",
    "availability": "https://schema.org/OnlineOnly"
  }
});

// Course schema for Lab workshops
export const generateCourseSchema = (course: {
  name: string;
  description: string;
  instructor?: string;
  duration?: string;
  price?: number;
  url: string;
}): BaseSchema => ({
  "@context": "https://schema.org",
  "@type": "Course",
  "name": course.name,
  "description": course.description,
  "provider": {
    "@type": "Organization",
    "name": "Guilds Lab"
  },
  "instructor": course.instructor ? {
    "@type": "Person",
    "name": course.instructor
  } : undefined,
  "timeRequired": course.duration,
  "url": course.url,
  "courseMode": "online",
  "educationalLevel": "Professional",
  "inLanguage": "pt-BR",
  "offers": course.price ? {
    "@type": "Offer",
    "price": course.price,
    "priceCurrency": "BRL",
    "availability": "https://schema.org/InStock"
  } : undefined
});

// Event schema for workshops and webinars
export const generateEventSchema = (event: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  url: string;
  organizer?: string;
}): BaseSchema => ({
  "@context": "https://schema.org",
  "@type": "Event",
  "name": event.name,
  "description": event.description,
  "startDate": event.startDate,
  "endDate": event.endDate,
  "url": event.url,
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
  "location": {
    "@type": "VirtualLocation",
    "url": event.url
  },
  "organizer": {
    "@type": "Organization",
    "name": event.organizer || "Guilds Lab"
  },
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "price": "0",
    "priceCurrency": "BRL",
    "validFrom": new Date().toISOString()
  }
});

// Article schema for blog posts
export const generateArticleSchema = (article: {
  title: string;
  description: string;
  author: string;
  publishDate: string;
  modifiedDate?: string;
  image?: string;
  url: string;
}): BaseSchema => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.description,
  "author": {
    "@type": "Person",
    "name": article.author
  },
  "publisher": {
    "@type": "Organization",
    "name": "Guilds",
    "logo": {
      "@type": "ImageObject",
      "url": "https://guilds.com.br/assets/guilds-logo-full.svg"
    }
  },
  "datePublished": article.publishDate,
  "dateModified": article.modifiedDate || article.publishDate,
  "image": article.image,
  "url": article.url,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": article.url
  }
});

// Breadcrumb schema
export const generateBreadcrumbSchema = (breadcrumbs: Array<{ name: string; url: string }>, baseUrl = "https://guilds.com.br"): BaseSchema => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": `${baseUrl}${crumb.url}`
  }))
});

// FAQ schema
export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>): BaseSchema => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

// Website schema with search functionality
export const generateWebsiteSchema = (seoSettings?: any): BaseSchema => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Guilds",
  "alternateName": "Guilds - Sistemas Inteligentes",
  "url": seoSettings?.canonical_base_url || "https://guilds.com.br",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${seoSettings?.canonical_base_url || "https://guilds.com.br"}/search?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
});

// Page-specific schema generator
export const generatePageSchema = (pathname: string, seoSettings?: any, pageData?: any): BaseSchema[] => {
  const schemas: BaseSchema[] = [];
  
  // Always include Organization schema
  schemas.push(generateOrganizationSchema(seoSettings));
  
  // Page-specific schemas
  switch (pathname) {
    case '/':
      schemas.push(generateWebsiteSchema(seoSettings));
      break;
      
    case '/servicos/software-apps':
      schemas.push(generateServiceSchema({
        name: "Desenvolvimento de Software e Apps",
        description: "Software e aplicativos personalizados com tecnologia moderna",
        url: `${seoSettings?.canonical_base_url || "https://guilds.com.br"}/servicos/software-apps`,
        category: "Software Development"
      }));
      break;
      
    case '/servicos/automacao-ia':
      schemas.push(generateServiceSchema({
        name: "Automação & Inteligência Artificial",
        description: "Automação inteligente e IA para otimizar processos",
        url: `${seoSettings?.canonical_base_url || "https://guilds.com.br"}/servicos/automacao-ia`,
        category: "AI & Automation"
      }));
      break;
      
    case '/servicos/jogos-gamificacao':
      schemas.push(generateProductSchema({
        name: "Jogos Corporativos e Gamificação",
        description: "Jogos corporativos e sistemas de gamificação",
        category: "GameApplication",
        url: `${seoSettings?.canonical_base_url || "https://guilds.com.br"}/servicos/jogos-gamificacao`
      }));
      break;
      
    case '/lab':
      if (pageData?.workshops) {
        pageData.workshops.forEach((workshop: any) => {
          schemas.push(generateCourseSchema({
            name: workshop.title,
            description: workshop.description,
            instructor: workshop.instructor,
            duration: workshop.duration,
            price: workshop.price,
            url: `${seoSettings?.canonical_base_url || "https://guilds.com.br"}/lab/${workshop.slug}`
          }));
        });
      }
      break;
  }
  
  // Add breadcrumb for non-home pages
  if (pathname !== '/') {
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [
      { name: 'Home', url: '/' },
      ...pathSegments.map((segment, index) => ({
        name: segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' '),
        url: '/' + pathSegments.slice(0, index + 1).join('/')
      }))
    ];
    schemas.push(generateBreadcrumbSchema(breadcrumbs, seoSettings?.canonical_base_url));
  }
  
  return schemas;
};

// Helper to validate schema
export const validateSchema = (schema: BaseSchema): boolean => {
  try {
    JSON.stringify(schema);
    return Boolean(schema["@context"] && schema["@type"]);
  } catch {
    return false;
  }
};