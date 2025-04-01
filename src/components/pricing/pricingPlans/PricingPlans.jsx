import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./PricingPlans.module.css";

const PricingPlans = () => {
  const [pricingPlans, setPricingPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch pricing plans from backend
  useEffect(() => {
    const fetchPricingPlans = async () => {
      try {
        const response = await axios.get("https://matrimonybackend-nd5n.onrender.com/api/v1/Pricing"); 
        setPricingPlans(response.data.data); // Ensure API returns { success: true, data: [...] }
      } catch (err) {
        console.error("Error fetching pricing plans:", err);
        setError("Failed to load pricing plans.");
      } finally {
        setLoading(false);
      }
    };

    fetchPricingPlans();
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.maintitle}>Upgrade your plan</div>

      {loading ? (
        <p>Loading plans...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <div className={styles.container}>
          {pricingPlans.map((plan) => (
            <div key={plan._id} className={`${styles.card} ${styles[plan._id]}`}>
              <h3 className={styles.title}>{plan.title}</h3>
              <p className={styles.price}>
                {plan.price} <span className={styles.duration}>/{plan.duration}</span>
              </p>
              <p className={styles.description}>{plan.description}</p>
              <ul className={styles.features}>
  {plan.features.map((feature, index) => (
    <li key={index} className={styles.featureItem}>
      {feature}
      <span className={styles.checkmark}>✔</span>
    </li>
  ))}
</ul>

              <button className={styles.button}>Choose Plan</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PricingPlans;
