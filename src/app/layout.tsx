import './globals.css';
import type { Metadata } from 'next';
import { Sidebar } from '@/components/shell/Sidebar';
import { MobileNav } from '@/components/shell/MobileNav';

export const metadata: Metadata = {
  title: 'ORBIT OS — Global Space Intelligence',
  description: 'Live space tracking from public sources.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#08090B',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-fg antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 min-w-0 flex flex-col">
            <MobileNav />
            <main className="flex-1 min-w-0">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}