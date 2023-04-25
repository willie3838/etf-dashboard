import Graph from '@/components/graph';
import { useEffect, useState } from 'react';

const PRICES_ENDPOINT = 'http://localhost:3000/api/retrievePrice'
const INTERVAL = 30000;
const ETFS = ["VOO", "QQQ", "VUG", "AVUV"]

export default function Home() {

  const [priceData, setPriceData] = useState([]);

  useEffect(() => {
    const interval = setInterval(async () => {
        const resp = await fetch(PRICES_ENDPOINT);
        setPriceData(await resp.json());
    }, INTERVAL);

    return () => clearInterval(interval);
    }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <p>ETF Dashboard</p>
      {
        ETFS.map((etf) => (
          <Graph key={etf} priceData={priceData} symbol={etf}/>
        ))
      }  
    </main>
  )
}
