import { compose } from '@typed/compose';
import React from 'react';

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
    const { bgColor, fgColor, locale, setLocale } = this.props;
    return (
      <React.Fragment>
        <LanguagePicker
          backgroundColor={bgColor}
          foregroundColor={fgColor}
          locale={locale}
          onSelectValue={setLocale}
        />
        <SendSuggestion bgColor={bgColor} fgColor={fgColor} />
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
