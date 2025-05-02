import { Reservation } from "./reservation.model";

export interface Session {
  id: number;
  title: string;               // Changed from 'nom' to 'title'
  description: string;
  fullDescription: string;     // New property
  date: Date;
  imageUrl: string;            // Changed from 'profilePicture' to 'imageUrl'
  location: string;
  price: number;               // New property
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'; // New property
  reservations: Reservation[];  // New property
}