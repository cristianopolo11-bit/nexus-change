interface ConversionResultProps {
  amount: number;
  currencyCode: string;
}

export default function ConversionResult({ amount, currencyCode }: ConversionResultProps) {
  const formatted = amount.toLocaleString("pt-PT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="py-8 border-y border-foreground/5 flex flex-col items-center justify-center space-y-2">
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 italic">
        Resultado Estimado
      </span>
      
      <div className="text-5xl md:text-6xl font-black tracking-tighter tabular-nums italic">
        {formatted}
        <span className="text-xl text-foreground/20 ml-3 not-italic">{currencyCode}</span>
      </div>
    </div>
  );
}