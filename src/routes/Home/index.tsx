import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  TouchableWithoutFeedback,
  View,
  Text,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import hooked from 'react-hook-hooked';

import icons from '@icons';
import t, { Home as strings } from '@locales';

import SVGButton from '@components/SVGButton';
import AdBanner from '@components/AdBanner';
import Button from '@components/Button';

import AdIds from 'src/models/ads';

import ThumbDownButton from './components/ThumbDownButton';
import ThumbUpButton from './components/ThumbUpButton';
import styles from './styles';
import usePhrases, { HookedProps, SelectedThumb } from './hooks';

const Home = ({
  colors,
  error,
  getRandomPhrase,
  handlePressReview,
  handlePressSettings,
  handlePressShare,
  handlePhraseContainerSize,
  isLoading,
  font,
  phrase,
  selectedThumb,
  viewShotRef,
}: HookedProps) => {
  const renderError = useCallback(() => {
    const dummySpacingView = <View />;
    return (
      <React.Fragment>
        <View style={styles.errorContainer}>
          <StatusBar
            barStyle={colors.isDark ? 'light-content' : 'dark-content'}
          />
          <Text style={[styles.errorTitle, { color: colors.fgColor }]}>
            {t(strings.errorMessage)}
          </Text>
          <Button onPress={getRandomPhrase}>{t(strings.tryAgainButton)}</Button>
        </View>
        {dummySpacingView}
      </React.Fragment>
    );
  }, [colors]);

  const renderPhrase = useCallback(() => {
    const textStyle = {
      ...font,
      backgroundColor: colors.bgColor,
      color: colors.fgColor,
    };
    return (
      <React.Fragment>
        {!isLoading ? (
          <ViewShot ref={viewShotRef} options={{ format: 'png' }}>
            <Text
              style={[styles.phraseText, textStyle]}
              allowFontScaling
              adjustsFontSizeToFit
            >
              {phrase?.content}
            </Text>
          </ViewShot>
        ) : (
          <ActivityIndicator
            color={colors.fgColor}
            size='large'
            style={styles.activityIndicator}
          />
        )}
      </React.Fragment>
    );
  }, [font, colors]);

  return (
    <TouchableWithoutFeedback onPress={getRandomPhrase} disabled={!!error}>
      <View style={[styles.container, { backgroundColor: colors.bgColor }]}>
        <StatusBar
          barStyle={colors.isDark ? 'light-content' : 'dark-content'}
        />
        <AdBanner adUnitID={AdIds.homeTopBanner} />
        <SafeAreaView style={styles.content}>
          <View style={styles.header}>
            <SVGButton
              fillAll
              color={colors.fgColor}
              icon={icons.share}
              onPress={handlePressShare}
              style={styles.iconButton}
            />
            <SVGButton
              fillAll
              color={colors.fgColor}
              icon={icons.cog}
              onPress={handlePressSettings}
              style={styles.iconButton}
            />
          </View>
          <View
            style={styles.phraseContainer}
            onLayout={handlePhraseContainerSize}
          >
            {!!error ? renderError() : renderPhrase()}
          </View>
          {!error && (
            <View style={styles.footer}>
              <ThumbDownButton
                color={colors.fgColor}
                isSelected={selectedThumb === SelectedThumb.Down}
                onPress={handlePressReview.bind(null, false)}
              />
              <ThumbUpButton
                color={colors.fgColor}
                isSelected={selectedThumb === SelectedThumb.Up}
                onPress={handlePressReview.bind(null, true)}
              />
            </View>
          )}
        </SafeAreaView>
        <AdBanner adUnitID={AdIds.homeBottomBanner} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const enhance = hooked<HookedProps, ReturnType<typeof usePhrases>>(usePhrases);
export default enhance(Home);
