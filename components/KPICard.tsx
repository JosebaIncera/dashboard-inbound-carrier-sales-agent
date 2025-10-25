interface KPICardProps {
    title: string;
    value: string;
    subtitle: string;
    trend: number | null;
}

export default function KPICard({ title, value, subtitle, trend }: KPICardProps) {
    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors shadow-md">
            <div className="text-gray-300 text-sm font-medium uppercase tracking-wide mb-2">
                {title}
            </div>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            <div className="flex items-center justify-between">
                <div className="text-gray-400 text-sm">{subtitle}</div>
                {trend !== null && (
                    <div
                        className={`text-sm font-medium ${trend > 0 ? 'text-white' : trend < 0 ? 'text-gray-400' : 'text-gray-300'
                            }`}
                    >
                        {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend)}%
                    </div>
                )}
            </div>
        </div>
    );
}

