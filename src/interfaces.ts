export interface Book {
  _id: string;
  title: string;
  author: string;
  ISBN: string;
  publisher: string;
  availableAmount: number;
  coverPicture: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookCollectionResponse {
  success: boolean;
  count: number;
  data: Book[];
}

export interface BookResponse {
  success: boolean;
  data: Book;
}

export interface Reservation {
  _id: string;
  borrowDate: string;
  pickupDate: string;
  createdAt?: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: "member" | "admin";
  };
  book: Book;
}

export interface ReservationCollectionResponse {
  success: boolean;
  count: number;
  data: Reservation[];
}

export interface ReservationResponse {
  success: boolean;
  data: Reservation;
}

export interface AuthResponse {
  success: boolean;
  _id: string;
  name: string;
  email: string;
  token: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  tel: string;
  password: string;
  role?: "member" | "admin";
}

export interface ApiError {
  success: false;
  error?: string;
  message?: string;
  msg?: string;
}

export interface LibraryUser {
  _id: string;
  name: string;
  email: string;
  tel: string;
  role: "member" | "admin";
  createdAt?: string;
  updatedAt?: string;
}
