import { z } from 'zod';

// Enhanced validation schemas for legal system
export const contractDataSchema = z.object({
  title: z.string()
    .min(5, 'Título deve ter pelo menos 5 caracteres')
    .max(200, 'Título deve ter no máximo 200 caracteres')
    .refine(val => !/[<>{}]/.test(val), 'Título contém caracteres inválidos'),
  
  client_contact_id: z.string()
    .uuid('ID do cliente inválido'),
  
  template_id: z.string()
    .uuid('ID do template inválido'),
  
  variables_data: z.record(z.any())
    .refine(val => {
      const str = JSON.stringify(val);
      return str.length < 10000; // Limit JSON size
    }, 'Dados de variáveis muito grandes'),
  
  selected_clauses: z.array(z.string().uuid())
    .max(50, 'Máximo de 50 cláusulas por contrato')
});

export const clauseDataSchema = z.object({
  title: z.string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres')
    .refine(val => !/[<>{}]/.test(val), 'Título contém caracteres inválidos'),
  
  content_markdown: z.string()
    .min(10, 'Conteúdo deve ter pelo menos 10 caracteres')
    .max(10000, 'Conteúdo deve ter no máximo 10.000 caracteres')
    .refine(val => {
      // Check for potentially dangerous HTML/JS
      const dangerousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /<iframe/i,
        /<object/i,
        /<embed/i
      ];
      return !dangerousPatterns.some(pattern => pattern.test(val));
    }, 'Conteúdo contém elementos não permitidos'),
  
  group_id: z.string()
    .uuid('ID do grupo inválido'),
  
  variables: z.array(z.string())
    .max(20, 'Máximo de 20 variáveis por cláusula'),
  
  tags: z.array(z.string())
    .max(10, 'Máximo de 10 tags por cláusula'),
  
  is_locked_by_legal: z.boolean(),
  is_active: z.boolean()
});

export const templateDataSchema = z.object({
  name: z.string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .refine(val => !/[<>{}]/.test(val), 'Nome contém caracteres inválidos'),
  
  description: z.string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional(),
  
  contract_type: z.enum([
    'software', 
    'white_label', 
    'maintenance', 
    'consulting', 
    'saas', 
    'standard'
  ]),
  
  default_clauses: z.array(z.string().uuid())
    .max(30, 'Máximo de 30 cláusulas padrão por template'),
  
  variables_mapping: z.record(z.any())
    .refine(val => {
      const str = JSON.stringify(val);
      return str.length < 5000; // Limit JSON size
    }, 'Mapeamento de variáveis muito grande'),
  
  is_default: z.boolean()
});

// Rate limiting helper
export class RateLimiter {
  private static requests = new Map<string, { count: number; resetTime: number }>();
  
  static checkLimit(
    identifier: string, 
    maxRequests: number = 10, 
    windowMs: number = 60000
  ): boolean {
    const now = Date.now();
    const key = identifier;
    
    const current = this.requests.get(key);
    
    if (!current || now > current.resetTime) {
      this.requests.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }
    
    if (current.count >= maxRequests) {
      return false;
    }
    
    current.count++;
    return true;
  }
  
  static cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.requests.entries()) {
      if (now > value.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

// Content sanitization
export const sanitizeContent = (input: string): string => {
  return input
    .replace(/<script[^>]*>.*?<\/script>/gis, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gis, '')
    .replace(/<object[^>]*>.*?<\/object>/gis, '')
    .replace(/<embed[^>]*>/gis, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

// Audit logging helper
export const createAuditLog = (
  action: string,
  resourceType: 'contract' | 'clause' | 'template',
  resourceId: string,
  userId?: string,
  metadata?: Record<string, any>
) => {
  return {
    action,
    resource_type: resourceType,
    resource_id: resourceId,
    user_id: userId,
    timestamp: new Date().toISOString(),
    metadata: metadata || {},
    ip_address: null, // Will be filled by edge function
    user_agent: null  // Will be filled by edge function
  };
};