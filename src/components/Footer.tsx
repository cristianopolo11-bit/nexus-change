import { currencies } from "@/lib/currencies";

interface CurrencySelectProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void; // Alterado de onChange para onValueChange
}

export default function CurrencySelect({ label, value, onValueChange }: CurrencySelectProps) {
  const selected = currencies.find((c) => c.code === value);

  return (
    <div className="space-y-2 w-full">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
        {label}
      </label>
      <div className="relative group">
        <select
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className="w-full h-16 bg-slate-50 border border-slate-200 rounded-2xl px-4 pr-12 text-lg font-black text-[#1a4571] appearance-none focus:outline-none focus:ring-2 focus:ring-[#1a4571]/20 focus:border-[#1a4571] transition-all cursor-pointer shadow-sm group-hover:bg-white"
        >
          {currencies.map((c) => (
            <option key={c.code} value={c.code} className="bg-white text-slate-900 font-sans py-2">
              {c.flag} {c.code} — {c.name}
            </option>
          ))}
        </select>
        
        {/* Ícone da bandeira flutuante à direita para dar um toque premium */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2">
          <span className="text-2xl grayscale-[0.2]">{selected?.flag}</span>
          <div className="w-px h-4 bg-slate-200 ml-1" />
          <svg 
            className="w-4 h-4 text-slate-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}