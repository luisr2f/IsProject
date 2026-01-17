import React, { useRef, useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from 'react-native';
import { Text, TextInput, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Logo, Button } from '@/components';
import { globalStyles } from '@/theme';
import { styles } from './registerScreenStyles';
import { useAppDispatch } from '@/store/hooks';
import { showError, showSuccess, useRegisterMutation } from '@/store';
import { APP_CONFIG } from '@/constants/config';

type RegisterScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Register'
>;

type FormData = {
  username: string;
  email: string;
  password: string;
};

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  navigation,
}) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const scrollRef = useRef<ScrollView | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // RTK Query mutation hook
  const [register, { isLoading }] = useRegisterMutation();

  const schema = yup
    .object()
    .shape({
      username: yup.string().required('El nombre de usuario es requerido'),
      email: yup
        .string()
        .required('El correo electrónico es requerido')
        .email('El correo electrónico no es válido'),
      password: yup
        .string()
        .required('La contraseña es requerida')
        .min(9, 'La contraseña debe tener más de 8 caracteres')
        .max(20, 'La contraseña debe tener máximo 20 caracteres')
        .test(
          'password-requirements',
          'La contraseña debe tener números, al menos una mayúscula y una minúscula',
          value => {
            if (!value) return false;
            const hasNumber = /\d/.test(value);
            const hasUpperCase = /[A-Z]/.test(value);
            const hasLowerCase = /[a-z]/.test(value);
            return hasNumber && hasUpperCase && hasLowerCase;
          },
        ),
    })
    .required();

  // Valores por defecto para desarrollo
  const isDevelopment =
    APP_CONFIG.NODE_ENV === 'development' || APP_CONFIG.NODE_ENV === 'develop';
  const defaultValues: FormData = isDevelopment
    ? {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123456',
      }
    : {
        username: '',
        email: '',
        password: '',
      };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onSubmit',
    resolver: yupResolver(schema),
    defaultValues,
  });

  const handleRegister = async (data: FormData) => {
    Keyboard.dismiss();
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });

    try {
      const result = await register({
        username: data.username,
        email: data.email,
        password: data.password,
      }).unwrap();

      // Mostrar mensaje de éxito
      dispatch(showSuccess('¡Registro exitoso! Redirigiendo a ingresar...'));

      // Navigate to login screen after successful registration
      if (result) {
        setTimeout(() => {
          navigation.navigate('Login');
        }, 1500);
      }
    } catch (error: any) {
      const errorMessage =
        error.data?.message ||
        error.data?.error ||
        error.message ||
        'Error al registrar usuario. Por favor, intente nuevamente.';

      dispatch(showError(errorMessage));
      console.error('Error en el registro:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[
        globalStyles.container,
        { backgroundColor: theme.colors.background },
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={globalStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={globalStyles.content}>
          <Logo />
          <Text
            variant="displaySmall"
            style={[globalStyles.title, { color: theme.colors.onBackground }]}
          >
            Registro
          </Text>

          <View style={globalStyles.form}>
            <Controller
              control={control}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  label="Nombre Usuario"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  autoCapitalize="none"
                  autoComplete="username"
                  error={!!errors.username}
                  style={globalStyles.input}
                  contentStyle={globalStyles.inputContent}
                />
              )}
              name="username"
            />
            {errors.username && (
              <Text
                style={[globalStyles.errorText, { color: theme.colors.error }]}
              >
                {errors.username.message}
              </Text>
            )}

            <Controller
              control={control}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  label="Correo Electrónico"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  error={!!errors.email}
                  style={globalStyles.input}
                  contentStyle={globalStyles.inputContent}
                />
              )}
              name="email"
            />
            {errors.email && (
              <Text
                style={[globalStyles.errorText, { color: theme.colors.error }]}
              >
                {errors.email.message}
              </Text>
            )}

            <Controller
              control={control}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  label="Contraseña"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password-new"
                  error={!!errors.password}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? 'eye-off' : 'eye'}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                  style={globalStyles.input}
                  contentStyle={globalStyles.inputContent}
                />
              )}
              name="password"
            />
            {errors.password && (
              <Text
                style={[globalStyles.errorText, { color: theme.colors.error }]}
              >
                {errors.password.message}
              </Text>
            )}

            <View style={globalStyles.buttonsContainer}>
              <Button
                variant="secondary"
                onPress={() => navigation.goBack()}
                disabled={isLoading}
                style={styles.button}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onPress={handleSubmit(handleRegister)}
                loading={isLoading}
                disabled={isLoading}
                style={styles.button}
              >
                {isLoading ? 'Creando cuenta...' : 'Registrarme'}
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
