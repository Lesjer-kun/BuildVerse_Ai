import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  ShieldX, 
  TrendingUp, 
  ShoppingBag, 
  ArrowDownCircle, 
  Plane,
  Coins,
  Bell,
  Settings,
  ArrowUpRight,
  ChevronDown
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Transaction, BankNode } from '../types';
import { ScrollReveal, StaggerContainer, StaggerItem } from './ScrollReveal';

interface OverviewProps {
  transactions: Transaction[];
  activeBank: BankNode;
  allBanks: BankNode[];
  onBankChange: (address: string) => void;
  onViewAllTransactions: () => void;
}

// Beautiful cash flow mock data for the charting canvas
const CHART_DATA = [
  { month: 'Jan', inflows: 42000, outflows: 28000 },
  { month: 'Feb', inflows: 58000, outflows: 31000 },
  { month: 'Mar', inflows: 61000, outflows: 42000 },
  { month: 'Apr', inflows: 82000, outflows: 45000 },
  { month: 'May', inflows: 95000, outflows: 52000 },
  { month: 'Jun', inflows: 110000, outflows: 62000 },
  { month: 'Jul', inflows: 115000, outflows: 58000 },
];

export default function Overview({ 
  transactions, 
  activeBank, 
  allBanks,
  onBankChange,
  onViewAllTransactions 
}: OverviewProps) {

  const [chartType, setChartType] = useState<'both' | 'inflows' | 'outflows'>('both');
  const [isNodeDropdownOpen, setIsNodeDropdownOpen] = useState(false);

  // Format currency
  const formatValue = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(num);
  };

  // Grab first 3 transactions for Recent Activity
  const recentTransactions = transactions.slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in text-white">
      {/* Upper Status Header Bar */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-white/8 pb-6">
        <div>
          <h1 className="text-4xl font-serif font-bold italic tracking-tight text-white">Overview</h1>
          <p className="text-sm text-slate-300 font-medium leading-relaxed mt-1">
            Real-world compliance gatekeeper and multi-node asset tracking ledger.
          </p>
        </div>
        
        {/* Profile and quick controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Institutional Switcher: Custom dropdown for pixel-perfect visibility and hover states */}
          <div className="relative">
            <button
              id="node-selector-dropdown-btn"
              onClick={() => setIsNodeDropdownOpen(!isNodeDropdownOpen)}
              className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 py-2 px-3.5 rounded-lg text-xs font-bold text-white transition-all cursor-pointer select-none"
            >
              <span className="text-[10px] text-[#C5A880] font-extrabold uppercase tracking-widest mr-1">Active Node:</span>
              <span>{activeBank.name}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-205 ${isNodeDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isNodeDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsNodeDropdownOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-64 bg-[#141416] border border-white/10 rounded-lg shadow-2xl z-50 py-1.5 animate-fade-in origin-top-right">
                  <div className="px-3 py-1.5 border-b border-white/5 mb-1.5">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Select Institutional Node</span>
                  </div>
                  {allBanks.map((bank) => {
                    const isSelected = bank.address === activeBank.address;
                    return (
                      <button
                        key={bank.address}
                        onClick={() => {
                          onBankChange(bank.address);
                          setIsNodeDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-[#C5A880]/15 text-[#C5A880] font-bold' 
                            : 'text-white hover:bg-white/5 hover:text-[#C5A880]'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold">{bank.name}</span>
                          <span className="text-[9px] text-slate-400 font-mono truncate max-w-[190px]">{bank.address}</span>
                        </div>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <button className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
            <Bell className="w-4 h-4" />
          </button>
          
          <button className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
            <Settings className="w-4 h-4" />
          </button>

          <div className="relative">
            <img 
              src={`https://api.dicebear.com/7.x/identicon/svg?seed=${activeBank.avatarSeed}`} 
              alt="Node Avatar" 
              className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 p-0.5"
            />
            {activeBank.verified ? (
              <span className="absolute bottom-[-1px] right-[-1px] w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
            ) : (
              <span className="absolute bottom-[-1px] right-[-1px] w-3 h-3 bg-red-500 border-2 border-slate-950 rounded-full animate-pulse" />
            )}
          </div>
        </div>
      </div>

      {/* Grid: Net Worth and Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gigantic Net Worth display */}
        <ScrollReveal className="lg:col-span-2" delay={0.05} yOffset={25}>
          <motion.div 
            whileHover={{ y: -4, scale: 1.005, borderColor: "rgba(197, 168, 128, 0.35)", boxShadow: "0 12px 30px -10px rgba(197, 168, 128, 0.12)" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="h-full bg-black/45 backdrop-blur-xl border border-white/8 rounded-xl p-8 relative overflow-hidden flex flex-col justify-between shadow-lg cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A880]/10 rounded-full blur-3xl pointer-events-none animate-pulse duration-5000" />
            
            <div className="space-y-3">
              <p className="text-[10px] font-extrabold text-[#C5A880] uppercase tracking-[0.25em]">Total Net Worth</p>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-serif font-black tracking-tighter text-white">
                  $1,248,590
                </span>
                <span className="text-2xl font-serif font-bold text-[#C5A880]">.00</span>
                
                <div className="ml-4 inline-flex items-center gap-1 bg-[#C5A880]/10 text-[#C5A880] font-bold text-xs py-1 px-3 rounded-full border border-[#C5A880]/20">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+2.4% MoM</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-white/8 pt-6 mt-10">
              <div>
                <p className="text-[10px] text-[#C5A880] font-bold uppercase tracking-wider">Tokenized Assets</p>
                <p className="text-xl font-serif font-bold text-white mt-1">$845,000<span className="text-xs text-slate-300">.00</span></p>
              </div>
              <div>
                <p className="text-[10px] text-[#C5A880] font-bold uppercase tracking-wider">Liquid Vaults</p>
                <p className="text-xl font-serif font-bold text-white mt-1">$403,590<span className="text-xs text-slate-300">.00</span></p>
              </div>
              <div>
                <p className="text-[10px] text-[#C5A880] font-bold uppercase tracking-wider">Node Jurisdiction</p>
                <p className="text-sm font-bold text-white mt-2.5 truncate max-w-full italic font-serif">
                  {activeBank.location}
                </p>
              </div>
            </div>
          </motion.div>
        </ScrollReveal>

        {/* Account Status Screen Verified/Blocked */}
        <ScrollReveal delay={0.15} yOffset={25}>
          <motion.div 
            whileHover={{ y: -4, scale: 1.005, borderColor: activeBank.verified ? "rgba(16, 185, 129, 0.4)" : "rgba(239, 68, 68, 0.4)" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`h-full border rounded-xl p-8 relative overflow-hidden flex flex-col justify-between bg-black/45 backdrop-blur-xl cursor-pointer ${
              activeBank.verified 
                ? 'border-emerald-500/25 shadow-emerald-950/20' 
                : 'border-red-500/25 shadow-red-950/20'
            }`}
          >
            <div>
              <p className="text-[10px] font-extrabold text-[#C5A880] uppercase tracking-[0.25em] mb-4">Account Status</p>
              
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${
                  activeBank.verified 
                    ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400' 
                    : 'bg-red-500/10 border border-red-500/25 text-red-400'
                }`}>
                  {activeBank.verified ? (
                    <ShieldCheck className="w-5 h-5 animate-pulse" />
                  ) : (
                    <ShieldX className="w-5 h-5 text-red-400" />
                  )}
                </div>
                
                <div>
                  <span className="text-[9px] font-extrabold tracking-[0.2em] uppercase bg-white/10 text-[#C5A880] px-2 py-0.5 rounded border border-white/10">
                    Compliance
                  </span>
                  
                  <p className={`text-2xl font-serif font-bold tracking-tight mt-1.5 ${
                    activeBank.verified ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {activeBank.verified ? 'Verified Node' : 'Suspended' }
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 mt-8 border-t border-white/8 pt-5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-semibold">Identity KYC status:</span>
                <span className={`font-bold ${activeBank.verified ? 'text-emerald-400' : 'text-red-400'}`}>
                  {activeBank.verified ? 'Cleared & Approved' : 'Sanction Blocked'}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-semibold">Risk Classification:</span>
                <span className="text-white font-bold">
                  {activeBank.verified ? 'Low (Institutional)' : 'Strict Sanction Watch'}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-semibold">Security review date:</span>
                <span className="text-[#C5A880] font-bold italic font-serif">Q3 2026</span>
              </div>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>

      {/* Grid: Charts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Chart Canvas Card */}
        <ScrollReveal className="lg:col-span-2" delay={0.1} yOffset={25}>
          <motion.div 
            whileHover={{ y: -4, scale: 1.005, borderColor: "rgba(255, 255, 255, 0.16)", boxShadow: "0 12px 30px -10px rgba(0,0,0,0.3)" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="bg-black/45 backdrop-blur-xl border border-white/8 rounded-xl p-8 shadow-lg cursor-pointer"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h2 className="text-lg font-serif font-bold tracking-tight text-white">Cash Flow Velocity</h2>
              
              <div className="flex gap-1 bg-white/5 border border-white/10 p-1 rounded-lg">
                <button 
                  onClick={() => setChartType('both')}
                  className={`text-[10px] uppercase tracking-wider px-3 py-1 rounded-md font-bold transition-all ${chartType === 'both' ? 'bg-white/15 text-white border border-white/10 shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setChartType('inflows')}
                  className={`text-[10px] uppercase tracking-wider px-3 py-1 rounded-md font-bold transition-all ${chartType === 'inflows' ? 'bg-white/15 text-white border border-white/10 shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  Inflows
                </button>
                <button 
                  onClick={() => setChartType('outflows')}
                  className={`text-[10px] uppercase tracking-wider px-3 py-1 rounded-md font-bold transition-all ${chartType === 'outflows' ? 'bg-white/15 text-white border border-white/10 shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  Outflows
                </button>
              </div>
            </div>

            <div className="h-68 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorInflows" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C5A880" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#C5A880" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOutflows" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#FFFFFF" strokeOpacity={0.06} strokeDasharray="4 4" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#A0A0A5" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false} 
                    tickMargin={8}
                  />
                  <YAxis 
                    stroke="#A0A0A5" 
                    fontSize={10} 
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `$${val/1000}k`}
                    tickMargin={8}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(20, 20, 23, 0.95)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: '10px', 
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontFamily: 'Inter, sans-serif'
                    }}
                    itemStyle={{ color: '#FFFFFF' }}
                    labelStyle={{ color: '#C5A880', fontWeight: 'bold' }}
                    formatter={(val: number) => [formatValue(val), '']}
                  />
                  {(chartType === 'both' || chartType === 'inflows') && (
                    <Area 
                      type="monotone" 
                      dataKey="inflows" 
                      stroke="#C5A880" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorInflows)" 
                      name="Inflow Velocity"
                    />
                  )}
                  {(chartType === 'both' || chartType === 'outflows') && (
                    <Area 
                      type="monotone" 
                      dataKey="outflows" 
                      stroke="rgba(255,255,255,0.7)" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorOutflows)" 
                      name="Outflow Velocity"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </ScrollReveal>

        {/* Recent Activity Card list */}
        <ScrollReveal delay={0.2} yOffset={25}>
          <motion.div 
            whileHover={{ y: -4, scale: 1.005, borderColor: "rgba(255, 255, 255, 0.16)", boxShadow: "0 12px 30px -10px rgba(0,0,0,0.3)" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="h-full bg-black/45 backdrop-blur-xl border border-white/8 rounded-xl p-8 shadow-lg flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between border-b border-white/8 pb-4 mb-5">
                <h2 className="text-base font-serif font-bold text-white">Recent Activity</h2>
                <button 
                  id="view-all-activity-link"
                  onClick={onViewAllTransactions}
                  className="text-xs font-semibold uppercase tracking-wider text-[#C5A880] hover:underline cursor-pointer"
                >
                  View Ledger
                </button>
              </div>

              <StaggerContainer className="space-y-4">
                {recentTransactions.map((tx) => {
                  const isNegative = tx.amount < 0;
                  
                  // Decide icon based on category
                  let Icon = ShoppingBag;
                  if (tx.category === 'Income') Icon = ArrowDownCircle;
                  else if (tx.category === 'Travel') Icon = Plane;
                  else if (tx.category === 'Investment') Icon = Coins;

                  return (
                    <StaggerItem key={tx.id}>
                      <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            isNegative ? 'bg-white/5 text-slate-300' : 'bg-white/10 text-[#C5A880] border border-[#C5A880]/20'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-white truncate">{tx.merchant}</p>
                            <span className="text-[10px] text-[#C5A880] font-extrabold uppercase tracking-wide">{tx.category}</span>
                          </div>
                        </div>

                        <p className={`text-xs font-bold font-serif shrink-0 ${
                          isNegative ? 'text-slate-300' : 'text-[#C5A880]'
                        }`}>
                          {isNegative ? '-' : '+'}${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-start gap-2 text-[10px] text-[#C5A880] font-medium leading-relaxed bg-white/5 p-3 rounded-lg border border-white/8">
              <Coins className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
              <span>Telemetry logged secure on-chain. Dynamic cryptographic updates subscribed automatically.</span>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </div>
  );
}
