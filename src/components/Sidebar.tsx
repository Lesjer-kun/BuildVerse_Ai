import { 
  LayoutDashboard, 
  ReceiptText, 
  Wallet, 
  ArrowRightLeft, 
  ShieldCheck, 
  HelpCircle, 
  LogOut,
  Building2
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onAddTransactionClick: () => void;
}

export default function Sidebar({ 
  activeSection, 
  onSectionChange, 
  onAddTransactionClick 
}: SidebarProps) {
  
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ReceiptText },
    { id: 'budgets', label: 'Budgets', icon: Wallet },
    { id: 'bridge', label: 'RWA Bridge', icon: ArrowRightLeft },
    { id: 'compliance', label: 'Compliance', icon: ShieldCheck },
  ];

  return (
    <aside className="w-68 min-h-screen bg-black/45 backdrop-blur-xl border-r border-white/8 flex flex-col justify-between select-none shrink-0 fixed top-0 left-0 z-30">
      <div className="flex flex-col">
        {/* Logo block with dynamic editorial touches */}
        <div className="p-6 py-8 border-b border-white/8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shadow-sm">
            <Building2 className="w-5 h-5 text-[#C5A880]" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-black italic text-white tracking-tight">Cryptograph</h1>
            <p className="text-[10px] text-[#C5A880] font-extrabold uppercase tracking-[0.25em]">Institutional</p>
          </div>
        </div>
 
        {/* Navigation list */}
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-extrabold mt-8 px-8 mb-2">
          Navigation
        </p>
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-tab-${item.id}`}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl text-left font-semibold text-sm transition-all duration-300 group relative ${
                  isActive 
                    ? 'bg-white/10 text-white border border-white/10 shadow-md' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                {/* Active Indicator Strip on left side */}
                {isActive && (
                  <span className="absolute left-1.5 top-3.5 bottom-3.5 w-1 bg-[#C5A880] rounded-full" />
                )}
                
                <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-105 ${
                  isActive ? 'text-[#C5A880]' : 'text-slate-400 group-hover:text-white'
                }`} />
                <span className="tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
 
      {/* Bottom block */}
      <div className="p-6 border-t border-white/10 space-y-6">
        {/* Elegant Editorial Action Button: Solid Black and Cream Typography */}
        <button
          id="sidebar-add-transaction-btn"
          onClick={onAddTransactionClick}
          className="w-full bg-[#C5A880] hover:bg-[#bca078] text-black font-bold text-xs py-3.5 px-5 rounded-lg flex items-center justify-center gap-2 active:scale-98 transition-all duration-150 cursor-pointer uppercase tracking-[0.15em] shadow-md hover:shadow-lg"
        >
          <span>+</span> Add Transaction
        </button>
 
        <div className="space-y-1">
          <button
            onClick={() => alert("Connecting institutional support desk...")}
            className="w-full flex items-center gap-3 py-2 px-3 text-xs font-semibold text-slate-300 hover:text-white rounded-lg transition-colors duration-200"
          >
            <HelpCircle className="w-4 h-4 text-[#C5A880]" />
            <span>Support Desk</span>
          </button>
          
          <button
            onClick={() => alert("Signing out of secure channel...")}
            className="w-full flex items-center gap-3 py-2 px-3 text-xs font-semibold text-slate-300 hover:text-red-400 rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-4 h-4 text-red-500/80" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
