import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Vendordetail.module.css";

const VendorDetail = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch vendor details from backend
  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await fetch(`https://matrimonybackend-nd5n.onrender.com/api/v1/vendors/${id}`);
        const data = await response.json();
        if (data.success) {
          setVendor(data.data); // Populate vendor details
        } else {
          setError(data.message || "Failed to fetch vendor details.");
        }
      } catch (err) {
        setError("Error fetching vendor details: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [id]);

  if (loading) return <p>Loading vendor details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.cardDetail}>
      <h1 className={styles.title}>{vendor.title || vendor.name}</h1>
      <div className={styles.eventContent}>
        <div className={styles.imagecard}>
        <img
          src={vendor.profilePicUrl || "/images/placeholder.png"} // Local fallback
          alt={vendor.title || "Vendor"}
          className={styles.imagemain}
          onError={(e) => (e.target.src = "/images/placeholder.png")} // Handle broken image
        />
        </div>
        <div className={styles.textContent}>
        
          <p className={styles.phonemain}>
            <strong>Address:</strong> {vendor.address}
          </p>
          <p className={styles.phonemain}>
            <strong>Phone:</strong> {vendor.phone}
          </p>
          <p className={styles.phonemain}>
            <strong>Email:</strong> {vendor.email}
          </p>
          <p className={styles.phonemain}>
            <strong>Services:</strong> {vendor.services?.join(", ") || "Not specified"}
          </p>
          <p className={styles.phonemain}>
            <strong>Verified:</strong> {vendor.isVerified ? "Yes" : "No"}
          </p>
          <p className={styles.phonemain}>
            <strong>Ratings:</strong> {vendor.ratings.toFixed(1)} / 5
          </p>
        </div>
        
      </div>
      <p className={styles.descriptionmain}> <strong className={styles.descriptions}>Description:</strong><br/> {vendor.description}</p>

      {/* Gallery Section */}
      {vendor.galleryImages?.length > 0 && (
        <div className={styles.gallery}>
          <h2 className={styles.gallerymian}>WORK </h2>
          <div className={styles.galleryGrid}>
            {vendor.galleryImages.map((image, index) => (
              <div key={index} className={styles.galleryItem}>
                <img
                className={styles.imagegallery}
                  src={image.imageUrl || "/images/placeholder.png"}
                  alt={image.title || "Gallery Image"}
                  onError={(e) => (e.target.src = "/images/placeholder.png")}
                />
                <div className={styles.galleryInfo}>
                  <p><strong className={styles.titlegallery}>Title: </strong><strong>{image.title}</strong></p>
                  <p><strong className={styles.titlegallery}>Description: </strong>{image.description}</p>
                  <p><strong className={styles.titlegallery}>Feedback: </strong>{image.feedback}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      {vendor.reviews?.length > 0 && (
        <div className={styles.reviews}>
          <h2>Reviews</h2>
          {vendor.reviews.map((review, index) => (
            <div key={index} className={styles.review}>
              <p>
                <strong>User:</strong> {review.user?.name || "Anonymous"}
              </p>
              <p>
                <strong>Rating:</strong> {review.rating} / 5
              </p>
              <p>{review.comment}</p>
              <p className={styles.reviewDate}>
                <strong>Reviewed on:</strong> {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorDetail;
