import { useEffect, useState } from "react";
import "../styles/EventList.css";

function EventListUI() {
    const [events, setEvents] = useState([]);

    const eventsTest = [
        {
            id: 1,
            title: "Sample Title",
            description: "Sample Title",
            date: "October 20, 2026",
            location: "Naga City",
        },
        {
            id: 2,
            title: "Sample Title",
            description: "Sample Title",
            date: "October 25, 2026",
            location: "Ateneo de Naga University",
        },
        {
            id: 3,
            title: "Sample Title",
            description: "Sample Title",
            date: "November 5, 2026",
            location: "Legazpi City",
        },
        {
            id: 4,
            title: "Sample Title",
            description: "Sample Title",
            date: "November 12, 2026",
            location: "Manila",
        },
    ];


    useEffect(() => {
        setEvents(eventsTest);
    }, []);

    return (
        <div className="eventList">
            <h1>Events</h1>

            <div className="eventGrid">
                {events.map((event) => (
                    <div className="eventCard" key={event.id}>
                        <h2>{event.title}</h2>
                        <p>{event.description}</p>
                        <p>Date: {event.date}</p>
                        <p>Location: {event.location}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EventListUI;