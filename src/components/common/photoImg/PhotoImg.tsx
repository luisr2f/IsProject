import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';
import { Avatar } from 'react-native-paper';
import { styles } from './photoImgStyles';

export interface PhotoImgProps {
  /**
   * Imagen en formato base64.
   * Si no se proporciona, se mostrará un icono de usuario.
   */
  base64?: string;
  /**
   * Tamaño de la imagen. Si se proporciona un número, se aplica a width y height.
   * Si se proporciona un objeto, se pueden especificar width y height por separado.
   */
  size?: number | { width: number; height: number };
  /**
   * Modo de redimensionamiento de la imagen.
   * Por defecto es 'cover'.
   */
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  /**
   * Estilos adicionales para la imagen.
   */
  style?: StyleProp<ImageStyle>;
}

/**
 * Componente genérico para mostrar imágenes de fotos.
 * Acepta imágenes en formato base64. Si no se proporciona, muestra un icono de usuario.
 *
 * @example
 * ```tsx
 * // Con base64
 * <PhotoImg base64="iVBORw0KGgoAAAANSUhEUgAA..." size={100} />
 *
 * // Sin imagen (muestra icono de usuario)
 * <PhotoImg size={100} />
 *
 * // Con tamaño personalizado
 * <PhotoImg base64={imageBase64} size={{ width: 150, height: 200 }} />
 * ```
 */
export const PhotoImg: React.FC<PhotoImgProps> = ({
  base64,
  size = 140,
  resizeMode = 'cover',
  style,
}) => {
  const getImageStyle = (): StyleProp<ImageStyle> => {
    const baseStyle: ImageStyle = {};

    if (typeof size === 'number') {
      baseStyle.width = size;
      baseStyle.height = size;
      baseStyle.borderRadius = size / 2; // Circular por defecto
    } else {
      baseStyle.width = size.width;
      baseStyle.height = size.height;
      // Si width y height son iguales, hacer circular
      if (size.width === size.height) {
        baseStyle.borderRadius = size.width / 2;
      }
    }

    return [styles.image, baseStyle, style];
  };

  const imageSize = typeof size === 'number' ? size : size.width;

  // Si no hay base64, mostrar icono de usuario en gris
  if (!base64) {
    return (
      <Avatar.Icon
        size={imageSize}
        icon="account"
        style={[styles.avatarGrey, style]}
        color="#FFFFFF"
      />
    );
  }

  // Construir URI para imagen base64
  const imageUri = base64.startsWith('data:')
    ? base64
    : `data:image/png;base64,${base64}`;

  return (
    <Image
      source={{ uri: imageUri }}
      style={getImageStyle()}
      resizeMode={resizeMode}
    />
  );
};

export default PhotoImg;
