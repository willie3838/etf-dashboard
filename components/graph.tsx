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

export default function Graph() {
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

        setPrice(priceData.latestPrice);
        setChartLabels(priceData.timeSeries.map((timeData: any) => timeData.datetime as Date));
        setChartData(priceData.timeSeries.map((timeData: any) => timeData.close as Number));
        console.log("Data: ", data.datasets[0].data);
        console.log("Labels: ", chartLabels);
    }, 10090);

    return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex min-h-screen flex-col items-center p-24">
            <p>ETF price: {price}</p>
            <Line
                options={options}
                data={data}
            />
        </div>
    )
}
