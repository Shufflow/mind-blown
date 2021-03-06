import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, View, Text, ScrollView } from 'react-native';
import hooked from 'react-hook-hooked';

import { Colors } from '@styles';
import icons from '@icons';
import t, { ModeratePhrases as strings } from '@locales';
import { getDate } from '@utils/dateFormatter';

import SVGButton from '@components/SVGButton';
import Button from '@components/Button';

import { Translation as TranslationType } from 'src/models/types';

import Translation from '../../components/Translation';
import styles from './styles';
import useModeratePhrases, { Props } from './hooks';

const ModeratePhrases = ({
  handlePressAddTranslation,
  handlePressDiscard,
  handlePressSave,
  handlePressVisitOriginal,
  handleRemoveTranslation,
  handleTranslate,
  isLoading,
  navigation: {
    color: { dark, light },
  },
  phrase,
  translations,
}: Props) => {
  const removeTranslation = useCallback(
    (idx: number) => () => {
      handleRemoveTranslation(idx);
    },
    [handleRemoveTranslation],
  );

  const translate = useCallback(
    (idx: number) => (language: string, content: string) => {
      handleTranslate(idx, language, content);
    },
    [handleTranslate],
  );

  const translationList = useMemo(
    () =>
      translations.map(
        ({ language, content }: TranslationType, idx: number) => {
          return (
            <Translation
              key={`${language}-${content}-${idx.toString()}}`}
              content={content}
              dark={dark}
              language={language}
              light={light}
              onRemove={idx === 0 ? null : removeTranslation(idx)}
              onTranslation={translate(idx)}
            />
          );
        },
      ),
    [translations, dark, light, translate, handleRemoveTranslation],
  );

  const isEmpty = !isLoading && !phrase;
  return (
    <ScrollView
      style={styles.container(light)}
      contentContainerStyle={styles.scrollViewContent}
    >
      {isLoading && (
        <ActivityIndicator
          color={dark}
          size='large'
          style={styles.activityIndicator}
        />
      )}
      {!isLoading && !!phrase && (
        <React.Fragment>
          <View style={styles.content}>
            <Text style={styles.text}>{phrase.content}</Text>
            <View style={styles.columnContainer}>
              <View>
                <Text style={styles.text}>{t(strings.score, phrase)}</Text>
                {!!phrase.dateAdded && (
                  <Text style={styles.text}>
                    {t(strings.dateAdded, { date: getDate(phrase.dateAdded) })}
                  </Text>
                )}
              </View>
              <Button onPress={handlePressVisitOriginal}>
                {t(strings.visitOriginal)}
              </Button>
            </View>
            {translationList}
            <SVGButton
              icon={icons.plus}
              color={Colors.darkGray}
              style={styles.plusButton}
              onPress={handlePressAddTranslation}
              fillAll
            />
          </View>
          <View style={styles.footer}>
            <Button onPress={handlePressDiscard} style={styles.discardButton}>
              {t(strings.discard)}
            </Button>
            <Button onPress={handlePressSave} style={styles.saveButton}>
              {t(strings.save)}
            </Button>
          </View>
        </React.Fragment>
      )}
      {isEmpty && <Text style={styles.empty}>{t(strings.emptyList)}</Text>}
    </ScrollView>
  );
};

const enhance = hooked<Props, ReturnType<typeof useModeratePhrases>, void>(
  useModeratePhrases,
);
export default enhance(ModeratePhrases);
