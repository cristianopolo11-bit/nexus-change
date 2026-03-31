import { currencies } from "@/lib/currencies";

interface ConversionResultProps {
  amount: number;
  currencyCode: string;
}

export default function ConversionResult({ amount, currencyCode }: ConversionResultProps) {
  const currency = currencies.find((c) => c.code === currencyCode);
  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="py-6 border-y border-foreground/5 flex flex-col items-center justify-center space-y-1 animate-slide-up-fade">
      <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/30">
        Converted Amount
      </span>
      <div className="text-5xl font-bold tracking-tighter tabular-nums">
        {formatted}
        <span className="text-xl text-foreground/20 ml-2">{currencyCode}</span>
      </div>
      {currency && (
        <span className="text-xs text-foreground/30 mt-1">
          {currency.flag} {currency.name}
        </span>
      )}
    </div>
  );
}
