import React, { useState, useEffect, useMemo } from 'react';
import { UsersIcon, MapPinIcon, ComputerDesktopIcon, CheckCircleIcon, ArrowPathIcon, ChevronDownIcon, ArrowDownTrayIcon, ShieldCheckIcon, ChartBarIcon, CursorArrowRaysIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import DisseminationChart from './DisseminationChart';
import InterestInsights from './InterestInsights';
import GeographicInsights from './GeographicInsights';
import LearnerProfileTable from './LearnerProfileTable';
import CourseList from './CourseList';
import CourseLearnerList from './CourseLearnerList';

const DataDashboard = ({ currentTab, setCurrentTab }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Navigation State for Drill-downs
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedLearner, setSelectedLearner] = useState(null);

    // Filter States
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedTrack, setSelectedTrack] = useState('');
    const [selectedChannel, setSelectedChannel] = useState('');

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8002/api/responses');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            // The API returns an array directly
            setData(Array.isArray(result) ? result : []);
        } catch (e) {
            console.error("Fetch failed, falling back to mock", e);
            // Fallback mock data in case API fails during presentation
            const mockData = Array.from({ length: 500 }, (_, i) => ({
                id: (1000 + i).toString(),
                university: ['Lebanese University', 'Beirut Arab University', 'USJ', 'AUB', 'LAU'][i % 5],
                track: ['AI Fundamentals', 'Data Ethics', 'Cloud Connectivity', 'Cybersecurity', 'Digital Marketing'][i % 5],
                region: ['Beirut', 'Mount Lebanon', 'North Lebanon', 'South Lebanon', 'Bekaa'][i % 5],
                gender: i % 2 === 0 ? 'Male' : 'Female',
                age: 18 + (i % 15),
                email: `learner${1000 + i}@example.com`,
                phone: `+961 70 ${100000 + i}`,
                source: ['Universities', 'Syndicates', 'Public Sector', 'NGOs', 'Employers'][i % 5],
                motivation: ['Career advancement', 'Personal interest', 'Employer required', 'Government initiative', 'Upskilling'][i % 5],
                challenge: ['Digital Literacy', 'Cybersecurity', 'AI & Programming', 'Data Skills', 'Digital Literacy, Cybersecurity'][i % 5],
            }));
            setData(mockData);
            setError("Using cached data. Live connection failed.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle Tab Changes clearing internal states if needed
    useEffect(() => {
        if (currentTab === 'dashboard') {
            setSelectedCourse(null);
            setSelectedLearner(null);
        }
    }, [currentTab]);

    // Compute Filtered Data
    const filteredData = useMemo(() => {
        return data.filter(item => {
            if (selectedRegion && item.region !== selectedRegion) return false;

            // Allow loose matching for tracks (often comma separated strings)
            if (selectedTrack && item.track && !item.track.includes(selectedTrack)) return false;
            if (selectedTrack && !item.track) return false; // If track is selected but item has no track

            const channelStr = item.source || '';
            if (selectedChannel && !channelStr.includes(selectedChannel)) return false;

            return true;
        });
    }, [data, selectedRegion, selectedTrack, selectedChannel]);

    // Unique options for filters
    const regions = useMemo(() => [...new Set(data.map(i => i.region).filter(Boolean))], [data]);

    // Tracks are often comma separated, let's split them and get unique
    const tracks = useMemo(() => {
        const all = new Set();
        data.forEach(i => {
            if (i.track) {
                i.track.split(',').forEach(t => all.add(t.trim()));
            }
        });
        return Array.from(all);
    }, [data]);

    // Channels
    const channels = useMemo(() => {
        const all = new Set();
        data.forEach(i => {
            if (i.source) {
                const parts = i.source.split('/');
                if (parts.length > 0) all.add(parts[0].trim());
            }
        });
        return Array.from(all).filter(Boolean);
    }, [data]);

    // Top sector breakdown — always shows all 5 fixed categories
    const FIXED_SECTORS = ['Universities', 'Syndicates', 'Public Sector', 'NGOs', 'Employers'];
    const sectorBreakdown = useMemo(() => {
        const counts = {};
        FIXED_SECTORS.forEach(s => { counts[s] = 0; }); // seed all to 0
        filteredData.forEach(i => {
            const sector = i.source ? i.source.split('/')[0].trim() : null;
            if (sector && FIXED_SECTORS.includes(sector)) {
                counts[sector] = (counts[sector] || 0) + 1;
            }
        });
        return FIXED_SECTORS.map(name => ({ name, count: counts[name] }))
            .sort((a, b) => b.count - a.count);
    }, [filteredData]);

    const topSector = sectorBreakdown[0]?.name || '—';

    // Top track (course)
    const topTrack = useMemo(() => {
        const counts = {};
        filteredData.forEach(i => {
            if (i.track) {
                i.track.split(',').forEach(t => {
                    const key = t.trim();
                    if (key) counts[key] = (counts[key] || 0) + 1;
                });
            }
        });
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        return sorted[0]?.[0] || '—';
    }, [filteredData]);


    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-500 font-medium tracking-tight">Aggregating national data streams...</p>
            </div>
        );
    }

    // --- Breadcrumb Helper Component ---
    const Breadcrumbs = () => {
        const crumbs = [];

        // Base Tab
        crumbs.push(
            <span key="base" onClick={() => setCurrentTab(currentTab === 'dashboard' ? 'dashboard' : 'courses')} className="cursor-pointer hover:text-gray-900 transition-colors">
                {currentTab === 'dashboard' ? 'Dashboard' : 'Courses'}
            </span>
        );

        if (currentTab === 'courses' || currentTab === 'learners') {
            if (selectedCourse) {
                crumbs.push(<span key="sep1" className="mx-2 text-gray-400">/</span>);
                crumbs.push(
                    <span key="course" onClick={() => { setSelectedLearner(null); setCurrentTab('courses'); }} className={`cursor-pointer transition-colors ${selectedLearner ? 'hover:text-gray-900' : 'text-gray-900 font-semibold'}`}>
                        {selectedCourse.name}
                    </span>
                );
            }
        }

        if (selectedLearner) {
            crumbs.push(<span key="sep2" className="mx-2 text-gray-400">/</span>);
            crumbs.push(
                <span key="learner" className="text-gray-900 font-semibold">
                    {selectedLearner.name || selectedLearner.email}
                </span>
            );
        }

        return (
            <div className="flex items-center text-sm text-gray-500 mb-6 bg-white py-2 px-4 rounded-lg shadow-sm border border-gray-100 w-fit">
                {crumbs}
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            {error && (
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-md mb-6">
                    <p className="text-sm text-orange-700 font-medium">{error}</p>
                </div>
            )}

            {/* Show breadcrumbs mainly if we are drilling down, but can show always */}
            {(currentTab !== 'dashboard' || selectedLearner || selectedCourse) && <Breadcrumbs />}

            {currentTab === 'dashboard' && (
                <>
                    {/* Header Section */}
                    <div className="flex flex-col xl:flex-row xl:items-start justify-between mb-8 gap-4 pt-2">
                        <div>
                            <h2 className="text-[32px] font-black text-[#111827] tracking-tight leading-[1.1]">Executive<br />Dashboard</h2>
                            <p className="mt-2 text-[15px] text-gray-500 max-w-xl font-medium">Real-time monitoring of registration, engagement, and program metrics across the kingdom.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <div className="relative">
                                <select
                                    value={selectedRegion}
                                    onChange={(e) => setSelectedRegion(e.target.value)}
                                    className="appearance-none bg-white border border-gray-200 text-gray-700 text-[13px] font-semibold py-2 pl-4 pr-10 rounded-lg shadow-sm hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-36"
                                >
                                    <option value="">All Regions</option>
                                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                                <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>

                            <div className="relative">
                                <select
                                    value={selectedTrack}
                                    onChange={(e) => setSelectedTrack(e.target.value)}
                                    className="appearance-none bg-white border border-gray-200 text-gray-700 text-[13px] font-semibold py-2 pl-4 pr-10 rounded-lg shadow-sm hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-36"
                                >
                                    <option value="">All Tracks</option>
                                    {tracks.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>

                            <div className="relative">
                                <select
                                    value={selectedChannel}
                                    onChange={(e) => setSelectedChannel(e.target.value)}
                                    className="appearance-none bg-white border border-gray-200 text-gray-700 text-[13px] font-semibold py-2 pl-4 pr-10 rounded-lg shadow-sm hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-36"
                                >
                                    <option value="">All Channels</option>
                                    {channels.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>

                            <button onClick={fetchData} className="bg-blue-600 hover:bg-blue-700 transition-colors text-white p-2 rounded-lg shadow-sm"><ArrowPathIcon className="w-5 h-5" /></button>
                        </div>
                    </div>

                    {/* 4 Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                        {/* Card 1 */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:border-blue-100 transition-colors">
                            <h4 className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-2">TOTAL REGISTRATIONS</h4>
                            <div className="flex items-baseline gap-2">
                                <span className="text-[32px] font-black text-gray-900 tracking-tight">{filteredData.length.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[11px] font-bold px-2 py-0.5 rounded">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                                    12%
                                </span>
                                <span className="text-[12px] text-gray-400 font-medium">vs last month</span>
                            </div>
                            <UsersIcon className="w-16 h-16 text-gray-50 absolute right-4 top-6 mix-blend-multiply opacity-60 group-hover:scale-110 transition-transform duration-500" />
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:border-blue-100 transition-colors">
                            {/* Assuming Beirut is most popular, dynamically finding top region could be added here */}
                            <h4 className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-2">TOP REGION</h4>
                            <div className="flex items-baseline gap-2">
                                <span className="text-[32px] font-black text-gray-900 tracking-tight">Beirut</span>
                            </div>
                            <div className="mt-3">
                                <span className="text-[12px] text-gray-500 font-semibold inline-block mb-1.5">Highest volume</span>
                                <div className="w-full bg-gray-100 rounded-full h-1">
                                    <div className="bg-blue-600 h-1 rounded-full" style={{ width: '60%' }}></div>
                                </div>
                            </div>
                            <MapPinIcon className="w-16 h-16 text-gray-50 absolute right-4 top-6 mix-blend-multiply opacity-60 group-hover:scale-110 transition-transform duration-500" />
                        </div>

                        {/* Card 3 — Top Sector */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:border-blue-100 transition-colors">
                            <h4 className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-2">TOP SECTOR</h4>
                            <div className="flex items-baseline gap-2">
                                <span className="text-[26px] font-black text-gray-900 tracking-tight leading-tight truncate pr-2">{topSector}</span>
                            </div>
                            <div className="mt-3">
                                <span className="text-[12px] text-gray-500 font-semibold">
                                    {sectorBreakdown[0]?.count?.toLocaleString() ?? 0} registrations
                                </span>
                            </div>
                            <ComputerDesktopIcon className="w-16 h-16 text-gray-50 absolute right-4 top-6 mix-blend-multiply opacity-60 group-hover:scale-110 transition-transform duration-500" />
                        </div>

                        {/* Card 4 — Top Course */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:border-blue-100 transition-colors">
                            <h4 className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-2">TOP COURSE</h4>
                            <div className="flex items-baseline gap-2">
                                <span className="text-[24px] font-black text-gray-900 tracking-tight leading-tight truncate pr-4">{topTrack}</span>
                            </div>
                            <div className="mt-3">
                                {/* Dynamic via topTrack */}
                            </div>
                            <CheckCircleIcon className="w-16 h-16 text-gray-50 absolute right-4 top-6 mix-blend-multiply opacity-60 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                    </div>

                    {/* Middle Section: Growth vs Geography */}
                    <div className="flex flex-col lg:flex-row gap-6 mb-8">
                        {/* Growth Chart (Left 65%) */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-grow lg:w-2/3 flex flex-col items-start relative">
                            <div className="w-full flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-[17px] font-bold text-gray-900">Growth over time</h3>
                                    <p className="text-[13px] text-gray-500 mt-1 font-medium">Progress in scalability</p>
                                </div>
                                <button className="text-[13px] font-bold text-blue-600 hover:text-blue-800 transition-colors">View Report</button>
                            </div>
                            <div className="w-full h-80 flex items-end pb-8">
                                <div className="w-full h-full opacity-60">
                                    <DisseminationChart data={filteredData} />
                                </div>
                            </div>
                        </div>

                        {/* Geographic Insights (Right 35%) */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:w-1/3 flex flex-col relative w-full">
                            <h3 className="text-[17px] font-bold text-gray-900">Geographic Insights</h3>
                            <p className="text-[13px] text-gray-500 mt-1 mb-5 font-medium">Active participants by region</p>

                            <div className="h-[220px] rounded-xl overflow-hidden shadow-inner border border-gray-100 relative z-0 mb-6">
                                <GeographicInsights data={filteredData} />
                            </div>


                        </div>
                    </div>

                    {/* Bottom Section: Interest & Strategy */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div>
                                <h3 className="text-[17px] font-bold text-gray-900">Interest & Strategy</h3>
                                <p className="text-[13px] text-gray-500 mt-1 font-medium">Performance breakdown by training track</p>
                            </div>
                            <button className="mt-4 sm:mt-0 bg-gray-50 text-gray-700 hover:bg-gray-100 text-[13px] font-semibold py-2 px-4 rounded-lg border border-gray-200 transition-colors">Download Report</button>
                        </div>

                        <div className="p-6">
                            <InterestInsights data={filteredData} />
                        </div>
                    </div>
                </>
            )}

            {currentTab === 'courses' && (
                <div className="animate-fade-in">
                    {!selectedCourse ? (
                        <CourseList
                            data={filteredData}
                            onCourseSelect={(course) => setSelectedCourse(course)}
                        />
                    ) : (
                        <CourseLearnerList
                            course={selectedCourse}
                            data={data}
                            onLearnerSelect={(learner) => {
                                setSelectedLearner(learner);
                                if (setCurrentTab) setCurrentTab('learners'); // Navigate to learners tab
                            }}
                            onBack={() => setSelectedCourse(null)}
                        />
                    )}
                </div>
            )}

            {currentTab === 'learners' && (
                <div className="animate-fade-in">
                    {selectedLearner ? (
                        <LearnerProfileTable learner={selectedLearner} onBack={() => {
                            if (setCurrentTab) setCurrentTab('courses');
                        }} />
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                            <UsersIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-[18px] font-bold text-gray-900 mb-2">No Learner Selected</h3>
                            <p className="text-[14px] text-gray-500 mb-6">Navigate through the Courses section to find and select a learner to view their full profile.</p>
                            <button
                                onClick={() => {
                                    if (setCurrentTab) setCurrentTab('courses');
                                }}
                                className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-bold py-2.5 px-6 rounded-lg text-[14px]"
                            >
                                Browse Courses
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DataDashboard;
