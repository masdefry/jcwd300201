export default function TableWeightComponent({ values }: { values: any }) {
    return (
        <div className="w-full overflow-y-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="py-3 px-6 text-center text-sm font-bold text-gray-600 uppercase">Total Item</th>
                        <th className="py-3 px-6 text-sm font-bold text-gray-600 uppercase text-center">Total Berat (kg)</th>
                        <th className="py-3 px-6 text-center text-sm font-bold text-gray-600 uppercase">Total Harga</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="hover:bg-gray-100 border-b">
                        <td className="py-3 px-6 text-center text-sm text-gray-600 break-words">{values?.items?.length}</td>
                        <td className="py-3 px-6 text-center text-sm text-gray-600 break-words">{values?.totalWeight ? values?.totalWeight : '0'}</td>
                        <td className="py-3 px-6 text-center text-sm text-gray-600 break-words">{values?.laundryPrice?.toLocaleString('id-ID')}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}