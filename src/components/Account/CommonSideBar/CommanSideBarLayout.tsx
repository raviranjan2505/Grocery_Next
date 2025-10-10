"use client";
import CommonSideBar from "../CommonSideBar";

export default function CommonSideBarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-8 px-4">
      {/* Container holding sidebar + main content */}
      <div className="flex flex-col md:flex-row w-full max-w-4xl">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0 hidden md:block">
          <CommonSideBar />
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-white p-6 md:p-8 shadow">
          {children}
        </main>
      </div>
    </div>
  );
}
