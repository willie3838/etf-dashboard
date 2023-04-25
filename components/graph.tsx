import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const PRICES_ENDPOINT = 'http://localhost:3000/api/retrievePrice'

export default function Graph({symbol}:{symbol: String}) {
    const [price, setPrice] = useState(0);
    const [chartData, setChartData] = useState([]);
    const [chartLabels, setChartLabels] = useState([]);

    const options = {
        responsive: true,
        plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Chart.js Line Chart',
        },
        y: {
            ticks: {
                stepSize: 0.1
            }
        }
        },
    };

    const data = {
        labels: chartLabels,
        datasets: [
        {
            label: 'ETF Price History',
            data: chartData,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        ],
    };

    useEffect(() => {
    const interval = setInterval(async () => {
        const resp = await fetch(PRICES_ENDPOINT);
        let priceData = await resp.json();

        var etfData;
        for (let i = 0; i < priceData.length; i++) {
            if (priceData[i].symbol === symbol) {
                etfData = priceData[i];
            }
        }
        console.log("Symbol: ", symbol)
        console.log("Etf data: ", etfData);

        setPrice(etfData.latestPrice);
        setChartLabels(etfData.timeSeries.map((timeData: any) => timeData.datetime as Date));
        setChartData(etfData.timeSeries.map((timeData: any) => timeData.close as Number));
        console.log("Data: ", data.datasets[0].data);
        console.log("Labels: ", chartLabels);
    }, 8000);

    return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-4/5 h-4/5 p-10">
            <p className="text-center">{symbol} price: {price}</p>
            <Line
                options={options}
                data={data}
            />
        </div>
    )
}
