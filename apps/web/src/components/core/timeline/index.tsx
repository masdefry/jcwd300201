import React from 'react';

const Timeline = ({ orderStatus }: any) => {
    const allStatuses = [
        'AWAITING_DRIVER_PICKUP',
        'DRIVER_TO_OUTLET',
        'DRIVER_ARRIVED_AT_OUTLET',
        'IN_WASHING_PROCESS',
        'IN_IRONING_PROCESS',
        'IN_PACKING_PROCESS',
        'DRIVER_TO_CUSTOMER',
        'DRIVER_DELIVERED_LAUNDRY'
    ];

    const statusesInOrder = orderStatus.map((statusItem: any) => statusItem.status);

    return (
        <div className="relative">
            {allStatuses.map((status, index) => {
                const isBlue = statusesInOrder.includes(status);

                return (
                    <div key={status} className="flex items-center">
                        {index < allStatuses.length - 1 && (
                            <div className='absolute w-1 bg-gray-300 h-8 top-2 left-2 z-0'></div>
                        )}
                        <div className={`w-6 h-6 mt-[3px] z-10 rounded-full flex items-center justify-center 
                ${isBlue ? 'bg-blue-500' : 'bg-gray-400'} border-2 ${isBlue ? 'border-blue-500' : 'border-gray-400'}`}>
                            <span className="text-white text-sm">{index + 1}</span>
                        </div>
                        <p className="ml-4 text-sm font-medium text-gray-800">{statusTranslations[status] || status}</p>
                    </div>
                );
            })}
        </div>
    );
};


const statusTranslations: Record<string, string> = {
    "AWAITING_DRIVER_PICKUP": "Menunggu Pickup",
    "DRIVER_TO_OUTLET": "Driver Menuju Outlet",
    "DRIVER_ARRIVED_AT_OUTLET": "Driver Tiba di Outlet",
    "IN_WASHING_PROCESS": "Proses Cuci",
    "IN_IRONING_PROCESS": "Proses Setrika",
    "IN_PACKING_PROCESS": "Proses Packing",
    "DRIVER_TO_CUSTOMER": "Driver Menuju Customer",
    "DRIVER_DELIVERED_LAUNDRY": "Laundry Terkirim",
};

export default Timeline;