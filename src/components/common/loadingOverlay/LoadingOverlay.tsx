import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Portal, useTheme, Text } from 'react-native-paper';
import { styles } from './loadingOverlayStyles';

export interface LoadingOverlayProps {
  /**
   * Controla si el overlay está visible
   */
  visible: boolean;
  /**
   * Mensaje opcional a mostrar debajo del spinner
   */
  message?: string;
  /**
   * Color del ActivityIndicator. Si no se proporciona, usa el color primario del tema
   */
  color?: string;
  /**
   * Tamaño del ActivityIndicator. Por defecto es 'large'
   */
  size?: 'small' | 'large' | number;
}

/**
 * Componente LoadingOverlay que muestra un overlay semitransparente
 * con un ActivityIndicator centrado mientras se realiza una operación de carga.
 *
 * Usa Portal de React Native Paper para renderizar sobre otros componentes.
 *
 * @example
 * ```tsx
 * <LoadingOverlay visible={isLoading} message="Cargando datos..." />
 * ```
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message,
  color,
  size = 'large',
}) => {
  const theme = useTheme();

  if (!visible) {
    return null;
  }

  return (
    <Portal>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator
            size={size}
            animating={true}
            color={color || theme.colors.primary}
          />
          {message && (
            <Text
              variant="bodyMedium"
              style={[styles.message, { color: theme.colors.onSurface }]}
            >
              {message}
            </Text>
          )}
        </View>
      </View>
    </Portal>
  );
};
