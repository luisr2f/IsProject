import React, { useRef, useEffect } from 'react';
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
import { AppBar, SelectModal } from '@/components/common';
import { Button, LoadingOverlay } from '@/components';
import { globalStyles } from '@/theme';
import { styles } from './clientFormScreenStyles';
import { APP_CONFIG } from '@/constants/config';
import { useGetInterestsListQuery } from '@/store/api/interestsApi';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  useCreateClientMutation,
  useUpdateClientMutation,
  useGetClientByIdQuery,
} from '@/store/api/clientApi';
import { showSuccess, showError } from '@/store/slices/snackbarSlice';
import { Loading } from '@/components/common/loading';
import { SelectPhoto } from '@/components/selectPhoto';
import { ClientDelete } from '@/components/clientDelete';

type ClientFormScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ClientForm'
>;

const GENERO_OPTIONS = [
  { label: 'Masculino', value: 'M' },
  { label: 'Femenino', value: 'F' },
];

// Función helper para validación de fechas
const createDateValidation = (requiredMessage: string) => {
  return yup
    .string()
    .required(requiredMessage)
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
    .test('past-date', 'La fecha debe ser en el pasado', value => {
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
    });
};

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
    otroTelefono: yup
      .string()
      .required('El teléfono es requerido')
      .matches(
        /^[0-9+\-\s()]+$/,
        'El teléfono solo debe contener números y caracteres válidos',
      ),
    direccion: yup.string().required('La dirección es requerida'),
    fNacimiento: createDateValidation('La fecha de nacimiento es requerida'),
    fAfiliacion: createDateValidation('La fecha de afiliación es requerida'),
    sexo: yup
      .string()
      .required('El género es requerido')
      .oneOf(['M', 'F'], 'El género debe ser Masculino o Femenino'),
    resennaPersonal: yup.string().required('La reseña es requerida'),
    imagen: yup.string().optional(),
    interesFK: yup.string().required('El interés es requerido'),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export const ClientFormScreen: React.FC<ClientFormScreenProps> = ({
  navigation,
  route,
}) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const scrollRef = useRef<ScrollView | null>(null);

  // Obtener el parámetro id opcional
  const id = route.params?.id;

  // Obtener usuarioId del estado de autenticación
  const usuarioId = useAppSelector(state => state.auth.userid);

  // Consultar cliente por ID si el id es válido
  const {
    data: clientByIdData,
    isLoading: isLoadingClient,
    error: clientError,
  } = useGetClientByIdQuery(id || '', {
    skip: !id,
  });

  // Mutation hooks para crear y actualizar cliente
  const [createClient, { isLoading: isCreating }] = useCreateClientMutation();
  const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation();

  const isSubmitting = isCreating || isUpdating;

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
      otroTelefono: '3001234569',
      direccion: 'Calle 123 #45-67',
      fNacimiento: '15.01.1990',
      fAfiliacion: '15.01.2026',
      sexo: 'M',
      resennaPersonal: 'Lorem ipsun',
      imagen: 'string',
      interesFK: '47c53f03-87fb-4bc4-8426-d17ef67445e0',
    }
    : {
      nombre: '',
      apellidos: '',
      identificacion: '',
      celular: '',
      otroTelefono: '',
      direccion: '',
      fNacimiento: '',
      fAfiliacion: '',
      sexo: '',
      resennaPersonal: '',
      imagen: '',
      interesFK: '',
    };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormData>({
    mode: 'onSubmit',
    resolver: yupResolver(schema) as any,
    defaultValues,
  });

  // Setear valores del formulario cuando se cargan los datos del cliente en modo edición
  useEffect(() => {
    if (clientByIdData && !isLoadingClient) {
      reset({
        nombre: clientByIdData.nombre || '',
        apellidos: clientByIdData.apellidos || '',
        identificacion: clientByIdData.identificacion || '',
        celular: clientByIdData.telefonoCelular || '', // Mapear telefonoCelular -> celular
        otroTelefono: clientByIdData.otroTelefono || '',
        direccion: clientByIdData.direccion || '',
        fNacimiento: convertDateFromISO(clientByIdData.fNacimiento),
        fAfiliacion: convertDateFromISO(clientByIdData.fAfiliacion),
        sexo: clientByIdData.sexo || '',
        resennaPersonal: clientByIdData.resenaPersonal || '', // Mapear resenaPersonal -> resennaPersonal
        imagen: clientByIdData.imagen || '',
        interesFK: clientByIdData.interesesId || '', // Mapear interesesId -> interesFK
      });
    }
  }, [clientByIdData, isLoadingClient, reset]);


  // Validar formato de fecha (solo validación, sin formatear)
  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return '';
    // Devolver el valor tal cual, sin formatear
    return dateString;
  };

  const handleDateTextChange = (
    field: 'fNacimiento' | 'fAfiliacion',
    text: string,
  ) => {
    // Solo validar formato: permitir solo números y puntos
    // Evitar múltiples puntos consecutivos
    const cleaned = text
      .replace(/[^0-9.]/g, '') // Solo números y puntos
      .replace(/\.{2,}/g, '.'); // Evitar múltiples puntos consecutivos

    // Actualizar el valor en el formulario y validar
    setValue(field, cleaned, { shouldValidate: true });
  };

  // Convertir fecha de DD.MM.YYYY a formato ISO (2026-02-17T16:46:09.632Z)
  const convertDateToISO = (dateString: string): string => {
    if (!dateString) return '';
    // Verificar que esté en formato DD.MM.YYYY
    const parts = dateString.split('.');
    if (parts.length !== 3) return dateString;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Los meses en Date son 0-indexed
    const year = parseInt(parts[2], 10);

    const date = new Date(year, month, day);
    // Verificar que la fecha sea válida
    if (isNaN(date.getTime())) return dateString;

    return date.toISOString();
  };

  // Convertir fecha de ISO a formato DD.MM.YYYY
  const convertDateFromISO = (isoString: string): string => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return '';

      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();

      return `${day}.${month}.${year}`;
    } catch {
      return '';
    }
  };

  const onSubmit = async (data: FormData): Promise<void> => {
    Keyboard.dismiss();
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });

    try {
      const clientData = {
        nombre: data.nombre,
        apellidos: data.apellidos,
        identificacion: data.identificacion,
        celular: data.celular,
        otroTelefono: data.otroTelefono,
        direccion: data.direccion,
        fNacimiento: convertDateToISO(data.fNacimiento),
        fAfiliacion: convertDateToISO(data.fAfiliacion),
        sexo: data.sexo as 'M' | 'F',
        resennaPersonal: data.resennaPersonal,
        imagen: data.imagen || '',
        interesFK: data.interesFK,
        usuarioId: usuarioId || '',
      };

      // Si hay un id, estamos en modo edición, usar updateClient
      if (id) {
        await updateClient({ ...clientData, id }).unwrap();
        dispatch(showSuccess('Cliente actualizado exitosamente'));
      } else {
        // Si no hay id, estamos en modo creación, usar createClient
        await createClient(clientData).unwrap();
        dispatch(showSuccess('Cliente creado exitosamente'));
      }

      // Navegar de vuelta después de un breve delay para que el usuario vea el mensaje
      setTimeout(() => {
        navigation.goBack();
      }, 500);
    } catch (error: any) {
      console.error(`Error al ${id ? 'actualizar' : 'crear'} cliente:`, error);
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        `Error al ${id ? 'actualizar' : 'crear'} el cliente. Por favor, intente nuevamente.`;
      dispatch(showError(errorMessage));
    }
  };

  return (
    <View style={[globalStyles.container]}>
      <AppBar title="Mantenimiento de Clientes" type="internalPage" />
      <KeyboardAvoidingView
        style={globalStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {isLoadingClient ? <><Loading /></> : <ScrollView
          ref={scrollRef}
          contentContainerStyle={globalStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[globalStyles.content, styles.content]}>
            <View style={globalStyles.form}>

              <Controller
                control={control}
                render={({ field: { value } }) => (
                  <SelectPhoto
                    base64={value}
                    onImageSelected={(base64) => {
                      setValue('imagen', base64, { shouldValidate: true });
                    }}
                  />
                )}
                name="imagen"
              />



              {/* Mostrar datos del cliente si existe id y se cargaron los datos */}
              {/*<Text>id: {id || 'No proporcionado'}</Text>*/}

              {/*id && (
                <View style={{ marginTop: 10, marginBottom: 10 }}>
                  {isLoadingClient && (
                    <Text style={{ color: theme.colors.primary }}>
                      Cargando datos del cliente...
                    </Text>
                  )}
                  {!!clientError && (
                    <Text style={{ color: theme.colors.error }}>
                      Error al cargar datos del cliente
                    </Text>
                  )}
                  {clientByIdData && !isLoadingClient && (
                    <Text
                      style={{
                        fontFamily: 'monospace',
                        fontSize: 12,
                        color: theme.colors.onSurface,
                        backgroundColor: theme.colors.surfaceVariant,
                        padding: 10,
                        borderRadius: 4,
                      }}
                    >
                      {JSON.stringify(clientByIdData, null, 2)}
                    </Text>
                  )}
                </View>
              )*/}

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
                render={({ field: { value, onChange } }) => (
                  <SelectModal
                    label="Género"
                    placeholder="Selecciona el género"
                    options={GENERO_OPTIONS}
                    value={value}
                    onSelect={(selectedValue) => onChange(selectedValue as string)}
                    required
                    error={errors.sexo?.message}
                    style={globalStyles.input}
                    mode="outlined"
                  />
                )}
                name="sexo"
              />

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
                    error={!!errors.otroTelefono}
                    style={globalStyles.input}
                    contentStyle={globalStyles.inputContent}
                  />
                )}
                name="otroTelefono"
              />
              {errors.otroTelefono && (
                <Text
                  style={[
                    globalStyles.errorText,
                    { color: theme.colors.error },
                  ]}
                >
                  {errors.otroTelefono.message}
                </Text>
              )}

              {/* Interés */}
              <Controller
                control={control}
                render={({ field: { value, onChange } }) => (
                  <SelectModal
                    label="Interés"
                    placeholder={
                      isLoadingInterests
                        ? 'Cargando...'
                        : 'Selecciona un interés'
                    }
                    options={INTERES_OPTIONS}
                    value={value}
                    onSelect={(selectedValue) =>
                      onChange(selectedValue as string)
                    }
                    required
                    disabled={isLoadingInterests}
                    error={
                      errors.interesFK?.message ||
                      (interestsError ? 'Error al cargar los intereses' : undefined)
                    }
                    style={globalStyles.input}
                    mode="outlined"
                  />
                )}
                name="interesFK"
              />

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
                    error={!!errors.resennaPersonal}
                    style={[globalStyles.input, globalStyles.tallInput]}
                    contentStyle={globalStyles.inputContent}
                  />
                )}
                name="resennaPersonal"
              />
              {errors.resennaPersonal && (
                <Text
                  style={[
                    globalStyles.errorText,
                    { color: theme.colors.error },
                  ]}
                >
                  {errors.resennaPersonal.message}
                </Text>
              )}

              {/* Botones */}
              <View style={globalStyles.buttonsContainer}>
                {id && (
                  <ClientDelete
                    clientId={id}
                    onDeleteSuccess={() => {
                      setTimeout(() => {
                        navigation.goBack();
                      }, 500);
                    }}
                    style={styles.button}
                  />
                )}
                <Button
                  variant="primary"
                  onPress={handleSubmit(onSubmit as any)}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  style={id ? styles.button : styles.buttonFullWidth}
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </Button>
              </View>
            </View>
          </View>
        </ScrollView>}

      </KeyboardAvoidingView>
      <LoadingOverlay
        visible={isSubmitting}
        message={id ? 'Actualizando cliente...' : 'Guardando cliente...'}
      />
    </View>
  );
};
