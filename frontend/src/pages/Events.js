import React, { useState, useContext, useEffect } from 'react';

import Modal from '../components/Modal/Modal';
import EventList from '../components/Events/EventList/EventList';
import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth-context';
import GraphQLContext from '../context/graphql-context';
import './Events.css';
import { Formik, Form } from 'formik';
import { object, string, number } from 'yup';
import { Input, TextArea } from '../components/Form';

const EventsPage = props => {
  const [creating, setCreating] = useState(false);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
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
    setCreating(true);
  };

  const modalConfirmHandler = async values => {
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
      console.log(err);
    }
  };

  const modalCancelHandler = () => {
    setCreating(false);
    setSelectedEvent(null);
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
    const selectedEvent = events.find(e => e._id === eventId);
    setSelectedEvent(selectedEvent);
  };

  const bookEventHandler = async () => {
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
    } catch (err) {
      console.log(err);
    } finally {
      setSelectedEvent(null);
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
            validationSchema={object().shape({
              title: string().required(),
              price: number().required(),
              description: string().required(),
              date: string().required()
            })}
          >
            {formikProps => (
              <Form id="createForm">
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
                <section className="modal__actions">
                  <button className="btn" onClick={modalCancelHandler}>
                    Cancel
                  </button>
                  <button className="btn" type="submit">
                    Create
                  </button>
                </section>
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
          confirmText="Book"
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
      {isLoading ? (
        <Spinner />
      ) : (
        <EventList
          events={events}
          authUserId={userId}
          onViewDetail={showDetailHandler}
        />
      )}
    </React.Fragment>
  );
};

export default EventsPage;
