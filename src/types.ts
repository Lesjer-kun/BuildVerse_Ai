export interface Transaction {
  id: string;
  merchant: string;
  date: string;
  category: 'Groceries' | 'Investment' | 'Rent' | 'Dining' | 'Health & Fitness' | 'Income' | 'Travel' | 'Other';
  status: 'Completed' | 'Pending' | 'Failed';
  amount: number;
  timestamp: number;
}

export interface RWAAsset {
  id: string;
  name: string;
  timePeriod: 'Monthly' | 'Quarterly' | 'Yearly';
  spent: number;
  limit: number;
  country: string;
  status: 'On Track' | 'Healthy' | 'Untouched' | 'Over Limit';
  ownerAddress: string;
}

export interface BankNode {
  address: string;
  name: string;
  location: string;
  verified: boolean;
  avatarSeed: string;
}
