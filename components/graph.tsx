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
import { ETF } from '@/pages/api/retrievePrice';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function Graph({symbol, priceData}:{symbol: String, priceData: ETF[]}) {
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
        var etfData: ETF;
        for(let i = 0; i < priceData.length; i++) {
            if (priceData[i].symbol === symbol) {
                etfData = priceData[i];
                setPrice(etfData!.latestPrice as number);
                setChartLabels(etfData!.timeSeries.map((timeData: any) => timeData.datetime as Date) as never[]);
                setChartData(etfData!.timeSeries.map((timeData: any) => timeData.close as Number) as never[]);
            }
        }
    }, [priceData]);

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
