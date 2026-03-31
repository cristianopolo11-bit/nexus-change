export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export const currencies: Currency[] = [
  { code: "AOA", name: "Angolan Kwanza", symbol: "Kz", flag: "🇦🇴" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷" },
  { code: "BWP", name: "Botswana Pula", symbol: "P", flag: "🇧🇼" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr", flag: "🇨🇭" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  { code: "ETB", name: "Ethiopian Birr", symbol: "Br", flag: "🇪🇹" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
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
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "XAF", name: "Central African CFA Franc", symbol: "CFA", flag: "🌍" },
  { code: "XOF", name: "West African CFA Franc", symbol: "CFA", flag: "🌍" },
  { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦" },
  { code: "ZMW", name: "Zambian Kwacha", symbol: "ZK", flag: "🇿🇲" }
];

/* -------------------------------- */
/* BASE RATES (fallback offline)    */
/* -------------------------------- */

const baseRates: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  AOA: 900,
  GBP: 0.79,
  JPY: 149.8,
  CHF: 0.88,
  CAD: 1.36,
  AUD: 1.53,
  BRL: 4.97,
  CNY: 7.24,
  NGN: 1500,
  ZAR: 18.5,
  INR: 83.1
};

/* -------------------------------- */
/* MARKET TREND SIMULATION          */
/* -------------------------------- */

const trends: Record<string, number> = {
  USD: 0,
  EUR: 0.2,
  AOA: -0.3,
  GBP: 0.1,
  JPY: 0,
  CHF: 0,
  CAD: 0,
  AUD: 0,
  BRL: -0.2,
  CNY: 0,
  NGN: -0.4,
  ZAR: 0.1,
  INR: 0
};

/* -------------------------------- */
/* FETCH LIVE RATES FROM API        */
/* -------------------------------- */

export async function fetchRates(base: string) {
  try {
    const response = await fetch(
      `https://open.er-api.com/v6/latest/${base}`
    );

    const data = await response.json();

    if (!data || !data.rates) {
      throw new Error("Invalid API response");
    }

    return data.rates;

  } catch (error) {
    console.error("Live rate fetch failed");

    return baseRates;
  }
}

/* -------------------------------- */
/* GET SINGLE LIVE RATE             */
/* -------------------------------- */

export async function fetchLiveRate(from: string, to: string): Promise<number> {

  const rates = await fetchRates(from);

  if (!rates[to]) {
    throw new Error("Rate unavailable");
  }

  return rates[to];
}

/* -------------------------------- */
/* BASIC CONVERSION                 */
/* -------------------------------- */

export async function convertCurrency(
  amount: number,
  from: string,
  to: string
) {

  const rate = await fetchLiveRate(from, to);

  return amount * rate;
}

/* -------------------------------- */
/* FALLBACK RATE                    */
/* -------------------------------- */

export function getExchangeRate(from: string, to: string): number {

  const fromRate = baseRates[from] ?? 1;
  const toRate = baseRates[to] ?? 1;

  return toRate / fromRate;
}

/* -------------------------------- */
/* SAFE CONVERSION (API + fallback) */
/* -------------------------------- */

export async function convert(
  amount: number,
  from: string,
  to: string
): Promise<number> {

  try {

    const rate = await fetchLiveRate(from, to);

    return amount * rate;

  } catch (error) {

    console.warn("Using fallback rate");

    const fallbackRate = getExchangeRate(from, to);

    return amount * fallbackRate;
  }
}

/* -------------------------------- */
/* MARKET TREND ANALYSIS            */
/* -------------------------------- */

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
      label: "Good time to convert",
      sub: `The ${from} is currently stronger against the ${to}.`,
      variant: "success",
      icon: "↑",
    };
  }

  if (trend < -0.5) {
    return {
      label: "Consider waiting",
      sub: `The market trend suggests a possible better rate soon.`,
      variant: "warning",
      icon: "↓",
    };
  }

  return {
    label: "Stable market",
    sub: "Minimal fluctuations detected.",
    variant: "neutral",
    icon: "→",
  };
}

/* -------------------------------- */
/* GENERATE ALL CURRENCY PAIRS SEO  */
/* -------------------------------- */

export function generateCurrencyPairs() {

  const pairs: { from: string; to: string }[] = [];

  currencies.forEach((from) => {

    currencies.forEach((to) => {

      if (from.code !== to.code) {

        pairs.push({
          from: from.code,
          to: to.code
        });

      }

    });

  });

  return pairs;
}
