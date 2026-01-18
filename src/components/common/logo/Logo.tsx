import React from 'react';
import { View, Image } from 'react-native';
import { styles } from './logoStyles';

export const Logo: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/company_logo.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

export default Logo;
