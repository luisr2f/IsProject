import React from 'react';
import { View, ViewStyle } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { styles } from './loadingStyles';

export interface LoadingProps {
  /**
   * Color del ActivityIndicator. Si no se proporciona, usa el color primario del tema
   */
  color?: string;
  /**
   * Tamaño del ActivityIndicator. Por defecto es 'large'
   */
  size?: 'small' | 'large' | number;
  /**
   * Estilos adicionales para el contenedor. Se concatenarán con los estilos por defecto
   */
  style?: ViewStyle;
}

/**
 * Componente Loading que muestra un ActivityIndicator centrado.
 * Tiene flex: 1 para expandirse al máximo y ocupar todo el espacio disponible.
 *
 * @example
 * ```tsx
 * <Loading />
 * ```
 */
export const Loading: React.FC<LoadingProps> = ({
  color,
  size = 32,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator
        size={size}
        animating={true}
        color={color || theme.colors.primary}
      />
    </View>
  );
};
