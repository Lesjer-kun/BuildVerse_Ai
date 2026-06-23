import { BankNode } from '../types';

export const INSTITUTION_NAMES: Record<string, string> = {
  "0x1111111111111111111111111111111111111111": "HSBC Singapore Node",
  "0x2222222222222222222222222222222222222222": "JP Morgan Dubai Node",
  "0x3333333333333333333333333333333333333333": "Deutsche Bank Frankfurt",
  "0x4444444444444444444444444444444444444444": "Emirates NBD Node",
  "0x6666666666666666666666666666666666666666": "Rogue Financial Node"
};

export const getInstitutionName = (address: string): string => {
  const normalized = address?.toLowerCase();
  for (const [key, value] of Object.entries(INSTITUTION_NAMES)) {
    if (key.toLowerCase() === normalized) {
      return value;
    }
  }
  return `${address?.slice(0, 6)}...${address?.slice(-4)}`;
};
