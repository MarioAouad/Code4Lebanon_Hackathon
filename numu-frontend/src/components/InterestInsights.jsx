import React, { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';

const COLORS = ['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#E0E7FF'];
const MOTIVATION_COLORS = ['#CE1126', '#F87171', '#FCA5A5', '#FECACA', '#FEF2F2'];
const CHALLENGE_COLORS = ['#047857', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5'];

// Helper to count frequencies of comma-separated string arrays
const getFrequencies = (data, key) => {
    const counts = {};
    data.forEach(item => {
        if (item[key]) {
            const parts = item[key].split(',').map(s => s.trim()).filter(Boolean);
            parts.forEach(p => {
                counts[p] = (counts[p] || 0) + 1;
            });
        }
    });

    // Convert to sorted array
    return Object.entries(counts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
};

const InterestInsights = ({ data }) => {

    const trackData = useMemo(() => getFrequencies(data, 'track').slice(0, 6), [data]);
    const motivationData = useMemo(() => getFrequencies(data, 'motivation').slice(0, 5), [data]);
    const challengeData = useMemo(() => getFrequencies(data, 'challenge').slice(0, 5), [data]);

    if (!data || data.length === 0) {
        return <div className="text-sm text-slate-500 py-10 text-center">Awaiting data to generate insights...</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-4">
            {/* Tracks Bar Chart */}
            <div className="flex flex-col h-72">
                <h4 className="text-[14px] font-bold text-gray-900 mb-4 text-center">Top Areas of Interest</h4>
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={trackData}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#4B5563' }}
                                width={100}
                            />
                            <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                {trackData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Motivations Doughnut */}
            <div className="flex flex-col h-72">
                <h4 className="text-[14px] font-bold text-gray-900 mb-0 text-center">Primary Motivations</h4>
                <div className="flex-1 w-full min-h-0 relative flex items-center justify-center">
                    {motivationData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={motivationData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {motivationData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={MOTIVATION_COLORS[index % MOTIVATION_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <span className="text-xs text-gray-400">No motivation data available</span>
                    )}
                </div>
            </div>

            {/* Challenges Doughnut */}
            <div className="flex flex-col h-72">
                <h4 className="text-[14px] font-bold text-gray-900 mb-0 text-center">Top Challenges</h4>
                <div className="flex-1 w-full min-h-0 relative flex items-center justify-center">
                    {challengeData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={challengeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={0}
                                    outerRadius={80}
                                    dataKey="value"
                                >
                                    {challengeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CHALLENGE_COLORS[index % CHALLENGE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend verticalAlign="bottom" height={36} iconType="square" wrapperStyle={{ fontSize: '11px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <span className="text-xs text-gray-400">No challenge data mapped</span>
                    )}
                </div>
            </div>

        </div>
    );
};

export default InterestInsights;
