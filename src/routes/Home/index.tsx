import { compose } from '@typed/compose';
import { isEqual } from 'lodash';
import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  TouchableWithoutFeedback,
  View,
  Text,
} from 'react-native';

import t, { Home as strings } from 'src/locales';
import AdIds from 'src/models/ads';
import { withLocale } from 'src/utils/hocs/withLocale';

import icons from 'src/assets/icons';
import SVGButton from 'src/components/SVGButton';
import AdBanner from 'src/components/AdBanner';
import SmartComponent from 'src/components/SmartComponent';
import Button from 'src/components/Button';

import HomeViewModel, {
  Props,
  State,
  SelectedThumb,
} from 'src/viewModels/home';

import Phrase from './components/Phrase';
import ThumbDownButton from './components/ThumbDownButton';
import ThumbUpButton from './components/ThumbUpButton';
import styles from './styles';

class Home extends SmartComponent<Props, State, HomeViewModel> {
  constructor(props: Props) {
    super(props, HomeViewModel);
  }

  componentDidMount() {
    this.viewModel.loadPhrase();
  }

  shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

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
          <Button onPress={this.viewModel.loadPhrase}>
            {t(strings.tryAgainButton)}
          </Button>
        </View>
        {dummySpacingView}
      </React.Fragment>
    );
  };

  renderPhrase = () => {
    const { fgColor, phrase, selectedThumb } = this.state;
    const phraseContent = this.viewModel.getPhraseContent();
    return (
      <React.Fragment>
        {!!phrase ? (
          <Phrase content={phraseContent} color={fgColor} />
        ) : (
          <ActivityIndicator
            color={fgColor}
            size='large'
            style={styles.activityIndicator}
          />
        )}
        <View style={styles.footer}>
          <ThumbDownButton
            color={fgColor}
            disabled={!phrase}
            isSelected={selectedThumb === SelectedThumb.Down}
            onPress={this.viewModel.handlePressReview(false)}
          />
          <ThumbUpButton
            color={fgColor}
            disabled={!phrase}
            isSelected={selectedThumb === SelectedThumb.Up}
            onPress={this.viewModel.handlePressReview(true)}
          />
        </View>
      </React.Fragment>
    );
  };

  render() {
    const { bgColor, fgColor, hasError, isDark } = this.state;
    return (
      <TouchableWithoutFeedback
        onPress={this.viewModel.getRandomPhrase}
        disabled={hasError}
      >
        <View style={[styles.container, { backgroundColor: bgColor }]}>
          <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
          <AdBanner adUnitID={AdIds.homeTopBanner} />
          <SafeAreaView style={styles.content}>
            <SVGButton
              color={fgColor}
              fillAll
              icon={icons.cog}
              onPress={this.viewModel.handlePressSettings}
              style={styles.settingsButton}
            />
            {hasError ? this.renderError() : this.renderPhrase()}
          </SafeAreaView>
          <AdBanner adUnitID={AdIds.homeBottomBanner} />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const enhance = compose(withLocale);
export default enhance(Home);
