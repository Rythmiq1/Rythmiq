import React from "react";

const IconText = ({ iconName, displayText, active }) => {
  return (
    <div className="flex items-center justify-start cursor-pointer">
      <div className="px-5 py-2">
        <span
          className={`material-icons text-lg ${active ? 'text-white' : 'text-gray-400'}`}
        >
          {iconName}
        </span>
      </div>
      <div className={`text-sm font-semibold ${active ? 'text-white' : 'text-gray-400'} hover:text-white`}>
        {displayText}
      </div>
    </div>
  );
};

export default IconText;