import { ReactNode } from 'react';

interface MultiSelectCardProps {
  label: string;
  description?: string;
  icon?: ReactNode;
  selected: boolean;
  onClick: () => void;
}

/**
 * Card de seleção múltipla — checkbox visual.
 * Visualmente idêntico ao OptionCard mas com indicador de checkbox.
 */
export function MultiSelectCard({ label, description, icon, selected, onClick }: MultiSelectCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        relative p-4 rounded-xl border cursor-pointer transition-all duration-200
        ${selected 
          ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,1)]' 
          : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
        }
      `}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div className={`mt-0.5 ${selected ? 'text-blue-400' : 'text-slate-400'}`}>
            {icon}
          </div>
        )}
        <div>
          <div className={`font-semibold text-sm ${selected ? 'text-white' : 'text-slate-200'}`}>
            {label}
          </div>
          {description && (
            <div className={`text-xs mt-1 leading-relaxed ${selected ? 'text-blue-200/80' : 'text-slate-400'}`}>
              {description}
            </div>
          )}
        </div>
      </div>
      
      {/* Checkbox indicator */}
      <div className={`
        absolute top-4 right-4 w-4 h-4 rounded border flex items-center justify-center transition-all
        ${selected ? 'border-blue-500 bg-blue-500' : 'border-slate-500'}
      `}>
        {selected && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
    </div>
  );
}
