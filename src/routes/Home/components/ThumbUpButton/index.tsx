import React from 'react';

import icons from '@icons';
import pure from '@hocs/pure';
import SVGButton from '@components/SVGButton';

import styles from './styles';

interface Props {
  color: string;
  disabled?: boolean;
  isSelected?: boolean;
  onPress: () => void;
}

const ThumbsUpButton = ({
  color,
  disabled = false,
  isSelected,
  onPress,
}: Props): React.ReactElement<Props> => (
  <SVGButton
    color={color}
    disabled={disabled}
    fillAll
    icon={isSelected ? icons.thumbsUpSolid : icons.thumbsUp}
    onPress={onPress}
    style={styles.container}
  />
);

export default pure(ThumbsUpButton);
