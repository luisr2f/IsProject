import React from 'react';
import { TouchableOpacity, View, Alert, Platform } from 'react-native';
import { launchCamera, launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import { styles } from './selectPhotoStyles';
import { PhotoImg } from '../common';
import { Avatar } from 'react-native-paper';
import { check, request, PERMISSIONS, RESULTS, Permission } from 'react-native-permissions';

export interface SelectPhotoProps {
    /**
     * Imagen en formato base64.
     */
    base64?: string;
    /**
     * Callback que se ejecuta cuando se selecciona una imagen.
     * Recibe la imagen en formato base64.
     */
    onImageSelected?: (base64: string) => void;
}

//29C1D1

export const SelectPhoto: React.FC<SelectPhotoProps> = ({
    base64,
    onImageSelected,
}) => {
    const requestCameraPermission = async (): Promise<boolean> => {
        try {
            const permission: Permission =
                Platform.OS === 'ios'
                    ? PERMISSIONS.IOS.CAMERA
                    : PERMISSIONS.ANDROID.CAMERA;

            const result = await check(permission);

            if (result === RESULTS.GRANTED) {
                return true;
            }

            if (result === RESULTS.DENIED) {
                const requestResult = await request(permission);
                return requestResult === RESULTS.GRANTED;
            }

            return false;
        } catch (error) {
            console.error('Error al solicitar permiso de cámara:', error);
            return false;
        }
    };

    const handleImagePicker = (response: ImagePickerResponse) => {
        if (response.didCancel) {
            return;
        }

        if (response.errorCode) {
            Alert.alert(
                'Error',
                response.errorMessage || 'Error al seleccionar la imagen',
            );
            return;
        }

        const asset = response.assets?.[0];
        if (!asset?.base64) {
            Alert.alert('Error', 'No se pudo obtener la imagen');
            return;
        }

        // Convertir a base64 sin el prefijo data:image
        const base64String = asset.base64;
        onImageSelected?.(base64String);
    };

    const openCamera = async () => {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) {
            Alert.alert(
                'Permiso requerido',
                'Se necesita permiso para acceder a la cámara',
            );
            return;
        }

        launchCamera(
            {
                mediaType: 'photo' as MediaType,
                quality: 0.8,
                includeBase64: true,
                maxWidth: 200,
                maxHeight: 200,
            },
            handleImagePicker,
        );
    };

    const openImagePicker = () => {
        launchImageLibrary(
            {
                mediaType: 'photo' as MediaType,
                quality: 0.8,
                includeBase64: true,
                maxWidth: 200,
                maxHeight: 200,
            },
            handleImagePicker,
        );
    };

    const showImageOptions = () => {
        Alert.alert(
            'Seleccionar foto',
            'Elige una opción',
            [
                {
                    text: 'Cámara',
                    onPress: openCamera,
                },
                {
                    text: 'Galería',
                    onPress: openImagePicker,
                },
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
            ],
            { cancelable: true },
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.line}>
                <PhotoImg size={120} base64={base64} />

                <TouchableOpacity
                    style={styles.btnIcon}
                    activeOpacity={0.8}
                    onPress={showImageOptions}>
                    <Avatar.Icon
                        size={32}
                        icon="camera"
                        color="#FFFFFF"
                        style={styles.btnIconIcon}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};
