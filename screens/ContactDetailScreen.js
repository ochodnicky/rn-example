import React, {useState, useEffect, Fragment} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

import * as contactsActions from '../store/actions/contacts';
import * as eventsActions from '../store/actions/events';
import * as christmasActions from '../store/actions/christmas';

import {Avatar} from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Title from '../components/Title';
import Event from '../components/Event';
import ContactBar from '../components/ContactBar';
import AddButton from '../components/AddButton';

import EventEditModal from '../modals/EventEditModal';
import ContactEditModal from '../modals/ContactEditModal';
import ContactActionModal from '../modals/ContactActionModal';
import EventActionModal from '../modals/EventActionModal';

import Colors from '../constants/Colors';
import Sizes from '../constants/Sizes';
import avatarImages from '../constants/AvatarImages';

import moment from 'moment/min/moment-with-locales';
moment.locale('cs');

const ContactDetailScreen = props => {
  const [eventId, setEventId] = useState();
  const [eventName, setEventName] = useState();
  const [isContactModalVisible, setContactModalVisible] = useState(false);
  const [isContactActionModalVisible, setContactActionModalVisible] =
    useState(false);
  const [isEventModalVisible, setEventModalVisible] = useState(false);
  const [isEventActionModalVisible, setEventActionModalVisible] =
    useState(false);

  const isScreenFocused = useIsFocused();

  const contactId = props.route.params.id;
  const type = props.route.params.type;

  const contact = useSelector(state =>
    state.contacts.availableContacts.find(contact => contact.id === contactId),
  );

  const events = useSelector(state =>
    state.events.events.filter(event => event.contactId === contactId),
  );

  const user = useSelector(state => state.user.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (type === 'addEvent' && isScreenFocused) {
      setEventModalVisible(true);
      setEventId(null);
    } else {
      setEventModalVisible(false);
    }
  }, [isScreenFocused]);

  const deleteContactHandler = () => {
    Alert.alert(
      'Potvrzení',
      `Opravdu chcete smazat kontakt ${contact.firstName}?`,
      [
        {text: 'No', style: 'default'},
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAllContactDataHandler();
              await dispatch(
                contactsActions.deleteContact(contact.id, user.id),
              );
              props.navigation.navigate('ContactListScreen');
              toggleContactActionModal();
            } catch (err) {
              console.log(err.message);
            }
          },
        },
      ],
    );
  };

  const deleteAllContactDataHandler = async () => {
    try {
      await dispatch(eventsActions.deleteAllContactEvents(contact.id, user.id));
      await dispatch(
        christmasActions.deleteContactChristmas(contact.id, user.id),
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  const deleteEventHandler = () => {
    Alert.alert('Potvrzení', `Opravdu chcete smazat událost ${eventName}?`, [
      {text: 'No', style: 'default'},
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          try {
            await dispatch(eventsActions.deleteEvent(eventId, user.id));
            setEventActionModalVisible(false);
          } catch (err) {
            console.log(err.message);
          }
        },
      },
    ]);
  };

  const toggleFavorite = () => {
    dispatch(
      contactsActions.updateContact(
        contactId,
        user.id,
        contact.firstName,
        contact.lastName,
        contact.avatar,
        contact.birthDate,
        !contact.isFavorite,
        contact.phone,
        contact.mail,
        contact.facebook,
        contact.groupId,
      ),
    );
  };

  const toggleEventModal = () => {
    setEventModalVisible(!isEventModalVisible);
  };

  const toggleContactModal = () => {
    setContactModalVisible(!isContactModalVisible);
  };

  const toggleContactActionModal = () => {
    setContactActionModalVisible(!isContactActionModalVisible);
  };

  const showEventActionModal = event => {
    setEventId(event.id);
    setEventName(event.name);
    setEventActionModalVisible(true);
  };

  const addEventHandler = () => {
    setEventId(null);
    toggleContactActionModal();
    setEventModalVisible(true);
  };

  const updateContactHandler = () => {
    toggleContactActionModal();
    setContactModalVisible(true);
  };

  if (!contact) {
    return null;
  }

  return (
    <Fragment>
      <SafeAreaView style={styles.screen}>
        <View style={styles.header}>
          <View style={styles.headerWrapper}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                onPress={() => {
                  props.navigation.navigate('ContactListScreen');
                }}
                style={styles.icon}>
                <MaterialIcons
                  name="keyboard-arrow-left"
                  color={Colors.white}
                  size={30}
                />
              </TouchableOpacity>
              <Title type="2" style={styles.title}>
                Detail
              </Title>
            </View>
            <View style={styles.headerRight}>
              <MaterialIcons
                name="menu"
                color={Colors.white}
                size={30}
                onPress={() => props.navigation.toggleDrawer()}
              />
            </View>
          </View>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
          style={{flex: 1}}>
          <View style={styles.contentArea}>
            <ScrollView style={styles.contentAreaScroll}>
              <View style={styles.contactHeader}>
                <View
                  style={{...styles.container, ...styles.contactDetailWrapper}}>
                  <Avatar
                    size={100}
                    rounded
                    source={avatarImages[contact.avatar]}
                  />
                  <TouchableOpacity
                    hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                    onPress={toggleContactActionModal}
                    style={styles.iconDots}>
                    <MaterialIcons
                      name="more-vert"
                      color={Colors.Greys.dark}
                      size={20}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={toggleFavorite}
                    style={styles.titleWrapper}
                    hitSlop={{top: 40, bottom: 40, left: 40, right: 40}}
                    activeOpacity={1}>
                    <Title type="2" style={{...styles.name}}>
                      {contact.firstName} {contact.lastName}
                    </Title>
                    <MaterialIcons
                      name={contact.isFavorite ? 'star' : 'star-border'}
                      color={
                        contact.isFavorite ? Colors.yellow : Colors.Greys.grey
                      }
                      size={24}
                      style={styles.favorite}
                    />
                  </TouchableOpacity>
                  {contact.birthDate.length > 1 && (
                    <Text style={styles.info}>
                      *{moment(contact.birthDate).format('D.M.YYYY')},{' '}
                      {moment().diff(moment(contact.birthDate), 'years')}{' '}
                      {moment().diff(moment(contact.birthDate), 'years') < 5
                        ? moment().diff(moment(contact.birthDate), 'years') ===
                          1
                          ? 'rok'
                          : 'roky'
                        : 'let'}
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.contactBar}>
                <ContactBar
                  phone={contact.phone}
                  mail={contact.mail}
                  facebook={contact.facebook}
                />
              </View>

              <View style={styles.events}>
                {events &&
                  events
                    .sort((a, b) => {
                      var dateA = moment(a.date).format('MMDD');
                      var dateB = moment(b.date).format('MMDD');
                      return dateA - dateB;
                    })
                    .map(event => {
                      return (
                        <Event
                          key={event.id}
                          event={event}
                          editHandler={showEventActionModal}
                        />
                      );
                    })}
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
        <View style={styles.buttonAdd}>
          <AddButton
            onPress={() => {
              setEventId(null);
              toggleEventModal();
            }}
            buttonSize={60}
            iconSize={28}
            iconName="event"
          />
        </View>
        {isEventModalVisible && (
          <EventEditModal
            navigation={props.navigation}
            isVisible={isEventModalVisible}
            onPress={toggleEventModal}
            contactId={contactId}
            eventId={eventId}
          />
        )}
        {isContactModalVisible && (
          <ContactEditModal
            navigation={props.navigation}
            isVisible={isContactModalVisible}
            contactId={contactId}
            onPress={toggleContactModal}
          />
        )}
        {isContactActionModalVisible && (
          <ContactActionModal
            isVisible={isContactActionModalVisible}
            onClose={toggleContactActionModal}
            name={contact.firstName}
            editHandler={updateContactHandler}
            deleteHandler={deleteContactHandler}
            eventHandler={addEventHandler}
          />
        )}
        {isEventActionModalVisible && (
          <EventActionModal
            isVisible={isEventActionModalVisible}
            onClose={() => setEventActionModalVisible(false)}
            id={eventId}
            name={eventName}
            editHandler={() => {
              setEventActionModalVisible(false);
              toggleEventModal();
            }}
            deleteHandler={deleteEventHandler}
          />
        )}
      </SafeAreaView>
      <SafeAreaView style={styles.screenBottom} />
    </Fragment>
  );
};

export default ContactDetailScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.Blues.darkest,
  },
  screenBottom: {
    flex: 0,
    backgroundColor: Colors.bgColor,
  },
  // Header
  header: {
    backgroundColor: Colors.Blues.darkest,
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: Sizes.baseUnit,
    justifyContent: 'space-between',
    marginHorizontal: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Contact detail
  icon: {
    marginRight: 16,
  },
  title: {
    color: Colors.white,
    marginBottom: 0,
  },
  contactDetailWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: 24,
  },
  titleWrapper: {
    position: 'relative',
    justifyContent: 'center',
    marginVertical: 8,
  },
  infoWrapper: {
    justifyContent: 'center',
    flexGrow: 1,
  },
  info: {
    fontFamily: 'Quicksand-Medium',
    fontSize: 14,
  },
  name: {
    marginBottom: 0,
  },
  favorite: {
    position: 'absolute',
    right: -40,
  },
  iconDots: {
    position: 'absolute',
    right: 24,
    top: 24,
  },
  contactBar: {
    alignItems: 'center',
  },
  events: {
    paddingTop: 32,
    paddingBottom: 24,
  },
  button: {
    marginTop: Sizes.baseUnit,
  },
  container: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  contentArea: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: Colors.bgColor,
    flex: 1,
    overflow: 'hidden',
  },
  contentAreaScroll: {
    flex: 1,
  },
  buttonAdd: {
    position: 'absolute',
    zIndex: 10,
    bottom: 16,
    right: 16,
  },
});
