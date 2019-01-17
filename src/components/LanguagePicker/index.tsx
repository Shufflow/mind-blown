import React from 'react';
import { Modal, Picker, Text, TouchableOpacity, View } from 'react-native';

import { HeaderProps } from 'src/utils/hocs/withHeader';
import t, { Global as strings } from 'src/locales';

import { Locales } from 'src/models/locale';

import styles from './styles';

interface Props extends HeaderProps {
  locale: string;
  omitKeys: string[];
  onSelectValue: (lang: string) => void;
}

interface State {
  isVisible: boolean;
  selectedValue: string;
}

class LanguagePicker extends React.Component<Props, State> {
  static defaultProps = {
    omitKeys: [],
  };

  pickerItems: Array<React.ReactElement<any>>;

  constructor(props: Props) {
    super(props);
    this.state = {
      isVisible: false,
      selectedValue: props.locale,
    };

    this.pickerItems = Object.entries(Locales)
      .filter(([key]) => !props.omitKeys.includes(key))
      .map(([key, label]) => (
        <Picker.Item key={key} label={label} value={key} />
      ));
  }

  show = () => {
    this.togglePickerVisible(true)();
  };

  togglePickerVisible = (isVisible: boolean) => () => {
    this.setState({ isVisible });
  };

  onSelectValue = (selectedValue: string) => {
    this.setState({ selectedValue });
  };

  onPressDone = () => {
    const { selectedValue } = this.state;
    this.props.onSelectValue(selectedValue);
    this.togglePickerVisible(false)();
  };

  render() {
    const { dark, light } = this.props;
    const { isVisible, selectedValue } = this.state;
    return (
      <Modal
        animationType='fade'
        transparent
        visible={isVisible}
        onRequestClose={this.togglePickerVisible(false)}
      >
        <View style={styles.pickerContainer}>
          <View style={styles.pickerBar(dark)}>
            <TouchableOpacity onPress={this.onPressDone}>
              <Text style={styles.doneButton(light)}>{t(strings.done)}</Text>
            </TouchableOpacity>
          </View>
          <Picker
            selectedValue={selectedValue}
            onValueChange={this.onSelectValue}
            style={styles.picker(light)}
            itemStyle={styles.pickerItem(dark)}
          >
            {this.pickerItems}
          </Picker>
        </View>
      </Modal>
    );
  }
}

export default LanguagePicker;
