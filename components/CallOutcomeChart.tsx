'use client';

import { Metric } from '@/lib/supabase';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CallOutcomeChartProps {
    metrics: Metric[];
}

export default function CallOutcomeChart({ metrics }: CallOutcomeChartProps) {
    // Aggregate call outcomes
    const outcomeCount: { [key: string]: number } = {};
    metrics.forEach((metric) => {
        outcomeCount[metric.call_outcome] = (outcomeCount[metric.call_outcome] || 0) + 1;
    });

    const data = Object.entries(outcomeCount).map(([name, value]) => ({
        name,
        value,
    }));

    // Black and white gradient colors
    const COLORS = ['#FFFFFF', '#D4D4D4', '#A3A3A3', '#737373', '#525252', '#404040'];

    // Render labels outside slices for readability on dark background
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        outerRadius,
        percent,
        name,
    }: any) => {
        const radius = outerRadius + 16;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="#E5E5E5"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                style={{ fontSize: 12 }}
            >
                {`${name} ${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold text-white mb-4">Call Outcomes</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={renderCustomizedLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#FFFFFF',
                            fontSize: '14px',
                            fontWeight: '500',
                        }}
                    />
                    <Legend
                        wrapperStyle={{ color: '#FFFFFF' }}
                        iconType="circle"
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

