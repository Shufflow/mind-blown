import { StyleSheet } from 'react-native';

import colors from '../colorPairs';

it('has valid colors', () => {
  colors.forEach(({ bg, fg }) => {
    expect(() => StyleSheet.create({ f: { color: bg } })).not.toThrow();
    expect(() => StyleSheet.create({ f: { color: fg } })).not.toThrow();
  });
});
