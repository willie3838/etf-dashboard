const { workerData, parentPort } = require("worker_threads");

const API_KEY = 'a3d71b5a2a734b9991d88225ef44c1e1';
const axios = require('axios');

async function retrievePrice(symbol) {
  console.log(symbol);
  let priceHistoryEndpoint = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1min&apikey=${API_KEY}`
  const dataPromise = await axios.get(priceHistoryEndpoint).then(response => response.data);
  return dataPromise;
}

async function main() {
  await retrievePrice(workerData.symbol)
    .then(response => {
      let timeSeries = response.values;
      let latestPrice = timeSeries[timeSeries.length - 1].close;

      let etf = {
          symbol: workerData.symbol,
          latestPrice: latestPrice,
          timeSeries: timeSeries
      };
      parentPort.postMessage(etf);
    }); 
}

main();
