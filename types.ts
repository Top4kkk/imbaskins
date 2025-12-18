
export enum Rarity {
  COMMON = 'Common', // Consumer Grade
  INDUSTRIAL = 'Industrial', // Industrial Grade
  MIL_SPEC = 'Mil-Spec', // High Grade
  RESTRICTED = 'Restricted', // Restricted
  CLASSIFIED = 'Classified', // Classified
  COVERT = 'Covert', // Covert
  GOLD = 'Gold', // Rare Special Item
  CASE = 'Case', // Consumable Case
}

export interface Item {
  id: string;
  name: string;
  price: number;
  image: string;
  rarity: Rarity;
  caseIdRef?: string; // If it's a case item, which case ID does it open?
}

export interface Case {
  id: string;
  name: string;
  price: number;
  image: string;
  items: Item[];
}

export interface User {
  username?: string;
  balance: number;
  inventory: Item[];
  xp: number;
  currency: 'USD' | 'RUB';
}
