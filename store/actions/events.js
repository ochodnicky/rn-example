import Event from '../../models/event';
import firestore from '@react-native-firebase/firestore';

export const DELETE_EVENT = 'DELETE_EVENT';
export const DELETE_CONTACT_EVENTS = 'DELETE_CONTACT_EVENTS';
export const CREATE_EVENT = 'CREATE_EVENT';
export const UPDATE_EVENT = 'UPDATE_EVENT';
export const SET_EVENTS = 'SET_EVENTS';
export const DELETE_ALL_EVENTS = 'DELETE_ALL_EVENTS';

export const fetchEvents = userId => {
  return async dispatch => {
    try {
      const eventsCollection = firestore()
        .collection('events')
        .doc(userId)
        .collection('data');

      const loadedEvents = [];

      const response = await eventsCollection.get();

      const resData = [];
      response.forEach(doc => {
        const entity = doc.data();
        entity.id = doc.id;
        resData.push(entity);
      });
      for (const key in resData) {
        loadedEvents.push(
          new Event(
            resData[key].id,
            resData[key].contactId,
            resData[key].name,
            resData[key].date,
            resData[key].remind,
            resData[key].color,
            resData[key].note,
            resData[key].notification1,
            resData[key].notification2,
            resData[key].notification3,
            resData[key].notification4,
          ),
        );
      }

      dispatch({
        type: SET_EVENTS,
        events: loadedEvents,
      });
    } catch (err) {
      throw err;
    }
  };
};

export const deleteEvent = (eventId, userId) => {
  return async dispatch => {
    const eventsCollection = firestore()
      .collection('events')
      .doc(userId)
      .collection('data');

    const response = await eventsCollection.doc(eventId).delete();

    dispatch({type: DELETE_EVENT, id: eventId});
  };
};

export const createEvent = (
  contactId,
  userId,
  name,
  date,
  remind,
  color,
  note = '',
  notification1,
  notification2,
  notification3,
  notification4,
) => {
  return async dispatch => {
    const eventsCollection = firestore()
      .collection('events')
      .doc(userId)
      .collection('data');

    const data = {
      contactId,
      name,
      date,
      remind,
      color,
      note,
      notification1,
      notification2,
      notification3,
      notification4,
    };

    const response = await eventsCollection.add(data);

    dispatch({
      type: CREATE_EVENT,
      eventData: {
        id: response.id,
        contactId,
        name,
        date,
        remind,
        color,
        note,
        notification1,
        notification2,
        notification3,
        notification4,
      },
    });
  };
};

export const updateEvent = (
  id,
  contactId,
  userId,
  name,
  date,
  remind,
  color,
  note = '',
  notification1,
  notification2,
  notification3,
  notification4,
) => {
  return async dispatch => {
    const eventsCollection = firestore()
      .collection('events')
      .doc(userId)
      .collection('data');

    const data = {
      contactId,
      name,
      date,
      remind,
      color,
      note,
      notification1,
      notification2,
      notification3,
      notification4,
    };

    const response = await eventsCollection.doc(id).update(data);

    dispatch({
      type: UPDATE_EVENT,
      eventData: {
        id,
        contactId,
        name,
        date,
        remind,
        color,
        note,
        notification1,
        notification2,
        notification3,
        notification4,
      },
    });
  };
};

export const deleteAllEvents = userId => {
  return async dispatch => {
    const eventsCollection = firestore()
      .collection('events')
      .doc(userId)
      .collection('data');

    const response = await eventsCollection.get();

    response.forEach(element => {
      element.ref.delete();
    });

    dispatch({
      type: DELETE_ALL_EVENTS,
    });
  };
};

export const deleteAllContactEvents = (contactId, userId) => {
  return async dispatch => {
    const eventsCollection = firestore()
      .collection('events')
      .doc(userId)
      .collection('data');

    const response = await eventsCollection
      .where('contactId', '==', contactId)
      .get();

    response.forEach(element => {
      element.ref.delete();
    });

    dispatch({type: DELETE_CONTACT_EVENTS, contactId: contactId});
  };
};

export const backupEvents = (userId, data) => {
  return async () => {
    const eventsCollection = firestore()
      .collection('events')
      .doc(userId)
      .collection('data');

    data.map(async item => {
      const data = {
        contactId: item.contactId,
        name: item.name,
        date: item.date,
        remind: item.remind,
        color: item.color,
        note: item.note,
        notification1: item.notification1,
        notification2: item.notification2,
        notification3: item.notification3,
        notification4: item.notification4,
      };
      const response = await eventsCollection.add(data);
    });
  };
};
