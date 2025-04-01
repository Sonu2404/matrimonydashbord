import React, { useState } from "react";
import styles from "./Addimage.module.css"; // Import your CSS module

const Addimage = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("imageevent", image);

    try {
      const response = await fetch("https://matrimonybackend-nd5n.onrender.com/api/v1/eventimage/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setMessage(data.message); // Display success message
      setTitle(""); // Clear title input
      setImage(null); // Clear image input
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage("Error uploading image. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Add Event Image</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="imageevent">Image:</label>
          <input
            type="file"
            id="imageevent"
            onChange={handleImageChange}
            accept="image/*"
            required
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>Upload</button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default Addimage;