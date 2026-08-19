export type AuthStackParamlist = {
  Login: undefined;
  Register: undefined;
  otp: { email: string };
  ForgotPassword: undefined;
  VerifyForgotOtp: { email: string };
  ResetPassword: { resetToken: string };
};
