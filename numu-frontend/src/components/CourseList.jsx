import React, { useState } from 'react';
import { HomeIcon, ChevronRightIcon, BookOpenIcon, UserGroupIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const CourseList = ({ data, onCourseSelect }) => {
    // Generate unique courses from the tracks in data
    const courses = [...new Set(data.filter(d => d.track).map(d => d.track))];
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCourses = courses.filter(course =>
        course.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col animate-fade-in w-full">
            {/* Breadcrumb */}
            <nav className="flex items-center text-[13px] text-gray-500 mb-6 font-medium">
                <HomeIcon className="w-4 h-4 mr-2" />
                <span className="hover:text-gray-900 cursor-pointer transition-colors">Home</span>
                <ChevronRightIcon className="w-3 h-3 mx-2" />
                <span className="text-gray-900 font-bold">Courses</span>
            </nav>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-[19px] font-black text-gray-900 mb-1 tracking-tight">Active Training Tracks</h2>
                        <p className="text-[13px] text-gray-500 font-medium">Manage and view learners enrolled in specific courses.</p>
                    </div>
                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-[13px] font-medium transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredCourses.map((course, idx) => {
                        const enrolledCount = data.filter(d => d.track === course).length;
                        return (
                            <div
                                key={idx}
                                onClick={() => onCourseSelect(course)}
                                className="border border-gray-100 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group bg-gray-50 hover:bg-white"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <BookOpenIcon className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-[15px] font-bold text-gray-900 leading-tight">{course}</h3>
                                </div>

                                <div className="flex items-center justify-between text-[13px] font-semibold text-gray-500 border-t border-gray-200 pt-3">
                                    <div className="flex items-center gap-1.5">
                                        <UserGroupIcon className="w-4 h-4 text-gray-400" />
                                        <span>{enrolledCount} Learners</span>
                                    </div>
                                    <span className="text-blue-600 group-hover:underline flex items-center gap-1">View List <ChevronRightIcon className="w-3 h-3" /></span>
                                </div>
                            </div>
                        )
                    })}

                    {filteredCourses.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-500 text-[14px] font-medium">
                            No courses match your search.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseList;
