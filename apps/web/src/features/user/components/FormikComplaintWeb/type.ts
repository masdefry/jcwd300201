export interface IFormikComplaintWeb {
    isPending: boolean; 
    handleComplaint: (values: { complaintText: string }) => void;
}
