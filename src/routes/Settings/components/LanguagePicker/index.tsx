import React from 'react';

import t, { Settings as strings, Locales } from '@locales';
import pure from '@hocs/pure';

import Item from '@components/ListItem';
import LanguagePicker from '@components/LanguagePicker';

interface Props {
  dark: string;
  light: string;
  locale: string;
  onSelectValue: (lang: string) => void;
}

interface State {
  isPickerVisible: boolean;
  selectedValue: string;
}

class SettingsLanguagePicker extends React.Component<Props, State> {
  committedLanguage: string = '';
  languagePicker: LanguagePicker | null = null;

  handleLanguagePickerRef = (ref: LanguagePicker) => {
    this.languagePicker = ref;
  };

  showLanguagePicker = () => {
    if (this.languagePicker) {
      this.languagePicker.togglePickerVisible(true)();
    }
  };

  onSelectLanguage = (lang: string) => {
    this.committedLanguage = lang;
  };

  render() {
    const { dark, light, locale, onSelectValue } = this.props;
    const language = Locales[this.committedLanguage || locale] || Locales.en;
    return (
      <React.Fragment>
        <Item label={t(strings.language)} onPress={this.showLanguagePicker}>
          {language}
        </Item>
        <LanguagePicker
          dark={dark}
          light={light}
          locale={locale}
          onSelectValue={onSelectValue}
          ref={this.handleLanguagePickerRef}
        />
      </React.Fragment>
    );
  }
}

export default pure(SettingsLanguagePicker);
