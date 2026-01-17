import React from 'react';
import { Button as PaperButton, useTheme } from 'react-native-paper';
import type { ButtonProps as PaperButtonProps } from 'react-native-paper';
import { styles } from './buttonStyles';

export type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps
  extends Omit<PaperButtonProps, 'buttonColor' | 'textColor'> {
  variant?: ButtonVariant;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  mode = 'contained',
  style,
  contentStyle,
  labelStyle,
  ...props
}) => {
  const theme = useTheme();

  // Configuración de colores según la variante
  const getButtonColors = () => {
    if (variant === 'primary') {
      return {
        buttonColor: theme.colors.primary,
        textColor: '#FFFFFF',
      };
    } else {
      // Secondary - gris
      return {
        buttonColor: '#404040',
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
