'use client';

import { Metric } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';

interface SavingsByAttemptsChartProps {
    metrics: Metric[];
}

export default function SavingsByAttemptsChart({ metrics }: SavingsByAttemptsChartProps) {
    // Group by negotiation attempts and calculate average savings
    const savingsByAttempts: { [key: number]: number[] } = {};

    metrics.forEach((metric) => {
        const attempts = metric.negotiation_attempts;
        if (!savingsByAttempts[attempts]) {
            savingsByAttempts[attempts] = [];
        }
        savingsByAttempts[attempts].push(metric.negotiation_performance);
    });

    const data = Object.entries(savingsByAttempts)
        .map(([attempts, savings]) => {
            const avgSavings = savings.reduce((acc, val) => acc + val, 0) / savings.length;
            const totalSavings = savings.reduce((acc, val) => acc + val, 0);
            return {
                attempts: `${attempts} attempt${parseInt(attempts) !== 1 ? 's' : ''}`,
                avgSavings: Math.round(avgSavings),
                totalSavings: Math.round(totalSavings),
                count: savings.length,
            };
        })
        .sort((a, b) => parseInt(a.attempts) - parseInt(b.attempts));

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg">
                    <p className="text-white font-semibold mb-1">{data.attempts}</p>
                    <p className="text-gray-300 text-sm">
                        Avg Savings: <span className={data.avgSavings >= 0 ? 'text-green-400' : 'text-red-400'}>
                            ${data.avgSavings.toLocaleString()}
                        </span>
                    </p>
                    <p className="text-gray-300 text-sm">
                        Total Savings: <span className={data.totalSavings >= 0 ? 'text-green-400' : 'text-red-400'}>
                            ${data.totalSavings.toLocaleString()}
                        </span>
                    </p>
                    <p className="text-gray-400 text-xs mt-1">{data.count} calls</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold text-white mb-4">
                Negotiation Performance by Attempts
            </h3>
            <p className="text-gray-400 text-sm mb-4">
                Average savings based on number of negotiation rounds
            </p>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                        dataKey="attempts"
                        stroke="#9CA3AF"
                        style={{ fill: '#9CA3AF' }}
                    />
                    <YAxis
                        stroke="#9CA3AF"
                        style={{ fill: '#9CA3AF' }}
                        label={{ value: 'Avg Savings ($)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ color: '#FFFFFF' }} />
                    <ReferenceLine y={0} stroke="#6B7280" strokeDasharray="3 3" />
                    <Bar
                        dataKey="avgSavings"
                        fill="#FFFFFF"
                        name="Average Savings"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

