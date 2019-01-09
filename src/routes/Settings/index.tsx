import { compose } from '@typed/compose';
import React from 'react';

import withColor, { ColorProps } from 'src/utils/hocs/withColors';
import withHeader from 'src/utils/hocs/withHeader';
import { LocaleConsumerProps, withLocale } from 'src/utils/hocs/withLocale';

import Dev from 'src/components/Dev';

import SendSuggestion from '../SendSuggestion';
import RedditPhrases from '../RedditPhrases';

import LanguagePicker from './components/LanguagePicker';

interface Props extends LocaleConsumerProps, ColorProps {
  dismiss: () => void;
}

class Settings extends React.Component<Props> {
  render() {
    const { dark, light, locale, setLocale } = this.props;
    return (
      <React.Fragment>
        <LanguagePicker
          dark={dark}
          light={light}
          locale={locale}
          onSelectValue={setLocale}
        />
        <SendSuggestion dark={dark} light={light} />
        <Dev>
          <RedditPhrases dark={dark} light={light} />
        </Dev>
        <Dev>
          {dark} - {light}
        </Dev>
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
