import { ErrorMessage, Field } from "formik";

export default function TotalWeightComponent() {
    return (
        <div className="flex flex-col gap-2">
            <label className="font-semibold">Total Berat <span className="text-red-600">*</span></label>
            <div className="relative">
                <Field name="totalWeight" type="number" placeholder="Enter total weight" className="w-full py-2 text-sm px-3 focus:outline-none border-b focus:border-orange-500 rounded-md" min="1" step="0.1" />
                <ErrorMessage
                    name="totalWeight"
                    component="div"
                    className="absolute -bottom-5 left-0 text-xs text-red-600"
                />
            </div>
        </div>
    );
}