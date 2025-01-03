import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function MonthlyCharts({ monthlyData }: any) {
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const monthlyPrices = new Array(12).fill(0)
    monthlyData?.forEach((item: any) => {
        const monthIndex = item.month;
        item?.monthlyStatistics?.forEach((stat: any) => {
            if (stat._sum?.totalPrice !== null) {
                monthlyPrices[monthIndex] += stat._sum.totalPrice;
            }
        });
    });

    const data = {
        labels: months,
        datasets: [
            {
                label: 'Total',
                data: monthlyPrices,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            }
        ]
    };

    const options: ChartOptions<'bar'> = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Laporan Bulanan'
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Bulan'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Total'
                },
                beginAtZero: true
            }
        }
    };

    return (
        <Bar data={data} options={options} className='w-full' style={{ width: '100%' }} />
    );
}
