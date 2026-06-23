import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserPlus
} from 'lucide-react';
import { BankNode } from '../types';
import toast from 'react-hot-toast';
import { ScrollReveal } from './ScrollReveal';

interface ComplianceRegistryProps {
  banks: BankNode[];
  onToggleVerification: (address: string) => void;
  onAddNewNode: (address: string, name: string, location: string) => void;
}

export default function ComplianceRegistry({ 
  banks, 
  onToggleVerification, 
  onAddNewNode 
}: ComplianceRegistryProps) {
  const [newNodeAddress, setNewNodeAddress] = useState('');
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodeLoc, setNewNodeLoc] = useState('');

  const handleCreateNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeAddress.trim() || !newNodeName.trim() || !newNodeLoc.trim()) {
      toast.error("Please fill in all node information fields.");
      return;
    }
    if (!newNodeAddress.startsWith('0x') || newNodeAddress.length !== 42) {
      toast.error("Please specify a valid 42-character Ethereum address (beginning with 0x).");
      return;
    }

    onAddNewNode(newNodeAddress.trim(), newNodeName.trim(), newNodeLoc.trim());
    setNewNodeAddress('');
    setNewNodeName('');
    setNewNodeLoc('');
    toast.success("Registered new active node placeholder. Verification set to standard compliant.");
  };

  return (
    <div className="space-y-6 animate-fade-in text-white max-w-4xl mx-auto">
      {/* Title block */}
      <div className="border-b border-white/8 pb-6">
        <h1 className="text-4xl font-serif font-bold italic tracking-tight text-white">Compliance Registrar</h1>
        <p className="text-sm text-slate-300 font-medium mt-1">
          Review, approve, or revoke real-time KYC/AML gateway permissions. Manage institutional whitelists.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Table list of bank nodes (7 cols) */}
        <ScrollReveal className="md:col-span-7" delay={0.05} yOffset={25}>
          <div className="bg-black/45 backdrop-blur-md border border-white/8 rounded-xl p-6 shadow-lg h-full">
            <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-white/8">
              <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
              <h2 className="text-[10px] font-extrabold text-[#C5A880] uppercase tracking-[0.25em]">Approved Gateway Whitelist</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/8 text-[9px] font-bold text-[#C5A880] uppercase tracking-wider select-none bg-white/5">
                    <th className="py-3 px-2">Institution Node</th>
                    <th className="py-3 px-4">Registry</th>
                    <th className="py-3 px-4 text-right">Sanction Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {banks.map((bank) => (
                    <tr key={bank.address} className="hover:bg-white/5 transition-colors">
                      {/* Institution */}
                      <td className="py-3.5 px-2 max-w-[170px]">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <img 
                            src={`https://api.dicebear.com/7.x/identicon/svg?seed=${bank.avatarSeed}`}
                            className="w-8 h-8 rounded-full bg-white/10 border border-white/10 shrink-0 p-0.5"
                          />
                          <div className="overflow-hidden">
                            <p className="font-bold text-white whitespace-nowrap truncate">{bank.name}</p>
                            <p className="text-[9px] text-slate-400 font-mono truncate">
                              {bank.address}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Status Cleared vs Suspended */}
                      <td className="py-3.5 px-4 font-bold uppercase text-[9px] tracking-wider">
                        {bank.verified ? (
                          <span className="text-[9px] px-2.5 py-1 rounded font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                            Verified
                          </span>
                        ) : (
                          <span className="text-[9px] px-2.5 py-1 rounded font-bold bg-red-500/10 text-red-400 border border-red-500/25">
                            Sanctioned
                          </span>
                        )}
                      </td>

                      {/* Click item to toggle on-chain permissions state */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onToggleVerification(bank.address)}
                          id={`toggle-compliance-${bank.avatarSeed}`}
                          className={`text-[9px] font-extrabold uppercase tracking-widest py-1.5 px-3 rounded border select-none cursor-pointer transition-colors duration-150 ${
                            bank.verified 
                              ? 'bg-red-500/10 hover:bg-red-500/25 border-red-500/25 text-red-400' 
                              : 'bg-emerald-500/10 hover:bg-emerald-500/25 border-emerald-500/25 text-emerald-400'
                          }`}
                        >
                          {bank.verified ? 'Revoke KYC' : 'Verify KYC'}
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>

        {/* Add node administrator (5 cols) */}
        <ScrollReveal className="md:col-span-5" delay={0.15} yOffset={25}>
          <div className="bg-black/55 backdrop-blur-xl border border-white/8 rounded-xl p-6 shadow-xl text-white h-full">
            <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-white/10">
              <UserPlus className="w-4 h-4 text-[#C5A880]" />
              <div>
                <h2 className="text-sm font-serif font-bold text-white tracking-tight">Register External Node</h2>
                <p className="text-[10px] text-slate-300 mt-0.5">Deploy companion on-chain settlement hooks.</p>
              </div>
            </div>

            <form onSubmit={handleCreateNode} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-[10px] font-extrabold text-[#C5A880] uppercase tracking-[0.2em] mb-2">
                  Institution Name
                </label>
                <input
                  id="registrar-name-input"
                  type="text"
                  value={newNodeName}
                  onChange={(e) => setNewNodeName(e.target.value)}
                  placeholder="e.g. BNP Paribas France"
                  className="w-full bg-white/5 border border-white/10 focus:border-[#C5A880] focus:outline-none rounded-lg py-2.5 px-4 text-xs text-white placeholder-slate-400"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-[10px] font-extrabold text-[#C5A880] uppercase tracking-[0.2em] mb-2">
                  Jurisdiction Location Range
                </label>
                <input
                  id="registrar-location-input"
                  type="text"
                  value={newNodeLoc}
                  onChange={(e) => setNewNodeLoc(e.target.value)}
                  placeholder="e.g. Paris (FR)"
                  className="w-full bg-white/5 border border-white/10 focus:border-[#C5A880] focus:outline-none rounded-lg py-2.5 px-4 text-xs text-white placeholder-slate-400"
                />
              </div>

              {/* Wallet Address */}
              <div>
                <label className="block text-[10px] font-extrabold text-[#C5A880] uppercase tracking-[0.2em] mb-2">
                  Cryptographic Node Wallet
                </label>
                <input
                  id="registrar-address-input"
                  type="text"
                  value={newNodeAddress}
                  onChange={(e) => setNewNodeAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-white/5 border border-white/10 focus:border-[#C5A880] focus:outline-none rounded-lg py-2.5 px-4 text-xs text-white placeholder-slate-400 font-mono"
                />
              </div>

              {/* Submit */}
              <button
                id="registrar-submit-btn"
                type="submit"
                className="w-full bg-[#C5A880] hover:bg-[#b5956a] text-black font-extrabold text-xs py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer uppercase tracking-wider border border-white/10 shadow-lg"
              >
                <UserPlus className="w-4 h-4 text-black" />
                <span>Register Node Registrar</span>
              </button>
            </form>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
