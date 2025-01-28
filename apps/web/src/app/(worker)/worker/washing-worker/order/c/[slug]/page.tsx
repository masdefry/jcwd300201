'use client'
import React from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ContentWebLayout from "@/components/core/webSessionContent";
import NotaCaptionContent from "@/features/adminOutlet/components/notaCaptionContent";
import NotaHeader from "@/components/core/createNotaHeaders";
import MobileSessionLayout from "@/components/core/mobileSessionLayout/subMenuLayout";
import FormikWashingMobile from "@/features/washingWorker/components/formikMobileWashing";
import FormikWashingWeb from "@/features/washingWorker/components/formikWebWashing";
import { useWashingCheckHook } from "@/features/washingWorker/hooks/useWashingCheckHook";


export default function Page({ params }: { params: Promise<{ slug: string }> }) {
    const {
        dataOrderNote,
        dataOrderNoteLoading,
        isFetching,
        showDialog,
        setShowDialog,
        dialogNotes,
        setDialogNotes,
        dataOrderDetail,
        dataOrderDetailLoading,
        dataItemName,
        dataItemNameLoading,
        isCheckedItem,
        setIsCheckedItem,
        isDisabledSucces,
        setIsDisabledSucces,
        handleStatusOrder,
        isPending,
        compareData,
        emails,
        handleDialogSubmit
    } = useWashingCheckHook({ params });

    if (dataOrderNote == undefined) return <div></div>
    if (isFetching) return <div></div>


    return (
        <>
            <MobileSessionLayout title="Pengecekan">
                <NotaHeader email={emails} />
                <FormikWashingMobile
                    dataItemName={dataItemName}
                    dataOrderNote={dataOrderNote}
                    dataOrderDetail={dataOrderDetail}
                    isPending={isPending}
                    isDisabledSucces={isDisabledSucces}
                    emails={emails}
                    handleStatusOrder={handleStatusOrder}
                    compareData={compareData}
                    setDialogNotes={setDialogNotes}
                    setShowDialog={setShowDialog}
                    setIsCheckedItem={setIsCheckedItem}
                    isCheckedItem={isCheckedItem}
                />
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
                                disabled={isPending}
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
            </MobileSessionLayout>

            <ContentWebLayout caption='Pengecekan'>
                <div className="pb-10 min-h-full h-fit w-full">
                    <NotaHeader email={emails} />
                    <NotaCaptionContent />
                    <FormikWashingWeb
                        dataItemName={dataItemName}
                        dataOrderNote={dataOrderNote}
                        dataOrderDetail={dataOrderDetail}
                        isPending={isPending}
                        isDisabledSucces={isDisabledSucces}
                        emails={emails}
                        handleStatusOrder={handleStatusOrder}
                        compareData={compareData}
                        setDialogNotes={setDialogNotes}
                        setShowDialog={setShowDialog}
                        setIsCheckedItem={setIsCheckedItem}
                        isCheckedItem={isCheckedItem}
                    />
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