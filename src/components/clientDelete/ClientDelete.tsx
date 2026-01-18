import React, { useState } from 'react';
import { View } from 'react-native';
import {
  Modal,
  Portal,
  Text,
  useTheme,
} from 'react-native-paper';
import { Button } from '@/components';
import { useDeleteClientMutation } from '@/store/api/clientApi';
import { useAppDispatch } from '@/store/hooks';
import { showSuccess, showError } from '@/store/slices/snackbarSlice';
import { styles } from './clientDeleteStyles';

export interface ClientDeleteProps {
  /**
   * ID del cliente a eliminar
   */
  clientId: string | number | undefined;
  /**
   * Callback que se ejecuta después de eliminar exitosamente
   */
  onDeleteSuccess?: () => void;
  /**
   * Estilo personalizado para el botón
   */
  style?: any;
}

export const ClientDelete: React.FC<ClientDeleteProps> = ({
  clientId,
  onDeleteSuccess,
  style,
}) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [deleteClient, { isLoading: isDeleting }] = useDeleteClientMutation();
  const [visible, setVisible] = useState(false);

  const handleDeletePress = () => {
    if (!clientId) {
      dispatch(showError('No se puede eliminar: ID de cliente no válido'));
      return;
    }
    setVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!clientId) {
      dispatch(showError('No se puede eliminar: ID de cliente no válido'));
      setVisible(false);
      return;
    }

    try {
      await deleteClient(clientId).unwrap();
      dispatch(showSuccess('Cliente eliminado exitosamente'));
      setVisible(false);
      onDeleteSuccess?.();
    } catch (error: any) {
      console.error('Error al eliminar cliente:', error);
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        'Error al eliminar el cliente. Por favor, intente nuevamente.';
      dispatch(showError(errorMessage));
      setVisible(false);
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <Button
        variant="danger"
        onPress={handleDeletePress}
        disabled={isDeleting || !clientId}
        style={[styles.button, style]}
      >
        {isDeleting ? 'Eliminando...' : 'Eliminar'}
      </Button>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={handleCancel}
          contentContainerStyle={[
            styles.modalContainer,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <View style={styles.modalContent}>
            <Text
              variant="titleLarge"
              style={[styles.modalTitle, { color: theme.colors.onSurface }]}
            >
              Confirmar eliminación
            </Text>
            <Text
              variant="bodyMedium"
              style={[
                styles.modalMessage,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              ¿Está seguro de que desea eliminar este cliente? Esta acción no
              se puede deshacer.
            </Text>
            <View style={styles.modalActions}>
              <Button
                variant="secondary"
                mode="outlined"
                onPress={handleCancel}
                disabled={isDeleting}
                style={styles.modalButton}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                mode="contained"
                onPress={handleConfirmDelete}
                loading={isDeleting}
                disabled={isDeleting}
                style={styles.modalButton}
              >
                Eliminar
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </>
  );
};
