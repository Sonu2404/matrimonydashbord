import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [counts, setCounts] = useState({ male: 0, female: 0, other: 0, total: 0 });
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCounts();
    fetchMonthlyData();
  }, []);

  const fetchCounts = async () => {
    try {
      const response = await axios.get("https://matrimonybackend-nd5n.onrender.com/api/v1/bride-groom/gender-counts");
      if (response.data.success) {
        setCounts({
          male: response.data.data.male,
          female: response.data.data.female,
          other: response.data.data.other,
          total: response.data.data.totalUsers,
        });
      }
    } catch (error) {
      console.error("Error fetching counts:", error);
      setError("Failed to load counts.");
    }
  };

  const fetchMonthlyData = async () => {
    try {
      const response = await axios.get("https://matrimonybackend-nd5n.onrender.com/api/v1/bride-groom/monthly-stats");
      if (response.data.success) {
        setMonthlyData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching monthly data:", error);
      setError("Failed to load monthly data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  const chartData = monthlyData.map((value) => ({
    name: value.month,
    male: value.male,
    female: value.female,
    other: value.other,
  }));

  return (
    <div className={styles.dashboard}>
      <h2 className={styles.welcome}>Welcome to Your Matrimony Dashboard</h2>

      <div className={styles.statsContainer}>
        <div className={`${styles.statBox} ${styles.male}`} data-aos="fade-up">
          <h3>Male Profiles</h3>
          <p>{counts.male}</p>
        </div>
        <div className={`${styles.statBox} ${styles.female}`} data-aos="fade-up" data-aos-delay="100">
          <h3>Female Profiles</h3>
          <p>{counts.female}</p>
        </div>
        <div className={`${styles.statBox} ${styles.other}`} data-aos="fade-up" data-aos-delay="200">
          <h3>Other Profiles</h3>
          <p>{counts.other}</p>
        </div>
        <div className={`${styles.statBox} ${styles.total}`} data-aos="fade-up" data-aos-delay="300">
          <h3>Total Profiles</h3>
          <p>{counts.total}</p>
        </div>
      </div>

      <div className={styles.chartContainer} data-aos="zoom-in">
        <h3 className={styles.monthly}>Monthly Growth Trend</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
            <XAxis dataKey="name" stroke="black" />
            <YAxis stroke="black" />
            <Tooltip contentStyle={{ backgroundColor: "#333", color: "black", borderRadius: "8px" }} />
            <Legend />
            <Bar
              dataKey="male"
              fill="#1abc9c"
              name="Male"
              barSize={60}
              radius={[12, 12, 0, 0]}
              animationDuration={1000}
            />
            <Bar
              dataKey="female"
              fill="#e74c3c"
              name="Female"
              barSize={60}
              radius={[12, 12, 0, 0]}
              animationDuration={1000}
            />
            <Bar
              dataKey="other"
              fill="#f39c12"
              name="Other"
              barSize={60}
              radius={[12, 12, 0, 0]}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;