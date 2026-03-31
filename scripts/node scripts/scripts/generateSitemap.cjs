const fs = require("fs")

const baseUrl = "http://localhost:8080"

const currencies = [
"USD","EUR","GBP","AOA","NGN","ZAR","CAD","AUD","JPY","CHF",
"CNY","INR","BRL","MXN","SGD","HKD","SEK","NOK","DKK","PLN",
"TRY","KRW","IDR","MYR"
]

let urls = ""

currencies.forEach(from => {
  currencies.forEach(to => {

    if(from !== to){

      urls += `
<url>
<loc>${baseUrl}/convert/${from.toLowerCase()}/${to.toLowerCase()}</loc>
</url>
`

    }

  })
})

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${urls}

</urlset>
`

fs.writeFileSync("public/sitemap.xml", sitemap)

console.log("Sitemap criado com sucesso!")
