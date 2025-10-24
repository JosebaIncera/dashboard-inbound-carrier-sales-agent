'use client';

import { useEffect, useState } from 'react';
import { fetchAllMetrics, updateMetrics, Metric } from '@/lib/supabase';
import KPICard from '@/components/KPICard';
import CallOutcomeChart from '@/components/CallOutcomeChart';
import SentimentChart from '@/components/SentimentChart';
import SavingsByAttemptsChart from '@/components/SavingsByAttemptsChart';
import RateComparisonChart from '@/components/RateComparisonChart';
import TimeSeriesChart from '@/components/TimeSeriesChart';

type DateRangePreset = 'all' | '7d' | '30d' | '90d' | 'custom';

export default function Dashboard() {
    const [completedMetrics, setCompletedMetrics] = useState<Metric[]>([]);
    const [loading, setLoading] = useState(true);
    const [dateRangePreset, setDateRangePreset] = useState<DateRangePreset>('all');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const [currentTime, setCurrentTime] = useState<string>('');

    useEffect(() => {
        // Load metrics on initial load
        const loadData = async () => {
            setLoading(true);
            await updateMetrics();
            await loadMetrics();
            // Update timestamp after data is loaded
            setCurrentTime(new Date().toLocaleString());
        };
        loadData();
    }, []); // Empty dependency array - runs only once

    const loadMetrics = async () => {
        const { completed } = await fetchAllMetrics();
        setCompletedMetrics(completed);
        setLoading(false);
    };

    // Filter metrics based on date range
    const getFilteredMetrics = (): Metric[] => {
        if (dateRangePreset === 'all') {
            return completedMetrics;
        }

        const now = new Date();
        let startDate: Date;
        let endDate: Date = now;

        if (dateRangePreset === 'custom') {
            if (!customStartDate && !customEndDate) {
                return completedMetrics;
            }
            startDate = customStartDate ? new Date(customStartDate) : new Date(0);
            endDate = customEndDate ? new Date(customEndDate) : now;
            endDate.setHours(23, 59, 59, 999); // Include full end date
        } else {
            // Calculate start date based on preset
            startDate = new Date();
            switch (dateRangePreset) {
                case '7d':
                    startDate.setDate(now.getDate() - 7);
                    break;
                case '30d':
                    startDate.setDate(now.getDate() - 30);
                    break;
                case '90d':
                    startDate.setDate(now.getDate() - 90);
                    break;
            }
            startDate.setHours(0, 0, 0, 0);
        }

        return completedMetrics.filter(metric => {
            const metricDate = new Date(metric.created_at);
            return metricDate >= startDate && metricDate <= endDate;
        });
    };

    const filteredMetrics = getFilteredMetrics();

    // Calculate KPIs
    const totalCalls = filteredMetrics.length;
    const completedCalls = filteredMetrics.filter((m) => m.call_status === 'completed').length;
    const avgCallDuration = filteredMetrics.length > 0
        ? Math.round(filteredMetrics.reduce((acc, m) => acc + m.call_duration, 0) / filteredMetrics.length)
        : 0;
    const avgNegotiationAttempts = filteredMetrics.length > 0
        ? (filteredMetrics.reduce((acc, m) => acc + m.negotiation_attempts, 0) / filteredMetrics.length).toFixed(1)
        : '0.0';

    // Total savings from negotiations (positive = saved money)
    const totalNegotiationSavings = filteredMetrics.length > 0
        ? Math.round(filteredMetrics.reduce((acc, m) => acc + m.negotiation_performance, 0))
        : 0;

    // Average savings per call
    const avgNegotiationSavings = filteredMetrics.length > 0
        ? Math.round(filteredMetrics.reduce((acc, m) => acc + m.negotiation_performance, 0) / filteredMetrics.length)
        : 0;

    const avgRateDifference = filteredMetrics.length > 0
        ? Math.round(filteredMetrics.reduce((acc, m) => acc + m.rate_difference, 0) / filteredMetrics.length)
        : 0;
    const successRate = totalCalls > 0
        ? ((completedCalls / totalCalls) * 100).toFixed(1)
        : '0.0';

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="border-b border-gray-700 bg-gray-900 shadow-lg">
                <div className="max-w-[1600px] mx-auto px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-white">
                                HappyRobot
                            </h1>
                            <p className="text-gray-300 mt-1 text-sm">
                                Inbound Carrier Calls Analytics Dashboard
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-300">Last Updated</div>
                            <div className="text-white font-medium">
                                {currentTime || 'Loading...'}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-[1600px] mx-auto px-8 py-8">
                {/* Date Filter */}
                <div className="bg-white rounded-lg shadow-md mb-8 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
                        {/* Date Filter Buttons */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setDateRangePreset('all')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${dateRangePreset === 'all'
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                All Time
                            </button>
                            <button
                                onClick={() => setDateRangePreset('7d')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${dateRangePreset === '7d'
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                Last 7 Days
                            </button>
                            <button
                                onClick={() => setDateRangePreset('30d')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${dateRangePreset === '30d'
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                Last 30 Days
                            </button>
                            <button
                                onClick={() => setDateRangePreset('90d')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${dateRangePreset === '90d'
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                Last 90 Days
                            </button>
                            <button
                                onClick={() => setDateRangePreset('custom')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${dateRangePreset === 'custom'
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                Custom
                            </button>
                        </div>
                    </div>

                    {/* Custom Date Inputs */}
                    {dateRangePreset === 'custom' && (
                        <div className="flex flex-col sm:flex-row gap-2 items-center mb-6">
                            <input
                                type="date"
                                value={customStartDate}
                                onChange={(e) => setCustomStartDate(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                            <span className="text-gray-500 text-sm">to</span>
                            <input
                                type="date"
                                value={customEndDate}
                                onChange={(e) => setCustomEndDate(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                        </div>
                    )}

                    {/* Stats Summary */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            Showing <span className="font-semibold text-gray-900">{filteredMetrics.length}</span> of{' '}
                            <span className="font-semibold text-gray-900">{completedMetrics.length}</span> total metrics
                        </p>
                    </div>
                </div>

                {/* Conditional rendering based on loading and filtered data */}
                {loading ? (
                    /* Loading State */
                    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-lg shadow-md p-12">
                        <div className="text-center">
                            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent mb-4"></div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading metrics...</h2>
                            <p className="text-gray-600">Please wait while we fetch the data</p>
                        </div>
                    </div>
                ) : filteredMetrics.length === 0 ? (
                    /* No Data Message */
                    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-lg shadow-md p-12">
                        <div className="text-center">
                            <svg
                                className="mx-auto h-24 w-24 text-gray-400 mb-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                                No Call Data Available
                            </h2>
                            <p className="text-gray-600 max-w-md mb-4">
                                No completed, canceled, or failed runs found for the selected date range.
                            </p>
                            <p className="text-sm text-gray-500">
                                Refresh the page to load the latest data.
                            </p>
                        </div>
                    </div>
                ) : (
                    /* Dashboard View */
                    <>
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <KPICard
                                title="Total Calls"
                                value={totalCalls.toString()}
                                subtitle="All time"
                                trend={null}
                            />
                            <KPICard
                                title="Success Rate"
                                value={`${successRate}%`}
                                subtitle="Completed calls"
                                trend={null}
                            />
                            <KPICard
                                title="Completed Calls"
                                value={completedCalls.toString()}
                                subtitle={`${totalCalls} total`}
                                trend={null}
                            />
                            <KPICard
                                title="Avg Call Duration"
                                value={`${Math.floor(avgCallDuration / 60)}m ${avgCallDuration % 60}s`}
                                subtitle="Per call"
                                trend={null}
                            />

                        </div>

                        {/* Secondary KPIs */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <KPICard
                                title="Total Savings"
                                value={`${totalNegotiationSavings >= 0 ? '+' : ''}$${totalNegotiationSavings.toLocaleString()}`}
                                subtitle="From negotiations"
                                trend={null}
                            />
                            <KPICard
                                title="Avg Savings Per Call"
                                value={`${avgNegotiationSavings >= 0 ? '+' : ''}$${avgNegotiationSavings.toLocaleString()}`}
                                subtitle="Average negotiation savings"
                                trend={null}
                            />
                            <KPICard
                                title="Avg Negotiation Attempts"
                                value={avgNegotiationAttempts}
                                subtitle="Per call"
                                trend={null}
                            />

                        </div>

                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <CallOutcomeChart metrics={filteredMetrics} />
                            <SentimentChart metrics={filteredMetrics} />
                        </div>

                        <div className="grid grid-cols-1 gap-6 mb-8">
                            <SavingsByAttemptsChart metrics={filteredMetrics} />
                        </div>

                        <div className="grid grid-cols-1 gap-6 mb-8">
                            <RateComparisonChart metrics={filteredMetrics} />
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <TimeSeriesChart metrics={filteredMetrics} />
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

