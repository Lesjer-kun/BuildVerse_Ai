import React, { useState } from 'react';
import { 
  Download, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ShoppingBag, 
  ArrowDownCircle, 
  Plane, 
  Coins, 
  FileText,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Transaction } from '../types';
import toast from 'react-hot-toast';
import { ScrollReveal } from './ScrollReveal';

interface TransactionsProps {
  transactions: Transaction[];
  onAddTransactionClick?: () => void;
}

export default function Transactions({ transactions, onAddTransactionClick }: TransactionsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // editorial layouts love breathing room and readable paging

  // Active filters for row selection
  const filterOptions = ['All', 'Groceries', 'Rent', 'Investment', 'Dining', 'Travel', 'Income'];

  // Excel/CSV downloader function
  const handleDownloadStatement = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Merchant,Date,Category,Status,Amount\n";

    transactions.forEach((tx) => {
      csvContent += `"${tx.id}","${tx.merchant}","${tx.date}","${tx.category}","${tx.status}",${tx.amount}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `aura_finance_statement_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Statement CSV generated and downloaded!");
  };

  // Filter & Search Logic
  const filtered = transactions.filter((tx) => {
    const matchesSearch = tx.merchant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategoryFilter === 'All' || tx.category === activeCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Pagination bounds
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = filtered.slice(startIndex, endIndex);

  // Grab icons with clean, elegant styling (muted editorial colors instead of high glow)
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Groceries': return <ShoppingBag className="w-4 h-4 text-[#C5A880]" />;
      case 'Income': return <ArrowDownCircle className="w-4 h-4 text-[#C5A880]" />;
      case 'Travel': return <Plane className="w-4 h-4 text-slate-300" />;
      case 'Investment': return <Coins className="w-4 h-4 text-white" />;
      default: return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-white">
      {/* Upper header action area */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-white/8 pb-6">
        <div>
          <h1 className="text-4xl font-serif font-bold italic tracking-tight text-white">Ledger</h1>
          <p className="text-sm text-slate-300 font-medium mt-1">
            Complete high-grain transaction history under institutional compliance verification.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {onAddTransactionClick && (
            <button
              onClick={onAddTransactionClick}
              id="transactions-add-tx-btn"
              className="bg-white/10 hover:bg-white/15 text-white text-xs font-bold py-3 px-5 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer uppercase tracking-[0.14em] shadow-lg border border-white/10"
            >
              <span>+ Add Transaction</span>
            </button>
          )}

          <button
            onClick={handleDownloadStatement}
            id="transactions-download-statement-btn"
            className="bg-[#C5A880] hover:bg-[#b5956a] text-black text-xs font-bold py-3 px-5 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer uppercase tracking-[0.14em] shadow-lg border border-white/10"
          >
            <Download className="w-4 h-4 text-black" />
            <span>Download Statement</span>
          </button>
        </div>
      </div>

      {/* Row: Search Bar & Filter Pills */}
      <ScrollReveal delay={0.05} yOffset={15}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black/35 backdrop-blur-md border border-white/8 p-4 rounded-xl">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3.5 top-3.5 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              id="transactions-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search records..."
              className="w-full bg-white/5 border border-white/10 focus:border-[#C5A880] focus:outline-none rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-400 transition-colors"
            />
          </div>

          {/* Filter Scrollable Section - Beautiful boutique pill tabs */}
          <div className="flex flex-wrap items-center gap-1.5 select-none">
            {filterOptions.slice(0, 5).map((opt) => {
              const isActive = activeCategoryFilter === opt;
              return (
                <button
                  key={opt}
                  id={`filter-pill-${opt}`}
                  onClick={() => {
                    setActiveCategoryFilter(opt);
                    setCurrentPage(1);
                  }}
                  className={`py-2 px-4 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'bg-white/15 text-white border border-white/15 shadow-md' 
                      : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </ScrollReveal>

      {/* Primary Ledger Table */}
      <ScrollReveal delay={0.15} yOffset={25}>
        <div className="bg-black/45 backdrop-blur-md border border-white/8 rounded-xl overflow-hidden shadow-lg">
          {totalItems === 0 ? (
            <div className="py-20 text-center text-slate-300 space-y-3">
              <Clock className="w-10 h-10 mx-auto text-[#C5A880]/60" />
              <p className="text-sm font-semibold italic font-serif">Empty transaction list.</p>
              <p className="text-xs text-slate-400">No records matching your search queries were located.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/8 text-[10px] font-bold text-[#C5A880] uppercase bg-white/5 py-2 select-none tracking-[0.2em]">
                    <th className="py-4.5 px-6">Merchant & Timestamp</th>
                    <th className="py-4.5 px-6">Asset Category</th>
                    <th className="py-4.5 px-6">Gate Status</th>
                    <th className="py-4.5 px-6 text-right">Settlement value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {currentItems.map((tx) => {
                    const isNegative = tx.amount < 0;
                    return (
                      <tr 
                        key={tx.id} 
                        className="hover:bg-white/5 transition-colors duration-150"
                      >
                        {/* Merchant & Date */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                              isNegative ? 'bg-white/5 text-slate-300' : 'bg-white/10 text-white border border-white/10'
                            }`}>
                              {getCategoryIcon(tx.category)}
                            </div>
                            <div>
                              <p className="font-bold text-white text-sm tracking-tight">{tx.merchant}</p>
                              <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase font-mono">{tx.date}</span>
                            </div>
                          </div>
                        </td>

                        {/* Category Badge Column */}
                        <td className="py-4 px-6">
                          <span className="bg-white/5 text-slate-300 text-xs font-bold py-1 px-3 rounded-md border border-white/10 uppercase tracking-wider">
                            {tx.category}
                          </span>
                        </td>

                        {/* Status Check dynamic rendering */}
                        <td className="py-4 px-6">
                          <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full py-1 px-3">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              tx.status === 'Completed' ? 'bg-emerald-500' : 
                              tx.status === 'Pending' ? 'bg-amber-500' : 'bg-red-500'
                            }`} />
                            <span className={`text-[11px] font-bold tracking-wider uppercase ${
                              tx.status === 'Completed' ? 'text-emerald-400' : 
                              tx.status === 'Pending' ? 'text-amber-400' : 'text-red-400'
                            }`}>
                              {tx.status}
                            </span>
                          </div>
                        </td>

                        {/* Value Display */}
                        <td className="py-4 px-6 text-right font-serif font-bold text-sm">
                          <span className={isNegative ? 'text-slate-300' : 'text-[#C5A880] font-extrabold'}>
                            {isNegative ? '-' : '+'}${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer info and page steering */}
          <div className="flex items-center justify-between border-t border-white/8 py-4.5 px-6 select-none bg-white/5">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Showing {totalItems === 0 ? 0 : startIndex + 1}—{endIndex} of {totalItems}
            </p>

            <div className="flex items-center gap-1.5">
              <button
                id="transactions-prev-page"
                onClick={() => setCurrentPage((c) => Math.max(c - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <button
                id="transactions-next-page"
                onClick={() => setCurrentPage((c) => Math.min(c + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
