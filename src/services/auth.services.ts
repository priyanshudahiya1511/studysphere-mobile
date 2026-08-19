import api from './api';
import {
  AuthResponse,
  RegisterPayload,
  RegisterResponse,
  LoginPayload,
  VerifyOtpPayload,
} from '../types/auth.types';

export const registerService = async (
  payload: RegisterPayload,
): Promise<RegisterResponse> => {
  const response = await api.post('/api/v1/auth/register', payload);
  return response.data;
};

export const verifyOtpService = async (
  payload: VerifyOtpPayload,
): Promise<AuthResponse> => {
  const response = await api.post('/api/v1/auth/verify-otp', payload);
  return response.data;
};

export const loginService = async (
  payload: LoginPayload,
): Promise<AuthResponse> => {
  const response = await api.post('/api/v1/auth/login', payload);
  return response.data;
};

export const logoutService = async () => {
  const response = await api.post('/api/v1/auth/logout');
  return response.data;
};

export const resendOtpService = async (email: string) => {
  const response = await api.post('/api/v1/auth/resend-otp', { email });
  return response.data;
};

export const forgotPasswordService = async (email: string) => {
  const response = await api.post('/api/v1/auth/forgot-password', { email });
  return response.data;
};

export const verifyForgotOtpService = async (email: string, otp: string) => {
  const response = await api.post('/api/v1/auth/verify-forgot-password-otp', {
    email,
    otp,
  });
  return response.data; // { message, resetToken }
};

export const resetPasswordService = async (
  resetToken: string,
  newPassword: string,
) => {
  const response = await api.post('/api/v1/auth/reset-password', {
    resetToken,
    newPassword,
  });
  return response.data;
};

export const googleAuthService = async (googleToken: string) => {
  const response = await api.post('/api/v1/auth/google', { googleToken });
  return response.data;
};
