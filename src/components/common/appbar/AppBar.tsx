import React from 'react';
import { Appbar } from 'react-native-paper';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

interface AppBarProps {
  title: string;
}

export const AppBar: React.FC<AppBarProps> = ({ title }) => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Appbar.Header>
      <Appbar.Action icon="account-circle-outline" size={34} />
      <Appbar.Content title={title} />
      <Appbar.Action icon="logout" onPress={handleLogout} size={34} />
    </Appbar.Header>
  );
};
