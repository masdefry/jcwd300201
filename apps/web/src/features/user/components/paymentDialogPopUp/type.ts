export interface IPaymentPopUpDialog {
    isUploadDialogOpen: boolean; 
    setIsUploadDialogOpen: (isOpen: boolean) => void;
    isUploading: boolean;
    uploadPaymentProof: (formData: FormData) => void;
}
