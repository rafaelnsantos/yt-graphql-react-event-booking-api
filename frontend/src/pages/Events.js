import React, { useState, useContext, useEffect } from 'react';

import { Modal, EventList } from '../components';
import { AuthContext, GraphQLContext, NotificationContext } from '../context';
import './Events.css';
import { Formik } from 'formik';
import { object, string, number } from 'yup';
import { Input, TextArea, Action, Form } from '../components/Form';
import {
  updateInArray,
  findInArrayById,
  addInArray
} from '../helper/array-utils';

const validationEvent = object().shape({
  title: string().required(),
  price: number().required(),
  description: string().required(),
  date: string().required()
});

const EventsPage = props => {
  const [creating, setCreating] = useState(false);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState();
  const { sendNotification, sendError } = useContext(NotificationContext);

  var isActive = true;

  const { token, userId } = useContext(AuthContext);
  const { query, mutate, subscribe } = useContext(GraphQLContext);

  let s1 = subscribe({
    subscription: `
      subscription {
        newEvent {
          _id
          title
          description
          price
          date
          creator {
            _id
          }
        }
      }
    `,
    callback: {
      next({ data }) {
        const { newEvent } = data;
        if (userId !== newEvent.creator._id)
          setEvents(addInArray(events, newEvent));
      },
      error(value) {
        sendError(value);
      }
    }
  });

  let s2 = subscribe({
    subscription: `
      subscription {
        updatedEvent {
          _id
          title
          description
          price
          date
        }
      }
    `,
    callback: {
      next({ data }) {
        const updatedEvent = findInArrayById(events, data.updatedEvent._id);
        if (!updatedEvent) return;
        if (updatedEvent && updatedEvent.creator._id !== userId)
          setEvents(updateInArray(events, data.updatedEvent));
      },
      error(value) {
        sendError(value);
      }
    }
  });

  useEffect(() => {
    fetchEvents();
    return () => {
      isActive = false;
      s1.unsubscribe();
      s2.unsubscribe();
    };
  }, []);

  const startCreateEventHandler = () => {
    setError();
    setCreating(true);
  };

  const modalConfirmHandler = async (values, { setSubmitting }) => {
    const createEventMutation = `
      mutation ($title: String!, $description: String!, $price: Float!, $date: DateTime!) {
        newEvent: createEvent(eventInput: {title: $title, description: $description, price: $price, date: $date}) {
          _id
          title
          description
          date
          price
          creator {
            _id
          }
        }
      }
    `;

    try {
      const { newEvent } = await mutate({
        mutation: createEventMutation,
        variables: values
      });
      setEvents(addInArray(events, newEvent));
      setCreating(false);
      sendNotification(`Event ${newEvent.title} created`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const modalConfirmUpdateHandler = async (values, { setSubmitting }) => {
    const updateEventMutation = `
      mutation ($_id: ID!, $title: String!, $description: String!, $price: Float!, $date: DateTime!) {
        event: updateEvent(input: {_id: $_id, event: {title: $title, description: $description, price: $price, date: $date}}) {
          _id
          title
          description
          date
          price
        }
      }
    `;
    try {
      const { event } = await mutate({
        mutation: updateEventMutation,
        variables: {
          _id: updating._id,
          ...values
        }
      });
      const updatedEvents = updateInArray(events, event);
      setUpdating(null);
      setEvents(updatedEvents);
      sendNotification(`Event ${event.title} updated`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const editHandler = eventId => {
    setError();
    setUpdating(findInArrayById(events, eventId));
  };

  const modalCancelHandler = () => {
    setError();
    setCreating(false);
    setSelectedEvent(null);
    setUpdating(null);
  };

  const fetchEvents = async () => {
    setIsLoading(true);
    const eventsQuery = `
      query {
        events {
          _id
          title
          description
          date
          price
          creator {
            _id
            email
          }
        }
      }
    `;

    try {
      const { events } = await query({
        query: eventsQuery,
        fetchPolicy: 'no-cache'
      });
      if (isActive) {
        setEvents(events);
      }
    } catch (err) {
      sendError(err.message);
    } finally {
      if (isActive) {
        setIsLoading(false);
      }
    }
  };

  const showDetailHandler = eventId => {
    setError();
    setSelectedEvent(findInArrayById(events, eventId));
  };

  const bookEventHandler = async () => {
    setIsBooking(true);
    console.log(selectedEvent);
    const bookEventMutation = `
      mutation BookEvent($id: ID!) {
        bookEvent(eventId: $id) {
          _id
          createdAt
          updatedAt
        }
      }
    `;
    try {
      await mutate({
        mutation: bookEventMutation,
        variables: { id: selectedEvent._id }
      });
      sendNotification(`Event ${selectedEvent.title} booked`);
      setSelectedEvent(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <React.Fragment>
      {creating && (
        <Modal title="Add Event">
          <Formik
            initialValues={{
              title: '',
              price: '',
              date: new Date().toISOString().slice(0, -5),
              description: ''
            }}
            onSubmit={modalConfirmHandler}
            validationSchema={validationEvent}
          >
            {formikProps => (
              <Form id="createForm" isLoading={formikProps.isSubmitting}>
                <Input
                  formikKey="title"
                  label="Title"
                  type="text"
                  formikProps={formikProps}
                />
                <Input
                  formikKey="price"
                  label="Price"
                  type="number"
                  formikProps={formikProps}
                />
                <Input
                  formikKey="date"
                  label="Date"
                  type="datetime-local"
                  formikProps={formikProps}
                />
                <TextArea
                  formikKey="description"
                  rows="4"
                  label="Description"
                  formikProps={formikProps}
                />
                <Action
                  onCancel={modalCancelHandler}
                  confirmText="Create"
                  error={error}
                />
              </Form>
            )}
          </Formik>
        </Modal>
      )}
      {updating && (
        <Modal title="Update Event">
          <Formik
            initialValues={{
              title: updating.title,
              price: updating.price,
              date: new Date(updating.date).toISOString().slice(0, -5),
              description: updating.description
            }}
            onSubmit={modalConfirmUpdateHandler}
            validationSchema={validationEvent}
          >
            {formikProps => (
              <Form id="createForm" isLoading={formikProps.isSubmitting}>
                <Input
                  formikKey="title"
                  label="Title"
                  type="text"
                  formikProps={formikProps}
                />
                <Input
                  formikKey="price"
                  label="Price"
                  type="number"
                  formikProps={formikProps}
                />
                <Input
                  formikKey="date"
                  label="Date"
                  type="datetime-local"
                  formikProps={formikProps}
                />
                <TextArea
                  formikKey="description"
                  rows="4"
                  label="Description"
                  formikProps={formikProps}
                />
                <Action
                  onCancel={modalCancelHandler}
                  confirmText="Save"
                  error={error}
                />
              </Form>
            )}
          </Formik>
        </Modal>
      )}
      {selectedEvent && (
        <Modal
          title={selectedEvent.title}
          onCancel={modalCancelHandler}
          onConfirm={token && bookEventHandler}
          cancelText={!token && 'Close'}
          confirmText={token && 'Book'}
          isLoading={isBooking}
          error={error}
        >
          <h1>{selectedEvent.title}</h1>
          <h2>
            ${selectedEvent.price} -{' '}
            {new Date(selectedEvent.date).toLocaleDateString()}
          </h2>
          <p>{selectedEvent.description}</p>
        </Modal>
      )}
      {token && (
        <div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={startCreateEventHandler}>
            Create Event
          </button>
        </div>
      )}
      <EventList
        events={events}
        onDetail={showDetailHandler}
        onEdit={editHandler}
        isLoading={isLoading}
      />
    </React.Fragment>
  );
};

export default EventsPage;
