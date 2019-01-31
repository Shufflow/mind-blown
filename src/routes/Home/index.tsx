import { compose } from '@typed/compose';
import { isEqual } from 'lodash';
import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import AdIds from 'src/models/ads';
import { withLocale } from 'src/utils/hocs/withLocale';

import icons from 'src/assets/icons';
import SVGButton from 'src/components/SVGButton';
import AdBanner from 'src/components/AdBanner';
import SmartComponent from 'src/components/SmartComponent';

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

  render() {
    const { bgColor, fgColor, isDark, phrase, selectedThumb } = this.state;
    const phraseContent = this.viewModel.getPhraseContent();
    return (
      <TouchableWithoutFeedback onPress={this.viewModel.getRandomPhrase}>
        <View style={[styles.container, { backgroundColor: bgColor }]}>
          <AdBanner adUnitID={AdIds.homeTopBanner} />
          <SafeAreaView style={styles.content}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
            <SVGButton
              color={fgColor}
              fillAll
              icon={icons.cog}
              onPress={this.viewModel.handlePressSettings}
              style={styles.settingsButton}
            />
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
                isSelected={selectedThumb === SelectedThumb.Down}
                onPress={this.viewModel.handlePressReview(false)}
              />
              <ThumbUpButton
                color={fgColor}
                isSelected={selectedThumb === SelectedThumb.Up}
                onPress={this.viewModel.handlePressReview(true)}
              />
            </View>
          </SafeAreaView>
          <AdBanner adUnitID={AdIds.homeBottomBanner} />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const enhance = compose(withLocale);
export default enhance(Home);
