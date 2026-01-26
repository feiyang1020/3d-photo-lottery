import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lottery 3D',
  description: 'A beautiful 3D lottery application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
