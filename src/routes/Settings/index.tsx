import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

import { getColor } from 'src/models/assets';
import getLocale, { setLocale } from 'src/models/locale';

import LanguagePicker from './components/LanguagePicker';

import styles from './styles';

interface Props {
  dismiss: () => void;
}

interface State {
  fg: string | undefined;
  bg: string | undefined;
  locale: string | undefined;
}

class Settings extends React.Component<Props, State> {
  state = {
    bg: undefined,
    fg: undefined,
    locale: undefined,
  };

  async componentDidMount() {
    this.setState({ ...getColor() });

    const locale = await getLocale();
    this.setState({ locale });
  }

  onSelectLanguage = (lang: string) => {
    setLocale(lang);
  };

  render() {
    const { dismiss } = this.props;
    const { bg, fg, locale } = this.state;
    return (
      <React.Fragment>
        <SafeAreaView style={styles.background(bg)} />
        <SafeAreaView style={styles.container(fg)}>
          <View style={styles.header(bg)}>
            <Text style={styles.title(fg)}>Settings</Text>
            <TouchableOpacity onPress={dismiss}>
              <Text style={styles.doneButton(fg)}>Done</Text>
            </TouchableOpacity>
          </View>
          <LanguagePicker
            backgroundColor={bg || 'transparent'}
            foregroundColor={fg || 'transparent'}
            locale={locale || ''}
            onSelectValue={this.onSelectLanguage}
          />
        </SafeAreaView>
      </React.Fragment>
    );
  }
}

export default Settings;
