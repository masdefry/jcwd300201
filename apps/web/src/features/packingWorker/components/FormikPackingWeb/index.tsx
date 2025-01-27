import { Formik, Form, Field, ErrorMessage } from "formik";
import InputDisplay from "@/features/adminOutlet/components/inputDisplayCustom";
import ButtonCustom from "@/components/core/buttonCustom";
import { IFormikPackingWebProps } from "./type";
import { packingItemValidationSchema } from "../../schemas/packingItemValidationSchema";

export type Iitem = {
    id: number;
    itemName: string;
    laundryItemId: number;
    quantity: number;
    weight: number;
};

export default function FormikPackingWeb({
    dataItemName,
    dataOrderNote,
    dataOrderDetail,
    isPending,
    isDisabledSucces,
    emails,
    handleStatusOrder,
    compareData,
    setDialogNotes,
    setShowDialog,
    setIsCheckedItem,
    isCheckedItem
}: IFormikPackingWebProps) {
    return (
        <Formik initialValues={{
            items: [],
            itemName: '',
            quantity: 1,
            notes: '',
        }}
            validationSchema={packingItemValidationSchema}
            onSubmit={(values: any) => {
                handleStatusOrder({
                    email: emails,
                    notes: values.notes,
                });
            }}
        >
            {({ values, setFieldValue, submitForm }) => {
                const handleCustomSubmit = () => {
                    const itemOrder = values.items.map((item: any) => ({
                        laundryItemId: item.itemName,
                        quantity: item.quantity,
                    }));
                    const isDataMatching = compareData(itemOrder, dataOrderDetail);
                    if (isDataMatching) {
                        submitForm()
                    } else {
                        setDialogNotes("Catatan:");
                        setShowDialog(true);
                    }
                }

                return (
                    <Form className="min-h-fit pb-5 w-full flex gap-4">
                        <div className="w-full bg-white">
                            <div className="space-y-5">
                                <InputDisplay value={`${dataOrderNote[0].User?.firstName} ${dataOrderNote[0].User?.lastName}`} caption="Nama Pelanggan" />
                                <InputDisplay value={`${dataOrderNote[0].UserAddress?.addressDetail}, ${dataOrderNote[0].UserAddress?.city}, ${dataOrderNote[0].UserAddress?.province}`} caption="Alamat Pelanggan" />
                                <InputDisplay value={dataOrderNote[0].OrderType?.type === 'Wash Only' ? 'Layanan Mencuci' : dataOrderNote[0].OrderType?.type === 'Iron Only' ? 'Layanan Setrika' : dataOrderNote[0].OrderType?.type === 'Wash & Iron' ? 'Mencuci dan Setrika' : 'Layanan Kami'} caption="Tipe Order" />
                                <div className="flex flex-col gap-2">
                                    <div className='flex w-full gap-2 items-end'>
                                        <div className='w-full'>
                                            <label className="font-semibold">Produk Laundry <span className="text-red-600">*</span></label>
                                            <Field
                                                as="select"
                                                name="itemName"
                                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                    setIsCheckedItem(false)
                                                    setFieldValue('itemName', e.target.value)
                                                }}
                                                className="w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500 rounded-md">
                                                <option value="" disabled>Select Item</option>
                                                {dataItemName?.map((item: Iitem, index: number) => (
                                                    <option key={index} value={item?.id}>
                                                        {item?.itemName}
                                                    </option>
                                                ))}
                                            </Field>
                                            <ErrorMessage name="itemName" component="div" className="text-xs text-red-600" />
                                        </div>
                                        <div className="w-full">
                                            <label className="font-semibold">Jumlah <span className="text-red-600">*</span></label>
                                            <Field name="quantity" max="1000" type="number" placeholder="Quantity" className="w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500 rounded-md" min="1" />
                                        </div>
                                        <div className='flex flex-col items-end'>
                                            <ButtonCustom type="button"
                                                disabled={isCheckedItem}
                                                onClick={() => {
                                                    const existingItemIndex = values.items.findIndex(
                                                        (item: Iitem) => item.itemName === values.itemName
                                                    );

                                                    if (existingItemIndex !== -1) {
                                                        const updatedItems = [...values.items];
                                                        updatedItems[existingItemIndex].quantity += values.quantity;
                                                        setFieldValue("items", updatedItems);
                                                    } else {
                                                        setFieldValue("items", [
                                                            ...values.items,
                                                            {
                                                                itemName: values.itemName,
                                                                quantity: values.quantity,
                                                            },
                                                        ]);
                                                    }

                                                    setFieldValue("itemName", "");
                                                    setFieldValue("quantity", 1);
                                                    setIsCheckedItem(true)
                                                }} btnColor="bg-orange-500 hover:bg-orange-500" width="w-fit">
                                                +
                                            </ButtonCustom>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full min-h-full flex flex-col gap-2">
                            <div className={`${values?.items?.length >= 5 ? 'h-1/2' : 'h-fit'} w-full overflow-y-auto`}>
                                <table className="min-w-full bg-white border border-gray-200">
                                    <thead className="bg-gray-200">
                                        <tr>
                                            <th className="py-3 px-6 text-center text-sm font-bold text-gray-600 uppercase">NO</th>
                                            <th className="py-3 px-6 text-center text-sm font-bold text-gray-600 uppercase">Produk</th>
                                            <th className="py-3 px-6 text-center text-sm font-bold text-gray-600 uppercase">Quantity</th>
                                            <th className="py-3 px-6 text-center text-sm font-bold text-gray-600 uppercase">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {values?.items?.length > 0 ?
                                            values.items.map((item: Iitem, index: number) => {
                                                const selectedItem = dataItemName.find((i: Iitem) => Number(i.id) === Number(item.itemName));
                                                return (
                                                    <tr key={index} className="hover:bg-gray-100 border-b">
                                                        <td className="py-3 px-6 text-center text-sm text-gray-600 break-words">{index + 1}</td>
                                                        <td className="py-3 px-6 text-center text-sm text-gray-600 break-words">{selectedItem ? selectedItem.itemName : 'Item not found'}</td>
                                                        <td className="py-3 px-6 text-center text-sm text-gray-600 break-words">{item?.quantity ? item?.quantity : '0'}</td>
                                                        <td className="py-3 px-6 text-center text-sm text-gray-600 break-words">
                                                            <button onClick={() => {
                                                                const updatedItems = values.items.filter((_: any, i: number) => i !== index);
                                                                setFieldValue("items", updatedItems)
                                                                // calculateTotals();
                                                            }} className="text-red-500 hover:text-red-600" type="button">Hapus</button></td>
                                                    </tr>
                                                );
                                            }) :
                                            <tr className="hover:bg-gray-100 border-b">
                                                <td className="py-3 px-6 text-center text-sm text-gray-600 break-words" colSpan={4}>Data tidak tersedia</td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <ButtonCustom width="w-full" disabled={values?.items?.length === 0 || isDisabledSucces || isPending} onClick={handleCustomSubmit} btnColor="bg-orange-600 hover:bg-orange-600" type='button'>
                                {isPending ? 'Proses Check Barang..' : 'Check Barang'}
                            </ButtonCustom>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    )
}