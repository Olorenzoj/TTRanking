"use client";

import dynamic from 'next/dynamic';

const JugadoresSection = dynamic(
  () => import('./JugadoresSection'),
  { 
    ssr: false,
    loading: () => <div className="bg-white rounded-lg shadow p-4 h-64 animate-pulse" />
  }
);

export default function JugadoresWrapper() {
  return <JugadoresSection />;
}