import React from 'react';

import Button, { ButtonTheme } from 'src/components/Button';

import styles from './styles';

interface Props {
  children: React.ReactNode;
  color: string;
  onPress: () => void;
}

const HeaderButton = ({
  children,
  color,
  onPress,
}: Props): React.ReactElement<Props> => (
  <Button
    onPress={onPress}
    textStyle={styles.button(color)}
    theme={ButtonTheme.minimalist}
  >
    {children}
  </Button>
);

export default HeaderButton;
