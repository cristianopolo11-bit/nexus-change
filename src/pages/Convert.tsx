import { useParams, Link } from "react-router-dom"
import { useEffect, useState, useMemo } from "react"
import { fetchLiveRate, getSmartDecision } from "@/lib/currencies"
import ConversionResult from "@/components/ConversionResult"
import SmartDecisionCard from "@/components/SmartDecisionCard"

export default function Convert(){

const { from, to } = useParams()

const fromCurrency = from?.toUpperCase() || "USD"
const toCurrency = to?.toUpperCase() || "EUR"

const [rate,setRate] = useState<number | null>(null)
const [amount,setAmount] = useState("1000")

const numericAmount = useMemo(()=>{

const n = parseFloat(amount)

return isNaN(n) ? 0 : n

},[amount])

const result = useMemo(()=>{

if(rate !== null){

return numericAmount * rate

}

return 0

},[numericAmount,rate])

useEffect(()=>{

async function loadRate(){

try{

const r = await fetchLiveRate(fromCurrency,toCurrency)

setRate(r)

}catch(err){

console.error("Failed to fetch rate",err)

}

}

loadRate()

},[fromCurrency,toCurrency])

const decision = useMemo(

()=>getSmartDecision(fromCurrency,toCurrency),

[fromCurrency,toCurrency]

)

return(

<div className="min-h-svh bg-background text-foreground flex items-center justify-center p-4">

<div className="w-full max-w-2xl mx-auto space-y-6">

<header className="text-center space-y-2">

<h1 className="text-xl md:text-2xl font-bold">

{fromCurrency} to {toCurrency} Converter

</h1>

<p className="text-sm text-foreground/50">

Live exchange rate and currency converter

</p>

</header>

<div className="bg-card rounded-2xl p-4 md:p-6 space-y-6">

<label className="text-xs uppercase tracking-widest text-foreground/40">

Amount

</label>

<input
type="number"
value={amount}
onChange={(e)=>setAmount(e.target.value)}
className="w-full h-14 px-4 rounded-lg bg-foreground/[0.03] text-lg"
/>

<div className="text-center text-sm text-foreground/50">

1 {fromCurrency} = {rate ? rate.toFixed(4) : "..."} {toCurrency}

</div>

{numericAmount > 0 && (

<ConversionResult
amount={result}
currencyCode={toCurrency}
/>

)}

<SmartDecisionCard decision={decision}/>

</div>

<div className="text-center">

<Link
to="/"
className="text-sm text-primary hover:underline"
>

Back to converter

</Link>

</div>

</div>

</div>

)

}
