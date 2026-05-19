import React from "react";

interface ConversionResultProps {
  amount?: number;
  currency?: string;
  fromCurrency?: string;
  rate?: number; // Recebe a taxa real calculada
}

const ConversionResult = ({ 
  amount = 0, 
  currency = "AOA", 
  fromCurrency = "USD",
  rate = 0 
}: ConversionResultProps) => {
  const safeAmount = typeof amount === "number" ? amount : 0;

  return (
    <div className="space-y-4 w-full overflow-hidden">
      <div className="space-y-1">
        {/* break-all garante que valores longos fiquem dentro do card */}
        <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-white tracking-tighter break-all leading-none">
          {safeAmount.toLocaleString("pt-AO", {
            style: "currency",
            currency: currency,
          })}
        </h3>
        
        {/* Preço Unitário dinâmico que muda com a consulta */}
        <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest opacity-90">
          Taxa: 1 {fromCurrency} = {rate.toLocaleString("pt-AO", { minimumFractionDigits: 2 })} {currency}
        </p>
      </div>
    </div>
  );
};

export default ConversionResult;