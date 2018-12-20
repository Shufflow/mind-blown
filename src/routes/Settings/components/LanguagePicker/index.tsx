import React from 'react';
import { Modal, Picker, Text, TouchableOpacity, View } from 'react-native';

import Item from '../Item';

import styles from './styles';

interface Props {
  backgroundColor: string;
  foregroundColor: string;
  onSelectValue: (lang: string) => void;
}

interface State {
  isPickerVisible: boolean;
  selectedValue: string;
}

class LanguagePicker extends React.Component<Props, State> {
  committedLanguage: string = 'en';

  state = {
    isPickerVisible: false,
    selectedValue: 'en',
  };

  togglePickerVisible = (isPickerVisible: boolean) => () => {
    this.setState({ isPickerVisible });
  };

  onSelectValue = (selectedValue: string) => {
    this.setState({ selectedValue });
  };

  onPressDone = () => {
    const { selectedValue } = this.state;
    this.props.onSelectValue(selectedValue);
    this.committedLanguage = selectedValue;
    this.togglePickerVisible(false)();
  };

  render() {
    const { backgroundColor, foregroundColor } = this.props;
    const { isPickerVisible, selectedValue } = this.state;
    return (
      <React.Fragment>
        <Item
          label='Language'
          onPress={this.togglePickerVisible(true)}
          value={this.committedLanguage}
        />
        <Modal animationType='fade' transparent visible={isPickerVisible}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerBar(backgroundColor)}>
              <TouchableOpacity onPress={this.onPressDone}>
                <Text style={styles.doneButton(foregroundColor)}>Done</Text>
              </TouchableOpacity>
            </View>
            <Picker
              selectedValue={selectedValue}
              onValueChange={this.onSelectValue}
              style={styles.picker(foregroundColor)}
              itemStyle={styles.pickerItem(backgroundColor)}
            >
              <Picker.Item label='English' value='en' />
              <Picker.Item label='Português' value='pt-BR' />
            </Picker>
          </View>
        </Modal>
      </React.Fragment>
    );
  }
}

export default LanguagePicker;
