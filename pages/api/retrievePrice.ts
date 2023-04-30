// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

const { Worker } = require("worker_threads");

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
const SYMBOLS =  ["VOO", "QQQ", "VUG", "AVUV"];
let responseData:ETF[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ETF[]>
) {
  let threads:any[] = [];
  let removed = 0;
  
  for (let i = 0; i < SYMBOLS.length; i++) {
    let symbol = SYMBOLS[i];
    threads.push(new Worker("./pages/api/callPriceAPI.js", { workerData: { symbol }}));
  }

  console.log(`Created ${threads.length} threads`)

  for (let worker of threads) {
    worker.on('error', (err:any) => { throw err; });
    worker.on('exit', () => {
      removed += 1;
      if (removed == threads.length) {
        console.log("Completed retrieving all data");
        res.status(200).json(responseData);
      }
    });
    worker.on('message', (msg:any) => { 
      responseData.push(msg);
    });
  }

}

