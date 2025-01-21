
export default function WeatherMobile({ isCurrentWeather }: { isCurrentWeather: { weather: { description: string }[]; main: { temp: number } } }) {
    return (
        <div className="w-full md:w-1/2 h-auto bg-gradient-to-tr from-sky-100 via-orange-100 to-white p-4 rounded-2xl shadow-md">
            <div className="h-full bg-white bg-opacity-70 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Status Cuaca</h2>
                <p className="text-sm text-gray-600">
                    {isCurrentWeather?.weather && isCurrentWeather.weather[0]?.description
                        ? `${isCurrentWeather.weather[0].description}, ${(isCurrentWeather.main.temp - 273.15).toFixed(1)}°C` : "Data cuaca tidak tersedia"}
                </p>
            </div>
        </div>
    )
}