import React from 'react';
import { View, TouchableOpacity, Text as RNText } from 'react-native';
import { Surface, IconButton } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { AppBar } from '@/components/common';
import { useAppSelector } from '@/store/hooks';
import { styles } from './dashboardScreenStyles';

type DashboardScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Dashboard'
>;

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const username =
    useAppSelector(state => state.auth.username) || 'Nombre de Usuario';

  return (
    <View style={styles.container}>
      <AppBar title={username} />
      <View style={styles.content}>
        <TouchableOpacity 
          onPress={() => {
            navigation.navigate('ClientList');
          }} 
          activeOpacity={0.7}
          style={styles.pressableCard}
        >
          <Surface style={styles.card}>
            <View style={styles.cardContent}>
              <IconButton
                icon="book-outline"
                size={40}
                style={styles.cardIcon}
              />
              <View style={styles.cardText}>
                <RNText style={styles.cardTitle}>
                  Clientes
                </RNText>
                <RNText style={styles.cardSubtitle}>
                  Administrar clientes
                </RNText>
              </View>
            </View>
          </Surface>
        </TouchableOpacity>
      </View>
    </View>
  );
};
