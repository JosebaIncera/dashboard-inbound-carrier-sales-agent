'use client';

import { Metric } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface NegotiationChartProps {
    metrics: Metric[];
}

export default function NegotiationChart({ metrics }: NegotiationChartProps) {
    // Aggregate negotiation attempts
    const attemptCount: { [key: number]: number } = {};
    metrics.forEach((metric) => {
        attemptCount[metric.negotiation_attempts] = (attemptCount[metric.negotiation_attempts] || 0) + 1;
    });

    const data = Object.entries(attemptCount)
        .map(([attempts, count]) => ({
            attempts: `${attempts} attempt${parseInt(attempts) !== 1 ? 's' : ''}`,
            count,
        }))
        .sort((a, b) => parseInt(a.attempts) - parseInt(b.attempts));

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold text-white mb-4">Negotiation Attempts</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                        dataKey="attempts"
                        stroke="#9CA3AF"
                        style={{ fill: '#9CA3AF' }}
                    />
                    <YAxis stroke="#9CA3AF" style={{ fill: '#9CA3AF' }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#FFFFFF',
                        }}
                    />
                    <Legend wrapperStyle={{ color: '#FFFFFF' }} />
                    <Bar dataKey="count" fill="#D4D4D4" name="Number of Calls" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

