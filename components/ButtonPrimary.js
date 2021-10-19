import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

import Colors from '../constants/Colors';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const ButtonPrimary = props => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={props.onPress}
      style={{
        ...styles.buttonWrap,
        ...props.style,
      }}>
      <LinearGradient
        colors={Colors.Gradients.blueGreen}
        start={{x: 0.6, y: 0}}
        end={{x: 0.7, y: 1}}
        locations={[0, 1]}
        style={styles.button}>
        {props.iconName && (
          <MaterialIcons
            name={props.iconName}
            color={props.iconColor}
            size={props.iconSize}
            style={styles.buttonIcon}
          />
        )}
        <Text style={styles.buttonText}>{props.children}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default ButtonPrimary;

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 100,
  },
  buttonWrap: {
    borderRadius: 100,
    marginBottom: 4,
    marginRight: 4,
  },
  buttonIcon: {
    marginRight: 2,
  },
  buttonText: {
    fontFamily: 'Quicksand-Bold',
    color: 'white',
    fontSize: 16,
  },
});
