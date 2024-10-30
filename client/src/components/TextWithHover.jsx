import React from "react";

const TextWithHover = ({ iconName, displayText, active }) => {
  return (
    <div className="flex items-center justify-start cursor-pointer">
      {/* Icon */}
      <span
        className={`material-icons ${
          active ? "text-white" : "text-gray-400"
        } mr-2 text-lg`}
      >
        {iconName}
      </span>
      {/* Text */}
      <div
        className={`${
          active ? "text-white" : "text-gray-400"
        } font-semibold hover:text-white`}
      >
        {displayText}
      </div>
    </div>
  );
};

export default TextWithHover;
