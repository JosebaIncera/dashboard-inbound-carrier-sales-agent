'use client';

import { Metric } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SentimentChartProps {
    metrics: Metric[];
}

export default function SentimentChart({ metrics }: SentimentChartProps) {
    // Aggregate sentiments
    const sentimentCount: { [key: string]: number } = {};
    metrics.forEach((metric) => {
        sentimentCount[metric.carrier_sentiment] = (sentimentCount[metric.carrier_sentiment] || 0) + 1;
    });

    const data = Object.entries(sentimentCount).map(([name, count]) => ({
        sentiment: name,
        count,
    }));

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold text-white mb-4">Carrier Sentiment</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                        dataKey="sentiment"
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
                    <Bar dataKey="count" fill="#FFFFFF" name="Number of Calls" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

