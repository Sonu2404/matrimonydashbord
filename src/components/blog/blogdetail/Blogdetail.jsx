import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./Blogdetail.module.css";

const Blogdetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setError(null);
        const response = await fetch(`https://matrimonybackend-nd5n.onrender.com/api/v1/blogs/${id}`);
        if (!response.ok) throw new Error("Failed to fetch blog details");

        const result = await response.json();

        if (result.success && result.data) {
          setBlog(result.data);
        } else {
          throw new Error("Unexpected response format from backend");
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) return <p>Loading blog...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.blogPage}>
      {/* Full-Screen Image */}
      <img
        src={blog.blogimageUrl || "https://via.placeholder.com/1920x1080"}
        alt={blog.title}
        className={styles.fullScreenImg}
      />

      <div className={styles.contentWrapper}>
      <div className={styles.mainCard}>
          <h1 className={styles.header}>{blog.title}</h1>
          <p className={styles.author}>
            <strong>Author:</strong> {blog.createdBy?.name || blog.author || "Unknown Author"}
          </p>
          <p className={styles.category}>
            <strong>Category:</strong> {blog.category || "Uncategorized"}
          </p>
          <p className={styles.published}>
            <strong>Published:</strong> {blog.isPublished ? "Yes" : "No"}
          </p>
          <div className={styles.content}>
            <p>{blog.content}</p>
          </div>
          <p className={styles.timestamp}>
            <strong>Created At:</strong> {new Date(blog.createdAt).toLocaleDateString()}
          </p>
          <p className={styles.timestamp}>
            <strong>Updated At:</strong> {new Date(blog.updatedAt).toLocaleDateString()}
          </p>
        </div>
        {/* Left Side - Additional Card */}
        {/* <div className={styles.leftCard}>
          <h2 className={styles.blog}>LATEST BLOGS</h2>
          <h3 className={styles.cantentmain}>{blog.cantentcard || "Uncategorized"}</h3>
          <hr />
          <h3 className={styles.cantentmain}>{blog.cantentcards}</h3>
          <hr />
          <h3 className={styles.cantentmain}>{blog.cantentmain}</h3>
          <p className={styles.react}><Link to="/blogmain">READ ALL BLOGS</Link></p>
        </div> */}

        {/* Right Side - Blog Main Card */}
      
      </div>
    </div>
  );
};

export default Blogdetail;
