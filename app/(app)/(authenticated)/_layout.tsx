import { useAuth } from '@/providers/AuthProvider';
import { Redirect, Slot } from 'expo-router';

const Layout = () => {
  const { authState, signOut } = useAuth();
  if (!authState.authenticated) {
    return <Redirect href="/login" />;
  }
  return <Slot />;
};
export default Layout;
