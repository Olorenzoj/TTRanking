"use client";

import dynamic from 'next/dynamic';

const ClubesSection = dynamic(
  () => import('./ClubesSection'),
  { 
    ssr: false,
    loading: () => <div className="bg-white rounded-lg shadow p-4 h-64 animate-pulse" />
  }
);

export default function ClubesWrapper() {
  return <ClubesSection />;
}