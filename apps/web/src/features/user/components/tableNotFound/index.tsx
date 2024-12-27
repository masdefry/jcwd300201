export default function TableNotFoundComponent({ isFetching }: { isFetching: boolean }) {
    return (
        <tr>
            <td colSpan={6} className="py-10 font-bold text-center text-lg text-gray-600 break-words">{isFetching ? 'Mohon tunggu...' : 'Alamat tidak tersedia'}</td>
        </tr>
    );
}