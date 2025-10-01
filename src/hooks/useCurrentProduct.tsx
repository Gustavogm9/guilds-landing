import { useMemo } from 'react';

export type BusinessUnit = 'guilds' | 'doavya';

/**
 * Hook que determina qual produto/projeto está sendo exibido.
 * 
 * Para o site público guilds.com.br: sempre retorna 'guilds'
 * Para o admin: pode alternar entre produtos via MultiProductContext
 * 
 * @param isAdminContext - Se true, pode retornar produto selecionado no admin
 * @param adminSelectedProduct - Produto selecionado no contexto admin
 */
export function useCurrentProduct(
  isAdminContext: boolean = false,
  adminSelectedProduct?: BusinessUnit
): BusinessUnit {
  return useMemo(() => {
    // No contexto admin, usa o produto selecionado
    if (isAdminContext && adminSelectedProduct) {
      return adminSelectedProduct;
    }
    
    // No site público, sempre Guilds
    return 'guilds';
  }, [isAdminContext, adminSelectedProduct]);
}
