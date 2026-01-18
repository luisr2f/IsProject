import React from 'react';
import { Snackbar, Text } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { hideSnackbar } from '@/store/slices/snackbarSlice';
import { useTheme } from 'react-native-paper';
import type { SnackbarType } from '@/store/slices/snackbarSlice';

const getSnackbarStyle = (type: SnackbarType, theme: any) => {
  switch (type) {
    case 'error':
      return {
        backgroundColor: theme.colors.errorContainer || '#FFEBEE',
        contentColor: theme.colors.error,
      };
    case 'success':
      return {
        backgroundColor: theme.colors.primaryContainer || '#E3F2FD',
        contentColor: theme.colors.primary,
      };
    case 'warning':
      return {
        backgroundColor: theme.colors.tertiaryContainer || '#FFE5E5',
        contentColor: theme.colors.tertiary,
      };
    case 'info':
    default:
      return {
        backgroundColor: theme.colors.surfaceVariant,
        contentColor: theme.colors.onSurfaceVariant || theme.colors.onSurface,
      };
  }
};

export const GlobalSnackbar: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { visible, message, type, duration } = useAppSelector(
    state => state.snackbar,
  );

  const handleDismiss = () => {
    dispatch(hideSnackbar());
  };

  const snackbarStyle = getSnackbarStyle(type, theme);

  const contentStyle = { backgroundColor: 'transparent' };

  return (
    <Snackbar
      visible={visible}
      onDismiss={handleDismiss}
      duration={duration}
      style={{
        backgroundColor: snackbarStyle.backgroundColor,
      }}
      contentStyle={contentStyle}
      theme={{
        ...theme,
        colors: {
          ...theme.colors,
          onSurface: snackbarStyle.contentColor,
          onSurfaceVariant: snackbarStyle.contentColor,
        },
      }}
      action={{
        label: 'OK',
        onPress: handleDismiss,
        textColor: snackbarStyle.contentColor,
      }}
    >
      <Text style={{ color: snackbarStyle.contentColor }}>{message}</Text>
    </Snackbar>
  );
};
