// Simple admin authentication
// In production, use proper backend authentication with hashed passwords

interface AdminUser {
  email: string;
  password: string;
}

// Admin credentials
const ADMIN_USERS: AdminUser[] = [
  {
    email: "excel6963@gmail.com",
    password: "Banele@123321",
  },
];

const AUTH_KEY = "shosh_admin_auth";

export const adminAuth = {
  login: (email: string, password: string): boolean => {
    const user = ADMIN_USERS.find(
      (u) => u.email === email && u.password === password
    );
    
    if (user) {
      sessionStorage.setItem(AUTH_KEY, JSON.stringify({ email: user.email, timestamp: Date.now() }));
      return true;
    }
    return false;
  },

  logout: (): void => {
    sessionStorage.removeItem(AUTH_KEY);
  },

  isAuthenticated: (): boolean => {
    const authData = sessionStorage.getItem(AUTH_KEY);
    if (!authData) return false;

    try {
      const { timestamp } = JSON.parse(authData);
      const EIGHT_HOURS = 8 * 60 * 60 * 1000;
      
      // Session expires after 8 hours
      if (Date.now() - timestamp > EIGHT_HOURS) {
        sessionStorage.removeItem(AUTH_KEY);
        return false;
      }
      
      return true;
    } catch {
      return false;
    }
  },

  getUser: (): { email: string } | null => {
    const authData = sessionStorage.getItem(AUTH_KEY);
    if (!authData) return null;

    try {
      const { email } = JSON.parse(authData);
      return { email };
    } catch {
      return null;
    }
  },
};
