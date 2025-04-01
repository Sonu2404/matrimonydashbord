import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Addevent.module.css";    

const Addevent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    timeOfEvent: "",
    location: "",
    contact: "",
    category: "",
    organizer: "",
    image: null,
    attendees: [{ name: "", phone: "", email: "", image: null }],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      setLoading(true);
      axios
        .get(`https://matrimonybackend-nd5n.onrender.com/api/v1/events/${id}`)
        .then((response) => {
          const event = response.data.data;
          if (event) {
            setFormData({
              name: event.name || "",
              description: event.description || "",
              date: event.date ? event.date.split("T")[0] : "",
              timeOfEvent: event.timeOfEvent || "",
              location: event.location || "",
              contact: event.contact || "",
              category: event.category || "",
              organizer: event.organizer || "",
              image: null,
              attendees:
                event.attendees.length > 0
                  ? event.attendees
                  : [{ name: "", phone: "", email: "", image: null }],
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching event:", error);
          alert("Error loading event data. Please try again.");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, files, dataset } = e.target;

    if (dataset.attendeeIndex !== undefined) {
      const index = Number(dataset.attendeeIndex);
      setFormData((prevData) => {
        const updatedAttendees = [...prevData.attendees];
        if (type === "file") {
          updatedAttendees[index] = {
            ...updatedAttendees[index],
            [name]: files[0],
          };
        } else {
          updatedAttendees[index] = {
            ...updatedAttendees[index],
            [name]: value,
          };
        }
        return { ...prevData, attendees: updatedAttendees };
      });
    } else if (type === "file") {
      setFormData((prevData) => ({ ...prevData, image: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const addAttendee = () => {
    setFormData((prevData) => ({
      ...prevData,
      attendees: [
        ...prevData.attendees,
        { name: "", phone: "", email: "", image: null },
      ],
    }));
  };

  const removeAttendee = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      attendees: prevData.attendees.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("date", formData.date);
    formDataToSend.append("timeOfEvent", formData.timeOfEvent);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("contact", formData.contact);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("organizer", formData.organizer);

    if (formData.image) {
      formDataToSend.append("imageUrl", formData.image);
    }

    formData.attendees.forEach((attendee, index) => {
      formDataToSend.append(`attendees[${index}][name]`, attendee.name);
      formDataToSend.append(`attendees[${index}][phone]`, attendee.phone);
      formDataToSend.append(`attendees[${index}][email]`, attendee.email);
      if (attendee.image) {
        formDataToSend.append(`attendees[${index}][image]`, attendee.image);
      }
    });

    try {
      setLoading(true);
      if (isEditing) {
        await axios.put(
          `http://localhost:8000/api/v1/events/${id}`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        alert("Event updated successfully!");
      } else {
        await axios.post(
          "http://localhost:8000/api/v1/events/create",
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        alert("Event created successfully!");
      }
      navigate("/event");
    } catch (error) {
      console.error("Error submitting event:", error.response?.data || error.message);
      alert("Error submitting event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImagePreview = (file) => {
    return file ? URL.createObjectURL(file) : null;
  };

  return (
    <div className={styles.Container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.createevent}>
          {isEditing ? "Edit Event" : "Create Event"}
        </h2>
        <div className={styles.main}>
          <div className={styles.Addeventmain}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Event Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="timeOfEvent">Time</label>
              <input
                type="time"
                id="timeOfEvent"
                name="timeOfEvent"
                value={formData.timeOfEvent}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="contact">Contact No</label>
              <input
                type="text"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="organizer">Organizer</label>
              <input
                type="text"
                id="organizer"
                name="organizer"
                value={formData.organizer}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="image">Event Image</label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleChange}
              />
              {formData.image && (
                <img
                  src={handleImagePreview(formData.image)}
                  alt="Event Preview"
                  className={styles.imagePreview}
                />
              )}
            </div>
          </div>
        </div>

        {/* Attendees Section */}
        <div className={styles.Addevent}>
          {formData.attendees.map((attendee, index) => (
            <div key={index} className={styles.attendeeGroup}>
              <div className={styles.Addeventcard}>
                <h3>Attendee {index + 1}</h3>

                <div className={styles.formGroup}>
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={attendee.name}
                    data-attendee-index={index}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={attendee.phone}
                    data-attendee-index={index}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={attendee.email}
                    data-attendee-index={index}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Attendee Image</label>
                  <input
                    type="file"
                    name="image"
                    data-attendee-index={index}
                    onChange={handleChange}
                  />
                  {attendee.image && (
                    <img
                      src={handleImagePreview(attendee.image)}
                      alt="Attendee Preview"
                      className={styles.imagePreview}
                    />
                  )}
                </div>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeAttendee(index)}
                >
                  Remove Attendee
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className={styles.addAttendeeBtn}
            onClick={addAttendee}
          >
            Add Attendee
          </button>
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={loading}
        >
          {loading ? "Saving..." : isEditing ? "Update Event" : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default Addevent;
