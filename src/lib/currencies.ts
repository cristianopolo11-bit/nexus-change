export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export const currencies: Currency[] = [
  { code: "AOA", name: "Angolan Kwanza", symbol: "Kz", flag: "🇦🇴" },
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷" },
  { code: "USDT", name: "Tether (USDT)", symbol: "₮", flag: "🪙" },
  { code: "USDC", name: "USD Coin (USDC)", symbol: "$", flag: "🪙" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "BWP", name: "Botswana Pula", symbol: "P", flag: "🇧🇼" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr", flag: "🇨🇭" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  { code: "ETB", name: "Ethiopian Birr", symbol: "Br", flag: "🇪🇹" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵", flag: "🇬🇭" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", flag: "🇰🇪" },
  { code: "MAD", name: "Moroccan Dirham", symbol: "DH", flag: "🇲🇦" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", flag: "🇳🇬" },
  { code: "TND", name: "Tunisian Dinar", symbol: "DT", flag: "🇹🇳" },
  { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh", flag: "🇹🇿" },
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh", flag: "🇺🇬" },
  { code: "XAF", name: "Central African CFA Franc", symbol: "CFA", flag: "🌍" },
  { code: "XOF", name: "West African CFA Franc", symbol: "CFA", flag: "🌍" },
  { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦" },
  { code: "ZMW", name: "Zambian Kwacha", symbol: "ZK", flag: "🇿🇲" }
];

/* -------------------------------- */
/* TAXAS OFICIAIS NEXUS             */
/* -------------------------------- */

// Taxas para quando o cliente COMPRA divisas da Nexus (Cash-in)
const buyRates: Record<string, number> = {
  AOA: 1,
  USD: 1200,
  EUR: 1350,
  USDT: 1200,
  USDC: 1200,
  BRL: 250,
  GBP: 1530,
  ZAR: 65,
  JPY: 8.10,
  CHF: 1370,
  CAD: 890,
  AUD: 800,
  CNY: 167,
  NGN: 0.85,
  INR: 14.5
};

// Taxas para quando o cliente VENDE divisas para a Nexus (Cash-out)
const sellRates: Record<string, number> = {
  AOA: 1,
  USD: 1120,
  EUR: 1300,
  USDT: 1120,
  USDC: 1120,
  BRL: 180,
  GBP: 1400,
  ZAR: 55,
  JPY: 7.50,
  CHF: 1250,
  CAD: 800,
  AUD: 720,
  CNY: 150,
  NGN: 0.75,
  INR: 13.0
};

/* -------------------------------- */
/* MARKET TREND SIMULATION          */
/* -------------------------------- */

const trends: Record<string, number> = {
  USD: 0,
  EUR: 0.2,
  AOA: -0.3,
  BRL: -0.2,
  USDT: 0,
  USDC: 0,
  GBP: 0.1,
  NGN: -0.4
};

/* -------------------------------- */
/* FUNÇÕES DE LÓGICA E CONVERSÃO    */
/* -------------------------------- */

export async function fetchRates(base: string, isSell: boolean = false) {
  const activeRates = isSell ? sellRates : buyRates;

  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${base}`);
    const data = await response.json();
    if (!data || !data.rates) throw new Error("Resposta da API inválida");

    const rates = { ...data.rates };

    // Injetamos as taxas fixas da Nexus sobre os dados da API
    if (base === "AOA") {
      rates["USD"]  = 1 / activeRates["USD"];
      rates["EUR"]  = 1 / activeRates["EUR"];
      rates["USDT"] = 1 / activeRates["USDT"];
      rates["USDC"] = 1 / activeRates["USDC"];
      rates["BRL"]  = 1 / activeRates["BRL"];
    } else if (["USD", "USDT", "USDC"].includes(base)) {
      rates["AOA"] = activeRates["USD"];
    } else if (base === "EUR") {
      rates["AOA"] = activeRates["EUR"];
    } else if (base === "BRL") {
      rates["AOA"] = activeRates["BRL"];
    }

    return rates;
  } catch (error) {
    console.error("Falha na API, usando taxas offline");
    const fallbackRates: Record<string, number> = {};
    const baseValue = activeRates[base] || 1;

    Object.keys(activeRates).forEach(key => {
      fallbackRates[key] = activeRates[key] / baseValue;
    });

    return fallbackRates;
  }
}

export function getExchangeRate(from: string, to: string, isSell: boolean = false): number {
  const rates = isSell ? sellRates : buyRates;

  const fromValue = rates[from] ?? 1;
  const toValue   = rates[to]   ?? 1;

  if (to === "AOA")   return fromValue;
  if (from === "AOA") return 1 / toValue;

  return fromValue / toValue;
}

export async function convert(
  amount: number,
  from: string,
  to: string,
  isSell: boolean = false
): Promise<number> {
  const fixedCurrencies = ["USD", "EUR", "BRL", "USDT", "USDC"];

  // Para moedas fixas contra o Kwanza, ignoramos a API e usamos sempre as nossas taxas
  if (
    (fixedCurrencies.includes(from) && to === "AOA") ||
    (from === "AOA" && fixedCurrencies.includes(to))
  ) {
    return amount * getExchangeRate(from, to, isSell);
  }

  try {
    const rates = await fetchRates(from, isSell);
    const rate  = rates[to] || getExchangeRate(from, to, isSell);
    return amount * rate;
  } catch (error) {
    return amount * getExchangeRate(from, to, isSell);
  }
}

export function getTrend(from: string, to: string): number {
  return (trends[to] ?? 0) - (trends[from] ?? 0);
}

export interface SmartDecision {
  label: string;
  sub: string;
  variant: "success" | "warning" | "neutral";
  icon: string;
}

export function getSmartDecision(from: string, to: string): SmartDecision {
  const trend = getTrend(from, to);
  if (trend > 0.5) {
    return {
      label: "Bom momento para converter",
      sub: `O ${from} está mais forte que o ${to}.`,
      variant: "success",
      icon: "↑",
    };
  }
  if (trend < -0.5) {
    return {
      label: "Considere aguardar",
      sub: `O mercado sugere uma taxa melhor em breve.`,
      variant: "warning",
      icon: "↓",
    };
  }
  return {
    label: "Mercado estável",
    sub: "Flutuações mínimas detectadas.",
    variant: "neutral",
    icon: "→",
  };
}

export function generateCurrencyPairs() {
  const pairs: { from: string; to: string }[] = [];
  currencies.forEach((from) => {
    currencies.forEach((to) => {
      if (from.code !== to.code) {
        pairs.push({ from: from.code, to: to.code });
      }
    });
  });
  return pairs;
}