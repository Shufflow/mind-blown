import { StyleSheet } from 'react-native';

import colors from '../colorPairs';

it('has valid colors', () => {
  colors.forEach(({ dark, light }) => {
    expect(() => StyleSheet.create({ f: { color: dark } })).not.toThrow();
    expect(() => StyleSheet.create({ f: { color: light } })).not.toThrow();
  });
});
