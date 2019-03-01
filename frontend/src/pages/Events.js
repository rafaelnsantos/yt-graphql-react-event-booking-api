import React, { useState, useRef, useContext, useEffect } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import EventList from '../components/Events/EventList/EventList';
import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth-context';
import GraphQLContext from '../context/graphql-context';
import './Events.css';

const EventsPage = props => {
  const [creating, setCreating] = useState(false);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  var isActive = true;

  const { token, userId } = useContext(AuthContext);
  const { query } = useContext(GraphQLContext);

  const titleElRef = useRef();
  const priceElRef = useRef();
  const dateElRef = useRef();
  const descriptionElRef = useRef();

  useEffect(() => {
    fetchEvents();
    return () => {
      isActive = false;
    };
  }, []);

  const startCreateEventHandler = () => {
    setCreating(true);
  };

  const modalConfirmHandler = async () => {
    setCreating(false);
    const title = titleElRef.current.value;
    const price = +priceElRef.current.value;
    const date = dateElRef.current.value;
    const description = descriptionElRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const event = { title, price, date, description };
    console.log(event);

    const requestBody = {
      query: `
          mutation CreateEvent($title: String!, $desc: String!, $price: Float!, $date: String!) {
            createEvent(eventInput: {title: $title, description: $desc, price: $price, date: $date}) {
              _id
              title
              description
              date
              price
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
      updatedEvents.push({
        _id: data.createEvent._id,
        title: data.createEvent.title,
        description: data.createEvent.description,
        date: data.createEvent.date,
        price: data.createEvent.price,
        creator: {
          _id: userId
        }
      });
      setEvents(updatedEvents);
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
    if (!token) {
      setSelectedEvent(null);
      return;
    }
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
      {(creating || selectedEvent) && <Backdrop />}
      {creating && (
        <Modal
          title="Add Event"
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={modalConfirmHandler}
          confirmText="Confirm"
        >
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" ref={titleElRef} />
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input type="number" id="price" ref={priceElRef} />
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input type="datetime-local" id="date" ref={dateElRef} />
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea id="description" rows="4" ref={descriptionElRef} />
            </div>
          </form>
        </Modal>
      )}
      {selectedEvent && (
        <Modal
          title={selectedEvent.title}
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={bookEventHandler}
          confirmText={token ? 'Book' : 'Confirm'}
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
