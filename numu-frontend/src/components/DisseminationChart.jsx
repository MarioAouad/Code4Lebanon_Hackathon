import React, { useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Inline plugin: draw count above each bar
const dataLabelPlugin = {
    id: 'dataLabelPlugin',
    afterDatasetsDraw(chart) {
        const { ctx } = chart;
        chart.data.datasets.forEach((dataset, i) => {
            const meta = chart.getDatasetMeta(i);
            meta.data.forEach((bar, index) => {
                const value = dataset.data[index];
                if (value === 0) return;
                ctx.save();
                ctx.fillStyle = '#374151';
                ctx.font = 'bold 13px Inter, system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillText(value.toLocaleString(), bar.x, bar.y - 4);
                ctx.restore();
            });
        });
    }
};

const SECTOR_COLORS = {
    'Universities': '#1E3A8A',
    'Syndicates': '#CE1126',
    'Public Sector': '#046A38',
    'NGOs': '#F59E0B',
    'Employers': '#7C3AED',
};

const FIXED_SECTORS = ['Universities', 'Syndicates', 'Public Sector', 'NGOs', 'Employers'];

const DisseminationChart = ({ data }) => {
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return null;

        const channelCounts = {};
        FIXED_SECTORS.forEach(s => { channelCounts[s] = 0; });

        data.forEach(curr => {
            const sector = curr.source ? curr.source.split('/')[0].trim() : null;
            if (sector && FIXED_SECTORS.includes(sector)) {
                channelCounts[sector] = (channelCounts[sector] || 0) + 1;
            }
        });

        const sorted = FIXED_SECTORS
            .map(name => ({ name, count: channelCounts[name] }))
            .sort((a, b) => b.count - a.count);

        return {
            labels: sorted.map(item => item.name),
            datasets: [{
                label: 'Registrations',
                data: sorted.map(item => item.count),
                backgroundColor: sorted.map(item => SECTOR_COLORS[item.name] || '#6B7280'),
                borderRadius: 6,
                borderSkipped: false,
            }]
        };
    }, [data]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) => ` ${ctx.raw.toLocaleString()} Citizens`,
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { display: true, color: '#f1f5f9' },
                ticks: { precision: 0 },
            },
            x: {
                grid: { display: false },
                ticks: { maxRotation: 20, minRotation: 0, font: { size: 12 } }
            }
        }
    };

    if (!chartData) return <div className="text-sm text-slate-400">Insufficient data</div>;

    return <Bar data={chartData} options={options} plugins={[dataLabelPlugin]} />;
};

export default DisseminationChart;
