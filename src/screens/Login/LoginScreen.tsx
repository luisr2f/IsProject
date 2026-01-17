import React, { useRef, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView, Keyboard } from 'react-native';
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

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

type FormData = {
  email: string;
  password: string;
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const scrollRef = useRef<ScrollView | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const schema = yup
    .object()
    .shape({
      email: yup
        .string()
        .required('El correo electrónico es requerido')
        .email('El correo electrónico no es válido'),
      password: yup
        .string()
        .required('La contraseña es requerida'),
    })
    .required();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onSubmit',
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (data: FormData) => {
    Keyboard.dismiss();
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });

    setLoading(true);
    try {
      // Aquí iría la lógica de login
      console.log('Datos del formulario:', data);
      // await signIn({ email: data.email, password: data.password });
    } catch (error) {
      console.error('Error en el login:', error);
    } finally {
      setLoading(false);
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
              <Text style={[globalStyles.errorText, { color: theme.colors.error }]}>
                {errors.email.message}
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
              <Text style={[globalStyles.errorText, { color: theme.colors.error }]}>
                {errors.password.message}
              </Text>
            )}

            <Button
              variant="primary"
              onPress={handleSubmit(handleLogin)}
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'INICIAR SESIÓN'}
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
