import React, { useRef, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView, Keyboard } from 'react-native';
import { Text, TextInput, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Logo, Button } from '@/components';
import { globalStyles } from '@/theme';
import { styles } from './registerScreenStyles';

type RegisterScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Register'
>;

type FormData = {
  name: string;
  email: string;
  password: string;
};

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  navigation,
}) => {
  const theme = useTheme();
  const scrollRef = useRef<ScrollView | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const schema = yup
    .object()
    .shape({
      name: yup
        .string()
        .required('El nombre es requerido'),
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
          (value) => {
            if (!value) return false;
            const hasNumber = /\d/.test(value);
            const hasUpperCase = /[A-Z]/.test(value);
            const hasLowerCase = /[a-z]/.test(value);
            return hasNumber && hasUpperCase && hasLowerCase;
          }
        ),
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
      name: '',
      email: '',
      password: '',
    },
  });

  const handleRegister = async (data: FormData) => {
    Keyboard.dismiss();
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });

    setLoading(true);
    try {
      // Aquí iría la lógica de registro
      console.log('Datos del formulario:', data);
      // await signUp({ email: data.email, password: data.password, name: data.name });
    } catch (error) {
      console.error('Error en el registro:', error);
    } finally {
      setLoading(false);
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
                  autoCapitalize="words"
                  autoComplete="name"
                  error={!!errors.name}
                  style={globalStyles.input}
                  contentStyle={globalStyles.inputContent}
                />
              )}
              name="name"
            />
            {errors.name && (
              <Text style={[globalStyles.errorText, { color: theme.colors.error }]}>
                {errors.name.message}
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
              <Text style={[globalStyles.errorText, { color: theme.colors.error }]}>
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
              <Text style={[globalStyles.errorText, { color: theme.colors.error }]}>
                {errors.password.message}
              </Text>
            )}

            <View style={globalStyles.buttonsContainer}>
              <Button
                variant="secondary"
                onPress={() => navigation.goBack()}
                disabled={loading}
                style={styles.button}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onPress={handleSubmit(handleRegister)}
                loading={loading}
                disabled={loading}
                style={styles.button}
              >
                {loading ? 'Creando cuenta...' : 'Registrarme'}
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
