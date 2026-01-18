import React, { useState, useMemo } from 'react';
import { View, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Card, Text, IconButton, Searchbar, Chip } from 'react-native-paper';
import type { RootStackParamList } from '@/navigation/types';
import { AppBar, Button, PhotoImg } from '@/components/common';
import { useGetClientsListQuery, ClientListItem } from '@/store/api/clientApi';
import { useAppSelector } from '@/store/hooks';
import { styles } from './clientListScreenStyles';
import { Loading } from '@/components/common/loading';

type ClientListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ClientList'
>;

export const ClientListScreen: React.FC<ClientListScreenProps> = ({
  navigation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'identification'>('name');

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

  // Filtrar clientes según el tipo de búsqueda y el query
  const filteredClients = useMemo(() => {
    if (!clients) return [];

    if (!searchQuery.trim()) {
      return clients;
    }

    const query = searchQuery.trim().toLowerCase();

    return clients.filter(client => {
      if (searchType === 'name') {
        const fullName = `${client.nombre} ${client.apellidos}`.trim().toLowerCase();
        return fullName.includes(query);
      } else {
        // searchType === 'identification'
        return client.identificacion.toLowerCase().includes(query);
      }
    });
  }, [clients, searchQuery, searchType]);

  const renderSearchTypeChip = (
    type: 'name' | 'identification',
    label: string,
  ) => {
    const isSelected = searchType === type;
    return (
      <Chip
        selected={isSelected}
        onPress={() => setSearchType(type)}
        style={[
          styles.searchTypeChip,
          isSelected && styles.searchTypeChipSelected,
        ]}
        textStyle={[
          styles.searchTypeChipText,
          isSelected && styles.searchTypeChipTextSelected,
        ]}
        icon={isSelected ? 'check' : undefined}
      >
        {label}
      </Chip>
    );
  };

  const renderClientItem = ({ item }: { item: ClientListItem }) => {
    const fullName = `${item.nombre} ${item.apellidos}`.trim();

    return (
      <Card
        style={styles.clientCard}
        onPress={() => handleClientPress(item)}
        elevation={0}
      >
        <Card.Content style={styles.clientCardContent}>
          {/* Listado de momento no devuelve la imagen del cliente */}
          <PhotoImg size={50} base64={''} />
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
        <Loading />
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

    if (searchQuery.trim() && filteredClients.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text variant="bodyLarge" style={styles.emptyText}>
            No se encontraron clientes que coincidan con la búsqueda
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
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Buscar..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
            inputStyle={styles.searchbarInput}
          />
          <View style={styles.searchTypeContainer}>
            {renderSearchTypeChip('name', 'Nombre')}
            {renderSearchTypeChip('identification', 'Identificación')}
          </View>
        </View>
        <FlatList
          data={filteredClients}
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
