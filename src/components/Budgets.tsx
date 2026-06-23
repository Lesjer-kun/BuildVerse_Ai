import React, { useState, useRef } from 'react';
import { 
  Building2, 
  Plane, 
  Utensils, 
  FileText, 
  Wallet, 
  CheckCircle, 
  Sparkles,
  ChevronDown,
  Pencil,
  Trash2,
  X,
  Save
} from 'lucide-react';
import { RWAAsset } from '../types';
import toast from 'react-hot-toast';
import { ScrollReveal, StaggerContainer, StaggerItem } from './ScrollReveal';

interface BudgetsProps {
  assets: RWAAsset[];
  onAddAsset: (name: string, limit: number, timePeriod: 'Monthly' | 'Quarterly' | 'Yearly', spent: number) => void;
  onUpdateAsset?: (id: string, updatedFields: Partial<RWAAsset>) => void;
  onDeleteAsset?: (id: string) => void;
}

export default function Budgets({ assets, onAddAsset, onUpdateAsset, onDeleteAsset }: BudgetsProps) {
  const [newName, setNewName] = useState('');
  const [newLimit, setNewLimit] = useState('');
  const [newSpent, setNewSpent] = useState('');
  const [newPeriod, setNewPeriod] = useState<'Monthly' | 'Quarterly' | 'Yearly'>('Monthly');

  // Edit mode states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editLimit, setEditLimit] = useState('');
  const [editSpent, setEditSpent] = useState('');
  const [editPeriod, setEditPeriod] = useState<'Monthly' | 'Quarterly' | 'Yearly'>('Monthly');

  // Delete verification state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Custom dropdown states
  const [isCreatePeriodDropdownOpen, setIsCreatePeriodDropdownOpen] = useState(false);
  const [isEditPeriodDropdownOpen, setIsEditPeriodDropdownOpen] = useState(false);

  const categoryNameInputRef = useRef<HTMLInputElement>(null);

  // Focus input when "Create New Budget" is clicked
  const handleFocusNewBudget = () => {
    categoryNameInputRef.current?.focus();
    categoryNameInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const startEditing = (item: RWAAsset) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditLimit(item.limit.toString());
    setEditSpent(item.spent.toString());
    setEditPeriod(item.timePeriod);
    setIsEditPeriodDropdownOpen(false);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsEditPeriodDropdownOpen(false);
  };

  const handleSaveEdit = (id: string) => {
    setIsEditPeriodDropdownOpen(false);
    if (!editName.trim() || !editLimit || !editSpent) {
      toast.error("Please fill in all fields.");
      return;
    }
    const limitNum = parseFloat(editLimit);
    const spentNum = parseFloat(editSpent);
    if (isNaN(limitNum) || limitNum <= 0) {
      toast.error("Limit must be a positive number.");
      return;
    }
    if (isNaN(spentNum) || spentNum < 0) {
      toast.error("Spent amount must be a positive number.");
      return;
    }

    if (onUpdateAsset) {
      onUpdateAsset(id, {
        name: editName.trim(),
        limit: limitNum,
        spent: spentNum,
        timePeriod: editPeriod
      });
      toast.success("Budget allocation updated!");
    }
    setEditingId(null);
  };

  // Submit allocation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newLimit) {
      toast.error("Please enter a category name and limit amount.");
      return;
    }
    const limitNum = parseFloat(newLimit);
    if (isNaN(limitNum) || limitNum <= 0) {
      toast.error("Limit must be a positive number.");
      return;
    }
    const spentNum = newSpent === '' ? 0 : parseFloat(newSpent);
    if (isNaN(spentNum) || spentNum < 0) {
      toast.error("Starting spent amount must be 0 or dynamic positive value.");
      return;
    }

    onAddAsset(newName.trim(), limitNum, newPeriod, spentNum);
    setNewName('');
    setNewLimit('');
    setNewSpent('');
    toast.success(`Initialized digital allocation: ${newName}`);
  };

  // Calculate totals for metadata cards
  const totalAllocation = assets.reduce((sum, item) => sum + item.limit, 0);
  const totalSpent = assets.reduce((sum, item) => sum + item.spent, 0);
  const utilizationPercent = totalAllocation > 0 ? (totalSpent / totalAllocation) * 100 : 0;

  // Render appropriate category icon with high-contrast luxury pairing
  const getCategoryIcon = (name: string) => {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes('house') || lowercaseName.includes('property') || lowercaseName.includes('corporate')) {
      return <Building2 className="w-4 h-4 text-[#C5A880]" />;
    } else if (lowercaseName.includes('travel') || lowercaseName.includes('flight') || lowercaseName.includes('executive')) {
      return <Plane className="w-4 h-4 text-slate-300" />;
    } else if (lowercaseName.includes('dining') || lowercaseName.includes('food') || lowercaseName.includes('client')) {
      return <Utensils className="w-4 h-4 text-white" />;
    }
    return <FileText className="w-4 h-4 text-slate-400" />;
  };

  // Status-based label mapping for flags with fine border colors
  const getStatusLabelColorClass = (item: RWAAsset) => {
    const percent = item.limit > 0 ? (item.spent / item.limit) * 100 : 0;
    if (percent >= 100) return 'text-red-400 bg-red-500/15 border-red-500/30';
    if (percent >= 75) return 'text-white bg-white/10 border-white/20';
    if (percent > 0) return 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
    return 'text-slate-300 bg-white/5 border-white/10';
  };

  return (
    <div className="space-y-8 animate-fade-in text-white">
      
      {/* Upper header section */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-white/8 pb-6">
        <div>
          <h1 className="text-4xl font-serif font-bold italic tracking-tight text-white">Allocations</h1>
          <p className="text-sm text-slate-300 font-medium mt-1 max-w-2xl leading-relaxed">
            Configure, deploy, and monitor multi-node asset velocity across fully verified institutional sub-accounts.
          </p>
        </div>

        {/* Create new budget button for boutique feel */}
        <button
          onClick={handleFocusNewBudget}
          id="budgets-create-new-btn"
          className="bg-[#C5A880] hover:bg-[#b5956a] text-black font-extrabold text-xs py-3 px-5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer uppercase tracking-[0.14em] shadow-lg border border-white/10"
        >
          <span>+</span> Create New Budget
        </button>
      </div>

      {/* Metric Cards Banner of Budgets Page */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Metric 1 */}
        <ScrollReveal delay={0.05} yOffset={25}>
          <div className="bg-black/45 backdrop-blur-xl border border-white/8 rounded-xl p-6.5 flex flex-col justify-between shadow-lg">
            <p className="text-[10px] font-extrabold text-[#C5A880] uppercase tracking-[0.25em]">Total Capital Allocation</p>
            <div className="flex items-baseline justify-between mt-4">
              <span className="text-3xl font-serif font-bold text-white">
                ${totalAllocation.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[9px] font-extrabold tracking-widest uppercase bg-emerald-500/15 text-emerald-400 px-2.5 py-1 rounded border border-emerald-500/30">
                Active Fund
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* Metric 2 */}
        <ScrollReveal delay={0.15} yOffset={25}>
          <div className="bg-black/45 backdrop-blur-xl border border-white/8 rounded-xl p-6.5 flex flex-col justify-between shadow-lg">
            <p className="text-[10px] font-extrabold text-[#C5A880] uppercase tracking-[0.25em]">Total Capital Velocity (Spent)</p>
            <div className="flex items-baseline justify-between mt-4">
              <span className="text-3xl font-serif font-bold text-white">
                ${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[9px] font-extrabold tracking-widest uppercase bg-white/10 text-[#C5A880] px-2.5 py-1 rounded border border-white/10">
                {utilizationPercent.toFixed(1)}% Velocity
              </span>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Main Grid: Active Categories List vs Initialize Parameter panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Active Categories Column */}
        <div className="lg:col-span-7 space-y-5">
          <h2 className="text-[10px] font-extrabold text-[#C5A880] uppercase tracking-[0.25em] mb-2">Category Portfolios</h2>
          
          <StaggerContainer className="space-y-4">
            {assets.map((item) => {
              const utilizedPercent = item.limit > 0 ? (item.spent / item.limit) * 100 : 0;
              const labelStyle = getStatusLabelColorClass(item);

              return (
                <StaggerItem key={item.id}>
                  <div className="bg-black/45 backdrop-blur-md border border-white/8 rounded-xl p-5 hover:border-[#C5A880]/30 transition-all duration-200 shadow-md">
                    {editingId === item.id ? (
                      /* EDIT MODE */
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                          <h3 className="text-xs font-extrabold text-[#C5A880] uppercase tracking-wider">Edit Allocation</h3>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleSaveEdit(item.id)}
                              className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold hover:bg-emerald-500/25 text-[10px] py-1.5 px-3 rounded-lg transition-all cursor-pointer uppercase tracking-wider flex items-center gap-1.5"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Save</span>
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 font-bold text-[10px] py-1.5 px-3 rounded-lg transition-all cursor-pointer uppercase tracking-wider flex items-center gap-1.5"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Cancel</span>
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
                              Category Name
                            </label>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 focus:border-[#C5A880] focus:outline-none rounded-lg py-2 px-3 text-xs text-white"
                            />
                          </div>

                          <div className="relative">
                            <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
                              Frequency
                            </label>
                            <button
                              type="button"
                              onClick={() => setIsEditPeriodDropdownOpen(!isEditPeriodDropdownOpen)}
                              className="w-full text-left bg-white/5 border border-white/10 hover:bg-white/10 focus:border-[#C5A880] focus:outline-none rounded-lg py-2 px-3 text-xs text-white cursor-pointer flex items-center justify-between"
                            >
                              <span>{editPeriod} Cycle</span>
                              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isEditPeriodDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isEditPeriodDropdownOpen && (
                              <>
                                <div 
                                  className="fixed inset-0 z-45" 
                                  onClick={() => setIsEditPeriodDropdownOpen(false)} 
                                />
                                <div className="absolute left-0 right-0 mt-1 bg-[#141416] border border-white/12 rounded-lg shadow-2xl z-50 py-1 animate-fade-in origin-top">
                                  {(['Monthly', 'Quarterly', 'Yearly'] as const).map((period) => {
                                    const isSelected = editPeriod === period;
                                    return (
                                      <button
                                        key={period}
                                        type="button"
                                        onClick={() => {
                                          setEditPeriod(period);
                                          setIsEditPeriodDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-3 py-1.5 text-[11px] flex items-center justify-between transition-all cursor-pointer ${
                                          isSelected 
                                            ? 'bg-[#C5A880]/15 text-[#C5A880] font-bold' 
                                            : 'text-white hover:bg-white/5 hover:text-[#C5A880]'
                                        }`}
                                      >
                                        <span>{period} Cycle</span>
                                        {isSelected && <span className="w-1 h-1 rounded-full bg-[#C5A880]" />}
                                      </button>
                                    );
                                  })}
                                </div>
                              </>
                            )}
                          </div>

                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
                              Limit Value ($)
                            </label>
                            <input
                              type="number"
                              value={editLimit}
                              onChange={(e) => setEditLimit(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 focus:border-[#C5A880] focus:outline-none rounded-lg py-2 px-3 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
                              Spent Value ($)
                            </label>
                            <input
                              type="number"
                              value={editSpent}
                              onChange={(e) => setEditSpent(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 focus:border-[#C5A880] focus:outline-none rounded-lg py-2 px-3 text-xs text-white"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* VIEW MODE */
                      <>
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                              {getCategoryIcon(item.name)}
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-white tracking-tight">{item.name}</h3>
                              <p className="text-[10px] text-[#C5A880] font-extrabold uppercase mt-0.5 tracking-wider">{item.timePeriod}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4.5">
                            <div className="text-right">
                              <p className="text-sm font-serif font-bold text-white">
                                ${item.spent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </p>
                              <p className="text-[10px] text-slate-300 font-medium">
                                of ${item.limit.toLocaleString('en-US', { minimumFractionDigits: 0 })} limit
                              </p>
                            </div>

                            {/* Actions Inline */}
                            <div className="flex items-center gap-1 border border-white/10 bg-white/5 rounded-lg p-1">
                              {deleteConfirmId === item.id ? (
                                <div className="flex items-center gap-1 px-1">
                                  <button
                                    onClick={() => {
                                      if (onDeleteAsset) {
                                        onDeleteAsset(item.id);
                                        toast.success("Budget allocation deleted.");
                                      }
                                      setDeleteConfirmId(null);
                                    }}
                                    className="bg-red-500/20 text-red-400 hover:bg-red-500/35 px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide transition-colors cursor-pointer"
                                  >
                                    Sure?
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="text-slate-400 hover:text-white px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <button
                                    onClick={() => startEditing(item)}
                                    className="hover:bg-white/10 p-1.5 rounded text-slate-300 hover:text-[#C5A880] transition-colors cursor-pointer"
                                    title="Edit Budget Parameters"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirmId(item.id)}
                                    className="hover:bg-red-500/10 p-1.5 rounded text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                                    title="Delete Budget"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Progress Slider Track with glowing indicator */}
                        <div className="space-y-2 mt-4">
                          <div className="w-full h-1.5 bg-white/5 border border-white/10 rounded-full overflow-hidden relative">
                            <div 
                              style={{ width: `${Math.min(utilizedPercent, 100)}%` }}
                              className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-[#C5A880] to-white"
                            />
                          </div>
                          
                          <div className="flex items-center justify-between text-[11px] font-semibold">
                            <span className="text-slate-300">
                              {utilizedPercent.toFixed(1)}% Portfolio Spent
                            </span>
                            <span className={`px-2 py-0.5 rounded border text-[10px] uppercase font-bold tracking-wider ${labelStyle}`}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>

        {/* Initialize Parameter New Allocation Column */}
        <ScrollReveal className="lg:col-span-5" delay={0.2} yOffset={25}>
          <div className="bg-black/55 backdrop-blur-xl border border-white/8 rounded-xl p-6.5 shadow-xl relative overflow-hidden text-white">
            
            {/* Design header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                <Wallet className="w-4 h-4 text-[#C5A880]" />
              </div>
              <div>
                <h3 className="text-sm font-serif font-bold text-white tracking-wide animate-pulse">Initialize Allocation</h3>
                <p className="text-[10px] text-slate-300 font-medium leading-normal">Deploy new capital boundary triggers.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-[10px] font-extrabold text-[#C5A880] uppercase tracking-[0.2em] mb-2">
                  Category Name
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-[#C5A880]/70">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <input
                    ref={categoryNameInputRef}
                    id="allocation-name-input"
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Real Estate Development"
                    className="w-full bg-white/5 border border-white/10 focus:border-[#C5A880] focus:outline-none rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder-slate-400 transition-colors"
                  />
                </div>
              </div>

              {/* Limit */}
              <div>
                <label className="block text-[10px] font-extrabold text-[#C5A880] uppercase tracking-[0.2em] mb-2">
                  Maximum Limit Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2 text-sm text-white font-bold">$</span>
                  <input
                    id="allocation-limit-input"
                    type="number"
                    value={newLimit}
                    onChange={(e) => setNewLimit(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-white/10 focus:border-[#C5A880] focus:outline-none rounded-lg py-3 pl-8 pr-4 text-sm text-white placeholder-slate-400 font-serif transition-colors"
                  />
                </div>
              </div>

              {/* Spent amount (Starting value of budget) */}
              <div>
                <label className="block text-[10px] font-extrabold text-[#C5A880] uppercase tracking-[0.2em] mb-2">
                  Initial Spent Amount (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2 text-sm text-white font-bold">$</span>
                  <input
                    id="allocation-spent-input"
                    type="number"
                    value={newSpent}
                    onChange={(e) => setNewSpent(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-white/10 focus:border-[#C5A880] focus:outline-none rounded-lg py-3 pl-8 pr-4 text-sm text-white placeholder-slate-400 font-serif transition-colors"
                  />
                </div>
              </div>

              {/* Time Period Dropdown */}
              <div className="relative">
                <label className="block text-[10px] font-extrabold text-[#C5A880] uppercase tracking-[0.2em] mb-2">
                  Allocation Frequency
                </label>
                <button
                  type="button"
                  id="allocation-period-dropdown-btn"
                  onClick={() => setIsCreatePeriodDropdownOpen(!isCreatePeriodDropdownOpen)}
                  className="w-full text-left bg-[#101012] border border-white/10 hover:bg-white/5 focus:border-[#C5A880] focus:outline-none rounded-lg py-3 px-4 text-sm text-white cursor-pointer flex items-center justify-between"
                >
                  <span>{newPeriod} Cycle</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-205 ${isCreatePeriodDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCreatePeriodDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsCreatePeriodDropdownOpen(false)} 
                    />
                    <div className="absolute left-0 right-0 mt-2 bg-[#141416] border border-white/10 rounded-lg shadow-2xl z-50 py-1.5 animate-fade-in origin-top">
                      {(['Monthly', 'Quarterly', 'Yearly'] as const).map((period) => {
                        const isSelected = newPeriod === period;
                        return (
                          <button
                            key={period}
                            type="button"
                            onClick={() => {
                              setNewPeriod(period);
                              setIsCreatePeriodDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between transition-all cursor-pointer ${
                              isSelected 
                                ? 'bg-[#C5A880]/15 text-[#C5A880] font-bold' 
                                : 'text-white hover:bg-white/5 hover:text-[#C5A880]'
                            }`}
                          >
                            <span>{period} Cycle</span>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Action Button */}
              <button
                id="allocation-submit-btn"
                type="submit"
                className="w-full bg-[#C5A880] hover:bg-[#b5956a] text-black font-extrabold text-xs py-3.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer uppercase tracking-wider shadow-lg border border-white/10"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Initialize Parameter</span>
              </button>
            </form>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}
