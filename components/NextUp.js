import React from 'react';
import {StyleSheet, Text, View, TouchableWithoutFeedback} from 'react-native';
import {Avatar} from 'react-native-elements';

import Colors from '../constants/Colors';
import Elevation from '../constants/Elevation';
import avatarImages from '../constants/AvatarImages';

import EventTile from '../constants/EventTile';

import moment from 'moment/min/moment-with-locales';
moment.locale('cs');

const NextUp = props => {
  const goToContactProfile = () => {
    props.navigation.navigate({
      name: 'ContactDetailScreen',
      params: {
        id: props.contactId,
      },
      merge: false,
    });
    if (props.onPress) {
      props.onPress();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={props.contactId && goToContactProfile}>
      <View
        style={{
          ...styles.nextUp,
          ...props.style,
        }}>
        <View
          style={{
            ...styles.line,
            backgroundColor: EventTile[props.color - 1].color,
          }}
        />
        <Text
          style={{
            ...styles.nextUpDate,
          }}>
          {moment(props.date).format('D.M.')}
        </Text>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Avatar
              size={50}
              rounded
              source={avatarImages[props.contactAvatar]}
            />
          </View>
          <Text style={styles.name}>{props.contactName}</Text>
        </View>
        <Text style={styles.nextUpText}>{props.name}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default NextUp;

const styles = StyleSheet.create({
  nextUp: {
    borderRadius: 10,
    width: 160,
    padding: 16,
    paddingTop: 8,
    marginBottom: 48,
    textAlign: 'center',
    backgroundColor: Colors.white,
    ...Elevation.eventTile,
  },
  line: {
    width: '50%',
    height: 2.8,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 16,
  },
  nextUpText: {
    fontFamily: 'Quicksand-Medium',
    fontSize: 16,
    textAlign: 'center',
    color: Colors.Blues.darkest,
  },
  nextUpDate: {
    fontFamily: 'Quicksand-Medium',
    fontSize: 16,
    color: Colors.Blues.darkest,
    textAlign: 'center',
  },
  avatarWrap: {
    alignItems: 'center',
    marginVertical: 8,
  },
  avatar: {
    borderRadius: 100,
    ...Elevation.avatar,
  },
  name: {
    marginTop: 4,
    color: Colors.Greys.grey,
    fontFamily: 'Quicksand-Medium',
    fontSize: 12,
  },
});
