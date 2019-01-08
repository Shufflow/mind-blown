import { compose } from '@typed/compose';
import React from 'react';
import { Text } from 'react-native';

import withColor, { ColorProps } from 'src/utils/hocs/withColors';
import withHeader from 'src/utils/hocs/withHeader';
import { LocaleConsumerProps, withLocale } from 'src/utils/hocs/withLocale';

import SendSuggestion from '../SendSuggestion';

import LanguagePicker from './components/LanguagePicker';

interface Props extends LocaleConsumerProps, ColorProps {
  dismiss: () => void;
}

class Settings extends React.Component<Props> {
  render() {
    const { dark, light, locale, setLocale } = this.props;
    return (
      <React.Fragment>
        {__DEV__ && (
          <Text>
            {dark} - {light}
          </Text>
        )}
        <LanguagePicker
          dark={dark}
          light={light}
          locale={locale}
          onSelectValue={setLocale}
        />
        <SendSuggestion bgColor={dark} fgColor={light} />
      </React.Fragment>
    );
  }
}

const enhance = compose(
  withColor,
  withLocale,
  withHeader({
    rightButton: {
      label: 'Done',
      onPress: ({ dismiss }: Props) => {
        dismiss();
      },
    },
    title: 'Settings',
  }),
);

export default enhance(Settings);
