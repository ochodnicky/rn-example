import React from 'react';
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native';

import Colors from '../constants/Colors';
import Elevation from '../constants/Elevation';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const AddButton = props => {
  return (
    <View style={styles.addButton}>
      <TouchableWithoutFeedback onPress={props.onPress}>
        <LinearGradient
          colors={Colors.Gradients.blueGreen}
          locations={[0.43, 1]}
          style={{
            ...styles.button,
            width: props.buttonSize,
            height: props.buttonSize,
            borderRadius: props.buttonSize,
          }}>
          <MaterialIcons
            name={props.iconName}
            color={Colors.white}
            size={props.iconSize}
          />
        </LinearGradient>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default AddButton;

const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    position: 'relative',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 60,
    ...Elevation.addButton,
  },
});
