import React from 'react';
import { View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { AppBar } from '@/components/common';
import { styles } from './clientListScreenStyles';

type ClientListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ClientList'
>;

export const ClientListScreen: React.FC<ClientListScreenProps> = () => {


  return (
    <View style={styles.container}>
      <AppBar title="Consulta de Clientes" type="mainPage" />
      <View style={styles.content}>
        <Text>List user</Text>
      </View>
    </View>
  );
};
