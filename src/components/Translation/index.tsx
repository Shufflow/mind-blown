import React, { useState, useCallback, useRef } from 'react';
import { TextInput, View } from 'react-native';

import { Colors } from '@styles';
import icons from '@icons';
import { Locales } from '@locales';
import { HeaderProps } from '@hocs/withHeader';
import pure from '@hocs/pure';

import LanguagePicker from '@components/LanguagePicker';
import SVGButton from '@components/SVGButton';
import Button from '@components/Button';

import styles from './styles';

interface Props extends HeaderProps {
  language: string;
  content: string;
  onTranslation: (language: string, content: string) => void;
  onRemove: (() => void) | null;
}

const Translation = ({
  dark,
  light,
  onTranslation,
  onRemove,
  content: contentProp,
  language: langProp,
}: Props) => {
  const [content, setContent] = useState<string>(contentProp);
  const [language, setLanguage] = useState<string>(langProp);
  const languagePicker = useRef<LanguagePicker | null>(null);

  const handlePressLanguage = useCallback(() => {
    if (languagePicker.current) {
      languagePicker.current.show();
    }
  }, [languagePicker.current]);

  const handleBlur = useCallback(() => {
    onTranslation(language, content);
  }, [onTranslation, language, content]);

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <Button onPress={handlePressLanguage}>{Locales[language]}</Button>
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
        onChangeText={setContent}
        onBlur={handleBlur}
        value={content}
        style={styles.textInput}
        editable
        multiline
      />
      <LanguagePicker
        dark={dark}
        light={light}
        locale={language}
        onSelectValue={setLanguage}
        ref={languagePicker}
      />
    </View>
  );
};

export default pure(Translation);
