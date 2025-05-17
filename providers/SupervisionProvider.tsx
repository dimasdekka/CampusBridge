// SupervisionProvider.tsx
// Provider ini mengelola seluruh operasi bimbingan (supervision) antara mahasiswa dan dosen di aplikasi.
import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthProvider';
import { Platform } from 'react-native';

// Struktur data supervision (bimbingan)
export interface Supervision {
  id: string;
  studentId: string;
  professorId: string;
  dateTime: string;
  status: SupervisionStatus;
  topic?: string;
  notes?: string;
  studentEmail?: string;
  professorName?: string;
  studentName?: string;
}

export enum SupervisionStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Cancelled = 'Cancelled',
  Completed = 'Completed',
}

interface SupervisionContextType {
  createSupervision: (data: Omit<Supervision, 'id'>) => Promise<Supervision>;
  getSupervisions: () => Promise<Supervision[]>;
  updateSupervision: (
    id: string,
    updateData: Partial<Supervision>
  ) => Promise<Supervision>;
}

interface SupervisionProviderProps {
  children: ReactNode;
}

export const API_URL = Platform.select({
  ios: process.env.EXPO_PUBLIC_API_URL,
  android: 'http://10.0.2.2:3000',
});

const SupervisionContext = createContext<SupervisionContextType | undefined>(
  undefined
);

export function SupervisionProvider({ children }: SupervisionProviderProps) {
  const { authState } = useAuth();

  // Membuat bimbingan baru
  const createSupervision = async (data: Omit<Supervision, 'id'>) => {
    try {
      const response = await fetch(`${API_URL}/supervisions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authState?.jwt}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Gagal membuat bimbingan:', error);
      throw error;
    }
  };

  // Mengambil seluruh bimbingan user (mahasiswa/dosen)
  const getSupervisions = async () => {
    try {
      const response = await fetch(`${API_URL}/supervisions`, {
        headers: {
          Authorization: `Bearer ${authState?.jwt}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Gagal mengambil data bimbingan:', error);
      throw error;
    }
  };

  // Memperbarui status/isi bimbingan
  const updateSupervision = async (
    id: string,
    updateData: Partial<Supervision>
  ) => {
    try {
      const response = await fetch(`${API_URL}/supervisions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authState?.jwt}`,
        },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Gagal memperbarui bimbingan:', error);
      throw error;
    }
  };

  const value = {
    createSupervision,
    getSupervisions,
    updateSupervision,
  };

  return (
    <SupervisionContext.Provider value={value}>
      {children}
    </SupervisionContext.Provider>
  );
}

// Custom hook untuk akses context supervision
export function useSupervisions() {
  const context = useContext(SupervisionContext);
  if (context === undefined) {
    throw new Error(
      'useSupervisions harus dipakai di dalam SupervisionProvider'
    );
  }
  return context;
}
