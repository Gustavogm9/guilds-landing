interface SliderFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  labels?: { min: string; max: string };
}

/**
 * Slider numérico estilizado para dark mode.
 */
export function SliderField({ label, value, onChange, min = 0, max = 100, step = 1, suffix = '', labels }: SliderFieldProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-baseline">
        <label className="text-sm font-semibold text-slate-200">{label}</label>
        <span className="text-lg font-bold text-blue-400">{value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(59,130,246,0.5)] [&::-webkit-slider-thumb]:cursor-pointer"
      />
      {labels && (
        <div className="flex justify-between text-[10px] text-slate-600">
          <span>{labels.min}</span>
          <span>{labels.max}</span>
        </div>
      )}
    </div>
  );
}
