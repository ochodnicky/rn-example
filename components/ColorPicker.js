import React, {useReducer, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableWithoutFeedback} from 'react-native';

import Colors from '../constants/Colors';
import EventTile from '../constants/EventTile';

import moment from 'moment/min/moment-with-locales';
moment.locale('cs');

const INPUT_CHANGE = 'INPUT_CHANGE';
const INPUT_BLUR = 'INPUT_BLUR';

const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUT_CHANGE:
      return {
        ...state,
        value: action.value,
        isValid: action.isValid,
        touched: true,
      };
    case INPUT_BLUR:
      return {
        ...state,
        touched: true,
      };
    default:
      return state;
  }
};

const ColorPicker = props => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue ? props.initialValue : 1,
    isValid: props.initiallyValid,
    touched: true,
  });

  const {onInputChange, id} = props;

  useEffect(() => {
    if (inputState.touched) {
      onInputChange(id, inputState.value, inputState.isValid);
    }
  }, [inputState, onInputChange, id]);

  const onChangeHandler = color => {
    dispatch({type: INPUT_CHANGE, value: color, isValid: true});
  };

  return (
    <View
      style={{
        ...styles.colorPicker,
        ...props.style,
      }}>
      <Text style={styles.label}>Barva</Text>
      <View style={styles.circlesWrapper}>
        {EventTile.map((color, index) => {
          const colorType = index + 1;
          return (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => onChangeHandler(colorType)}>
              <View
                style={
                  inputState.value === colorType
                    ? {
                        ...styles.circle,
                        ...styles.selected,
                        backgroundColor: color.color,
                      }
                    : {...styles.circle, backgroundColor: color.color}
                }
              />
            </TouchableWithoutFeedback>
          );
        })}
      </View>
    </View>
  );
};

export default ColorPicker;

const styles = StyleSheet.create({
  colorPicker: {},
  circle: {
    width: 25,
    height: 25,
    borderRadius: 100,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circlesWrapper: {
    flexDirection: 'row',
  },
  selected: {
    borderWidth: 2,
    borderColor: Colors.Blues.darkest,
    zIndex: 3,
  },
  label: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 14,
    marginBottom: 8,
    color: Colors.Blues.darkest,
  },
});
