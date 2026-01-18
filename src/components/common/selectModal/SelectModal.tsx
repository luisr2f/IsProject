import React, { useState } from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';
import {
  TextInput,
  Modal,
  Portal,
  Text,
  useTheme,
  Divider,
  IconButton,
  Icon,
} from 'react-native-paper';
import { styles } from './selectModalStyles';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectModalProps {
  /**
   * Etiqueta del campo
   */
  label?: string;
  /**
   * Placeholder del campo
   */
  placeholder?: string;
  /**
   * Opciones disponibles para seleccionar
   */
  options: SelectOption[];
  /**
   * Valor seleccionado actualmente
   */
  value?: string | number | null;
  /**
   * Callback que se ejecuta cuando se selecciona una opción
   */
  onSelect: (value: string | number) => void;
  /**
   * Si el campo está deshabilitado
   */
  disabled?: boolean;
  /**
   * Si el campo es requerido (muestra asterisco)
   */
  required?: boolean;
  /**
   * Mensaje de error a mostrar
   */
  error?: string;
  /**
   * Si el campo tiene un helper text
   */
  helperText?: string;
  /**
   * Estilo personalizado para el contenedor
   */
  style?: any;
  /**
   * Modo del TextInput (flat, outlined)
   */
  mode?: 'flat' | 'outlined';
}

/**
 * Componente SelectModal que muestra un campo similar a un Select de React Native Paper
 * y al hacer tap abre un modal para seleccionar entre las opciones disponibles.
 *
 * @example
 * ```tsx
 * <SelectModal
 *   label="Selecciona una opción"
 *   placeholder="Elige una opción"
 *   options={[
 *     { label: 'Opción 1', value: '1' },
 *     { label: 'Opción 2', value: '2' },
 *   ]}
 *   value={selectedValue}
 *   onSelect={(value) => setSelectedValue(value)}
 * />
 * ```
 */
export const SelectModal: React.FC<SelectModalProps> = ({
  label,
  placeholder = 'Selecciona una opción',
  options,
  value,
  onSelect,
  disabled = false,
  required = false,
  error,
  helperText,
  style,
  mode = 'outlined',
}) => {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  const selectedOption = options.find((option) => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : '';

  const handleSelect = (optionValue: string | number) => {
    onSelect(optionValue);
    setVisible(false);
  };

  const handleOpenModal = () => {
    if (!disabled) {
      setVisible(true);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={handleOpenModal}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <TextInput
          label={required ? `${label} *` : label}
          value={displayValue}
          placeholder={placeholder}
          mode={mode}
          editable={false}
          disabled={disabled}
          error={!!error}
          right={
            <TextInput.Icon
              icon="chevron-down"
              onPress={handleOpenModal}
              disabled={disabled}
            />
          }
          style={styles.input}
          contentStyle={styles.inputContent}
        />
      </TouchableOpacity>

      {error && (
        <Text style={[styles.helperText, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}

      {helperText && !error && (
        <Text
          style={[
            styles.helperText,
            { color: theme.colors.onSurfaceVariant },
          ]}
        >
          {helperText}
        </Text>
      )}

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={[
            styles.modalContainer,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text
              variant="titleLarge"
              style={{ color: theme.colors.onSurface }}
            >
              {label || 'Selecciona una opción'}
            </Text>
            <IconButton
              icon="close"
              size={24}
              onPress={() => setVisible(false)}
              iconColor={theme.colors.onSurface}
            />
          </View>

          <Divider />

          <FlatList
            data={options}
            keyExtractor={(item) => String(item.value)}
            renderItem={({ item }) => {
              const isSelected = item.value === value;
              return (
                <TouchableOpacity
                  onPress={() => handleSelect(item.value)}
                  style={[
                    styles.optionItem,
                    isSelected && {
                      backgroundColor: theme.colors.primaryContainer,
                    },
                  ]}
                >
                  <Text
                    variant="bodyLarge"
                    style={[
                      styles.optionText,
                      {
                        color: isSelected
                          ? theme.colors.onPrimaryContainer
                          : theme.colors.onSurface,
                        fontWeight: isSelected ? '600' : '400',
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                  {isSelected && (
                    <Icon
                      source="check"
                      size={24}
                      color={theme.colors.primary}
                    />
                  )}
                </TouchableOpacity>
              );
            }}
            ItemSeparatorComponent={() => (
              <Divider style={styles.optionSeparator} />
            )}
            style={styles.optionsList}
          />
        </Modal>
      </Portal>
    </View>
  );
};

export default SelectModal;
