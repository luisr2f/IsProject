import React, { useRef, useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from 'react-native';
import { Text, TextInput, useTheme, Menu } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { AppBar } from '@/components/common';
import { Button } from '@/components';
import { globalStyles } from '@/theme';
import { styles } from './clientFormScreenStyles';
import { APP_CONFIG } from '@/constants/config';
import { useGetInterestsListQuery } from '@/store/api/interestsApi';

type ClientFormScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ClientForm'
>;

const GENERO_OPTIONS = [
  { label: 'Masculino', value: 'M' },
  { label: 'Femenino', value: 'F' },
];

// Validación con yup
const schema = yup
  .object()
  .shape({
    nombre: yup.string().required('El nombre es requerido'),
    apellidos: yup.string().required('Los apellidos son requeridos'),
    identificacion: yup.string().required('La identificación es requerida'),
    celular: yup
      .string()
      .required('El celular es requerido')
      .matches(
        /^[0-9+\-\s()]+$/,
        'El celular solo debe contener números y caracteres válidos',
      ),
    telefono: yup
      .string()
      .required('El teléfono es requerido')
      .matches(
        /^[0-9+\-\s()]+$/,
        'El teléfono solo debe contener números y caracteres válidos',
      ),
    direccion: yup.string().required('La dirección es requerida'),
    fNacimiento: yup
      .string()
      .required('La fecha de nacimiento es requerida')
      .test(
        'date-format',
        'La fecha debe tener el formato DD.MM.YYYY',
        value => {
          if (!value) return false;
          const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
          return dateRegex.test(value);
        },
      )
      .test('valid-date', 'La fecha debe ser válida', value => {
        if (!value) return false;
        // Convertir DD.MM.YYYY a Date
        const parts = value.split('.');
        if (parts.length !== 3) return false;
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Los meses en Date son 0-indexed
        const year = parseInt(parts[2], 10);
        const date = new Date(year, month, day);
        return (
          !isNaN(date.getTime()) &&
          date.getDate() === day &&
          date.getMonth() === month &&
          date.getFullYear() === year
        );
      })
      .test(
        'past-date',
        'La fecha de nacimiento debe ser en el pasado',
        value => {
          if (!value) return false;
          const parts = value.split('.');
          if (parts.length !== 3) return false;
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          const year = parseInt(parts[2], 10);
          const date = new Date(year, month, day);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date < today;
        },
      ),
    fAfiliacion: yup
      .string()
      .required('La fecha de afiliación es requerida')
      .test(
        'date-format',
        'La fecha debe tener el formato DD.MM.YYYY',
        value => {
          if (!value) return false;
          const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
          return dateRegex.test(value);
        },
      )
      .test('valid-date', 'La fecha debe ser válida', value => {
        if (!value) return false;
        // Convertir DD.MM.YYYY a Date
        const parts = value.split('.');
        if (parts.length !== 3) return false;
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Los meses en Date son 0-indexed
        const year = parseInt(parts[2], 10);
        const date = new Date(year, month, day);
        return (
          !isNaN(date.getTime()) &&
          date.getDate() === day &&
          date.getMonth() === month &&
          date.getFullYear() === year
        );
      }),
    genero: yup
      .string()
      .required('El género es requerido')
      .oneOf(['M', 'F'], 'El género debe ser Masculino o Femenino'),
    resenna: yup.string().required('La reseña es requerida'),
    interesFK: yup.string().required('El interés es requerido'),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export const ClientFormScreen: React.FC<ClientFormScreenProps> = ({
  navigation,
}) => {
  const theme = useTheme();
  const scrollRef = useRef<ScrollView | null>(null);
  const [generoMenuVisible, setGeneroMenuVisible] = useState(false);
  const [interesMenuVisible, setInteresMenuVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Obtener lista de intereses desde la API
  const {
    data: interestsData,
    isLoading: isLoadingInterests,
    error: interestsError,
  } = useGetInterestsListQuery();

  // Transformar datos de la API al formato necesario para el componente
  const INTERES_OPTIONS = React.useMemo(() => {
    if (!interestsData) return [];
    return interestsData.map(interest => ({
      label: interest.descripcion,
      value: interest.id,
    }));
  }, [interestsData]);

  // Valores por defecto para desarrollo
  const isDevelopment =
    APP_CONFIG.NODE_ENV === 'development' || APP_CONFIG.NODE_ENV === 'develop';
  const defaultValues = isDevelopment
    ? {
        nombre: 'Juan',
        apellidos: 'Pérez',
        identificacion: '1234567890',
        celular: '3001234567',
        telefono: '3001234569',
        direccion: 'Calle 123 #45-67',
        fNacimiento: '15.01.1990',
        fAfiliacion: (() => {
          const today = new Date();
          const day = String(today.getDate()).padStart(2, '0');
          const month = String(today.getMonth() + 1).padStart(2, '0');
          const year = today.getFullYear();
          return `${day}.${month}.${year}`;
        })(),
        genero: 'M',
        resenna: 'Lorem ipsun',
        interesFK: '47c53f03-87fb-4bc4-8426-d17ef67445e0',
      }
    : {
        nombre: '',
        apellidos: '',
        identificacion: '',
        celular: '',
        telefono: '',
        direccion: '',
        fNacimiento: '',
        fAfiliacion: '',
        genero: '',
        resenna: '',
        interesFK: '',
      };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    mode: 'onSubmit',
    resolver: yupResolver(schema) as any,
    defaultValues,
  });

  // Formatear fecha a DD.MM.YYYY (útil para convertir desde otros formatos)
  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return '';
    // Si ya está en formato DD.MM.YYYY (completo o parcial), devolverlo tal cual
    if (/^[\d.]*$/.test(dateString) && dateString.includes('.')) {
      return dateString;
    }
    // Si está en formato YYYY-MM-DD, convertir
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const parts = dateString.split('-');
      return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }
    // Intentar parsear como Date
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    }
    return dateString;
  };

  const handleDateTextChange = (
    field: 'fNacimiento' | 'fAfiliacion',
    text: string,
  ) => {
    // Permitir solo números y puntos
    let cleaned = text.replace(/[^0-9.]/g, '');

    // Evitar múltiples puntos consecutivos
    cleaned = cleaned.replace(/\.{2,}/g, '.');

    // Limitar formato DD.MM.YYYY
    const parts = cleaned.split('.');
    if (parts.length > 3) {
      // Si hay más de 3 partes, tomar solo las primeras 3
      cleaned = parts.slice(0, 3).join('.');
    }

    // Validar y limitar longitud de cada parte
    const newParts = cleaned.split('.');
    let formatted = '';

    for (let i = 0; i < newParts.length; i++) {
      if (i === 0) {
        // Día: máximo 2 dígitos, validar rango 01-31
        let day = newParts[i].slice(0, 2);
        if (day) {
          const dayNum = parseInt(day, 10);
          if (dayNum > 31) {
            day = '31';
          } else if (dayNum > 0) {
            day = day.padStart(Math.min(day.length, 2), '0');
          }
        }
        formatted = day;
      } else if (i === 1) {
        // Mes: máximo 2 dígitos, validar rango 01-12
        let month = newParts[i].slice(0, 2);
        if (month) {
          const monthNum = parseInt(month, 10);
          if (monthNum > 12) {
            month = '12';
          } else if (monthNum > 0) {
            month = month.padStart(Math.min(month.length, 2), '0');
          }
        }
        formatted += '.' + month;
      } else if (i === 2) {
        // Año: máximo 4 dígitos
        const year = newParts[i].slice(0, 4);
        formatted += '.' + year;
      }
    }

    // Actualizar el valor en el formulario
    setValue(field, formatted, { shouldValidate: false });
  };

  const handleGeneroSelect = (value: string) => {
    setValue('genero', value);
    setGeneroMenuVisible(false);
  };

  const handleInteresSelect = (value: string) => {
    setValue('interesFK', value);
    setInteresMenuVisible(false);
  };

  const onSubmit = async (data: FormData): Promise<void> => {
    Keyboard.dismiss();
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });

    setIsSubmitting(true);
    try {
      // TODO: Integrar con Redux aquí
      console.log('Form data:', data);

      // Simular delay
      await new Promise<void>(resolve => setTimeout(resolve, 1000));

      // Aquí irá la integración con Redux
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[globalStyles.container]}>
      <AppBar title="Mantenimiento de Clientes" type="internalPage" />
      <KeyboardAvoidingView
        style={globalStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={globalStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[globalStyles.content, styles.content]}>
            <View style={globalStyles.form}>
              {/* Identificación */}
              <Controller
                control={control}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    label="Identificación *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    mode="outlined"
                    keyboardType="default"
                    error={!!errors.identificacion}
                    style={globalStyles.input}
                    contentStyle={globalStyles.inputContent}
                  />
                )}
                name="identificacion"
              />
              {errors.identificacion && (
                <Text
                  style={[
                    globalStyles.errorText,
                    { color: theme.colors.error },
                  ]}
                >
                  {errors.identificacion.message}
                </Text>
              )}

              {/* Nombre */}
              <Controller
                control={control}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    label="Nombre *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    mode="outlined"
                    autoCapitalize="words"
                    error={!!errors.nombre}
                    style={globalStyles.input}
                    contentStyle={globalStyles.inputContent}
                  />
                )}
                name="nombre"
              />
              {errors.nombre && (
                <Text
                  style={[
                    globalStyles.errorText,
                    { color: theme.colors.error },
                  ]}
                >
                  {errors.nombre.message}
                </Text>
              )}

              {/* Apellidos */}
              <Controller
                control={control}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    label="Apellidos *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    mode="outlined"
                    autoCapitalize="words"
                    error={!!errors.apellidos}
                    style={globalStyles.input}
                    contentStyle={globalStyles.inputContent}
                  />
                )}
                name="apellidos"
              />
              {errors.apellidos && (
                <Text
                  style={[
                    globalStyles.errorText,
                    { color: theme.colors.error },
                  ]}
                >
                  {errors.apellidos.message}
                </Text>
              )}

              {/* Género */}
              <Controller
                control={control}
                render={({ field: { value } }) => (
                  <View>
                    <Menu
                      visible={generoMenuVisible}
                      onDismiss={() => setGeneroMenuVisible(false)}
                      anchor={
                        <TextInput
                          label="Género *"
                          value={
                            GENERO_OPTIONS.find(opt => opt.value === value)
                              ?.label || ''
                          }
                          mode="outlined"
                          error={!!errors.genero}
                          editable={false}
                          right={
                            <TextInput.Icon
                              icon="chevron-down"
                              onPress={() => setGeneroMenuVisible(true)}
                            />
                          }
                          style={[
                            globalStyles.input,
                            Platform.OS === 'ios' && {
                              backgroundColor: theme.colors.surface,
                            },
                          ]}
                          contentStyle={globalStyles.inputContent}
                        />
                      }
                    >
                      {GENERO_OPTIONS.map(option => (
                        <Menu.Item
                          key={option.value}
                          onPress={() => handleGeneroSelect(option.value)}
                          title={option.label}
                        />
                      ))}
                    </Menu>
                  </View>
                )}
                name="genero"
              />
              {errors.genero && (
                <Text
                  style={[
                    globalStyles.errorText,
                    { color: theme.colors.error },
                  ]}
                >
                  {errors.genero.message}
                </Text>
              )}

              {/* Fecha de Nacimiento */}
              <Controller
                control={control}
                render={({ field: { value, onBlur } }) => {
                  const displayValue = formatDateForDisplay(value);

                  return (
                    <TextInput
                      label="Fecha Nacimiento *"
                      value={displayValue}
                      onChangeText={text => {
                        handleDateTextChange('fNacimiento', text);
                      }}
                      onBlur={onBlur}
                      mode="outlined"
                      keyboardType="numeric"
                      placeholder="DD.MM.YYYY"
                      error={!!errors.fNacimiento}
                      right={<TextInput.Icon icon="calendar" />}
                      style={globalStyles.input}
                      contentStyle={globalStyles.inputContent}
                    />
                  );
                }}
                name="fNacimiento"
              />
              {errors.fNacimiento && (
                <Text
                  style={[
                    globalStyles.errorText,
                    { color: theme.colors.error },
                  ]}
                >
                  {errors.fNacimiento.message}
                </Text>
              )}

              {/* Fecha de Afiliación */}
              <Controller
                control={control}
                render={({ field: { value, onBlur } }) => {
                  const displayValue = formatDateForDisplay(value);

                  return (
                    <TextInput
                      label="Fecha de Afiliación *"
                      value={displayValue}
                      onChangeText={text => {
                        handleDateTextChange('fAfiliacion', text);
                      }}
                      onBlur={onBlur}
                      mode="outlined"
                      keyboardType="numeric"
                      placeholder="DD.MM.YYYY"
                      error={!!errors.fAfiliacion}
                      right={<TextInput.Icon icon="calendar" />}
                      style={globalStyles.input}
                      contentStyle={globalStyles.inputContent}
                    />
                  );
                }}
                name="fAfiliacion"
              />
              {errors.fAfiliacion && (
                <Text
                  style={[
                    globalStyles.errorText,
                    { color: theme.colors.error },
                  ]}
                >
                  {errors.fAfiliacion.message}
                </Text>
              )}

              {/* Celular */}
              <Controller
                control={control}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    label="Celular *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    mode="outlined"
                    keyboardType="phone-pad"
                    error={!!errors.celular}
                    style={globalStyles.input}
                    contentStyle={globalStyles.inputContent}
                  />
                )}
                name="celular"
              />
              {errors.celular && (
                <Text
                  style={[
                    globalStyles.errorText,
                    { color: theme.colors.error },
                  ]}
                >
                  {errors.celular.message}
                </Text>
              )}

              {/* Teléfono */}
              <Controller
                control={control}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    label="Teléfono *"
                    value={value || ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    mode="outlined"
                    keyboardType="phone-pad"
                    error={!!errors.telefono}
                    style={globalStyles.input}
                    contentStyle={globalStyles.inputContent}
                  />
                )}
                name="telefono"
              />
              {errors.telefono && (
                <Text
                  style={[
                    globalStyles.errorText,
                    { color: theme.colors.error },
                  ]}
                >
                  {errors.telefono.message}
                </Text>
              )}

              {/* Interés */}
              <Controller
                control={control}
                render={({ field: { value } }) => (
                  <View>
                    <Menu
                      visible={interesMenuVisible}
                      onDismiss={() => setInteresMenuVisible(false)}
                      anchor={
                        <TextInput
                          label="Interés *"
                          value={
                            isLoadingInterests
                              ? 'Cargando...'
                              : INTERES_OPTIONS.find(opt => opt.value === value)
                                  ?.label || ''
                          }
                          mode="outlined"
                          error={!!errors.interesFK || !!interestsError}
                          editable={false}
                          disabled={isLoadingInterests}
                          right={
                            !isLoadingInterests && (
                              <TextInput.Icon
                                icon="chevron-down"
                                onPress={() => setInteresMenuVisible(true)}
                              />
                            )
                          }
                          style={[
                            globalStyles.input,
                            Platform.OS === 'ios' && {
                              backgroundColor: theme.colors.surface,
                            },
                          ]}
                          contentStyle={globalStyles.inputContent}
                        />
                      }
                    >
                      {INTERES_OPTIONS.map(option => (
                        <Menu.Item
                          key={option.value}
                          onPress={() => handleInteresSelect(option.value)}
                          title={option.label}
                        />
                      ))}
                    </Menu>
                  </View>
                )}
                name="interesFK"
              />
              {errors.interesFK && (
                <Text
                  style={[
                    globalStyles.errorText,
                    { color: theme.colors.error },
                  ]}
                >
                  {errors.interesFK.message}
                </Text>
              )}
              {interestsError && (
                <Text
                  style={[
                    globalStyles.errorText,
                    { color: theme.colors.error },
                  ]}
                >
                  Error al cargar los intereses
                </Text>
              )}

              {/* Dirección */}
              <Controller
                control={control}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    label="Dirección *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    mode="outlined"
                    multiline
                    numberOfLines={3}
                    autoCapitalize="words"
                    error={!!errors.direccion}
                    style={[globalStyles.input, globalStyles.tallInput]}
                    contentStyle={globalStyles.inputContent}
                  />
                )}
                name="direccion"
              />
              {errors.direccion && (
                <Text
                  style={[
                    globalStyles.errorText,
                    { color: theme.colors.error },
                  ]}
                >
                  {errors.direccion.message}
                </Text>
              )}

              {/* Reseña */}
              <Controller
                control={control}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    label="Reseña *"
                    value={value || ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    mode="outlined"
                    multiline
                    numberOfLines={4}
                    error={!!errors.resenna}
                    style={[globalStyles.input, globalStyles.tallInput]}
                    contentStyle={globalStyles.inputContent}
                  />
                )}
                name="resenna"
              />
              {errors.resenna && (
                <Text
                  style={[
                    globalStyles.errorText,
                    { color: theme.colors.error },
                  ]}
                >
                  {errors.resenna.message}
                </Text>
              )}

              {/* Botones */}
              <View style={globalStyles.buttonsContainer}>
                <Button
                  variant="secondary"
                  onPress={() => navigation.goBack()}
                  disabled={isSubmitting}
                  style={styles.button}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onPress={handleSubmit(onSubmit as any)}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  style={styles.button}
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </Button>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
