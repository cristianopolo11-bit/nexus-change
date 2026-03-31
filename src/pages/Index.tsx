import { Link } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { ArrowUpDown } from "lucide-react";

import CurrencySelect from "@/components/CurrencySelect";
import ConversionResult from "@/components/ConversionResult";
import SmartDecisionCard from "@/components/SmartDecisionCard";

import {
  getSmartDecision,
  fetchLiveRate,
  generateCurrencyPairs
} from "@/lib/currencies";

export default function Index() {

  const [amount, setAmount] = useState<string>("1000");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [liveRate, setLiveRate] = useState<number | null>(null);

  /* ----------------------------- */
  /* PARSE AMOUNT                  */
  /* ----------------------------- */

  const numericAmount = useMemo(() => {
    const n = parseFloat(amount);
    return isNaN(n) ? 0 : n;
  }, [amount]);

  /* ----------------------------- */
  /* CONVERSION RESULT             */
  /* ----------------------------- */

  const result = useMemo(() => {

    if (!liveRate) return 0;

    return numericAmount * liveRate;

  }, [numericAmount, liveRate]);

  /* ----------------------------- */
  /* LOAD LIVE RATE                */
  /* ----------------------------- */

  useEffect(() => {

    async function loadRate() {

      try {

        const rate = await fetchLiveRate(fromCurrency, toCurrency);

        setLiveRate(rate);

      } catch (error) {

        console.error("Live rate failed");

        setLiveRate(null);

      }

    }

    loadRate();

  }, [fromCurrency, toCurrency]);

  /* ----------------------------- */
  /* SMART DECISION                */
  /* ----------------------------- */

  const decision = useMemo(() => {
    return getSmartDecision(fromCurrency, toCurrency);
  }, [fromCurrency, toCurrency]);

  /* ----------------------------- */
  /* SWAP CURRENCIES               */
  /* ----------------------------- */

  const handleSwap = () => {

    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);

  };

  /* ----------------------------- */
  /* TIME DISPLAY                  */
  /* ----------------------------- */

  const timeString = useMemo(() => {

    const now = new Date();

    return now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  }, []);

  /* ----------------------------- */
  /* GENERATE SEO PAIRS            */
  /* ----------------------------- */

  const currencyPairs = useMemo(() => {

    return generateCurrencyPairs();

  }, []);

  /* Mostrar apenas alguns links para não pesar */

  const seoLinks = currencyPairs.slice(0, 60);

  /* ----------------------------- */
  /* POPULAR LINKS                 */
  /* ----------------------------- */

  const popularConversions = [
    { from: "USD", to: "AOA" },
    { from: "USD", to: "NGN" },
    { from: "USD", to: "ZAR" },
    { from: "EUR", to: "AOA" },
    { from: "EUR", to: "NGN" },
    { from: "GBP", to: "AOA" },
    { from: "GBP", to: "NGN" }
  ];

  return (

    <div className="min-h-svh bg-background text-foreground flex items-center justify-center p-4">

      <div className="w-full max-w-2xl mx-auto space-y-6">

        {/* HEADER */}

        <header className="space-y-2 text-center">

          <div className="flex items-center justify-center gap-2">

            <img
              src="/icon.png"
              alt="Nexus Change Icon"
              className="w-8 h-8"
            />

            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              Nexus Change
            </h1>

          </div>

          <p className="text-sm text-foreground/60">
            Smart Currency Intelligence
          </p>

          <p className="text-xs text-foreground/40">
            Real-time currency conversion for Africa and the world
          </p>

        </header>

        {/* MAIN CARD */}

        <div className="bg-card rounded-2xl p-4 md:p-6 shadow-lg space-y-8">

          {/* AMOUNT */}

          <div className="space-y-4">

            <div className="space-y-2">

              <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/30">

                Amount

              </label>

              <input
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-14 bg-foreground/[0.03] rounded-lg px-4 text-xl font-medium tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/40"
              />

            </div>

            {/* SELECTS */}

            <div className="grid grid-cols-[1fr_40px_1fr] items-end gap-2">

              <CurrencySelect
                label="From"
                value={fromCurrency}
                onChange={setFromCurrency}
              />

              <button
                onClick={handleSwap}
                className="h-14 flex items-center justify-center hover:bg-foreground/5 rounded-lg transition"
              >
                <ArrowUpDown className="w-4 h-4 text-foreground/30" />
              </button>

              <CurrencySelect
                label="To"
                value={toCurrency}
                onChange={setToCurrency}
              />

            </div>

            {/* RATE */}

            <div className="text-xs text-foreground/40 text-center tabular-nums">

              1 {fromCurrency} = {liveRate ? liveRate.toFixed(4) : "..."} {toCurrency}

            </div>

          </div>

          {/* RESULT */}

          {numericAmount > 0 && (

            <ConversionResult
              amount={result}
              currencyCode={toCurrency}
            />

          )}

          {/* AI DECISION */}

          <SmartDecisionCard decision={decision} />

          {/* SEND MONEY */}

          <div className="space-y-3 text-center">

            <p className="text-xs text-foreground/40 uppercase tracking-widest">
              Send money with
            </p>

            <div className="flex gap-2 justify-center flex-wrap">

              <a
                href="https://wise.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm rounded-lg bg-foreground/5 hover:bg-foreground/10 transition"
              >
                Wise
              </a>

              <a
                href="https://westernunion.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm rounded-lg bg-foreground/5 hover:bg-foreground/10 transition"
              >
                Western Union
              </a>

              <a
                href="https://binance.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm rounded-lg bg-foreground/5 hover:bg-foreground/10 transition"
              >
                Binance
              </a>

            </div>

          </div>

        </div>

        {/* POPULAR CONVERSIONS */}

        <div className="space-y-3 text-center">

          <p className="text-xs text-foreground/40 uppercase tracking-widest">

            Popular conversions

          </p>

          <div className="flex flex-wrap justify-center gap-2">

            {popularConversions.map((c, i) => (

              <Link
                key={i}
                to={`/convert/${c.from.toLowerCase()}/${c.to.toLowerCase()}`}
                className="text-xs md:text-sm px-3 py-2 rounded-md bg-foreground/5 hover:bg-foreground/10 transition"
              >
                {c.from} → {c.to}
              </Link>

            ))}

          </div>

        </div>

        {/* SEO LINKS */}

        <div className="space-y-3 text-center">

          <p className="text-xs text-foreground/40 uppercase tracking-widest">

            More currency pairs

          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">

            {seoLinks.map((pair, i) => (

              <Link
                key={i}
                to={`/convert/${pair.from.toLowerCase()}/${pair.to.toLowerCase()}`}
                className="text-xs px-2 py-2 rounded-md bg-foreground/5 hover:bg-foreground/10 transition"
              >
                {pair.from} → {pair.to}
              </Link>

            ))}

          </div>

        </div>

        {/* FOOTER */}

        <footer className="flex justify-between text-[10px] uppercase text-foreground/20">

          <span>Live Rates: {timeString}</span>

          <span>Source: Market API</span>

        </footer>

      </div>

    </div>

  );

}
