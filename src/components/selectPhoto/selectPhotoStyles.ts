import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

const box = 140;

export const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    line: {
        borderWidth: 1,
        borderColor: colors.border,
        height: box,
        width: box,
        borderRadius: box / 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#29C1D1',
        borderRadius: 30,
        padding: 8,
    },
    btnIconIcon: {
        backgroundColor: 'transparent',
    },
});
