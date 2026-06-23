import { Transaction, RWAAsset, BankNode } from '../types';

export const INITIAL_BANKS: BankNode[] = [
  {
    address: '0x1111111111111111111111111111111111111111',
    name: 'HSBC Singapore Node',
    location: 'Singapore (SG)',
    verified: true,
    avatarSeed: 'hsbc'
  },
  {
    address: '0x2222222222222222222222222222222222222222',
    name: 'JP Morgan Dubai Node',
    location: 'Dubai (AE)',
    verified: true,
    avatarSeed: 'jpmorgan'
  },
  {
    address: '0x3333333333333333333333333333333333333333',
    name: 'Deutsche Bank Frankfurt',
    location: 'Frankfurt (DE)',
    verified: true,
    avatarSeed: 'db'
  },
  {
    address: '0x4444444444444444444444444444444444444444',
    name: 'Emirates NBD',
    location: 'Dubai (AE)',
    verified: true,
    avatarSeed: 'enbd'
  },
  {
    address: '0x6666666666666666666666666666666666666666',
    name: 'Rogue Financial Node',
    location: 'Offshore (KY)',
    verified: false,
    avatarSeed: 'unknown'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    merchant: 'Whole Foods Market',
    date: 'Oct 24, 2023 14:32',
    category: 'Groceries',
    status: 'Completed',
    amount: -142.50,
    timestamp: 1698157920
  },
  {
    id: 'tx-2',
    merchant: 'Vanguard Dividends',
    date: 'Oct 23, 2023 09:00',
    category: 'Investment',
    status: 'Completed',
    amount: 845.20,
    timestamp: 1698051600
  },
  {
    id: 'tx-3',
    merchant: 'Avalon Properties',
    date: 'Oct 22, 2023 10:15',
    category: 'Rent',
    status: 'Pending',
    amount: -2400.00,
    timestamp: 1697969700
  },
  {
    id: 'tx-4',
    merchant: 'Blue Bottle Coffee',
    date: 'Oct 21, 2023 08:45',
    category: 'Dining',
    status: 'Completed',
    amount: -6.50,
    timestamp: 1697877900
  },
  {
    id: 'tx-5',
    merchant: 'Equinox',
    date: 'Today 10:00',
    category: 'Health & Fitness',
    status: 'Completed',
    amount: -320.00,
    timestamp: Date.now() / 1000 - 3600
  },
  {
    id: 'tx-6',
    merchant: 'Payroll Deposit',
    date: 'Yesterday 09:00',
    category: 'Income',
    status: 'Completed',
    amount: 8450.00,
    timestamp: Date.now() / 1000 - 86400
  },
  {
    id: 'tx-7',
    merchant: 'Delta Airlines',
    date: 'Oct 24, 2023 11:15',
    category: 'Travel',
    status: 'Completed',
    amount: -1250.00,
    timestamp: 1698146100
  }
];

export const INITIAL_ASSETS: RWAAsset[] = [
  {
    id: 'rwa-1',
    name: 'Corporate Housing',
    timePeriod: 'Monthly',
    spent: 3500.00,
    limit: 4000.00,
    country: 'Singapore',
    status: 'On Track',
    ownerAddress: '0x1111111111111111111111111111111111111111'
  },
  {
    id: 'rwa-2',
    name: 'Executive Travel',
    timePeriod: 'Quarterly',
    spent: 620.00,
    limit: 5000.00,
    country: 'Frankfurt',
    status: 'Healthy',
    ownerAddress: '0x3333333333333333333333333333333333333333'
  },
  {
    id: 'rwa-3',
    name: 'Client Dining',
    timePeriod: 'Monthly',
    spent: 0.00,
    limit: 1200.00,
    country: 'Dubai',
    status: 'Untouched',
    ownerAddress: '0x2222222222222222222222222222222222222222'
  }
];
