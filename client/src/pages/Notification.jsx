import React, { useState } from "react";
import { MdNotificationsNone } from "react-icons/md";  

const notificationsData = [
  { id: 1, text: "You left your coffee in the microwave again... It's cold now.", time: "2 minutes ago" },
  { id: 2, text: "Your pet just Googled 'how to delete browsing history.'", time: "5 minutes ago" },
  { id: 3, text: "Your plants are judging you for not watering them.", time: "1 hour ago" },
  { id: 4, text: "Your fridge door has been open for 2 hours. The milk is now sentient.", time: "3 hours ago" },
  { id: 5, text: "You tried to work out today... your bed disagreed.", time: "Yesterday" },
];

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative bg-none">
      <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none">
        <MdNotificationsNone className="w-6 h-6 text-white" /> 
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg overflow-hidden z-50">
          <div className="px-4 py-2 font-semibold text-lg text-gray-700 border-b">Notifications</div>
          <div className="max-h-64 overflow-y-auto">
            {notificationsData.map((notification) => 
            (
              <div key={notification.id} className="flex items-start px-4 py-3 border-b hover:bg-gray-100">
                
                <div className="w-8 h-8 flex items-center justify-center mr-3">
                  <MdNotificationsNone className="w-6 h-6 text-gray-500" /> 
                </div>

                <div className="text-sm flex-1">
                  <p className="text-gray-600">{notification.text}</p>
                  <p className="text-gray-400 text-xs mt-1">{notification.time}</p>
                </div>

                <a href="#" className=" text-sm hover:underline ml-2" > View </a>
              </div>
            ))}
          </div>

          <div className="px-4 py-2 text-center">
            <a href="#" className=" text-sm hover:underline"> See all </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
