'use client';

import { Metric } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface RateComparisonChartProps {
    metrics: Metric[];
}

export default function RateComparisonChart({ metrics }: RateComparisonChartProps) {
    // Get the most recent 10 calls
    const recentMetrics = metrics.slice(0, 10).reverse();

    const data = recentMetrics.map((metric, index) => ({
        call: `Call ${index + 1}`,
        'Load Board Rate': metric.load_loadboard_rate,
        'Carrier Offer': metric.carrier_initial_offer,
        'Agreed Rate': metric.load_agreed_rate,
    }));

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold text-white mb-4">Load Board Rate vs Carrier Offer vs Agreed Rate (Last 10 Calls)</h3>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                        dataKey="call"
                        stroke="#9CA3AF"
                        style={{ fill: '#9CA3AF' }}
                    />
                    <YAxis
                        stroke="#9CA3AF"
                        style={{ fill: '#9CA3AF' }}
                        label={{ value: 'Rate ($)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#FFFFFF',
                        }}
                    />
                    <Legend wrapperStyle={{ color: '#FFFFFF' }} />
                    <Bar dataKey="Load Board Rate" fill="#525252" />
                    <Bar dataKey="Carrier Offer" fill="#A3A3A3" />
                    <Bar dataKey="Agreed Rate" fill="#FFFFFF" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

