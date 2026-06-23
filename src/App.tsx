import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Overview from './components/Overview';
import Budgets from './components/Budgets';
import Transactions from './components/Transactions';
import BridgeTransfer from './components/BridgeTransfer';
import ComplianceRegistry from './components/ComplianceRegistry';
import AddTransactionModal from './components/AddTransactionModal';

import { Transaction, RWAAsset, BankNode } from './types';
import { INITIAL_BANKS, INITIAL_TRANSACTIONS, INITIAL_ASSETS } from './utils/data';
import { getInstitutionName } from './services/blockchain_mock';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('overview');
  
  // Ledger Databases States
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [assets, setAssets] = useState<RWAAsset[]>(INITIAL_ASSETS);
  const [banks, setBanks] = useState<BankNode[]>(INITIAL_BANKS);
  
  // Active selected institution node
  const [activeBank, setActiveBank] = useState<BankNode>(INITIAL_BANKS[0]);

  // Modal Dialog toggle
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);

  // Switch institutional node switcher
  const handleBankNodeChange = (address: string) => {
    const selected = banks.find(b => b.address === address);
    if (selected) {
      setActiveBank(selected);
    }
  };

  // Switch tabs helper
  const handleSectionTabChange = (section: string) => {
    setActiveSection(section);
  };

  // Add customized Digital Allocation (Asset)
  const handleAddAsset = (
    name: string, 
    limit: number, 
    timePeriod: 'Monthly' | 'Quarterly' | 'Yearly', 
    spent: number = 0
  ) => {
    const percent = limit > 0 ? (spent / limit) * 100 : 0;
    let statusLabel: 'On Track' | 'Healthy' | 'Untouched' | 'Over Limit' = 'Healthy';
    if (percent >= 100) statusLabel = 'Over Limit';
    else if (percent >= 75) statusLabel = 'On Track';
    else if (percent > 0) statusLabel = 'Healthy';
    else statusLabel = 'Untouched';

    const newAsset: RWAAsset = {
      id: `rwa-custom-${Date.now()}`,
      name,
      timePeriod,
      spent,
      limit,
      country: activeBank.location,
      status: statusLabel,
      ownerAddress: activeBank.address
    };

    setAssets((prev) => [newAsset, ...prev]);
  };

  // Update existing Digital Allocation
  const handleUpdateAsset = (id: string, updatedFields: Partial<RWAAsset>) => {
    setAssets((prev) => prev.map((asset) => {
      if (asset.id === id) {
        const merged = { ...asset, ...updatedFields };
        const percent = merged.limit > 0 ? (merged.spent / merged.limit) * 100 : 0;
        let statusLabel: 'On Track' | 'Healthy' | 'Untouched' | 'Over Limit' = 'Healthy';
        if (percent >= 100) statusLabel = 'Over Limit';
        else if (percent >= 75) statusLabel = 'On Track';
        else if (percent > 0) statusLabel = 'Healthy';
        else statusLabel = 'Untouched';
        
        return {
          ...merged,
          status: statusLabel
        };
      }
      return asset;
    }));
  };

  // Delete Digital Allocation
  const handleDeleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((asset) => asset.id !== id));
  };

  // Add dynamic manual transaction ledger insertion
  const handleAddTransaction = (
    merchant: string, 
    category: any, 
    status: any, 
    amount: number
  ) => {
    const newTx: Transaction = {
      id: `tx-custom-${Date.now()}`,
      merchant,
      date: 'Today ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category,
      status,
      amount,
      timestamp: Date.now() / 1000
    };

    // Prepend to transactions
    setTransactions((prev) => [newTx, ...prev]);

    // If it is a spending transaction (negative amount), update the corresponding budgetspent!
    if (amount < 0) {
      const positiveSpendVal = Math.abs(amount);
      setAssets((prevAssets) => {
        return prevAssets.map((asset) => {
          // Attempt direct category text matching or name matching
          const categoryMatched = 
            (category === 'Travel' && asset.name.toLowerCase().includes('travel')) ||
            (category === 'Dining' && asset.name.toLowerCase().includes('dining')) ||
            (category === 'Rent' && asset.name.toLowerCase().includes('housing')) ||
            asset.name.toLowerCase() === merchant.toLowerCase();

          if (categoryMatched) {
            const nextSpent = asset.spent + positiveSpendVal;
            const percent = (nextSpent / asset.limit) * 100;
            let statusLabel: 'On Track' | 'Healthy' | 'Untouched' | 'Over Limit' = 'Healthy';
            if (percent >= 100) statusLabel = 'Over Limit';
            else if (percent >= 75) statusLabel = 'On Track';
            else if (percent > 0) statusLabel = 'Healthy';

            return {
              ...asset,
              spent: nextSpent,
              status: statusLabel
            };
          }
          return asset;
        });
      });
    }
  };

  // Execute institutional bridge payload transfer
  const handleExecuteBridgeTransfer = (assetId: string, toAddress: string, amount: number) => {
    // Lookup recipient whitelist details
    const targetNode = banks.find(b => b.address.toLowerCase() === toAddress.toLowerCase());

    if (!targetNode || !targetNode.verified) {
      return {
        success: false,
        message: "Compliance Violation: The receiving node address is either missing from the registrar or flagged on active sanctions blacklists."
      };
    }

    // Process budget subtraction on sender assets
    setAssets((prevAssets) => {
      return prevAssets.map((asset) => {
        if (asset.id === assetId) {
          const nextSpent = Math.max(0, asset.spent - amount);
          const percent = (nextSpent / asset.limit) * 100;
          let statusLabel: 'On Track' | 'Healthy' | 'Untouched' | 'Over Limit' = 'Healthy';
          if (percent >= 100) statusLabel = 'Over Limit';
          else if (percent >= 75) statusLabel = 'On Track';
          else if (percent > 0) statusLabel = 'Healthy';
          else statusLabel = 'Untouched';

          return {
            ...asset,
            spent: nextSpent,
            status: statusLabel
          };
        }
        return asset;
      });
    });

    // Create a historical transaction recording the successful zero-knowledge bridge clearance
    const newTx: Transaction = {
      id: `tx-bridge-${Date.now()}`,
      merchant: `Bridge: ${getInstitutionName(toAddress)}`,
      date: 'Today ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'Investment',
      status: 'Completed',
      amount: -amount,
      timestamp: Date.now() / 1000
    };

    setTransactions((prev) => [newTx, ...prev]);

    return {
      success: true,
      message: `Bridged Payload Cleared: Automated KYC passed. Valued $${amount.toLocaleString()} in cross-border collateral transfer initiated.`
    };
  };

  // Toggle node verification status in registrar
  const handleToggleVerification = (address: string) => {
    setBanks((prevBanks) => {
      const updated = prevBanks.map((bank) => {
        if (bank.address === address) {
          const nextVerified = !bank.verified;
          
          // If we are editing the currently active selected node, update current too
          if (activeBank.address === address) {
            setActiveBank({ ...bank, verified: nextVerified });
          }
          
          return { ...bank, verified: nextVerified };
        }
        return bank;
      });
      return updated;
    });
  };

  // Create new node in compliance ledger
  const handleAddNewNode = (address: string, name: string, location: string) => {
    const newNode: BankNode = {
      address,
      name,
      location,
      verified: true,
      avatarSeed: name.toLowerCase().replace(/\s+/g, '')
    };

    setBanks((prev) => [...prev, newNode]);
  };

  // Primary rendering engine based on active menu section
  const renderMainContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <Overview 
            transactions={transactions}
            activeBank={activeBank}
            allBanks={banks}
            onBankChange={handleBankNodeChange}
            onViewAllTransactions={() => handleSectionTabChange('transactions')}
          />
        );
      case 'budgets':
        return (
          <Budgets 
            assets={assets}
            onAddAsset={handleAddAsset}
            onUpdateAsset={handleUpdateAsset}
            onDeleteAsset={handleDeleteAsset}
          />
        );
      case 'transactions':
        return (
          <Transactions 
            transactions={transactions}
            onAddTransactionClick={() => setIsAddTxOpen(true)}
          />
        );
      case 'bridge':
        return (
          <BridgeTransfer 
            assets={assets}
            banks={banks}
            onExecuteTransfer={handleExecuteBridgeTransfer}
          />
        );
      case 'compliance':
        return (
          <ComplianceRegistry 
            banks={banks}
            onToggleVerification={handleToggleVerification}
            onAddNewNode={handleAddNewNode}
          />
        );
      default:
        return (
          <div className="py-24 text-center text-slate-400">
            Page template section coming soon.
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen font-sans antialiased text-white flex relative overflow-x-hidden">

      {/* Premium Cinematic VisionOS Background Overlay */}
      {/* Toast Alert Config with Editorial Aesthetics */}
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'rgba(20, 20, 23, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#FFFFFF',
            fontSize: '13px',
            borderRadius: '12px',
            padding: '12px 18px',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
          }
        }}
      />

      {/* Identical left sidebar */}
      <Sidebar 
        activeSection={activeSection}
        onSectionChange={handleSectionTabChange}
        onAddTransactionClick={() => setIsAddTxOpen(true)}
      />

      {/* Main Container scrolled offset */}
      <div className="flex-1 min-h-screen pl-68 pr-4 py-8 max-w-7xl mx-auto overflow-y-auto">
        <div className="max-w-6xl mx-auto py-4">
          {renderMainContent()}
        </div>
      </div>

      {/* Translucent overlay dialog for transaction submissions */}
      {isAddTxOpen && (
        <AddTransactionModal 
          onClose={() => setIsAddTxOpen(false)}
          onAddTransaction={handleAddTransaction}
        />
      )}
    </div>
  );
}
