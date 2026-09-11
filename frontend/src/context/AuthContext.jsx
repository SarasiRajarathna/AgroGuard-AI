import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const MOCK_USERS = {
  farmer: {
    id: 1,
    name: 'Ruwan Perera',
    email: 'ruwan@farm.lk',
    role: 'farmer',
    avatar: 'RP',
    location: 'Kandy, Sri Lanka',
    farmSize: '2.4 acres',
    phone: '+94 77 123 4567',
  },
  officer: {
    id: 2,
    name: 'Nimali Fernando',
    email: 'nimali@agri.gov.lk',
    role: 'officer',
    avatar: 'NF',
    district: 'Kandy District',
    badgeId: 'AGO-2024-045',
    phone: '+94 71 987 6543',
  },
  research: {
    id: 3,
    name: 'Dr. Kasun Silva',
    email: 'kasun@research.lk',
    role: 'research',
    avatar: 'KS',
    institution: 'Dept. of Agriculture',
    specialization: 'Plant Pathology',
  },
  admin: {
    id: 4,
    name: 'System Admin',
    email: 'admin@agroguard.lk',
    role: 'admin',
    avatar: 'SA',
    permissions: ['all'],
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (role) => {
    setUser(MOCK_USERS[role]);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
