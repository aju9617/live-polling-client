import React from "react";
import { useChatContext } from "../context/chatContext";
import { useNavigate } from "react-router-dom";

function Layout({ title, showTitle = false, rightSection, children }) {
  const chatContext = useChatContext();
  const navigate = useNavigate();
  return (
    <div className="max-w-[990px] mx-auto relative">
      {showTitle && (
        <div className="flex justify-between items-center border border-gray-700 p-4 py-2">
          <p className="text-lg  ">
            {title} <br />
          </p>
          {rightSection}
        </div>
      )}
      <div className="border border-gray-700 p-4 py-2">{children}</div>
    </div>
  );
}

export default Layout;
