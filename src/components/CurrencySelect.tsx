import { currencies } from "@/lib/currencies";

interface CurrencySelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function CurrencySelect({ label, value, onChange }: CurrencySelectProps) {
  const selected = currencies.find((c) => c.code === value);

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 ml-1">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-14 bg-foreground/[0.03] rounded-lg px-4 pr-8 text-sm font-medium text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer"
        >
          {currencies.map((c) => (
            <option key={c.code} value={c.code} className="bg-card text-foreground">
              {c.flag} {c.code} — {c.name}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/40 text-lg">
          {selected?.flag}
        </div>
      </div>
    </div>
  );
}
