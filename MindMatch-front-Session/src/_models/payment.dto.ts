import { PaymentStatus } from "./payment.model";


export interface PaymentDTO {
  id: number;
  version: number;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethodType;
  email: string;
  createdAt: Date;
  currency: string;
  description: string;
  titles: string;
  stripeSessionId: string;
  holderName: string;
  userId: number;
  userFirstName: string;
  userLastName: string;
  userPhone: string;
  userAddress: string;
}

export enum PaymentMethodType {
  CARD = 'CARD',
  LINK = 'LINK',
  CASHAPP = 'CASHAPP',
  AMAZON_PAY = 'AMAZON_PAY',
  OTHER = 'OTHER',
}
