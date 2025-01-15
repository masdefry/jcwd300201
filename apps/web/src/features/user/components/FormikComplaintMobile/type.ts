export interface IFormikComplaintMobile {
    isPending: boolean; 
    handleComplaint: (values: { complaintText: string }) => void; 
}
