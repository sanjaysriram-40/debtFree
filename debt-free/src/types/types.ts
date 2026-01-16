export type TransactionDirection = 'YOU_GAVE' | 'YOU_GOT';

export interface Person {
  id: number;
  name: string;
  phone?: string;
  notes?: string;
  created_at: number;
}

export interface Transaction {
  id: number;
  person_id: number;
  amount: number;
  direction: TransactionDirection;
  date: number;
  note?: string;
  created_at: number;
}

export interface TransactionHistory {
  id: number;
  transaction_id: number;
  previous_amount: number;
  previous_direction: TransactionDirection;
  previous_date: number;
  previous_note?: string;
  changed_at: number;
}

export interface PersonBalance {
  person: Person;
  netBalance: number;
  owesMe: boolean;
  iOwe: boolean;
  settled: boolean;
  displayAmount: number;
}

export interface GlobalBalance {
  globalNet: number;
  totalLent: number;
  totalBorrowed: number;
  message: string;
  color: 'red' | 'green';
}

export type CardType = 'VISA' | 'MASTERCARD' | 'RUPAY';

export interface Card {
  id: number;
  cardName: string;
  cardNumber: string;
  cardType: CardType;
  nameOnCard: string;
  expiry: string;
  cvv: string;
  color: string;
  created_at: number;
}
