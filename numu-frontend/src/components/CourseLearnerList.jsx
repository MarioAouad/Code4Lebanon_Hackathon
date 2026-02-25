import React, { useState } from 'react';
import { HomeIcon, ChevronRightIcon, MagnifyingGlassIcon, UserIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const CourseLearnerList = ({ course, data, onLearnerSelect, onBack }) => {
    // Filter learners who belong to this course
    const enrolledLearners = data.filter(d => d.track === course);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLearners = enrolledLearners.filter(learner =>
        (learner.email && learner.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (learner.phone && learner.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (learner.id && learner.id.toString().includes(searchTerm))
    );

    return (
        <div className="flex flex-col animate-fade-in w-full">
            {/* Breadcrumb */}
            <nav className="flex items-center text-[13px] text-gray-500 mb-6 font-medium">
                <HomeIcon className="w-4 h-4 mr-2" />
                <span className="hover:text-gray-900 cursor-pointer transition-colors">Home</span>
                <ChevronRightIcon className="w-3 h-3 mx-2" />
                <span onClick={onBack} className="hover:text-gray-900 cursor-pointer transition-colors">Courses</span>
                <ChevronRightIcon className="w-3 h-3 mx-2" />
                <span className="text-gray-900 font-bold">{course}</span>
            </nav>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-100 pb-5">
                    <div className="flex items-center gap-3">
                        <button onClick={onBack} className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 hover:text-gray-900 transition-colors">
                            <ArrowLeftIcon className="w-5 h-5" />
                        </button>
                        <div>
                            <h2 className="text-[19px] font-black text-gray-900 mb-1 tracking-tight">{course}</h2>
                            <p className="text-[13px] text-gray-500 font-medium">{enrolledLearners.length} Enrolled Learners</p>
                        </div>
                    </div>
                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by ID, Email, Phone..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-[13px] font-medium transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider sm:pl-6 rounded-tl-lg">
                                    Learner Details
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                    Region
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider rounded-tr-lg pr-6">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {filteredLearners.map((learner, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                                <UserIcon className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-[14px]">Learner #{learner.id}</div>
                                                <div className="text-gray-500 text-[12px] font-medium">{learner.email || learner.phone}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-[13px] font-semibold text-gray-500">
                                        {learner.region || 'Unknown'}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-green-100">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Active
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-right pr-6">
                                        <button
                                            onClick={() => onLearnerSelect(learner)}
                                            className="text-blue-600 hover:text-blue-800 text-[13px] font-bold transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md"
                                        >
                                            View Profile
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredLearners.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center text-gray-500 text-[14px] font-medium">
                                        No enrolled learners found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CourseLearnerList;
