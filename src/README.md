# Guía de Uso de la Estructura

## 📦 Instalación de Dependencias

Primero, instala el plugin de Babel necesario para los path aliases:

```bash
npm install --save-dev babel-plugin-module-resolver
```

Luego reinicia el servidor de Metro:

```bash
npm start -- --reset-cache
```

## 🎯 Uso de Path Aliases

Con la configuración de path aliases, puedes importar módulos de forma más limpia:

### ❌ Antes (imports relativos)
```typescript
import { Button } from '../../../components/common/Button';
import { formatCurrency } from '../../utils/formatters';
import { colors } from '../../../theme/colors';
```

### ✅ Ahora (con path aliases)
```typescript
import { Button } from '@/components/common/Button';
import { formatCurrency } from '@/utils/formatters';
import { colors } from '@/theme/colors';
```

## 📝 Ejemplos de Uso

### Crear un Componente

```typescript
// src/components/common/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
}

export const Button: React.FC<ButtonProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
  },
  text: {
    color: colors.text,
    textAlign: 'center',
  },
});
```

Luego exportarlo en `src/components/index.ts`:
```typescript
export { Button } from './common/Button';
```

### Crear una Pantalla

```typescript
// src/screens/Home/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@/components';
import { colors } from '@/theme/colors';

export const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido</Text>
      <Button title="Comenzar" onPress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    color: colors.text,
    marginBottom: 20,
  },
});
```

### Crear un Custom Hook

```typescript
// src/hooks/useApi.ts
import { useState, useEffect } from 'react';
import { apiClient } from '@/services/api/client';

export const useApi = <T>(endpoint: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await apiClient.get(endpoint);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
};
```

### Usar Utilidades

```typescript
import { formatCurrency, formatDate } from '@/utils/formatters';
import { isValidEmail, isValidPassword } from '@/utils/validation';

// En tu componente
const price = formatCurrency(99.99, 'USD'); // "$99.99"
const date = formatDate(new Date()); // "12/25/2023"
const isValid = isValidEmail('user@example.com'); // true
```

### Usar Constantes y Tema

```typescript
import { APP_CONFIG } from '@/constants/config';
import { colors } from '@/theme/colors';

// En tu componente
const apiUrl = APP_CONFIG.API_BASE_URL;
const primaryColor = colors.primary;
```

## 🔄 Flujo de Trabajo Recomendado

1. **Crear un componente**: 
   - Crea el archivo en `src/components/common/` o `src/components/forms/`
   - Exporta en `src/components/index.ts`
   - Usa `@/components` para importarlo

2. **Crear una pantalla**:
   - Crea una carpeta en `src/screens/` con el nombre de la pantalla
   - Incluye el componente, estilos y lógica relacionada
   - Exporta en `src/screens/index.ts`

3. **Agregar servicios**:
   - Define endpoints en `src/services/api/endpoints.ts`
   - Crea servicios en `src/services/api/services.ts`
   - Usa el cliente en `src/services/api/client.ts`

4. **Agregar utilidades**:
   - Crea funciones puras en `src/utils/`
   - Exporta en `src/utils/index.ts`
   - Usa `@/utils` para importarlas

## 📚 Mejores Prácticas

1. **Siempre usa path aliases** en lugar de imports relativos
2. **Exporta todo desde index.ts** para facilitar los imports
3. **Mantén los componentes pequeños** y enfocados en una responsabilidad
4. **Separa la lógica de negocio** en hooks y servicios
5. **Usa TypeScript** para todos los archivos nuevos
6. **Agrupa archivos relacionados** en la misma carpeta

## 🚀 Próximos Pasos

1. Instala las dependencias necesarias según tus necesidades:
   - `@react-native-async-storage/async-storage` para storage
   - `@react-navigation/native` para navegación
   - `axios` o `fetch` para llamadas API

2. Configura tu sistema de navegación en `src/navigation/`

3. Crea tus primeros componentes y pantallas siguiendo esta estructura

4. Agrega tests en `__tests__/` para tus componentes y utilidades
