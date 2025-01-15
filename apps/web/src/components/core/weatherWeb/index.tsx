import { FaTint } from "react-icons/fa";
import { FaCloud, FaTemperatureHigh } from "react-icons/fa6";

export default function WeatherWeb({ isCurrentWeather }: any) {
    return (
        <div className="w-1/2 h-full flex items-center px-2 flex-col justify-center rounded-xl bg-white bg-opacity-45">
            <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-700">Status Cuaca</h2>
                <div className="flex justify-center items-center py-4">
                    {isCurrentWeather?.weather ? (
                        <p className='text-6xl text-neutral-700 font-bold'> {isCurrentWeather?.main?.temp
                            ? `${(isCurrentWeather.main.temp - 273.15).toFixed(1)}°C`
                            : '- °C'}
                        </p>
                    ) : (
                        <span className="text-gray-500">Cuaca tidak tersedia</span>
                    )}
                </div>
            </div>
            <div>
                <p className="text-lg text-gray-600">
                    {isCurrentWeather?.weather && isCurrentWeather.weather[0]?.description
                        ?
                        <span className='flex gap-2 items-center '>
                            <FaCloud className="text-gray-200" />
                            {isCurrentWeather.weather[0].description.toUpperCase()}
                        </span>
                        : 'Data cuaca tidak tersedia'}</p>
            </div>
            <div className="py-4 space-y-2 w-full">
                <div className="flex items-center space-x-3 bg-white bg-opacity-70 w-full py-1 px-4 rounded-full">
                    <FaTint className="text-neutral-400" />
                    <p className="text-neutral-700 text-sm">{isCurrentWeather?.main?.humidity ? `${isCurrentWeather.main.humidity}%` : '- %'}</p>
                </div>
                <div className="flex items-center space-x-3 bg-white bg-opacity-70 w-full py-1 px-4 rounded-full">
                    <FaTemperatureHigh className="text-neutral-400" />
                    <p className="text-neutral-700 text-sm"> {isCurrentWeather?.main?.temp
                        ? `${(isCurrentWeather.main.temp - 273.15).toFixed(1)}°C`
                        : '- °C'}</p>
                </div>
            </div>
        </div>
    )
}