'use client';

import { Metric } from '@/lib/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';

interface TimeSeriesChartProps {
    metrics: Metric[];
}

export default function TimeSeriesChart({ metrics }: TimeSeriesChartProps) {
    // Debug logging
    console.log('=== TimeSeriesChart Debug ===');
    console.log('Input metrics count:', metrics.length);
    console.log('Input metrics:', metrics.map(m => ({
        id: m.id,
        created_at: m.created_at,
        negotiation_performance: m.negotiation_performance,
        call_duration: m.call_duration
    })));

    // Group metrics by date and calculate daily totals/averages
    const dailyData: { [key: string]: { savings: number[]; duration: number[]; dateKey: string } } = {};

    metrics.forEach((metric) => {
        // Extract date part directly from ISO string to avoid timezone issues
        const dateKey = metric.created_at.split('T')[0]; // Gets "2025-10-23" from "2025-10-23T22:22:45.187178+00:00"

        console.log(`Processing metric ${metric.id}:`, {
            originalDate: metric.created_at,
            extractedDateKey: dateKey,
            call_duration: metric.call_duration,
            negotiation_performance: metric.negotiation_performance
        });

        if (!dailyData[dateKey]) {
            dailyData[dateKey] = { savings: [], duration: [], dateKey };
        }
        dailyData[dateKey].savings.push(metric.negotiation_performance);
        dailyData[dateKey].duration.push(metric.call_duration);
    });

    console.log('Daily data keys:', Object.keys(dailyData));
    console.log('Daily data:', dailyData);

    // Convert to array and sort by date
    const data = Object.entries(dailyData)
        .map(([dateKey, values]) => {
            // Create a proper date from the dateKey for display formatting
            const displayDate = new Date(dateKey + 'T00:00:00Z'); // UTC date to avoid timezone issues

            const totalSavings = values.savings.reduce((a, b) => a + b, 0);
            const avgDurationMinutes = values.duration.reduce((a, b) => a + b, 0) / values.duration.length / 60;

            console.log(`Processing date ${dateKey}:`, {
                durations: values.duration,
                totalDuration: values.duration.reduce((a, b) => a + b, 0),
                avgDurationMinutes: avgDurationMinutes,
                totalSavings: totalSavings
            });

            return {
                date: format(displayDate, 'MMM dd'), // Display format using UTC date
                sortKey: dateKey, // For sorting
                'Total Savings': Number(totalSavings.toFixed(0)),
                'Avg Duration (min)': Number(avgDurationMinutes.toFixed(1)),
            };
        })
        .sort((a, b) => a.sortKey.localeCompare(b.sortKey)); // Sort chronologically by full date

    console.log('Final chart data:', data);
    console.log('============================');

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold text-white mb-4">Daily Total Savings VS Average Call Duration</h3>
            <p className="text-gray-400 text-sm mb-4">
                Total negotiation savings per day vs average call duration (minutes) per day
            </p>
            <ResponsiveContainer width="100%" height={350}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                        dataKey="date"
                        stroke="#9CA3AF"
                        style={{ fill: '#9CA3AF' }}
                    />
                    <YAxis
                        yAxisId="left"
                        stroke="#9CA3AF"
                        style={{ fill: '#9CA3AF' }}
                        label={{ value: 'Savings ($)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#9CA3AF"
                        style={{ fill: '#9CA3AF' }}
                        label={{ value: 'Duration (min)', angle: 90, position: 'insideRight', fill: '#9CA3AF' }}
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
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="Total Savings"
                        stroke="#FFFFFF"
                        strokeWidth={2}
                        dot={{ fill: '#FFFFFF', r: 4 }}
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="Avg Duration (min)"
                        stroke="#737373"
                        strokeWidth={2}
                        dot={{ fill: '#737373', r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}