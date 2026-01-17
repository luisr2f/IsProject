import React from 'react';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

type AppBarType = 'home' | 'mainPage' | 'internalPage';

interface AppBarProps {
  type?: AppBarType;
  title?: string;
}

export const AppBar: React.FC<AppBarProps> = ({ type='home', title='' }) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
 const username =
    useAppSelector(state => state.auth.username) || '';


  const handleLogout = () => {
    dispatch(logout());
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleHome = () => {
    navigation.navigate('Dashboard' as never);
  };

  return (
    <Appbar.Header>
      {type === 'home' ? (
        <Appbar.Action icon="account-circle-outline" size={34} />
      ) : type === 'mainPage' ? (
        <Appbar.Action icon="home" size={34} onPress={handleHome} />
      ) : (
         <Appbar.BackAction onPress={handleBack} />
      )}
      <Appbar.Content title={type === 'home'? username : title} />
     {type !== 'internalPage' && <Appbar.Action icon="logout" onPress={handleLogout} size={34} />}
    </Appbar.Header>
  );
};
