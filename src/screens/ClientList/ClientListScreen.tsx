import React from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Card, Avatar, Text, IconButton } from 'react-native-paper';
import type { RootStackParamList } from '@/navigation/types';
import { AppBar, Button } from '@/components/common';
import { useGetClientsListQuery, ClientListItem } from '@/store/api/clientApi';
import { useAppSelector } from '@/store/hooks';
import { styles } from './clientListScreenStyles';

type ClientListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ClientList'
>;

export const ClientListScreen: React.FC<ClientListScreenProps> = ({
  navigation,
}) => {
  const userid = useAppSelector(state => state.auth.userid);
  const username = useAppSelector(state => state.auth.username);
  const {
    data: clients,
    isLoading,
    error,
  } = useGetClientsListQuery(
    {
      usuarioId: userid || '',
      nombre: username || '',
    },
    { skip: !userid },
  );

  const handleNewClient = () => {
    navigation.navigate('ClientForm');
  };

  const handleClientPress = (client: ClientListItem) => {
    // Navegar al formulario de cliente con el ID para edición
    navigation.navigate('ClientForm', { id: client.id });
  };

  const renderClientItem = ({ item }: { item: ClientListItem }) => {
    const fullName = `${item.nombre} ${item.apellidos}`.trim();
    const firstInitial = item.nombre?.[0]?.toUpperCase() || '';
    const lastInitial = item.apellidos?.[0]?.toUpperCase() || '';
    const initials = firstInitial + lastInitial || '?';

    return (
      <Card
        style={styles.clientCard}
        onPress={() => handleClientPress(item)}
        elevation={0}
      >
        <Card.Content style={styles.clientCardContent}>
          <Avatar.Text size={50} label={initials} style={styles.avatar} />
          <View style={styles.clientInfo}>
            <Text variant="titleMedium" style={styles.clientName}>
              {fullName}
            </Text>
            <Text variant="bodyMedium" style={styles.clientNumber}>
              {item.identificacion}
            </Text>
          </View>
          <IconButton
            icon="chevron-right"
            size={32}
            iconColor="#8E8E93"
            style={styles.chevron}
          />
        </Card.Content>
      </Card>
    );
  };

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text variant="bodyLarge" style={styles.emptyText}>
            Cargando clientes...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text variant="bodyLarge" style={styles.errorText}>
            Error al cargar clientes
          </Text>
        </View>
      );
    }

    if (!clients || clients.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text variant="bodyLarge" style={styles.emptyText}>
            No hay clientes disponibles
          </Text>
        </View>
      );
    }

    return null;
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
        <FlatList
          data={clients || []}
          renderItem={renderClientItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};
