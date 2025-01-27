type TValue = string | number | readonly string[] | undefined
export default function InputDisplay({ value, caption }: { value: TValue, caption: string }) {
    return (
        <div className="flex flex-col">
            <label className="font-semibold bg-gray-200 rounded-t-md py-2 px-3">{caption} <span className="text-red-600">*</span></label>
            <input
                type="text"
                value={value}
                disabled
                className="w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500 rounded-b-md"
            />
        </div>
    );
}