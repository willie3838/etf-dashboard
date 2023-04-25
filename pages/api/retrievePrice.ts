// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { plainToInstance } from "class-transformer";

export interface TimeSeries {
  datetime: Date
  open: Number
  high: Number
  low: Number
  close: Number
  volume: Number
}

export interface ETF {
  symbol: String
  latestPrice: Number
  timeSeries: TimeSeries[]
}

const API_KEY = 'a3d71b5a2a734b9991d88225ef44c1e1';
// const ALL_ETFS = `https://api.twelvedata.com/etf?apikey=${API_KEY}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ETF[]>
) {
  // const allEtfsRes = await fetch(ALL_ETFS);
  // const etfJsonData = await allEtfsRes.json();
  
  // let etfData = await etfJsonData.data;
  let symbols = ["VOO", "QQQ", "VUG", "AVUV"];

  // for (let i = 0; i < etfData.length; i++) {
  //   symbols.push(etfData[i].symbol);
  // }

  let responseData = []
  for (let i = 0; i < symbols.length; i++) {
    let symbol = symbols[i];
    console.log("Symbol: ", symbol)
    let priceHistoryEndpoint = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1min&apikey=${API_KEY}`

    let apiRes = await fetch(priceHistoryEndpoint);
    let priceData = await apiRes.json();

    if (priceData.code == 400) {
      continue;
    }

    console.log("Price data: ", priceData);
    let timeSeries = priceData.values as TimeSeries[];
    let latestPrice = timeSeries[timeSeries.length - 1].close;

    let etf: ETF = {
      symbol: symbol,
      latestPrice: latestPrice,
      timeSeries: timeSeries
    };
    responseData.push(etf);
  }
  
  res.status(200).json(responseData)
}
