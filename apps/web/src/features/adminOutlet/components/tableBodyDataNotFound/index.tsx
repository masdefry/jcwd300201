export default function TableBodyNotFound({ caption = 'Data tidak Tersedia' }: { caption?: string }) {
    return (
        <tr>
            <td colSpan={6} className="text-center py-20 font-bold text-3xl text-neutral-300">{caption}</td>
        </tr>
    );
}