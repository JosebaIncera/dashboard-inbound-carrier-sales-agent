'use client';

import { Metric } from '@/lib/supabase';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface CallDurationChartProps {
    metrics: Metric[];
}

export default function CallDurationChart({ metrics }: CallDurationChartProps) {
    const data = metrics.map((metric, index) => ({
        index: index + 1,
        duration: Math.round(metric.call_duration / 60), // Convert to minutes
        status: metric.call_status,
    }));

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold text-white mb-4">Call Duration Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                        dataKey="index"
                        name="Call Number"
                        stroke="#9CA3AF"
                        style={{ fill: '#9CA3AF' }}
                        label={{ value: 'Call Number', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }}
                    />
                    <YAxis
                        dataKey="duration"
                        name="Duration"
                        unit=" min"
                        stroke="#9CA3AF"
                        style={{ fill: '#9CA3AF' }}
                        label={{ value: 'Duration (minutes)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#FFFFFF',
                        }}
                        cursor={{ strokeDasharray: '3 3' }}
                    />
                    <Legend wrapperStyle={{ color: '#FFFFFF' }} />
                    <Scatter name="Call Duration" data={data} fill="#A3A3A3" />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
}

