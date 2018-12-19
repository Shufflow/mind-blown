import React from 'react';
import { View } from 'react-native';

import PhrasesDataSource from 'src/models/phrases';

import Phrase from './components/Phrase';
import styles from './styles';

interface State {
  phrase: string | null;
}

class Home extends React.Component<{}, State> {
  dataSource: PhrasesDataSource;

  constructor(props: {}) {
    super(props);

    this.dataSource = new PhrasesDataSource();
    this.state = {
      phrase: null,
    };
  }

  componentDidMount() {
    this.dataSource
      .getRandomPhrase('pt-BR')
      .then(phrase => this.setState({ phrase }));
  }

  render() {
    return (
      <View style={styles.content}>
        <Phrase content={this.state.phrase || ''} />
      </View>
    );
  }
}

export default Home;
