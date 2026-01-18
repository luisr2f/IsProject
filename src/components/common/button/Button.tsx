import React from 'react';
import { Button as PaperButton, useTheme } from 'react-native-paper';
import type { ButtonProps as PaperButtonProps } from 'react-native-paper';
import { styles } from './buttonStyles';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

export interface ButtonProps
  extends Omit<PaperButtonProps, 'buttonColor' | 'textColor'> {
  variant?: ButtonVariant;
  buttonColor?: string;
  textColor?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  mode = 'contained',
  style,
  contentStyle,
  labelStyle,
  buttonColor: customButtonColor,
  textColor: customTextColor,
  ...props
}) => {
  const theme = useTheme();

  // Configuración de colores según la variante
  const getButtonColors = () => {
    // Si se proporcionan colores personalizados, usarlos
    if (customButtonColor && customTextColor) {
      return {
        buttonColor: customButtonColor,
        textColor: customTextColor,
      };
    }

    if (variant === 'primary') {
      return {
        buttonColor: theme.colors.primary,
        textColor: '#FFFFFF',
      };
    } else if (variant === 'secondary') {
      // Secondary - gris
      return {
        buttonColor: '#404040',
        textColor: '#FFFFFF',
      };
    } else {
      // Danger - rojo
      return {
        buttonColor: theme.colors.error,
        textColor: '#FFFFFF',
      };
    }
  };

  const { buttonColor, textColor } = getButtonColors();

  return (
    <PaperButton
      mode={mode}
      buttonColor={buttonColor}
      textColor={textColor}
      style={[styles.button, style]}
      contentStyle={[styles.buttonContent, contentStyle]}
      labelStyle={[styles.buttonLabel, labelStyle]}
      uppercase
      {...props}
    />
  );
};

export default Button;
