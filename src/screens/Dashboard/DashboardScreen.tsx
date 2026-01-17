import React from 'react';
import { View } from 'react-native';
import { Text, Surface, IconButton } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { AppBar } from '@/components/common';
import { useAppSelector } from '@/store/hooks';
import { styles } from './dashboardScreenStyles';

type DashboardScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Dashboard'
>;

export const DashboardScreen: React.FC<DashboardScreenProps> = () => {
  const username =
    useAppSelector(state => state.auth.username) || 'Nombre de Usuario';

  return (
    <View style={styles.container}>
      <AppBar title={username} />
      <View style={styles.content}>
        <Surface style={styles.card}>
          <View style={styles.cardContent}>
            <IconButton
              icon="book-outline"
              size={40}
              iconColor="#072477"
              style={styles.cardIcon}
            />
            <View style={styles.cardText}>
              <Text variant="titleLarge" style={styles.cardTitle}>
                Clientes
              </Text>
              <Text variant="bodyMedium" style={styles.cardSubtitle}>
                Administrar clientes
              </Text>
            </View>
          </View>
        </Surface>
      </View>
    </View>
  );
};
