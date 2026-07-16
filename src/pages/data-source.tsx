import React, { useState } from 'react';
import { ReactFlow, Background, Controls, Edge, Node, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Footer } from '@/src/components/ui/footer';
import { ShieldAlert, Info } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const initialNodes: Node[] = [
  {
    id: 'bca',
    type: 'default',
    data: { label: <div className="font-bold text-center">🏦 BCA</div> },
    position: { x: 50, y: 150 },
    style: { background: '#fff', border: '2px solid #00ba68', borderRadius: '8px', padding: '10px' },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: 'flip',
    type: 'default',
    data: { label: <div className="font-bold text-center">🔄 Flip</div> },
    position: { x: 300, y: 150 },
    style: { background: '#fff', border: '2px solid #00ba68', borderRadius: '8px', padding: '10px' },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: 'gopay',
    type: 'default',
    data: { label: <div className="font-bold text-center">📱 GoPay</div> },
    position: { x: 550, y: 150 },
    style: { background: '#fff', border: '2px solid #00ba68', borderRadius: '8px', padding: '10px' },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: 'jago',
    type: 'default',
    data: { label: <div className="font-bold text-center">🏦 Bank Jago</div> },
    position: { x: 800, y: 150 },
    style: { background: '#fff', border: '2px solid #00ba68', borderRadius: '8px', padding: '10px' },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e-bca-flip',
    source: 'bca',
    target: 'flip',
    label: 'Rp0 (Kode Unik)',
    animated: true,
    style: { stroke: '#00ba68', strokeWidth: 2 },
    labelStyle: { fill: '#64748b', fontWeight: 600 },
    labelBgStyle: { fill: '#f8fafc', fillOpacity: 0.9, rx: 4 },
  },
  {
    id: 'e-flip-gopay',
    source: 'flip',
    target: 'gopay',
    label: 'Rp1.000',
    animated: true,
    style: { stroke: '#00ba68', strokeWidth: 2 },
    labelStyle: { fill: '#64748b', fontWeight: 600 },
    labelBgStyle: { fill: '#f8fafc', fillOpacity: 0.9, rx: 4 },
  },
  {
    id: 'e-gopay-jago',
    source: 'gopay',
    target: 'jago',
    label: 'Rp0',
    animated: true,
    style: { stroke: '#00ba68', strokeWidth: 2 },
    labelStyle: { fill: '#64748b', fontWeight: 600 },
    labelBgStyle: { fill: '#f8fafc', fillOpacity: 0.9, rx: 4 },
  },
];

export function DataSource() {
  const [activeTopic, setActiveTopic] = useState('optimizer');
  const topics = [
    { id: 'optimizer', label: 'Optimizer Transfer' },
    { id: 'bifast', label: 'BI-FAST Routes' },
    { id: 'ewallet', label: 'E-Wallet Limits' }
  ];

  return (
    <div className="min-h-screen bg-theme-bg pt-28">
      <div className="max-w-7xl mx-auto px-6 pb-24">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-theme-main mb-4">
            Sumber Data & Algoritma
          </h1>
          <p className="text-theme-textDim text-lg max-w-3xl">
            Transparansi penuh terhadap cara Dity Flow menghitung rute, biaya admin, dan memetakan logika institusi finansial Indonesia.
          </p>
        </div>

        {/* Chips */}
        <div className="flex flex-wrap gap-3 mb-10">
          {topics.map(topic => (
            <button
              key={topic.id}
              onClick={() => setActiveTopic(topic.id)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-bold transition-all border",
                activeTopic === topic.id 
                  ? "bg-theme-accent text-theme-inverted border-theme-accent shadow-lg shadow-theme-accent/20"
                  : "bg-theme-card text-theme-main border-theme-border hover:border-theme-accent"
              )}
            >
              {topic.label}
            </button>
          ))}
        </div>

        {/* Content Box */}
        <div className="bg-theme-card border border-theme-border rounded-3xl overflow-hidden shadow-xl shadow-theme-shadow/5 mb-12">
          
          <div className="p-8 border-b border-theme-border">
            <h2 className="text-2xl font-bold text-theme-main mb-2">Simulasi Pemetaan Rute Transfer</h2>
            <p className="text-theme-textDim mb-6">Contoh rute optimasi multi-langkah: BCA → Bank Jago.</p>
            
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 bg-theme-badge border border-theme-border rounded-xl p-4 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-theme-main text-sm">Peringatan Kode Unik</h4>
                  <p className="text-sm text-theme-textDim mt-1">
                    Transfer masuk ke Flip membutuhkan 3 digit kode unik (misal: Rp50.123). Dana kode unik akan dikembalikan ke saldo Anda.
                  </p>
                </div>
              </div>
              <div className="flex-1 bg-theme-badge border border-theme-border rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-theme-main text-sm">Potongan Saldo Masuk</h4>
                  <p className="text-sm text-theme-textDim mt-1">
                    Biaya top-up E-Wallet umumnya memotong saldo tujuan. Sistem kami memisahkan status DEDUCTED_FROM_TARGET vs ADDED_TO_SOURCE untuk perhitungan presisi.
                  </p>
                </div>
              </div>
            </div>

            {/* React Flow Canvas */}
            <div className="h-[400px] w-full border border-theme-border rounded-2xl overflow-hidden bg-theme-bg relative">
              <ReactFlow 
                nodes={initialNodes} 
                edges={initialEdges} 
                fitView
                fitViewOptions={{ padding: 0.2 }}
              >
                <Background color="#cbd5e1" gap={16} />
                <Controls showInteractive={false} />
              </ReactFlow>
            </div>
          </div>

          <div className="p-8 bg-theme-bg">
            <h3 className="font-bold text-theme-main text-xl mb-4">Analisis Engine Algoritma</h3>
            <div className="prose prose-sm dark:prose-invert max-w-none text-theme-textDim">
              <p>
                Sistem perutean (routing) Dity Flow dibangun dengan algoritma berbasis graf (Graph Algorithm) layaknya Google Maps, namun untuk topologi bank dan e-wallet. Kami menggunakan fungsi <strong>Recursive CTE (Common Table Expressions)</strong> pada SQL untuk mengeksekusi pencarian rute hingga kedalaman maksimal 4 langkah (node hops) demi menjaga performa dan relevansi.
              </p>
              <p>
                Ketika Anda melakukan kueri pencarian, sistem memetakan semua kemungkinan node dari bank asal (Source) hingga bank tujuan (Destination) dan menghitung akumulasi bobot (Total Fee) dari setiap Edge (Aturan Transfer). Algoritma ini mendukung:
              </p>
              <ul>
                <li><strong>Dynamic Limit & Quotas:</strong> Mengevaluasi apakah pengguna memiliki sisa kuota transfer gratis bulanan.</li>
                <li><strong>Bypass Quota Check:</strong> Mengalihkan kalkulasi ke tarif <i>fallback</i> jika pengguna mencentang batas limit bulanan.</li>
                <li><strong>Multiple Routing Strategy:</strong> Mengembalikan TOP 3 Rute Terbaik, memberi Anda fleksibilitas untuk memilih jalur tercepat atau termurah.</li>
              </ul>
            </div>
          </div>

        </div>

      </div>
      <Footer />
    </div>
  );
}
