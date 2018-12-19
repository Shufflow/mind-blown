import React from 'react';
import { View } from 'react-native';

import PhrasesDataSource from 'src/models/phrases';
import getTheme from 'src/models/themes';

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

    const color = getTheme();
    this.backgroundColor = { backgroundColor: color.bg };
    this.textColor = color.fg;
  }

  componentDidMount() {
    this.dataSource.getRandomPhrase('pt-BR').then(phrase => {
      this.setState({ phrase });
    });
  }

  render() {
    return (
      <View style={[styles.content, this.backgroundColor]}>
        <Phrase content={this.state.phrase || ''} color={this.textColor} />
      </View>
    );
  }
}

export default Home;
