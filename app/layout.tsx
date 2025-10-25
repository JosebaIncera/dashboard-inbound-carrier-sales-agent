import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'HappyRobot - Carrier Call Analytics',
    description: 'Freight Brokerage Automation Dashboard',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="bg-gray-100 text-gray-900 antialiased">{children}</body>
        </html>
    );
}

