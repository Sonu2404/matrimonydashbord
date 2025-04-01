import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Sanchalakform.module.css";

const Sanchalakform = () => {
  const { id } = useParams(); // Get sanchalak ID from URL if editing
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    phone: "",
    email: "",
    profilePic: null,
    bio: "",
    address: "",
    birthData: "",
    place: "",
    description: "",
    education: "",
    role: "",
    achievements: [""],
    socialLinks: { facebook: "", instagram: "", twitter: "" },
    work: [{ title: "", description: "", image: null, feedback: "" }],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      setLoading(true);
      axios
        .get(`https://matrimonybackend-nd5n.onrender.com/api/v1/sanchalak/${id}`)
        .then((response) => {
          console.log("Fetched data:", response.data);
          // Populate the form data with the response data
          const fetchedData = response.data.data;
          setFormData((prev) => ({
            ...prev,
            name: fetchedData.name || "",
            designation: fetchedData.designation || "",
            phone: fetchedData.phone || "",
            email: fetchedData.email || "",
            profilePic: fetchedData.profilePic || null,
            bio: fetchedData.bio || "",
            address: fetchedData.address || "",
            birthData: fetchedData.birthData || "",
            place: fetchedData.place || "",
            description: fetchedData.description || "",
            education: fetchedData.education || "",
            role: fetchedData.role || "",
            achievements: fetchedData.achievements || [""],
            socialLinks: fetchedData.socialLinks || { facebook: "", instagram: "", twitter: "" },
            work: Array.isArray(fetchedData.work) ? fetchedData.work : [{ title: "", description: "", image: null, feedback: "" }],
          }));
        })
        .catch((error) => {
          if (error.response) {
            console.error("Error fetching sanchalak data:", error.response.data);
            alert(`Error: ${error.response.data.message || "Failed to fetch Sanchalak data."}`);
          } else if (error.request) {
            console.error("Error: No response received from the server.");
          } else {
            console.error("Error:", error.message);
          }
          alert("Error loading data. Please try again.");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleWorkChange = (index, e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => {
      const updatedWork = [...prev.work];
      if (type === "file") {
        updatedWork[index][name] = files[0];
      } else {
        updatedWork[index][name] = value;
      }
      return { ...prev, work: updatedWork };
    });
  };

  // Add Work entry
  const addWork = () => {
    setFormData((prev) => ({
      ...prev,
      work: [
        ...prev.work,
        { title: "", description: "", image: null, feedback: "" },
      ],
    }));
  };

  // Remove Work entry
  const removeWork = (index) => {
    setFormData((prev) => ({
      ...prev,
      work: prev.work.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "work") {
        formData.work.forEach((work, index) => {
          formDataToSend.append(`work[${index}][title]`, work.title);
          formDataToSend.append(`work[${index}][description]`, work.description);
          formDataToSend.append(`work[${index}][feedback]`, work.feedback);
          if (work.image) {
            formDataToSend.append(`work[${index}][image]`, work.image);
          }
        });
      } else if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });
    try {
      setLoading(true);
      if (isEditing) {
        await axios.put(
          `https://matrimonybackend-nd5n.onrender.com/api/v1/sanchalak/${id}`,
          formDataToSend,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("Sanchalak updated successfully!");
      } else {
        await axios.post(
          "https://matrimonybackend-nd5n.onrender.com/api/v1/sanchalak/create",
          formDataToSend,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("Sanchalak created successfully!");
      }
      navigate("/sanchalaks");
    } catch (error) {
      console.error("Error submitting sanchalak:", error.response?.data || error.message);
      alert("Error submitting form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>{isEditing ? "Edit Sanchalak" : "Create Sanchalak"}</h2>
      <div className={styles.FirstGroup}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="text"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          placeholder="Designation"
          required
        />
      </div>

      <div className={styles.FirstGroup}>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
      </div>
      <input type="file" name="profilePic" onChange={handleChange} />
      <textarea
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        placeholder="Short Bio"
      />

      <div className={styles.FirstGroup}>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
        />
        <input
          type="date"
          name="birthData"
          value={formData.birthData}
          onChange={handleChange}
          required
        />
      </div>

      <input
        type="text"
        name="place"
        value={formData.place}
        onChange={handleChange}
        required
        placeholder="Place"
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Detailed Description"
      />

      <div className={styles.FirstGroup}>
        <input
          type="text"
          name="education"
          value={formData.education}
          onChange={handleChange}
          placeholder="Education"
        />
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="Role"
        />
      </div>
      {Array.isArray(formData.work) && formData.work.map((work, index) => (
        <div key={index}>
          <input
            type="text"
            name="title"
            value={work.title}
            onChange={(e) => handleWorkChange(index, e)}
            placeholder="Work Title"
            required
          />
          <textarea
            name="description"
            value={work.description}
            onChange={(e) => handleWorkChange(index, e)}
            placeholder="Work Description"
            required
          />
          <input
            type="file"
            name="image"
            onChange={(e) => handleWorkChange(index, e)}
          />
          <textarea
            name="feedback"
            value={work.feedback}
            onChange={(e) => handleWorkChange(index, e)}
            placeholder="Feedback"
          />
          <button
            type="button"
            className={styles.removeWorkBtn}
            onClick={() => removeWork(index)}
          >
            Remove Work
          </button>

        </div>
      ))}
      <button
        type="button"
        className={styles.addWorkBtn}
        onClick={addWork}
      >
        Add Work
      </button>
      <button
        type="submit"
        className={styles.submitBtn}
        disabled={loading}
      >
        {loading ? "Submitting..." : isEditing ? "Save Changes" : "Create Sanchalak"}
      </button>
    </form>
  );
};

export default Sanchalakform;
