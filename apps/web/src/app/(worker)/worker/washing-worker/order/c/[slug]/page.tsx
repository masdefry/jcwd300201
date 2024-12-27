'use client'
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import HeaderMobile from "@/components/core/headerMobile"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaRegTrashAlt } from "react-icons/fa";
import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authstore";
import { useToast } from "@/components/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ButtonCustom from "@/components/core/button";
import ContentWebLayout from "@/components/core/webSessionContent";
import NotaHeader from "@/features/adminOutlet/components/notaHeader";
import NotaCaptionContent from "@/features/adminOutlet/components/notaCaptionContent";
import InputDisplay from "@/features/adminOutlet/components/inputDisplay";

const validationSchema = Yup.object().shape({
    customerName: Yup.string().required("Customer name is required"),
    customerAddress: Yup.string().required("Customer address is required"),
    orderTypeId: Yup.string().required("Order type is required"),
    items: Yup.array()
        .of(
            Yup.object().shape({
                itemName: Yup.string().required("Item name is required"),
                quantity: Yup.number()
                    .required("Quantity is required")
                    .min(1, "Quantity must be at least 1"),
                weight: Yup.number()
                    .required("Weight is required")
                    .min(0.1, "Weight must be at least 0.1 kg"),
            })
        )
        .min(1, "At least one item is required"),
});

interface ICreateOrder {
    id: string,
    values: FormData
}
type Iitem = {
    id: number,
    itemName: string,
    laundryItemId: number;
    quantity: number;
    weight: number;
};

export default function Page({ params }: { params: Promise<{ slug: string }> }) {

    const { slug } = React.use(params);
    const router = useRouter()

    const token = authStore((state) => state.token);
    const emails = authStore((state) => state.email);
    const { toast } = useToast();
    const [showDialog, setShowDialog] = useState(false);
    const [dialogNotes, setDialogNotes] = useState("");



    const { data: dataOrderNote, isLoading: dataOrderNoteLoading, isFetching } = useQuery({
        queryKey: ['get-order-note'],
        queryFn: async () => {
            const res = await instance.get(`/order/detail-order-note/${slug}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(dataOrderNote)
            return res?.data?.data;
        },
    });

    const { data: dataOrderDetail, isLoading: dataOrderDetailLoading } = useQuery({
        queryKey: ['get-detail-item'],
        queryFn: async () => {
            const res = await instance.get(`/order/order-detail/${slug}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res?.data?.data;
        },
    });

    const { data: dataItemName, isLoading: dataItemNameLoading } = useQuery({
        queryKey: ['get-data-item'],
        queryFn: async () => {
            const res = await instance.get('/laundry', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res?.data?.data;
        },
    });

    const { mutate: handleStatusOrder, isPending: isPendingStatus } = useMutation({
        mutationFn: async ({ email, notes }: any) => {
            return await instance.post(`/order/washing-process/${slug}`, { email, notes }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        },
        onSuccess: (res: any) => {
            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
            })
            setTimeout(() => {
                router.push('/worker/washing-worker/order/');
            }, 1000);
        },
        onError: (err: any) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg"
            })

        }
    })

    const handleDialogSubmit = () => {
        handleStatusOrder({ email: emails, notes: dialogNotes });
        setShowDialog(false);
    };

    const compareData = (frontendItems: any[], backendItems: any[]) => {
        if (!backendItems || backendItems.length !== frontendItems.length) return false;

        return frontendItems.every((item) =>
            backendItems.some(
                (backendItem) =>
                    String(backendItem?.laundryItemId) === item?.laundryItemId &&
                    backendItem?.quantity === item?.quantity
            )
        );
    };

    if (dataOrderNote == undefined) return <div></div>
    if (isFetching) return <div></div>


    return (
        <>
            <main className="w-full h-fit md:hidden block">
                <section className="w-full h-fit">
                    <HeaderMobile />
                    <main className="w-full">
                        <section className="w-full fixed pt-16 text-lg pb-4 border-b-2 bg-white">
                            <div className="mx-8 flex gap-2 items-center font-bold w-full">
                                <Link href='/admin/settings'><FaArrowLeft /></Link> ITEM CHECKING
                            </div>
                        </section>
                        <section className="py-28 px-10">

                            <Formik
                                initialValues={{
                                    items: [],
                                    itemName: '',
                                    quantity: 1,
                                    notes: '',
                                }}
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
                                            console.log("Data is matching, submitting form...");
                                            submitForm()
                                        } else {
                                            const initialNotes = values.items
                                                .map((item: any) => {
                                                    const itemDetails = dataItemName.find((data: any) => Number(data.id) === Number(item.itemName));
                                                    return `Item: ${itemDetails?.itemName}, Quantity: ${item.quantity}`;
                                                }).join("\n");


                                            setDialogNotes(initialNotes);
                                            setShowDialog(true);
                                        }
                                    }

                                    return (
                                        <Form>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex flex-col col-span-2">
                                                    <label className="text-sm">Customer Name</label>
                                                    <input
                                                        type="text"
                                                        value={`${dataOrderNote[0].User?.firstName} ${dataOrderNote[0].User?.lastName}`}
                                                        disabled
                                                        className="border border-gray-500 rounded-md p-2 bg-gray-200"
                                                    />
                                                </div>

                                                <div className="flex flex-col col-span-2">
                                                    <label className="text-sm">Customer Address</label>
                                                    <input
                                                        type="text"
                                                        value={`${dataOrderNote[0].UserAddress?.addressDetail}, ${dataOrderNote[0].UserAddress?.city}, ${dataOrderNote[0].UserAddress?.province}`}
                                                        disabled
                                                        className="border border-gray-500 rounded-md p-2 bg-gray-200"
                                                    />
                                                </div>

                                                <div className="flex flex-col col-span-2">
                                                    <label className="text-sm">Order Type</label>
                                                    <input
                                                        type="text"
                                                        value={dataOrderNote[0].OrderType?.type}
                                                        disabled
                                                        className="border border-gray-500 rounded-md p-2 bg-gray-200"
                                                    />
                                                </div>

                                                {/* Item Selection */}
                                                <div className="flex flex-col col-span-2">
                                                    <label className="text-sm">Item</label>
                                                    <Field
                                                        as="select"
                                                        name="itemName"
                                                        className="border border-gray-500 rounded-md p-2"
                                                    >
                                                        <option value="">Select Item</option>
                                                        {dataItemName?.map((item: Iitem, index: number) => (
                                                            <option key={index} value={item?.id}>
                                                                {item?.itemName}
                                                            </option>
                                                        ))}
                                                    </Field>
                                                    <ErrorMessage name="itemName" component="div" className="text-xs text-red-600" />

                                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                                        <Field
                                                            name="quantity"
                                                            type="number"
                                                            placeholder="Quantity"
                                                            className="border border-gray-500 rounded-md p-2"
                                                            min="1"
                                                        />

                                                    </div>
                                                    <button
                                                        type="button"
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
                                                        }}
                                                        className="bg-blue-500 text-white rounded-md p-3 mt-4"
                                                    >
                                                        Add Item
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Display Items */}
                                            <div className="mt-4">
                                                {values.items.map((item: Iitem, index: number) => {
                                                    const selectedItem = dataItemName.find((i: Iitem) => Number(i.id) === Number(item.itemName));
                                                    return (
                                                        <div key={index} className="bg-blue-50 p-4 mb-2 rounded-lg">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <h3 className="text-lg font-semibold">
                                                                        {selectedItem ? selectedItem.itemName : 'Item not found'}
                                                                    </h3>
                                                                    <p className="text-gray-600 mt-1">
                                                                        Quantity: {item.quantity},
                                                                    </p>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const updatedItems = values.items.filter((_: any, i: number) => i !== index);
                                                                        setFieldValue("items", updatedItems);
                                                                    }}
                                                                    className="text-red-500"
                                                                >
                                                                    <FaRegTrashAlt />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>


                                            <button
                                                type="button"
                                                className="bg-green-500 text-white rounded-md p-3 mt-4"
                                                onClick={handleCustomSubmit}

                                            >
                                                Submit Order
                                            </button>
                                        </Form>
                                    );
                                }}
                            </Formik>
                            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Konfirmasi Outlet Admin</DialogTitle>
                                        <DialogDescription>
                                            Terjadi perbedaan antara data barang yang diberikan oleh admin outlet dan data anda. Silahkan klik Lapor                                        </DialogDescription>
                                    </DialogHeader>
                                    <textarea
                                        value={dialogNotes}
                                        onChange={(e) => setDialogNotes(e.target.value)}
                                        className="hidden w-full p-2 border rounded-md mt-4"
                                        placeholder="Add notes or comments..."
                                        rows={6}
                                    />
                                    <DialogFooter className="flex flex-col gap-2">
                                        <button
                                            onClick={handleDialogSubmit}

                                            type="submit"
                                            className="bg-blue-500 hover:bg-blue-700 transition-all duration-200 ease-in-out text-white rounded-md p-2"
                                        >
                                            Lapor
                                        </button>
                                        <button
                                            onClick={() => setShowDialog(false)}
                                            className="bg-gray-500 text-white rounded-md p-2"
                                        >
                                            Cancel
                                        </button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </section>
                    </main>
                </section>
            </main>

            <ContentWebLayout caption='Buat Nota Order'>
                <div className="pb-10 min-h-full h-fit w-full">
                    <NotaHeader email={emails} />
                    <NotaCaptionContent />
                    <Formik initialValues={{
                        items: [],
                        itemName: '',
                        quantity: 1,
                        notes: '',
                    }}
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
                                    console.log("Data is matching, submitting form...");
                                    submitForm()
                                    console.log('<< trigger if')
                                } else {
                                    console.log('<< trigger else')
                                    const initialNotes = values.items
                                        .map((item: any) => {
                                            const itemDetails = dataItemName.find((data: any) => Number(data.id) === Number(item.itemName));
                                            return `Item: ${itemDetails?.itemName}, Quantity: ${item.quantity}`;
                                        })
                                        .join("\n");


                                    setDialogNotes(initialNotes);
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
                                                            onChange={(e: any) => {
                                                                // setIsCheckedItem(false)
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
                                                        <Field name="quantity" type="number" placeholder="Quantity" className="w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500 rounded-md" min="1" />
                                                    </div>
                                                    <div className='flex flex-col items-end'>
                                                        <ButtonCustom type="button"
                                                            // disabled={isCheckedItem} 
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
                                                                // setIsCheckedItem(true)
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
                                                                    <td className="py-3 px-6 text-center text-sm text-gray-600 break-words">{selectedItem ? selectedItem.itemName : 'Data tidak tersedia'}</td>
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
                                        <ButtonCustom width="w-full" disabled={values?.items?.length === 0 || isPendingStatus} onClick={handleCustomSubmit} btnColor="bg-orange-600 hover:bg-orange-600" type='button'>
                                            Buat Nota Order
                                        </ButtonCustom>
                                    </div>
                                </Form>
                            );
                        }}
                    </Formik>
                    <Dialog open={showDialog} onOpenChange={setShowDialog}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Konfirmasi Outlet Admin</DialogTitle>
                                <DialogDescription>
                                    Terjadi perbedaan antara data barang yang diberikan oleh admin outlet dan data anda. Silahkan klik Lapor                                        </DialogDescription>
                            </DialogHeader>
                            <textarea
                                value={dialogNotes}
                                onChange={(e) => setDialogNotes(e.target.value)}
                                className="hidden w-full p-2 border rounded-md mt-4"
                                placeholder="Add notes or comments..."
                                rows={6}
                            />
                            <DialogFooter className="flex flex-col gap-2">
                                <button onClick={handleDialogSubmit} type="submit" className="bg-blue-500 hover:bg-blue-700 transition-all duration-200 ease-in-out text-white rounded-md p-2">
                                    Lapor
                                </button>
                                <button onClick={() => setShowDialog(false)} className="bg-gray-500 text-white rounded-md p-2">
                                    Cancel
                                </button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </ContentWebLayout>
        </>
    );
}