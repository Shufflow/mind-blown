import React from 'react';

import pure from 'src/utils/hocs/pure';
import t, { Settings as strings } from 'src/locales';

import { Locales } from 'src/models/locale';

import Item from 'src/components/ListItem';
import LanguagePicker from 'src/components/LanguagePicker';

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
    return (
      <React.Fragment>
        <Item
          label={t(strings.language)}
          onPress={this.showLanguagePicker}
          value={Locales[this.committedLanguage || locale]}
        />
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
