import { IoIosNotifications } from "react-icons/io";
import { useState } from "react";

interface NotificationData {
    id: number;
    message: string;
}

export default function Notification() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Sample data for the list of notifications
    const notifications: NotificationData[] = [
        { id: 1, message: "Your order has been shipped." },
        { id: 2, message: "New product added to your wishlist." },
        { id: 3, message: "Your payment was successful." },
    ];

    const handleDialogToggle = () => {
        setIsDialogOpen(!isDialogOpen);
    };

    return (
        <div className="relative">
            {/* Notification Button */}
            <button
                onClick={handleDialogToggle}
                className="p-2 bg-blue-500 text-white rounded-full focus:outline-none"
            >
                <IoIosNotifications />
            </button>

            {/* Dialog (Popover) */}
            {isDialogOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Notifications</h3>
                        <button onClick={handleDialogToggle} className="text-gray-500">
                            X
                        </button>
                    </div>

                    {/* List of Notifications */}
                    <ul className="mt-2 space-y-2">
                        {notifications.map((notification) => (
                            <li key={notification.id} className="text-sm text-gray-600">
                                {notification.message}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}