import { isEqual } from 'lodash';
import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  TouchableWithoutFeedback,
  View,
  Text,
  LayoutChangeEvent,
} from 'react-native';
import ViewShot from 'react-native-view-shot';

import icons from '@icons';
import t, { Home as strings } from '@locales';
import { withLocale } from '@hocs/withLocale';
import { compose } from '@utils/compose';

import SVGButton from '@components/SVGButton';
import AdBanner from '@components/AdBanner';
import SmartComponent from '@components/SmartComponent';
import Button from '@components/Button';

import AdIds from 'src/models/ads';

import HomeViewModel, {
  Props,
  State,
  SelectedThumb,
} from 'src/viewModels/home';

import ThumbDownButton from './components/ThumbDownButton';
import ThumbUpButton from './components/ThumbUpButton';
import styles from './styles';

class Home extends SmartComponent<Props, State, HomeViewModel> {
  constructor(props: Props) {
    super(props, HomeViewModel);
  }

  componentDidMount() {
    this.viewModel.getRandomPhrase();
  }

  shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  handlePhraseLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    this.viewModel.handlePhraseContainerSize(layout);
  };

  renderError = () => {
    const { fgColor, isDark } = this.state;
    const dummySpacingView = <View />;
    return (
      <React.Fragment>
        <View style={styles.errorContainer}>
          <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
          <Text style={[styles.errorTitle, { color: fgColor }]}>
            {t(strings.errorMessage)}
          </Text>
          <Button onPress={this.viewModel.getRandomPhrase}>
            {t(strings.tryAgainButton)}
          </Button>
        </View>
        {dummySpacingView}
      </React.Fragment>
    );
  };

  renderPhrase = () => {
    const {
      fgColor: color,
      bgColor: backgroundColor,
      font,
      phrase,
    } = this.state;
    const phraseContent = this.viewModel.getPhraseContent();
    const textStyle = {
      ...font,
      backgroundColor,
      color,
    };
    const isLoading = !phrase || !font.fontSize;
    return (
      <React.Fragment>
        {!isLoading ? (
          <ViewShot
            ref={this.viewModel.handleViewShotRef}
            options={{ format: 'png' }}
          >
            <Text
              style={[styles.phraseText, textStyle]}
              allowFontScaling
              adjustsFontSizeToFit
            >
              {phraseContent}
            </Text>
          </ViewShot>
        ) : (
          <ActivityIndicator
            color={color}
            size='large'
            style={styles.activityIndicator}
          />
        )}
      </React.Fragment>
    );
  };

  render() {
    const { bgColor, fgColor, hasError, isDark, selectedThumb } = this.state;
    return (
      <TouchableWithoutFeedback
        onPress={this.viewModel.getRandomPhrase}
        disabled={hasError}
      >
        <View style={[styles.container, { backgroundColor: bgColor }]}>
          <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
          <AdBanner adUnitID={AdIds.homeTopBanner} />
          <SafeAreaView style={styles.content}>
            <View style={styles.header}>
              <SVGButton
                fillAll
                color={fgColor}
                icon={icons.share}
                onPress={this.viewModel.handlePressShare}
                style={styles.iconButton}
              />
              <SVGButton
                fillAll
                color={fgColor}
                icon={icons.cog}
                onPress={this.viewModel.handlePressSettings}
                style={styles.iconButton}
              />
            </View>
            <View
              style={styles.phraseContainer}
              onLayout={this.handlePhraseLayout}
            >
              {hasError ? this.renderError() : this.renderPhrase()}
            </View>
            {!hasError && (
              <View style={styles.footer}>
                <ThumbDownButton
                  color={fgColor}
                  isSelected={selectedThumb === SelectedThumb.Down}
                  onPress={this.viewModel.handlePressReview(false)}
                />
                <ThumbUpButton
                  color={fgColor}
                  isSelected={selectedThumb === SelectedThumb.Up}
                  onPress={this.viewModel.handlePressReview(true)}
                />
              </View>
            )}
          </SafeAreaView>
          <AdBanner adUnitID={AdIds.homeBottomBanner} />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const enhance = compose(withLocale);
export default enhance(Home);
