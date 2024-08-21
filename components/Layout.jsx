import React from "react";

function Layout({ title, showTitle = false, rightSection, children }) {
  return (
    <div className="max-w-[990px] mx-auto">
      {showTitle && (
        <div className="flex justify-between items-center border border-gray-700 p-4 py-2">
          <p className="text-lg  ">{title}</p>
          {rightSection}
        </div>
      )}
      <div className="border border-gray-700 p-4 py-2">{children}</div>
    </div>
  );
}

export default Layout;
