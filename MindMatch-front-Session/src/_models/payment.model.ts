
export interface Payment {
  id: number;
  amount: number;
  status: PaymentStatus;
  bank: Bank;
  createdAt: Date;
  paymentMethod: PaymentMethod; // Nouveau champ structuré
  userInfo: UserInfo; // Regroupement des infos utilisateur
  paymentId: string;
  sessionTitles: string[]; // Nom plus descriptif
}

export interface PaymentMethod {
  holderName: string;
  expirationDate: string;
  cardNumber: string;
  securityCode: number; // Renommé de cardCode pour plus de clarté
}

export interface UserInfo {
  userId: number;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED' // Ajout d'un statut manquant
}

export enum Bank {
  AMANE = 'AMANE',
  BIAT = 'BIAT',
  ATB = 'ATB', // Exemple d'ajout
  BNA = 'BNA'  // Exemple d'ajout
}