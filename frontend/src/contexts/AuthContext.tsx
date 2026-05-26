import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Ambassador {
  _id: string;
  email: string;
  isVerified: boolean;
  balance: number;
  clearanceStatus: string;
  clearancePaymentStatus: string;
  profile?: any;
  selectedOutfits?: any[];
}

interface AuthContextType {
  ambassador: Ambassador | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ambassador, setAmbassador] = useState<Ambassador | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('ambassadorToken');
    const storedAmbassador = localStorage.getItem('ambassador');
    
    if (storedToken && storedAmbassador) {
      setToken(storedToken);
      setAmbassador(JSON.parse(storedAmbassador));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/ambassadors/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setToken(data.token);
      setAmbassador(data.ambassador);
      localStorage.setItem('ambassadorToken', data.token);
      localStorage.setItem('ambassador', JSON.stringify(data.ambassador));
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      console.log('Attempting to register:', email);
      console.log('Backend URL: /api/ambassadors/register');
      
      // Test connection first
      const testResponse = await fetch('/api/ambassadors/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        mode: 'cors',
        credentials: 'omit'
      });

      console.log('Response status:', testResponse.status);
      console.log('Response headers:', testResponse.headers);

      if (!testResponse.ok) {
        const errorData = await testResponse.json();
        console.error('Registration failed:', errorData);
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await testResponse.json();
      console.log('Registration successful:', data);

      setToken(data.token);
      setAmbassador(data.ambassador);
      localStorage.setItem('ambassadorToken', data.token);
      localStorage.setItem('ambassador', JSON.stringify(data.ambassador));
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Failed to connect to server. Please check if backend is running.');
      }
      if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
        throw new Error('Network error. Please check your internet connection.');
      }
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setAmbassador(null);
    localStorage.removeItem('ambassadorToken');
    localStorage.removeItem('ambassador');
  };

  const isAuthenticated = !!token && !!ambassador;

  return (
    <AuthContext.Provider
      value={{
        ambassador,
        token,
        login,
        register,
        logout,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
