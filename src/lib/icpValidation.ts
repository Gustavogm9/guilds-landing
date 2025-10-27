import { supabase } from "@/integrations/supabase/client";

// Known fields from ContactForm and QualificationModal that can be used for ICP criteria
// Includes both original field names and their aliases from public forms
export const CONTACT_FORM_FIELDS = [
  'name',
  'email',
  'phone',
  'company',
  'role',
  'job_title', // Mapped from 'cargo' in QualificationModal
  'industry', // Added to QualificationModal
  'company_size', // Mapped from 'tamanho_empresa' in QualificationModal
  'budget_range', // Mapped from 'orcamento' in QualificationModal
  'timeline',
  'decision_timeline', // Mapped from 'prazo' in QualificationModal
  'decision_authority', // Mapped from 'autoridade_decisao' in QualificationModal
  'source',
  'product_interest',
  'message',
  'lead_source',
  'utm_source',
  'utm_medium',
  'utm_campaign'
];

// Core fields from crm_contacts table schema
export const CRM_CONTACT_FIELDS = [
  'id',
  'name',
  'email',
  'phone',
  'company',
  'title',
  'role',
  'source',
  'lead_source',
  'lifecycle_stage',
  'lead_score',
  'engagement_score',
  'icp_score',
  'last_interaction_date',
  'tags',
  'custom_fields',
  'created_at',
  'updated_at'
];

export interface FieldValidation {
  exists: boolean;
  inForm: boolean;
  isCustomField: boolean;
  warnings: string[];
  suggestions: string[];
}

/**
 * Validates if a criterion field is valid and usable
 */
export function validateCriterionField(fieldName: string): FieldValidation {
  const warnings: string[] = [];
  const suggestions: string[] = [];
  
  // Check if it's a custom field (in custom_fields JSON) with proper validation
  const isValidCustomField = 
    fieldName.startsWith('custom_fields.') && 
    /^custom_fields\.[a-zA-Z_][a-zA-Z0-9_]*$/.test(fieldName) &&
    fieldName.split('.').length === 2;
  
  const isCustomField = isValidCustomField;
  const actualFieldName = isCustomField ? fieldName.replace('custom_fields.', '') : fieldName;
  
  // Check if field exists in CRM schema
  const existsInSchema = CRM_CONTACT_FIELDS.includes(actualFieldName) || isCustomField;
  
  // Check if field is in contact form
  const inForm = CONTACT_FORM_FIELDS.includes(actualFieldName);
  
  if (!existsInSchema && !isCustomField) {
    warnings.push(`Campo "${fieldName}" não existe na tabela crm_contacts`);
    suggestions.push('Verifique se o nome do campo está correto ou use custom_fields.[nome]');
  }
  
  if (existsInSchema && !inForm && !isCustomField) {
    warnings.push(`Campo "${fieldName}" não está no formulário de contato`);
    suggestions.push('Considere adicionar este campo ao formulário ou use enriquecimento automático');
  }
  
  return {
    exists: existsInSchema || isCustomField,
    inForm,
    isCustomField,
    warnings,
    suggestions
  };
}

/**
 * Get missing fields (fields in ICP criteria but not in contact form)
 */
export function getMissingFieldsFromCriteria(criteria: any[]): string[] {
  const missingFields: string[] = [];
  
  criteria.forEach(criterion => {
    const validation = validateCriterionField(criterion.criterion_field);
    if (!validation.inForm && !validation.isCustomField) {
      missingFields.push(criterion.criterion_field);
    }
  });
  
  return [...new Set(missingFields)]; // Remove duplicates
}

/**
 * Check for conflicting criteria (e.g., overlapping ranges, contradictory conditions)
 */
export function checkCriteriaConflicts(criteria: any[]): Array<{
  criteriaIds: string[];
  conflict: string;
  severity: 'warning' | 'error';
}> {
  const conflicts: Array<{ criteriaIds: string[]; conflict: string; severity: 'warning' | 'error' }> = [];
  
  // Group by field
  const byField = new Map<string, any[]>();
  criteria.forEach(c => {
    if (!byField.has(c.criterion_field)) {
      byField.set(c.criterion_field, []);
    }
    byField.get(c.criterion_field)!.push(c);
  });
  
  // Check for multiple active criteria on same field
  byField.forEach((fieldCriteria, field) => {
    const activeCriteria = fieldCriteria.filter(c => c.is_active);
    if (activeCriteria.length > 1) {
      conflicts.push({
        criteriaIds: activeCriteria.map(c => c.id),
        conflict: `Múltiplos critérios ativos para o campo "${field}". Isso pode causar pontuação inesperada.`,
        severity: 'warning'
      });
    }
  });
  
  return conflicts;
}

/**
 * Suggest weight rebalancing to reach 100%
 */
export function suggestWeightRebalance(criteria: any[]): Map<string, number> {
  const activeCriteria = criteria.filter(c => c.is_active);
  const totalWeight = activeCriteria.reduce((sum, c) => sum + c.weight, 0);
  
  const suggestions = new Map<string, number>();
  
  if (totalWeight === 0 || activeCriteria.length === 0) {
    return suggestions;
  }
  
  // Proportional adjustment to reach 100%
  const adjustmentFactor = 100 / totalWeight;
  
  activeCriteria.forEach(criterion => {
    const newWeight = Math.round(criterion.weight * adjustmentFactor);
    suggestions.set(criterion.id, newWeight);
  });
  
  // Ensure total is exactly 100 by adjusting the largest weight
  const suggestedTotal = Array.from(suggestions.values()).reduce((sum, w) => sum + w, 0);
  if (suggestedTotal !== 100 && suggestions.size > 0) {
    const [largestId] = Array.from(suggestions.entries())
      .sort(([, a], [, b]) => b - a)[0];
    suggestions.set(largestId, suggestions.get(largestId)! + (100 - suggestedTotal));
  }
  
  return suggestions;
}