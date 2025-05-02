export interface PaymentStripe {
    id: number;
    amount: number;
    status: PaymentStatus;
    courriel: string;
    createdAt: Date;
    userId: number;
    userFirstName: string;
    userLastName: string;
    userPhone: string;
    userAddress: string;
    paymentId: string;
  }
  
  export enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    REFUNDED = 'REFUNDED',
  }