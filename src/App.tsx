// tslint:disable:file-name-casing

import React from 'react';
import { Modal } from 'react-native';

import Home from './routes/Home';
import Settings from './routes/Settings';

interface State {
  isSettingsVisible: boolean;
}

class App extends React.Component<{}, State> {
  state = {
    isSettingsVisible: false,
  };

  toggleSettings = (isSettingsVisible: boolean) => () => {
    this.setState({ isSettingsVisible });
  };

  render() {
    return (
      <React.Fragment>
        <Home onPressSettings={this.toggleSettings(true)} />
        <Modal animationType='slide' visible={this.state.isSettingsVisible}>
          <Settings dismiss={this.toggleSettings(false)} />
        </Modal>
      </React.Fragment>
    );
  }
}

export default App;
// tslint:enable:file-name-casing
