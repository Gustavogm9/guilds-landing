interface TextAreaFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  hint?: string;
}

/**
 * Campo de texto livre com estilo dark-mode Raio-X.
 */
export function TextAreaField({ label, placeholder, value, onChange, maxLength = 500, hint }: TextAreaFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-200">{label}</label>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={4}
        className="w-full rounded-xl bg-slate-900/50 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-white placeholder:text-slate-600 text-sm p-4 resize-none transition-colors outline-none"
      />
      <div className="text-right text-[10px] text-slate-600">{value.length}/{maxLength}</div>
    </div>
  );
}
