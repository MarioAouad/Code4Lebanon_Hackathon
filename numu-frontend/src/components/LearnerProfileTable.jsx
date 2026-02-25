import React from 'react';
import { HomeIcon, ChevronRightIcon, EnvelopeIcon, ArrowDownTrayIcon, ClockIcon, NoSymbolIcon, CheckCircleIcon, UserIcon, BriefcaseIcon, AcademicCapIcon, ChartBarIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const LearnerProfileTable = ({ learner, onBack }) => {
    // Safety check just in case
    if (!learner) return null;

    // Use learner data or fallbacks
    const fullName = learner.name || 'Anonymous Learner';
    const email = learner.email || 'N/A';
    const phone = learner.phone || 'N/A';
    const region = learner.region || 'Unknown Region';
    const track = learner.track || 'Unassigned';
    const gender = learner.gender || 'Not Specified';
    const age = learner.age ? `${learner.age} Years` : 'Not Specified';

    // Derived or mock data for the profile that isn't cleanly in the API yet
    const initials = fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'L';

    return (
        <div className="flex flex-col animate-fade-in w-full">
            {/* Breadcrumb & Navigation */}
            <div className="flex items-center justify-between mb-6">
                <nav className="flex items-center text-[13px] text-gray-500 font-medium">
                    <HomeIcon className="w-4 h-4 mr-2" />
                    <span className="hover:text-gray-900 cursor-pointer transition-colors">Home</span>
                    <ChevronRightIcon className="w-3 h-3 mx-2" />
                    <span onClick={onBack} className="hover:text-gray-900 cursor-pointer transition-colors">Courses</span>
                    <ChevronRightIcon className="w-3 h-3 mx-2" />
                    <span className="text-gray-900 font-bold">{fullName}</span>
                </nav>
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-[13px] font-bold transition-colors bg-white border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg shadow-sm"
                >
                    <ArrowLeftIcon className="w-4 h-4" /> Back to List
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Sidebar */}
                <div className="w-full lg:w-[320px] flex flex-col gap-6">
                    {/* Profile Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center relative">
                        <div className="relative mb-4">
                            <div className="w-24 h-24 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center overflow-hidden border-4 border-white shadow-sm">
                                <span className="text-3xl font-black">{initials}</span>
                            </div>
                            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <h2 className="text-[19px] font-black text-gray-900 mb-0.5 tracking-tight">{fullName}</h2>
                        <p className="text-[13px] text-gray-500 font-medium mb-3">Learner ID: #{learner.id || 'N/A'}</p>

                        <span className="bg-green-50 text-green-700 text-[11px] font-bold px-3 py-1 rounded-full mb-6 border border-green-100 inline-flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Active
                        </span>

                        <div className="w-full space-y-3 mb-6">
                            <div className="flex justify-between text-[13px]">
                                <span className="text-gray-500 font-medium">Region</span>
                                <span className="text-gray-900 font-bold">{region}</span>
                            </div>
                            <div className="flex justify-between text-[13px]">
                                <span className="text-gray-500 font-medium">Last Active</span>
                                <span className="text-gray-900 font-bold">2 hours ago</span>
                            </div>
                        </div>

                        <button className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white text-[14px] font-bold py-2.5 rounded-lg flex justify-center items-center gap-2 shadow-sm">
                            <EnvelopeIcon className="w-4 h-4" /> Contact Learner
                        </button>
                    </div>

                    {/* Enrolled Provider */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">ENROLLED PROVIDER</h3>
                        <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3 border border-gray-100">
                            <div className="w-10 h-10 bg-white rounded shadow-sm border border-gray-100 flex flex-wrap p-2 gap-0.5">
                                {/* Microsoft-ish logo */}
                                <div className="w-2.5 h-2.5 bg-[#f25022]"></div>
                                <div className="w-2.5 h-2.5 bg-[#7fba00]"></div>
                                <div className="w-2.5 h-2.5 bg-[#00a4ef]"></div>
                                <div className="w-2.5 h-2.5 bg-[#ffb900]"></div>
                            </div>
                            <div>
                                <h4 className="text-[14px] font-bold text-gray-900">Microsoft</h4>
                                <p className="text-[11px] text-gray-500 font-medium">Enterprise Skills Initiative</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">ACTIONS</h3>
                        <div className="space-y-4">
                            <button className="flex items-center gap-3 text-gray-700 hover:text-blue-600 w-full transition-colors text-[13px] font-semibold">
                                <ArrowDownTrayIcon className="w-5 h-5 text-gray-400" />
                                Download Transcript
                            </button>
                            <button className="flex items-center gap-3 text-red-600 hover:text-red-700 w-full transition-colors text-[13px] font-semibold">
                                <NoSymbolIcon className="w-5 h-5 text-red-500" />
                                Suspend Account
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Personal Information */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                            <UserIcon className="w-5 h-5 text-blue-600" />
                            <h3 className="text-[16px] font-bold text-gray-900">Personal Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div>
                                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">FULL NAME (ENGLISH)</h4>
                                <p className="text-[14px] font-bold text-gray-900">{fullName}</p>
                            </div>
                            <div>
                                {/* Empty cell to match layout */}
                            </div>
                            <div>
                                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">AGE</h4>
                                <p className="text-[14px] font-bold text-gray-900">{age}</p>
                            </div>
                            <div>
                                {/* Empty cell to match layout */}
                            </div>
                            <div>
                                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">GENDER</h4>
                                <p className="text-[14px] font-bold text-gray-900">{gender}</p>
                            </div>
                            <div>
                                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">PHONE NUMBER</h4>
                                <p className="text-[14px] font-bold text-gray-900">{phone}</p>
                            </div>
                            <div className="md:col-span-2">
                                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">EMAIL ADDRESS</h4>
                                <div className="flex items-center gap-2">
                                    <p className="text-[14px] font-bold text-gray-900">{email}</p>
                                    <span className="bg-green-50 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-green-100">Verified</span>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">REGION</h4>
                                <p className="text-[14px] font-bold text-gray-900">{region}</p>
                            </div>
                        </div>
                    </div>

                    {/* Employment & Demographics */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                            <BriefcaseIcon className="w-5 h-5 text-blue-600" />
                            <h3 className="text-[16px] font-bold text-gray-900">Employment & Demographics</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div>
                                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">EMPLOYMENT STATUS</h4>
                                <span className="inline-block bg-blue-50 text-blue-600 border border-blue-100 text-[12px] font-bold px-3 py-1 rounded-full">Enrolled Student</span>
                            </div>
                            <div>
                                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">CURRENT UNIVERSITY/INSTITUTION</h4>
                                <p className="text-[14px] font-bold text-gray-900">{learner.university || 'Lebanese University'}</p>
                            </div>
                            <div>
                                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">EDUCATION LEVEL</h4>
                                <p className="text-[14px] font-bold text-gray-900">Attending University</p>
                            </div>
                        </div>
                    </div>

                    {/* Current Program Selection */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative">
                        <div className="flex items-center justify-between mb-6 border-b border-gray-50 pb-4">
                            <div className="flex items-center gap-3">
                                <AcademicCapIcon className="w-5 h-5 text-blue-600" />
                                <h3 className="text-[16px] font-bold text-gray-900">Current Program Selection</h3>
                            </div>
                            <span className="bg-purple-50 text-purple-600 border border-purple-100 text-[11px] font-bold px-2.5 py-1 rounded-full">Active Enrollment</span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-5">
                            <div className="w-full sm:w-32 bg-gray-50 rounded-xl h-24 flex items-center justify-center border border-gray-100 flex-shrink-0">
                                <span className="text-gray-400 text-xl font-bold tracking-widest">&lt; / &gt;</span>
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                                <h4 className="text-[15px] font-bold text-gray-900 mb-1">{track} Certificate Program</h4>
                                <p className="text-[13px] text-gray-500 font-medium mb-5 leading-relaxed">
                                    Official MITAI track for upskilling in {track.toLowerCase()}.
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                                    <div>
                                        <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Track</h5>
                                        <p className="text-[13px] font-bold text-gray-900">{track}</p>
                                    </div>
                                    <div>
                                        <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Start Date</h5>
                                        <p className="text-[13px] font-bold text-gray-900">Recently Enrolled</p>
                                    </div>
                                    <div>
                                        <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Progress</h5>
                                        <p className="text-[13px] font-bold text-blue-600">12%</p>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '12%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                            <ChartBarIcon className="w-5 h-5 text-blue-600" />
                            <h3 className="text-[16px] font-bold text-gray-900">Recent Activity</h3>
                        </div>

                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-blue-100 lg:before:hidden ml-1">

                            {/* Activity Item 1 */}
                            <div className="relative flex items-center gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 border-2 border-blue-100 flex items-center justify-center z-10">
                                    <ArrowDownTrayIcon className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="text-[13px] font-bold text-gray-900 mb-0.5">Registered via {learner.university || 'Portal'}</h4>
                                    <p className="text-[11px] font-medium text-gray-400">Recently</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LearnerProfileTable;
