// ... (resto do código acima igual)

  // 1. AS TUAS TAXAS REAIS (Onde tu controlas o lucro)
  const NEXUS_RATES: Record<string, number> = {
    // Venda (Cliente compra de ti)
    "USD_AOA": 1210, 
    "EUR_AOA": 1350, 
    "BRL_AOA": 250,  
    "USDT_AOA": 1190, 
    "USDC_AOA": 1190,
    
    // Compra (Tu compras do cliente - taxas sugeridas com margem)
    "AOA_USD": 1 / 1310,
    "AOA_EUR": 1 / 1450,
    "AOA_BRL": 1 / 280,
    "AOA_USDT": 1 / 1290,
    "AOA_USDC": 1 / 1290,
  };

  useEffect(() => {
    async function loadRate() {
      const pair = `${fromCurrency}_${toCurrency}`;
      
      // PRIORIDADE TOTAL: Se a moeda está na tua lista Nexus, NÃO consulta a API
      if (NEXUS_RATES[pair]) {
        setLiveRate(NEXUS_RATES[pair]);
      } 
      // Apenas moedas que tu NÃO transacionas (ex: JPY, CAD) vão à API
      else {
        try {
          const rate = await fetchLiveRate(fromCurrency, toCurrency);
          setLiveRate(rate);
        } catch (error) {
          setLiveRate(null);
        }
      }
    }
    loadRate();
  }, [fromCurrency, toCurrency]);

// ... (resto do código igual)