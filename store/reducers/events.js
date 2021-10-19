import {
  DELETE_EVENT,
  DELETE_CONTACT_EVENTS,
  DELETE_ALL_EVENTS,
  CREATE_EVENT,
  UPDATE_EVENT,
  SET_EVENTS,
} from '../actions/events';
import Event from '../../models/event';

const initialState = {
  events: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_EVENTS:
      return {
        events: action.events,
      };
    case CREATE_EVENT:
      const newEvent = new Event(
        action.eventData.id,
        action.eventData.contactId,
        action.eventData.name,
        action.eventData.date,
        action.eventData.remind,
        action.eventData.color,
        action.eventData.note,
        action.eventData.notification1,
        action.eventData.notification2,
        action.eventData.notification3,
        action.eventData.notification4,
      );
      return {
        ...state,
        events: state.events.concat(newEvent),
      };
    case UPDATE_EVENT:
      const eventIndex = state.events.findIndex(
        event => event.id === action.eventData.id,
      );
      const updatedEvent = new Event(
        action.eventData.id,
        action.eventData.contactId,
        action.eventData.name,
        action.eventData.date,
        action.eventData.remind,
        action.eventData.color,
        action.eventData.note,
        action.eventData.notification1,
        action.eventData.notification2,
        action.eventData.notification3,
        action.eventData.notification4,
      );
      const updatedEvents = [...state.events];
      updatedEvents[eventIndex] = updatedEvent;
      return {
        ...state,
        events: updatedEvents,
      };
    case DELETE_EVENT:
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.id),
      };
    case DELETE_CONTACT_EVENTS:
      return {
        ...state,
        events: state.events.filter(
          event => event.contactId !== action.contactId,
        ),
      };
    case DELETE_ALL_EVENTS:
      return {
        ...state,
        events: [],
      };
  }
  return state;
};
