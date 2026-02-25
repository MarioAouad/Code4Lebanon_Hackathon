import React from 'react';

const DashboardLayout = ({ children, currentTab, setCurrentTab }) => {
    return (
        <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans">
            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10 antialiased">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">

                        {/* Logo Section */}
                        <div className="flex items-center gap-3 w-1/3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 20V10M12 20V4M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="flex flex-col leading-tight">
                                <span className="text-base font-bold text-gray-900 tracking-tight">NUMŪ</span>
                                <span className="text-[13px] font-semibold text-gray-800">Analytics</span>
                            </div>
                        </div>

                        {/* Centered Navigation Tabs */}
                        <nav className="flex space-x-8 w-1/3 justify-center h-full">
                            <button
                                onClick={() => setCurrentTab('dashboard')}
                                className={`inline-flex items-center px-1 border-b-[3px] text-sm font-medium ${currentTab === 'dashboard'
                                    ? 'border-blue-500 text-blue-500'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => setCurrentTab('courses')}
                                className={`inline-flex items-center px-1 border-b-[3px] text-sm font-medium ${currentTab === 'courses'
                                    ? 'border-blue-500 text-blue-500'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Courses
                            </button>
                        </nav>

                        {/* Right placeholder for balance */}
                        <div className="w-1/3 flex justify-end">
                            {/* Empty spacing for symmetric center nav */}
                        </div>

                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 antialiased">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
