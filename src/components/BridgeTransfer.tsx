import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  CheckCircle2, 
  XSquare,
  Sparkles,
  Link2,
  ChevronDown
} from 'lucide-react';
import { RWAAsset, BankNode } from '../types';
import { getInstitutionName } from '../services/blockchain_mock';
import toast from 'react-hot-toast';
import { ScrollReveal } from './ScrollReveal';

interface BridgeTransferProps {
  assets: RWAAsset[];
  banks: BankNode[];
  onExecuteTransfer: (assetId: string, toAddress: string, amount: number) => { success: boolean; message: string };
}

export default function BridgeTransfer({ assets, banks, onExecuteTransfer }: BridgeTransferProps) {
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<{ success: boolean; message: string; to: string } | null>(null);
  const [isAssetDropdownOpen, setIsAssetDropdownOpen] = useState(false);

  // Filter verified nodes for quick selector options inside input
  const testComplianceDestinations = banks.filter(b => b.verified);
  const testBlockedDestinations = banks.filter(b => !b.verified);

  const handleSelectQuickDest = (address: string) => {
    setRecipientAddress(address);
    setLastResult(null);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId) {
      toast.error("Please select an active budget category asset to bridge.");
      return;
    }
    if (!recipientAddress.trim()) {
      toast.error("Please specify an institutional node receiver address.");
      return;
    }
    
    // Validate amount
    const amt = parseFloat(transferAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid bridge transfer valuation.");
      return;
    }

    const selectedAsset = assets.find(a => a.id === selectedAssetId);
    if (!selectedAsset) return;

    if (selectedAsset.limit < amt) {
      toast.error(`Transfer amount exceeds maximum budget limit in "${selectedAsset.name}". Max transferable: $${selectedAsset.limit.toLocaleString()}`);
      return;
    }

    setIsProcessing(true);
    setLastResult(null);

    // Simulate smart contract wait time for verification proof processing
    setTimeout(() => {
      const response = onExecuteTransfer(selectedAssetId, recipientAddress.trim(), amt);
      setIsProcessing(false);
      setLastResult({
        success: response.success,
        message: response.message,
        to: recipientAddress.trim()
      });

      if (response.success) {
        toast.success("Bridge execution validated!");
        // Clear fields
        setTransferAmount('');
        setSelectedAssetId('');
         setRecipientAddress('');
      } else {
        toast.error("Transfer Blocked by Smart Security Guardian.");
      }
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in text-white max-w-4xl mx-auto">
      {/* Page Title */}
      <div className="border-b border-white/8 pb-6">
        <h1 className="text-4xl font-serif font-bold italic tracking-tight text-white">Compliance Bridge</h1>
        <p className="text-sm text-slate-300 font-medium mt-1">
          Zero-knowledge compliance sandbox validating and clearing institutional tokenized assets cross-border.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left column: Form */}
        <ScrollReveal delay={0.05} yOffset={25}>
          <div className="bg-black/45 backdrop-blur-md border border-white/8 rounded-xl p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A880]/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/8">
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                <ArrowRightLeft className="w-4 h-4 text-[#C5A880]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">Initiate Gateway Route</h3>
                <p className="text-[10px] text-[#C5A880] font-extrabold uppercase mt-0.5 tracking-wider">Dynamic Node Integrity Check</p>
              </div>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-5">
              {/* Asset NFT Selector */}
              <div className="relative">
                <label className="block text-[10px] font-extrabold text-[#C5A880] uppercase tracking-[0.2em] mb-2">
                  Select Tokenized Asset Allocation
                </label>
                <button
                  type="button"
                  id="bridge-asset-selector-btn"
                  onClick={() => setIsAssetDropdownOpen(!isAssetDropdownOpen)}
                  className="w-full text-left bg-white/5 border border-white/10 hover:bg-white/10 focus:border-[#C5A880] focus:outline-none rounded-lg py-3 px-4 text-sm text-white cursor-pointer flex items-center justify-between"
                >
                  {assets.find(a => a.id === selectedAssetId) ? (
                    <span>
                      {assets.find(a => a.id === selectedAssetId)?.name} <span className="text-[10px] text-[#C5A880] font-bold font-mono ml-2">(Val: ${assets.find(a => a.id === selectedAssetId)?.spent.toLocaleString()} / Lim: ${assets.find(a => a.id === selectedAssetId)?.limit.toLocaleString()})</span>
                    </span>
                  ) : (
                    <span className="text-slate-400">Select portfolio allocation asset...</span>
                  )}
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isAssetDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isAssetDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsAssetDropdownOpen(false)} 
                    />
                    <div className="absolute left-0 right-0 mt-2 bg-[#141416]/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl z-50 py-1.5 animate-fade-in origin-top">
                      {assets.length === 0 ? (
                        <div className="px-4 py-3 text-xs text-slate-400">
                          No active budget allocation assets found.
                        </div>
                      ) : (
                        assets.map((asset) => {
                          const isSelected = asset.id === selectedAssetId;
                          return (
                            <button
                              key={asset.id}
                              type="button"
                              onClick={() => {
                                setSelectedAssetId(asset.id);
                                setLastResult(null);
                                setIsAssetDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between transition-all cursor-pointer ${
                                isSelected 
                                  ? 'bg-[#C5A880]/15 text-[#C5A880] font-bold' 
                                  : 'text-white hover:bg-white/5 hover:text-[#C5A880]'
                              }`}
                            >
                              <div className="flex flex-col">
                                <span className="font-semibold">{asset.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                                  Current Value: ${asset.spent.toLocaleString()} | Allocation Limit: ${asset.limit.toLocaleString()}
                                </span>
                              </div>
                              {isSelected && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Transferrable Value */}
              <div>
                <label className="block text-[10px] font-extrabold text-[#C5A880] uppercase tracking-[0.2em] mb-2">
                  Transfer Bridge Valuation
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-sm text-white font-bold">$</span>
                  <input
                    id="bridge-amount-input"
                    type="number"
                    value={transferAmount}
                    onChange={(e) => {
                      setTransferAmount(e.target.value);
                      setLastResult(null);
                    }}
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-white/10 focus:border-[#C5A880] focus:outline-none rounded-lg py-3 pl-8 pr-4 text-sm text-white placeholder-slate-400 font-serif"
                  />
                </div>
              </div>

              {/* Recipient node address prefix */}
              <div>
                <label className="block text-[10px] font-extrabold text-[#C5A880] uppercase tracking-[0.2em] mb-2">
                  Destination Node Address
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-slate-400">
                    <Link2 className="w-4 h-4" />
                  </span>
                  <input
                    id="bridge-recipient-input"
                    type="text"
                    value={recipientAddress}
                    onChange={(e) => {
                      setRecipientAddress(e.target.value);
                      setLastResult(null);
                    }}
                    placeholder="0x..."
                    className="w-full bg-white/5 border border-white/10 focus:border-[#C5A880] focus:outline-none rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder-slate-400 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Action submit button */}
              <button
                id="bridge-submit-btn"
                type="submit"
                disabled={isProcessing}
                className={`w-full py-3.5 rounded-lg font-extrabold text-xs select-none cursor-pointer transition-all duration-200 border uppercase tracking-widest ${
                  isProcessing 
                    ? 'bg-white/10 border-white/10 text-slate-400 cursor-not-allowed' 
                    : 'bg-[#C5A880] hover:bg-[#b5956a] border-transparent text-black shadow-lg'
                }`}
              >
                {isProcessing ? 'Verifying Zero-Knowledge Oracles...' : 'Authorize Vault Bridge Route'}
              </button>
            </form>
          </div>
        </ScrollReveal>

        {/* Right column: Info & Result Box */}
        <ScrollReveal className="space-y-6" delay={0.15} yOffset={25}>
          {/* Quick interactive test destinations */}
          <div className="bg-black/45 backdrop-blur-md border border-white/8 rounded-xl p-5 shadow-lg">
            <h4 className="text-[10px] font-extrabold text-[#C5A880] uppercase tracking-[0.2em] mb-2">Telemetry Test Scenarios</h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Simulate high-compliance zero-knowledge transfers directly into approved or restricted nodes.
            </p>

            <div className="space-y-4">
              <div>
                <span className="text-[9px] text-[#C5A880] uppercase font-bold tracking-widest mb-1.5 block">Approved Institutional Node Addresses</span>
                <div className="flex flex-col gap-2">
                  {testComplianceDestinations.map(node => (
                    <button
                      key={node.address}
                      type="button"
                      id={`dest-selector-verified-${node.avatarSeed}`}
                      onClick={() => handleSelectQuickDest(node.address)}
                      className="w-full flex items-center justify-between text-left p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      <div className="overflow-hidden pr-2">
                        <p className="font-bold text-white text-sm">{node.name}</p>
                        <p className="font-mono text-slate-400 text-[10px] truncate max-w-[200px]">
                          {node.address}
                        </p>
                      </div>
                      <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 shrink-0 select-none uppercase tracking-wider">
                        Whitelisted
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[9px] text-red-400 uppercase font-bold tracking-widest mb-1.5 block">Sanctions Registry Restrained Node</span>
                <div className="flex flex-col gap-2">
                  {testBlockedDestinations.map(node => (
                    <button
                      key={node.address}
                      type="button"
                      id={`dest-selector-blocked-${node.avatarSeed}`}
                      onClick={() => handleSelectQuickDest(node.address)}
                      className="w-full flex items-center justify-between text-left p-2.5 bg-white/5 hover:bg-red-500/10 border border-red-500/20 text-xs transition-colors cursor-pointer"
                    >
                      <div className="overflow-hidden pr-2">
                        <p className="font-bold text-white text-sm">{node.name}</p>
                        <p className="font-mono text-slate-400 text-[10px] truncate max-w-[200px]">
                          {node.address}
                        </p>
                      </div>
                      <span className="text-[9px] font-bold text-red-400 bg-red-500/10 px-2.5 py-1 rounded border border-red-500/20 shrink-0 select-none uppercase tracking-wider">
                        Blocked
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Transfer feedback alerts popup! */}
          {lastResult && (
            <div className={`rounded-xl p-6 border text-center relative overflow-hidden transform duration-300 ${
              lastResult.success 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
                : 'bg-red-500/10 border-red-500/20 text-red-300'
            }`}>
              
              {lastResult.success ? (
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-1 text-emerald-400 border border-emerald-500/25">
                    <CheckCircle2 className="w-5 h-5 animate-pulse" />
                  </div>
                  <h4 className="text-base font-serif font-bold tracking-tight text-white">Vault Route Approved</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Zero-Knowledge AML compliance proof returned positive validation. Settlement broadcast.
                  </p>
                  <div className="border-t border-white/10 pt-3 mt-4 text-[11px] font-bold text-slate-300 flex justify-between">
                    <span>Receiver Node:</span>
                    <span className="text-[#C5A880] font-mono">{getInstitutionName(lastResult.to)}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-1 text-red-400 border border-red-500/25">
                    <XSquare className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-serif font-bold tracking-tight text-red-400">Vault Blocked by Sanction Policy</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Compliance registry check failed for <span className="text-red-400 font-bold">({getInstitutionName(lastResult.to)})</span>. 
                    Asset settlement blocked to protect against illegal fund velocity and AML breaches.
                  </p>
                  <div className="border-t border-red-500/20 pt-3 mt-4 text-[11px] font-bold text-slate-300 flex justify-between">
                    <span>Audit Status:</span>
                    <span className="text-red-400 uppercase font-bold tracking-wider text-[10px]">Registry Blacklist</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollReveal>
      </div>
    </div>
  );
}
