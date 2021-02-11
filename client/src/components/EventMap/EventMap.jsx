import {useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userInSessionThunk } from '../../redux/action-creators/user';
import { YMaps, Map, Placemark, Clusterer } from 'react-yandex-maps';
import './eventMap.css';
import {filterEvents, getCurrentEventThunk, getEventsThunk} from '../../redux/action-creators/events';
import Checkbox from '../Checkbox/Checkbox';
import '../EventMap/eventMap.css'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  useHistory,
} from "react-router-dom";


const EventMap = () => {
  const [category, setCategory] = useState([])
  const key = '51ad9d93-9100-4ffa-8ebf-138a17d2a225';
  const dispatch = useDispatch();
  const history = useHistory();
  const { user, events } = useSelector(store => store);
  const [eventState, setEventState] = useState(events.event)
  const currentEvent = useSelector(store => store.currentEvent);
  const filterEvent = useSelector(items => items.events.filterEvent)
  const redirectOnEventPage = id => {
    history.push(`/event-page/${id}`);
  };
  useEffect(() => {
    (async () => {
      await dispatch(userInSessionThunk());
      await dispatch(getEventsThunk());
    })();
  }, []);

  useEffect(() => {
    if (category.length) {
      dispatch(filterEvents(category))
    }
  }, [category])

  useEffect(() => {
    if (category.length) {
      setEventState(filterEvent)
    }
  }, [filterEvent])

  const clickHandler = id => {
    dispatch(getCurrentEventThunk(id));
  };
  const sortByCheckbox = (event) => {
    event.target.value = !event.target.value
      if (event.target.checked) {
        setCategory(prev => [...prev, event.target.dataset.id])
      } else {
        setCategory(prev => {
          return prev.filter(el => el !== event.target.dataset.id)
        })
        setEventState(events.event)
      }
  }
  return (
 <div className="bg">
      <div className="eventMap wrapper">
      <Link title="Домой" to="/">
        <img src="icons8-menu-96.png" className="hamburger" />
      </Link>
      <div className="container">
        <div className="info">
          {user ? (
            <div className="current-info">
              {currentEvent ? (
                <>
                  <h3>{currentEvent.game.title}</h3>
                  <p>Описание события: {currentEvent.description}</p>
                  <span>Адрес: {currentEvent.address}</span>
                  <button
                    onClick={() => redirectOnEventPage(currentEvent._id)}
                    className="btn btn-primary"
                  >
                    Подробнее
                  </button>
                </>
              ) : (
                <p>Выбери событие</p>
              )}
            </div>
          ) : (
            <h1>Давай зарегистрируемся?</h1>
          )}
        </div>
        <div className="y-wrapper">
          <Checkbox sortByCheckbox={sortByCheckbox} />
          <YMaps query={{ ns: "use-load-option", apikey: key }}>
            <Map
              defaultState={{
                center: [55.75, 37.57],
                zoom: 10,
                controls: ["zoomControl", "fullscreenControl"],
              }}
              modules={[
                "control.ZoomControl",
                "control.FullscreenControl",
                "geocode",
              ]}
              className="map"
              instanceRef={(ref) => {
                ref && ref.behaviors.disable("scrollZoom");
              }}
            >
              <Clusterer options={{ groupByCoordinates: false }}>
                {eventState &&
                  eventState.map((event) => {
                    return (
                      <div key={event._id}>
                        <Placemark
                          onClick={() => clickHandler(event._id)}
                          geometry={event.coordinates}
                          options={{
                            iconLayout: "default#image",
                            iconImageHref: `http://localhost:3001${event.thumbnail}`,
                            iconImageSize: [40, 40],
                          }}
                        />
                      </div>
                    );
                  })}
              </Clusterer>
            </Map>
          </YMaps>
        </div>
      </div>
    </div>
 </div>
  );
};

export default EventMap;
