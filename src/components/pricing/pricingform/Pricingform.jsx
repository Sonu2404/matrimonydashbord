import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./Pricingform.module.css";

const PricingForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Use id for editing

  const [formData, setFormData] = useState({
    title: "", // Title will be dynamically set during creation
    price: "",
    duration: "",
    description: "",
    features: [""],
  });

  // Effect hook to handle creation and editing
  useEffect(() => {
    if (id) {
      // Editing an existing plan: Fetch plan data
      const fetchPlan = async () => {
        try {
          const response = await axios.get(`https://matrimonybackend-nd5n.onrender.com/api/v1/pricing/${id}`);
          setFormData({
            title: response.data.data.title, // Use the title from the API response
            price: response.data.data.price,
            duration: response.data.data.duration,
            description: response.data.data.description,
            features: response.data.data.features || [""],
          });
        } catch (error) {
          alert("Failed to fetch pricing plan.");
        }
      };

      fetchPlan();
    } else {
      // Creation mode: Set title dynamically based on the URL (gold or silver)
      const planType = window.location.pathname.split("/").pop().toLowerCase();
      setFormData({
        ...formData,
        title: planType === "gold" ? "Gold Plan" : "Silver Plan", // Set title accordingly
      });
    }
  }, [id]); // Effect runs when the component mounts or when the ID changes

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle features field changes
  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData({ ...formData, features: updatedFeatures });
  };

  // Add a new feature row
  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  // Remove a feature row
  const removeFeature = (index) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
  };

  // Handle form submission (both for create and edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        // Editing an existing plan (PUT request)
        await axios.put(`http://localhost:8000/api/v1/pricing/${id}`, formData);
        alert("Pricing plan updated successfully!");
      } else {
        // Creating a new plan (POST request)
        await axios.post("http://localhost:8000/api/v1/pricing/create", formData);
        alert("Pricing plan added successfully!");
      }
      navigate("/pricing"); // Redirect to pricing page after submitting
    } catch (error) {
      alert("Failed to save pricing plan.");
    }
  };

  return (
    <div className={styles.main}>
      <h2 className={styles.maintitle}>{id ? "Edit" : "Create"} {formData.title}</h2> {/* Title display */}
      <form className={styles.form} onSubmit={handleSubmit}>
        
        {/* Title is displayed and can be modified by the user */}
        <label>Plan Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange} // Allow user to modify the title
        />

        {/* Editable fields */}
        <label>Price</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} required />

        <label>Duration</label>
        <input type="text" name="duration" value={formData.duration} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required />

        <label>Features</label>
        {formData.features.map((feature, index) => (
          <div key={index} className={styles.featureRow}>
            <input
              type="text"
              value={feature}
              onChange={(e) => handleFeatureChange(index, e.target.value)}
              required
            />
            <button className={styles.mainbutton} type="button" onClick={() => removeFeature(index)}>-</button>
          </div>
        ))}
        <button className={styles.feature} type="button" onClick={addFeature}>
          Add Feature
        </button>

        <button className={styles.feature} type="submit">
          {id ? "Update Plan" : "Add Plan"}
        </button>
      </form>
    </div>
  );
};

export default PricingForm;
