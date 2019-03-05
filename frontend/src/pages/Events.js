import React, { useState, useContext, useEffect } from 'react';

import { Modal, EventList } from '../components';
import { AuthContext, GraphQLContext } from '../context';
import './Events.css';
import { Formik } from 'formik';
import { object, string, number } from 'yup';
import { Input, TextArea, Action, Form } from '../components/Form';
import { updateInArray, findInArrayById } from '../helper/array-utils';

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

  var isActive = true;

  const { token, userId } = useContext(AuthContext);
  const { query } = useContext(GraphQLContext);

  useEffect(() => {
    fetchEvents();
    return () => {
      isActive = false;
    };
  }, []);

  const startCreateEventHandler = () => {
    setError();
    setCreating(true);
  };

  const modalConfirmHandler = async (values, { setSubmitting }) => {
    const { title, price, date, description } = values;

    const requestBody = {
      query: `
          mutation CreateEvent($title: String!, $desc: String!, $price: Float!, $date: DateTime!) {
            createEvent(eventInput: {title: $title, description: $desc, price: $price, date: $date}) {
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
        `,
      variables: {
        title: title,
        desc: description,
        price: price,
        date: date
      }
    };

    try {
      const data = await query(requestBody);
      const updatedEvents = [...events];
      updatedEvents.push(data.createEvent);
      setEvents(updatedEvents);
      setCreating(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const modalConfirmUpdateHandler = async (values, { setSubmitting }) => {
    const { title, price, date, description } = values;

    const requestBody = {
      query: `
        mutation CreateEvent($_id: ID!, $title: String!, $desc: String!, $price: Float!, $date: DateTime!) {
          updateEvent(input: {_id: $_id, event: {title: $title, description: $desc, price: $price, date: $date}}) {
            _id
            title
            description
            date
            price
          }
        }
      `,
      variables: {
        _id: updating._id,
        title: title,
        desc: description,
        price: price,
        date: date
      }
    };
    try {
      const data = await query(requestBody);
      const updatedEvents = updateInArray(events, data.updateEvent);
      setUpdating(null);
      setEvents(updatedEvents);
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
    const requestBody = {
      query: `
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
        `
    };

    try {
      const data = await query(requestBody);
      const events = data.events;
      if (isActive) {
        setEvents(events);
      }
    } catch (err) {
      console.log(err);
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
    const requestBody = {
      query: `
          mutation BookEvent($id: ID!) {
            bookEvent(eventId: $id) {
              _id
             createdAt
             updatedAt
            }
          }
        `,
      variables: {
        id: selectedEvent._id
      }
    };

    try {
      const data = await query(requestBody);
      console.log(data);
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
        authUserId={userId}
        onViewDetail={showDetailHandler}
        onEdit={editHandler}
        isLoading={isLoading}
      />
    </React.Fragment>
  );
};

export default EventsPage;
