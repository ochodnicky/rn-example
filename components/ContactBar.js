import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Colors from '../constants/Colors';

import moment from 'moment/min/moment-with-locales';
moment.locale('cs');

const ContactBar = props => {
  const dialCall = async number => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    await Linking.openURL(phoneNumber);
  };

  const sendSms = async (number, message = '') => {
    const separator = Platform.OS === 'ios' ? '&' : '?';
    const url = `sms:${number}${separator}body=${message}`;
    await Linking.openURL(url);
  };

  const sendMail = async mail => {
    const url = `mailto:${mail}`;
    await Linking.openURL(url);
  };

  return (
    <View
      style={{
        ...styles.contactBar,
        ...props.style,
      }}>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          props.phone ? dialCall(props.phone) : null;
        }}>
        <MaterialIcons
          name="call"
          color={props.phone ? Colors.Greys.dark : Colors.Greys.light}
          size={26}
          style={styles.ContactBarIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          props.phone ? sendSms(props.phone) : null;
        }}>
        <MaterialIcons
          name="chat"
          color={props.phone ? Colors.Greys.dark : Colors.Greys.light}
          size={26}
          style={styles.ContactBarIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          props.mail ? sendMail(props.mail) : null;
        }}>
        <MaterialIcons
          name="mail"
          color={props.mail ? Colors.Greys.dark : Colors.Greys.light}
          size={26}
          style={styles.ContactBarIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ContactBar;

const styles = StyleSheet.create({
  contactBar: {
    borderRadius: 100,
    backgroundColor: '#E2E8EC',
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  ContactBarIcon: {
    marginVertical: 10,
    marginHorizontal: 14,
  },
});
