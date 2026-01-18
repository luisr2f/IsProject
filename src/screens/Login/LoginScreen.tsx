import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from 'react-native';
import {
  Text,
  TextInput,
  Button as PaperButton,
  useTheme,
} from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Logo, Button } from '@/components';
import { globalStyles } from '@/theme';
import { useAppDispatch } from '@/store/hooks';
import { useLoginMutation } from '@/store/api/authApi';
import { setCredentials } from '@/store/slices/authSlice';
import { showError } from '@/store/slices/snackbarSlice';
import { APP_CONFIG } from '@/constants/config';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

type FormData = {
  username: string;
  password: string;
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const scrollRef = useRef<ScrollView | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Use RTK Query mutation for login
  const [login, { isLoading, reset: resetLogin }] = useLoginMutation();

  const schema = yup
    .object()
    .shape({
      username: yup.string().required('El usuario es requerido'),
      password: yup.string().required('La contraseña es requerida'),
    })
    .required();

  // Credenciales de ejemplo para desarrollo
  const isDevelopment = APP_CONFIG.NODE_ENV === 'development';
  const defaultUsername = isDevelopment ? 'testuser1' : '';
  const defaultPassword = isDevelopment ? 'Test123456' : '';

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onSubmit',
    resolver: yupResolver(schema),
    defaultValues: {
      username: defaultUsername,
      password: defaultPassword,
    },
  });

  // Reset mutation when screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      resetLogin();
    });
    return unsubscribe;
  }, [navigation, resetLogin]);

  const handleLogin = async (data: FormData) => {
    Keyboard.dismiss();
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });

    try {
      const response = await login({
        username: data.username,
        password: data.password,
      }).unwrap();

      // Update Redux state with credentials
      dispatch(
        setCredentials({
          token: response.token,
          expiration: response.expiration,
          userid: response.userid,
          username: response.username,
        }),
      );

      // El cambio de estado de autenticación manejará la navegación automáticamente
    } catch (error: any) {
      // Handle error and show snackbar
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        'Error al iniciar sesión. Por favor, intente nuevamente.';
      dispatch(showError(errorMessage));
      console.error('Error en el login:', error);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
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
            ¡Bienvenido!
          </Text>

          <View style={globalStyles.form}>
            <Controller
              control={control}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  label="Usuario *"
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
                  label="Contraseña *"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
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

            <Button
              variant="primary"
              onPress={handleSubmit(handleLogin)}
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'INICIAR SESIÓN'}
            </Button>

            <View style={globalStyles.registerContainer}>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                ¿No tiene una cuenta?{' '}
              </Text>
              <PaperButton
                mode="text"
                onPress={navigateToRegister}
                compact
                textColor={theme.colors.primary}
              >
                Regístrese
              </PaperButton>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
