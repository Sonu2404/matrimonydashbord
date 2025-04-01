import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Eventdetail.module.css";

const Eventsdetail = () => {
  const { id } = useParams(); // Get event ID from URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`https://matrimonybackend-nd5n.onrender.com/api/v1/events/${id}`);
        const data = await response.json();
        if (data.success) {
          setEvent(data.data); // Populate event details
        } else {
          setError(data.message || "Failed to fetch event details.");
        }
      } catch (err) {
        setError("Error fetching event: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.cardDetail}>
      <h1>{event.name}</h1>
      <div className={styles.eventContent}>
        <img
          src={event.imageUrl || "https://via.placeholder.com/300"}
          alt={event.name}
          className={styles.image}
        />
        <div className={styles.textContent}>
          <p className={styles.description}>{event.description}</p>
          <p className={styles.eventDetails}>
            <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
          </p>
          <p className={styles.eventDetails}>
            <strong>Location:</strong> {event.location}
          </p>
          <p className={styles.eventDetails}>
            <strong>Organizer:</strong> {event.organizer || "N/A"}
          </p>
        </div>
      </div>

      <div className={styles.attendees}>
        <h3>Attendees:</h3>
        {event.attendees && event.attendees.length > 0 ? (
          <ul className={styles.maincard}>
            {event.attendees.map((attendee, index) => (
              <li key={index} className={styles.attendee}>
                <img
                  src={attendee.image || "https://via.placeholder.com/50"}
                  alt={attendee.name}
                  className={styles.attendeeImage}
                />
                <div>
                  <p><strong>{attendee.name}</strong></p>
                  <p>{attendee.phone}</p>
                  <p>{attendee.email}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No attendees yet.</p>
        )
        }
      </div>
      </div>

  );
};

export default Eventsdetail;
