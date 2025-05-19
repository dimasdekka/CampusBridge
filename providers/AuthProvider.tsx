// File ini ngurusin semua hal soal autentikasi (login, register, dll).
// Nyimpen token JWT, info user, dan ngecek siapa yang udah login.
// Di web disimpen di localStorage, di mobile disimpen di SecureStore.

import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Ini tipe data yang bakal di-share lewat context auth
interface AuthProps {
  authState: {
    token: string | null;
    jwt: string | null;
    authenticated: boolean | null;
    user_id: string | null;
    role: string | null;
    email: string | null;
  };
  onRegister: (nim: string, email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  initialized: boolean;
  isProfessor: boolean;
}

// Nama key buat nyimpen token di storage
const TOKEN_KEY = 'user-jwt';

// URL backend, beda-beda tergantung platform
export const API_URL = Platform.select({
  ios: process.env.EXPO_PUBLIC_API_URL,
  android: 'http://10.0.2.2:3000',
});

// Bikin context buat nyimpen data auth secara global
const AuthContext = createContext<Partial<AuthProps>>({});

// Fungsi bantu buat nyimpen/ambil/hapus data tergantung platform
const storage = {
  async setItem(key: string, value: string) {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    return await SecureStore.setItemAsync(key, value);
  },
  async getItem(key: string) {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },
  async removeItem(key: string) {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    return await SecureStore.deleteItemAsync(key);
  },
};

// State kosong buat kondisi awal (belum login)
const EMPTY_AUTH_STATE = {
  token: null,
  jwt: null,
  authenticated: null,
  user_id: null,
  role: null,
  email: null,
};

// Komponen utama buat nge-handle auth di seluruh app
export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    jwt: string | null;
    authenticated: boolean | null;
    user_id: string | null;
    role: string | null;
    email: string | null;
  }>(EMPTY_AUTH_STATE);

  const [initialized, setInitialized] = useState(false);

  // Saat komponen pertama kali jalan, coba ambil token dari storage
  useEffect(() => {
    const loadToken = async () => {
      const data = await storage.getItem(TOKEN_KEY);

      if (data) {
        const object = JSON.parse(data);
        updateAuthStateFromToken(object);
      }
      setInitialized(true);
    };
    loadToken();
  }, []);

  useEffect(() => {
    if (
      authState &&
      (authState.authenticated === null ||
        authState.authenticated === false ||
        !authState.token ||
        !authState.jwt ||
        !authState.user_id)
    ) {
      signOut();
    }
  }, [authState]);

  // Update state auth setelah dapet token dari login/registrasi
  const updateAuthStateFromToken = (object: any) => {
    setAuthState({
      token: object.token,
      jwt: object.jwt,
      authenticated: true,
      user_id: object.user.id,
      role: object.user.role,
      email: object.user.email,
    });
  };

  // Fungsi buat login user
  const signIn = async (email: string, password: string) => {
    const result = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const json = await result.json();

    if (!result.ok) {
      throw new Error(json.msg);
    }

    updateAuthStateFromToken(json);
    await storage.setItem(TOKEN_KEY, JSON.stringify(json));
    return result;
  };

  // Fungsi buat registrasi user baru
  const register = async (nim: string, email: string, password: string) => {
    const result = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nim, email, password }),
    });

    const json = await result.json();

    if (!result.ok) {
      throw new Error(json.msg);
    }

    // Pastikan updateAuthStateFromToken menerima json yang ada jwt-nya!
    updateAuthStateFromToken(json);
    await storage.setItem(TOKEN_KEY, JSON.stringify(json));
    return json;
  };

  // Logout user dan reset auth state
  const signOut = async () => {
    await storage.removeItem(TOKEN_KEY);
    setAuthState(EMPTY_AUTH_STATE);
  };

  // Cek apakah user adalah professor
  const isProfessor = authState.role === 'professor';

  // Semua nilai yang bakal di-share ke komponen lain
  const value = {
    onRegister: register,
    signIn,
    signOut,
    authState,
    initialized,
    isProfessor,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook biar gampang akses auth di komponen lain
export const useAuth = () => {
  return useContext(AuthContext) as AuthProps;
};
