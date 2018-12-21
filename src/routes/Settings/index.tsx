import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

import { getColor } from 'src/models/assets';
import { LocaleConsumerProps, withLocale } from 'src/utils/hocs/withLocale';

import LanguagePicker from './components/LanguagePicker';

import styles from './styles';

interface Props extends LocaleConsumerProps {
  dismiss: () => void;
}

interface State {
  fg: string | undefined;
  bg: string | undefined;
}

class Settings extends React.Component<Props, State> {
  state = {
    bg: undefined,
    fg: undefined,
  };

  async componentDidMount() {
    this.setState({ ...getColor() });
  }

  render() {
    const { dismiss, locale, setLocale } = this.props;
    const { bg, fg } = this.state;
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
            locale={locale}
            onSelectValue={setLocale}
          />
        </SafeAreaView>
      </React.Fragment>
    );
  }
}

export default withLocale(Settings);
