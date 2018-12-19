import React from 'react';
import {
  ActivityIndicator,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { getColor } from 'src/models/assets';
import locale from 'src/models/locale';
import PhrasesDataSource from 'src/models/phrases';

import Phrase from './components/Phrase';
import styles from './styles';

interface State {
  backgroundColor: string;
  phrase: string | null;
  textColor: string;
}

class Home extends React.Component<{}, State> {
  dataSource: PhrasesDataSource;

  constructor(props: {}) {
    super(props);

    this.dataSource = new PhrasesDataSource();
    this.state = {
      backgroundColor: '',
      phrase: null,
      textColor: 'white',
    };
  }

  componentDidMount() {
    this.getRandomPhrase();
  }

  getRandomPhrase = () => {
    const color = getColor();
    this.setState({
      backgroundColor: color.bg,
      textColor: color.fg,
    });

    this.dataSource.getRandomPhrase(locale).then(phrase => {
      this.setState({ phrase });
    });
  };

  render() {
    const { backgroundColor, phrase, textColor } = this.state;
    return (
      <TouchableWithoutFeedback onPress={this.getRandomPhrase}>
        <View style={[styles.content, { backgroundColor }]}>
          <ActivityIndicator
            animating={!phrase}
            color={textColor}
            size='large'
            hidesWhenStopped
          />
          <Phrase content={phrase || ''} color={textColor} />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default Home;
