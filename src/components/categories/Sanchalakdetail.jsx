import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa"; // Import social media icons
import styles from  "./Sanchalakdetail.module.css";

const MemberDetail = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/v1/sanchalak/${id}`);
        const data = await response.json();
        if (data.success) {
          setMember(data.data);
        } else {
          setError(data.message || "Failed to fetch member details.");
        }
      } catch (err) {
        setError("Error fetching member: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  if (loading) return <p>Loading member details...</p>;
  if (error) return <p>{error}</p>;
  if (!member) return <p>Member not found!</p>;

  // Map social media platforms to their respective icons
  const platformIcons = {
    facebook: <FaFacebook />,
    twitter: <FaTwitter />,
    linkedin: <FaLinkedin />,
    instagram: <FaInstagram />
  };

  return (
    <div className={styles.detail}>
      <div className={styles.main}>
        <div className={styles.deta}>
          <div className={styles.name}>{member.name}</div>
          <div className={styles.designation}>{member.designation}</div>
          <div className={styles.bio}>{member.bio}</div>
        </div>
        <img
          src={member.profilePic || "https://via.placeholder.com/150"}
          alt={member.name}
          className={styles.image}
        />
      </div>

      <h2 className={styles.name}>{member.name}</h2>

      <div className={styles.info}>
        <p><strong>Phone:</strong> {member.phone}</p>
        <p><strong>Email:</strong> {member.email}</p>
        <p><strong>Birth Date:</strong> {new Date(member.birthData).toLocaleDateString()}</p>
        <p><strong>Age:</strong> {new Date().getFullYear() - new Date(member.birthData).getFullYear()}</p>
        <p><strong>Place:</strong> {member.place}</p>
        <p><strong>Address:</strong> {member.address}</p>
        <p><strong>Education:</strong> {member.education}</p>
        <p><strong>Role:</strong> {member.role}</p>
        <p><strong>Description:</strong> {member.description}</p>
      </div>

      <h3 className={styles.title}>Work</h3>
      <div className={styles.work}>
        {member.work && member.work.length > 0 ? (
          member.work.map((workItem) => (
            <div key={workItem._id} className={styles.workItem}>
              
              <img
                src={workItem.image || "https://via.placeholder.com/150"}
                alt={workItem.title}
                className={styles.workImage}
              />
              <div className={styles.maintext}>
              <h4>{workItem.title}</h4>
              <p>{workItem.description}</p>
              <p><strong>Feedback:</strong> {workItem.feedback}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No work items available.</p>
        )}
      </div>

      <h3 className={styles.title}>Achievements</h3>
      <div className={styles.achievements}>
        {member.achievements && member.achievements.length > 0 ? (
          member.achievements.map((achievement, index) => (
            <p key={index}>{achievement}</p>
          ))
        ) : (
          <p>No achievements listed.</p>
        )}
      </div>

      <h3 className={styles.title}>Follow on Social Media</h3>
      <div className={styles.socialLinks}>
        {member.socialLinks && Object.keys(member.socialLinks).map((platform, index) => (
          <a
            key={index}
            href={member.socialLinks[platform]}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.iconLink}
          >
            <span className={styles.icon}>{platformIcons[platform]}</span>
            <span className={styles.platformName}>
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default MemberDetail;
