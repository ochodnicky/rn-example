import React, {useState, useEffect, useCallback, useReducer} from 'react';
import {StyleSheet, Text, View, Alert} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import * as eventsActions from '../store/actions/events';

import Title from '../components/Title';
import Input from '../components/Input';
import DatePicker from '../components/DatePicker';
import Switcher from '../components/Switcher';
import Button from '../components/Button';
import ButtonPrimary from '../components/ButtonPrimary';
import ColorPicker from '../components/ColorPicker';
import Modal from '../components/Modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Sizes from '../constants/Sizes';
import Colors from '../constants/Colors';
import NotificationModal from './NotificationModal';
import {TouchableOpacity} from 'react-native';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};

const EventEditModal = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isNotificationModalVisible, setNotificationModalVisible] =
    useState(false);

  const eventId = props.eventId;

  const contactId = props.contactId;

  const editedEvent = useSelector(state =>
    state.events.events.find(event => event.id === eventId),
  );

  const user = useSelector(state => state.user.user);

  const dispatch = useDispatch();

  const closeModal = props.onPress;

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      name: editedEvent ? editedEvent.name : '',
      date: editedEvent ? editedEvent.date : '',
      remind: editedEvent ? editedEvent.remind : false,
      color: editedEvent ? editedEvent.color : '',
      note: editedEvent ? editedEvent.note : '',
      notification1: editedEvent ? editedEvent.notification1 : false,
      notification2: editedEvent ? editedEvent.notification2 : false,
      notification3: editedEvent ? editedEvent.notification3 : false,
      notification4: editedEvent ? editedEvent.notification4 : true,
    },
    inputValidities: {
      name: editedEvent ? true : false,
      date: editedEvent ? true : false,
      remind: editedEvent ? true : false,
      note: true,
    },
    formIsValid: editedEvent ? true : false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred!', error, [{text: 'Okay'}]);
    }
  }, [error]);

  useEffect(() => {
    console.log(formState);
  }, [formState]);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState],
  );

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert('Chyba', 'Prosím zkontrolujte vyplněná pole.', [
        {text: 'Okay'},
      ]);
      setFormSubmitted(true);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      if (editedEvent) {
        await dispatch(
          eventsActions.updateEvent(
            eventId,
            contactId,
            user.id,
            formState.inputValues.name,
            formState.inputValues.date,
            formState.inputValues.remind,
            formState.inputValues.color,
            formState.inputValues.note,
            formState.inputValues.notification1,
            formState.inputValues.notification2,
            formState.inputValues.notification3,
            formState.inputValues.notification4,
          ),
        );
      } else {
        await dispatch(
          eventsActions.createEvent(
            contactId,
            user.id,
            formState.inputValues.name,
            formState.inputValues.date,
            formState.inputValues.remind,
            formState.inputValues.color,
            formState.inputValues.note,
            formState.inputValues.notification1,
            formState.inputValues.notification2,
            formState.inputValues.notification3,
            formState.inputValues.notification4,
          ),
        );
      }
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
    closeModal();
  }, [dispatch, formState]);

  useEffect(() => {
    //console.log(formState);
  }, [formState]);

  const toggleNotificationModal = () => {
    setNotificationModalVisible(!isNotificationModalVisible);
  };

  return (
    <Modal isVisible={props.isVisible} onPress={props.onPress}>
      <Title type="2" style={styles.titleWrapper}>
        {editedEvent ? `Upravit ${editedEvent.name}` : 'Přidat událost'}
      </Title>
      <View style={styles.divider}>
        <View style={{width: '55%'}}>
          <Input
            id="name"
            label="Název události"
            errorText="Chybí název"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedEvent ? editedEvent.name : ''}
            initiallyValid={!!editedEvent}
            checkValidation={formSubmitted}
            required
          />
        </View>
        <View style={{width: '40%'}}>
          <DatePicker
            id="date"
            label="Datum"
            errorText="Chybí datum"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedEvent ? editedEvent.date : ''}
            initiallyValid={!!editedEvent}
            checkValidation={formSubmitted}
            required
          />
        </View>
      </View>
      <View style={styles.divider}>
        <View style={{width: '55%'}}>
          <ColorPicker
            id="color"
            label="Barva"
            errorText="Vyber barvu"
            onInputChange={inputChangeHandler}
            initialValue={editedEvent ? editedEvent.color : 1}
            initiallyValid={true}
          />
        </View>
        <View style={{width: '40%'}}>
          <View style={styles.formControl}>
            <TouchableOpacity
              style={styles.labelWrapper}
              onPress={toggleNotificationModal}>
              <Text style={styles.label}>Notifikace</Text>
              <MaterialIcons
                name="settings"
                color={Colors.Greys.light}
                size={14}
                style={styles.settingsIcon}
              />
            </TouchableOpacity>
            <Switcher
              id="remind"
              errorText="Chcete notifikaci?"
              onInputChange={inputChangeHandler}
              initialValue={editedEvent ? editedEvent.remind : true}
              initiallyValid={true}
            />
          </View>
        </View>
      </View>
      <View style={styles.buttonsWrapper}>
        {editedEvent ? (
          <View>
            <ButtonPrimary
              onPress={submitHandler}
              style={styles.button}
              type="primary">
              Upravit událost
            </ButtonPrimary>
          </View>
        ) : (
          <ButtonPrimary
            onPress={submitHandler}
            style={styles.button}
            type="primary">
            Vytvořit událost
          </ButtonPrimary>
        )}
        <Button onPress={closeModal} style={styles.button} type="secondary">
          Zrušit
        </Button>
        {isNotificationModalVisible && (
          <NotificationModal
            isVisible={isNotificationModalVisible}
            onPress={toggleNotificationModal}
            errorText="Nastavte notifikaci"
            inputChangeHandler={inputChangeHandler}
            initialValue1={editedEvent ? editedEvent.notification1 : false}
            initialValue2={editedEvent ? editedEvent.notification2 : false}
            initialValue3={editedEvent ? editedEvent.notification3 : false}
            initialValue4={editedEvent ? editedEvent.notification4 : true}
          />
        )}
      </View>
    </Modal>
  );
};

export default EventEditModal;

const styles = StyleSheet.create({
  titleWrapper: {
    paddingTop: 24,
  },
  divider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonsWrapper: {
    flexDirection: 'row',
    marginTop: 32,
  },
  button: {
    marginRight: Sizes.baseUnit,
  },
  formControl: {
    alignItems: 'flex-start',
  },
  labelWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 14,
    color: Colors.Blues.darkest,
  },
  settingsIcon: {
    marginLeft: 6,
  },
});
