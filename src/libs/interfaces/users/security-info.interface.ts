export interface SecurityInfo {
  userId: string;
  email: string;
  isMfaEnabled: boolean;
  lastPasswordChange: string | null;
  sessionInfo: {
    currentSession: {
      device: string;
      location: string;
      lastActivity: string;
      createdAt: string;
    };
  };
  accountInfo: {
    accountType: string;
    createdAt: string;
    updatedAt: string;
  };
}
