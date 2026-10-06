import { useEffect, useState } from "react";
import "../styles/EventDetailsUI.css";

function EventDetailsUI({ event, onClose }) {
    if (!event) {
        return null;
    }

    return (
        <div className="modalOverlay" onClick={onClose}>
            <div className="eventModal" onClick={(e) => e.stopPropagation()}>
                <button className="closeButton" onClick={onClose}>×</button>

                <h2>{event.title}</h2>
                <p>{event.description}</p>
                <p><strong>Date:</strong> {event.date}</p>
                <p><strong>Location:</strong> {event.location}</p>

            </div>
        </div>
    );
}

export default EventDetailsUI;