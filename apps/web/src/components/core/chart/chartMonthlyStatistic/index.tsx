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
import { useQuery } from '@tanstack/react-query';
import { instance } from '@/utils/axiosInstance';
import { IMonthlyChartsProps, IMonthlyDataItem, IMonthlyStatistic } from './type';
import Loading from '../../loadingCustom';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function MonthlyCharts({ refetch,refetchTab, monthlyData, onChange, value, showDropdown, isLoading }: IMonthlyChartsProps) {
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const monthlyPrices = new Array(12).fill(0)
    monthlyData?.forEach((item: IMonthlyDataItem) => {
        const monthIndex = item.month;
        item?.monthlyStatistics?.forEach((stat: IMonthlyStatistic) => {
            if (stat._sum?.laundryPrice !== null) {
                monthlyPrices[monthIndex] += stat._sum.laundryPrice;
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

    const { data: getDataStore, isLoading: isStoreLoading } = useQuery({
        queryKey: ['get-data-store'],
        queryFn: async () => {
            const res = await instance.get('/store')
            return res?.data?.data
        }
    })

    const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log('>>>')
        const selectedValue = e.target.value;
        if (onChange) {
            onChange(e);
        }
        refetch?.(); 
        refetchTab?.()
        console.log('<<<')
    };
    return (
        <div className='w-full relative'>

            {isLoading || !monthlyData && <Loading />}
            {isStoreLoading && (
                <div className='absolute top-0 left-0 w-full h-full bg-opacity-50 bg-gray-200 flex items-center justify-center'>
                    <Loading />
                </div>
            )}
            {showDropdown && (
                <select name="outletId" id="outletId" className='text-xs absolute bg-transparent border-b pb-2 focus:outline-none font-sans font-semibold' value={value} onChange={handleDropdownChange}>
                    <option value="">Semua</option>
                    {getDataStore?.map((store: { storeId: string, storeName: string }, i: number) => (
                        <option value={store?.storeId} key={i}>{store?.storeName}</option>
                    ))}
                    <option value="">Reset</option>
                </select>
            )}
            {!isStoreLoading && (
                <div className="chart-container mt-6">
                    <Bar data={data} options={options} />
                </div>
            )}

        </div>
    );
}
