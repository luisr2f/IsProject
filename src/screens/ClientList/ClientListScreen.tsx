import React from 'react';
import { View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { AppBar, Button } from '@/components/common';
import { styles } from './clientListScreenStyles';

type ClientListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ClientList'
>;

export const ClientListScreen: React.FC<ClientListScreenProps> = ({
  navigation,
}) => {
  const handleNewClient = () => {
    navigation.navigate('ClientForm');
  };

  return (
    <View style={styles.container}>
      <AppBar title="Consulta de Clientes" type="mainPage" />
      <View style={styles.content}>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleNewClient}
            style={styles.newClientButton}
            icon="plus"
          >
            Nuevo cliente
          </Button>
        </View>
        <Text>List user</Text>
      </View>
    </View>
  );
};
