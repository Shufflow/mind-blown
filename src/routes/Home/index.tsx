import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { getColor } from 'src/models/assets';
import PhrasesDataSource from 'src/models/phrases';

import Phrase from './components/Phrase';
import styles from './styles';

interface State {
  phrase: string | null;
}

class Home extends React.Component<{}, State> {
  dataSource: PhrasesDataSource;
  backgroundColor: { backgroundColor: string };
  textColor: string;

  constructor(props: {}) {
    super(props);

    this.dataSource = new PhrasesDataSource();
    this.state = {
      phrase: null,
    };

    const color = getColor();
    this.backgroundColor = { backgroundColor: color.bg };
    this.textColor = color.fg;
  }

  componentDidMount() {
    this.dataSource.getRandomPhrase('pt-BR').then(phrase => {
      this.setState({ phrase });
    });
  }

  render() {
    const { phrase } = this.state;
    return (
      <View style={[styles.content, this.backgroundColor]}>
        <ActivityIndicator
          animating={!phrase}
          color={this.textColor}
          size='large'
          hidesWhenStopped
        />
        <Phrase content={phrase || ''} color={this.textColor} />
      </View>
    );
  }
}

export default Home;
