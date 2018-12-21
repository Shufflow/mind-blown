import React from 'react';
import { Modal, Picker, Text, TouchableOpacity, View } from 'react-native';

import { Locales } from 'src/models/locale';

import Item from 'src/components/ListItem';

import styles from './styles';

interface Props {
  backgroundColor: string;
  foregroundColor: string;
  locale: string;
  onSelectValue: (lang: string) => void;
}

interface State {
  isPickerVisible: boolean;
  selectedValue: string;
}

class LanguagePicker extends React.Component<Props, State> {
  committedLanguage: string;
  pickerItems: Array<React.ReactElement<any>>;

  constructor(props: Props) {
    super(props);
    this.committedLanguage = props.locale;
    this.state = {
      isPickerVisible: false,
      selectedValue: props.locale,
    };

    this.pickerItems = Object.entries(Locales).map(([key, label]) => (
      <Picker.Item key={key} label={label} value={key} />
    ));
  }

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
    const { backgroundColor, foregroundColor, locale } = this.props;
    const { isPickerVisible, selectedValue } = this.state;
    return (
      <React.Fragment>
        <Item
          label='Language'
          onPress={this.togglePickerVisible(true)}
          value={Locales[this.committedLanguage || locale]}
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
              {this.pickerItems}
            </Picker>
          </View>
        </Modal>
      </React.Fragment>
    );
  }
}

export default LanguagePicker;
