import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Add initialization logging
console.log('=== Supabase Initialization ===');
console.log('Environment:', process.env.NODE_ENV);
console.log('Supabase URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'NOT SET');
console.log('Supabase Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NOT SET');
console.log('==============================');

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('⚠️ CRITICAL: Supabase credentials are missing!');
    if (process.env.NODE_ENV === 'production') {
        throw new Error('Supabase credentials must be set in production');
    }
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
);


export interface Metric {
    id: string;
    call_outcome: string;
    carrier_sentiment: string;
    load_loadboard_rate: number;
    carrier_initial_offer: number;
    load_agreed_rate: number;
    negotiation_attempts: number;
    run_id: string;
    organization_id: string;
    call_duration: number;
    call_status: string;
    negotiation_performance: number;
    rate_difference: number;
    created_at: string;
    updated_at: string;
}

export async function updateMetrics(): Promise<void> {
    // Call the Supabase Edge Function to update metrics
    try {
        const { data, error } = await supabase.functions.invoke('update-metrics', {
            method: 'POST',
        });

        if (error) {
            console.error('Error calling update-metrics function:', error);
        } else if (data) {
            console.log('Update metrics response:', data);
        }
    } catch (error) {
        console.error('Error calling update-metrics function:', error);
    }
}

export async function fetchAllMetrics(): Promise<{ completed: Metric[]; running: Metric[] }> {
    // Fetch all metrics from Supabase
    const { data, error } = await supabase
        .from('metrics')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching metrics:', error);
        return { completed: [], running: [] };
    }

    const allMetrics = data || [];

    // Filter metrics by status
    const completedMetrics = allMetrics.filter(metric =>
        ['completed', 'canceled', 'failed'].includes(metric.call_status)
    );

    const runningMetrics = allMetrics.filter(metric =>
        ['running', 'scheduled'].includes(metric.call_status)
    );

    // Log the fetched metrics data
    console.log('=== Fetched All Metrics ===');
    console.log('Total Records:', allMetrics.length);
    console.log('Completed Records:', completedMetrics.length);
    console.log('Running Records:', runningMetrics.length);
    console.log('==========================');

    return { completed: completedMetrics, running: runningMetrics };
}

