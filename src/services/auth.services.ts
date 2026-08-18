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
