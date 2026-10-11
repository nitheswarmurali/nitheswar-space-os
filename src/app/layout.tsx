import './globals.css';
import type { Metadata } from 'next';
import { Sidebar } from '@/components/shell/Sidebar';
export const metadata: Metadata = {
  title: 'ORBIT OS — Global Space Intelligence',
  description: 'Live space tracking from public sources.',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-fg antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}