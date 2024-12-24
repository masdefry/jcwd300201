import React from 'react';

const HorizontalTimeline = ({ orderStatus }: any) => {
    const phaseStatuses = {
        pickup: [
            'AWAITING_DRIVER_PICKUP',
            'DRIVER_TO_OUTLET',
            'DRIVER_ARRIVED_AT_OUTLET'
        ],
        laundry: [
            'IN_WASHING_PROCESS',
            'IN_IRONING_PROCESS',
            'IN_PACKING_PROCESS'
        ],
        delivery: [
            'DRIVER_TO_CUSTOMER'
        ],
        finished: [
            'DRIVER_DELIVERED_LAUNDRY'
        ]
    };

    const statusesInOrder = orderStatus.map((statusItem: any) => statusItem.status);

    const isPhaseCompleted = (statuses: string[]) => statuses.some(status => statusesInOrder.includes(status));

    const phases = [
        {
            label: 'Proses Pickup',
            done: isPhaseCompleted(phaseStatuses.pickup)
        },
        {
            label: 'Proses Laundry',
            done: isPhaseCompleted(phaseStatuses.laundry)
        },
        {
            label: 'Proses Delivery',
            done: isPhaseCompleted(phaseStatuses.delivery)
        },
        {
            label: 'Terkirim',
            done: isPhaseCompleted(phaseStatuses.finished)
        }
    ];

    return (
        <div className="flex items-center justify-center w-full mt-4">
            {phases.map((phase, index) => (
                <div key={phase.label} className="flex flex-col items-center text-center">
                    <div className="flex items-center">
                        <div
                            className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm
                                ${phase.done ? 'bg-blue-500' : 'bg-gray-400'}`}
                        >
                            {index + 1}
                        </div>
                        {index < phases.length - 1 && (
                            <div
                                className={`h-1 w-16 
                                    ${phases[index].done || phases[index + 1].done
                                        ? 'bg-blue-500'
                                        : 'bg-gray-300'
                                    }`}
                            ></div>
                        )}
                    </div>
                    <div className="mt-2 text-center min-h-[48px] flex flex-col justify-center">
                        {phase.label.split(' ').map((word, i) => (
                            <div key={i} className="text-sm text-gray-800">
                                {word}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HorizontalTimeline;
