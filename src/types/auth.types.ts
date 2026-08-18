export type User = {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
  googleId: string | null;
  plan: 'free' | 'premium';
  createdAt: string;
  updatedAt: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type VerifyOtpPayload = {
  email: string;
  otp: string;
};

export type AuthResponse = {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
};

export type RegisterResponse = {
  message: string;
};
