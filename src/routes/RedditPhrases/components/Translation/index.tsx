import React from 'react';
import { TextInput, View } from 'react-native';

import { HeaderProps } from 'src/utils/hocs/withHeader';
import { Colors } from 'src/utils/styles';
import icons from 'src/assets/icons';

import { Locales } from 'src/models/locale';

import LanguagePicker from 'src/components/LanguagePicker';
import SVGButton from 'src/components/SVGButton';

import styles from './styles';
import Button from 'src/components/Button';

interface Props extends HeaderProps {
  language: string;
  content: string;
  onTranslation: (language: string, content: string) => void;
  onRemove: (() => void) | null;
}

interface State {
  content: string;
  language: string;
}

class Translation extends React.Component<Props, State> {
  languagePicker: LanguagePicker | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      content: props.content,
      language: props.language,
    };
  }

  handleLanguagePickerRef = (ref: LanguagePicker) => {
    this.languagePicker = ref;
  };

  onPressLanguage = () => {
    if (this.languagePicker) {
      this.languagePicker.show();
    }
  };

  onChangeText = (content: string) => {
    this.setState({ content });

    const { language } = this.state;
    if (content && language) {
      this.props.onTranslation(language, content);
    }
  };

  onSelectLanguage = (language: string) => {
    this.setState({ language });

    const { content } = this.state;
    if (language && content) {
      this.props.onTranslation(language, content);
    }
  };

  render() {
    const { onRemove, dark, light } = this.props;
    const { content, language } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.buttonsContainer}>
          <Button onPress={this.onPressLanguage}>{Locales[language]}</Button>
          {!!onRemove && (
            <SVGButton
              color={Colors.darkGray}
              icon={icons.minus}
              onPress={onRemove}
              style={styles.removeButton}
              fillAll
            />
          )}
        </View>
        <TextInput
          onChangeText={this.onChangeText}
          value={content}
          style={styles.textInput}
          autoFocus
          editable
          multiline
        />
        <LanguagePicker
          dark={dark}
          light={light}
          locale={language || Locales.en}
          onSelectValue={this.onSelectLanguage}
          ref={this.handleLanguagePickerRef}
        />
      </View>
    );
  }
}

export default Translation;
