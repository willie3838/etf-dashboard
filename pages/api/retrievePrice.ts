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

export interface Data {
  latestPrice: Number
  timeSeries: TimeSeries[]
}

const API_KEY = 'a3d71b5a2a734b9991d88225ef44c1e1';
const QUOTE_ENDPOINT = `https://api.twelvedata.com/time_series?symbol=VOO&interval=1min&apikey=${API_KEY}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  
  const apiRes = await fetch(QUOTE_ENDPOINT);
  const data = await apiRes.json();

  let timeSeries = data.values as TimeSeries[];
  let latestPrice = timeSeries[timeSeries.length - 1].close;
  
  res.status(200).json({ latestPrice: latestPrice, timeSeries: timeSeries })
}
