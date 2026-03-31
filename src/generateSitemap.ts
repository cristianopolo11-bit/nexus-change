import { currencies } from "./lib/currencyList"

const baseUrl = "https://nexuschange.com"

function generatePairs(){

const urls:string[] = []

currencies.forEach(from=>{

currencies.forEach(to=>{

if(from !== to){

urls.push(`${baseUrl}/convert/${from.toLowerCase()}/${to.toLowerCase()}`)

}

})

})

return urls

}

export function generateSitemap(){

const urls = generatePairs()

return `<?xml version="1.0" encoding="UTF-8"?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${urls.map(url=>`

<url>

<loc>${url}</loc>

<changefreq>daily</changefreq>

<priority>0.8</priority>

</url>

`).join("")}

</urlset>

`

}
