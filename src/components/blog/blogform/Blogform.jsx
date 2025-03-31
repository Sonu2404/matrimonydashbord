import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Blogform.module.css"; // Assuming you'll create a similar CSS

const Addblog = () => {
  const { id } = useParams(); // Get blog ID from URL if editing
  const navigate = useNavigate(); // For navigation
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    category: "",
    cantentcard: "", // New field
    cantentcards: "", // New field
    cantentmain: "", // New field
    blogimageUrl: null, // Image is handled separately
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false); // To handle loading state

  // Fetch blog data if editing
  useEffect(() => {
    if (id) {
      setIsEditing(true);
      setLoading(true);
      axios
        .get(`http://localhost:8000/api/v1/blogs/${id}`)
        .then((response) => {
          const blog = response.data.data;
          if (blog) {
            setFormData({
              title: blog.title || "",
              content: blog.content || "",
              author: blog.author || "",
              category: blog.category || "",
              cantentcard: blog.cantentcard || "", // Populate the new field
              cantentcards: blog.cantentcards || "", // Populate the new field
              cantentmain: blog.cantentmain || "", // Populate the new field
              blogimageUrl: null, // Image is handled separately
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching blog:", error);
          alert("Error loading blog data. Please try again.");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  // Handles changes to form inputs
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // Handles form submission for both Create and Edit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("content", formData.content);
    formDataToSend.append("author", formData.author);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("cantentcard", formData.cantentcard); // Add new fields
    formDataToSend.append("cantentcards", formData.cantentcards); // Add new fields
    formDataToSend.append("cantentmain", formData.cantentmain); // Add new fields

     // Handle blog image separately
  if (formData.blogimageUrl) {
    formDataToSend.append("blogimageUrl", formData.blogimageUrl);
  }

  try {
    setLoading(true);
    if (isEditing) {
      // Update blog (PUT request)
      await axios.put(`http://localhost:8000/api/v1/blogs/${id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Blog updated successfully!");
    } else {
      // Create new blog (POST request)
      await axios.post("http://localhost:8000/api/v1/blogs/create", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Blog created successfully!");
    }
    // Redirect to the blog list (blogmain page) after successful submit
    navigate("/blogmain"); // Make sure your routing is correct and this matches the route for the blog list page
  } catch (error) {
    console.error("Error submitting blog:", error.response?.data || error.message);
  } finally {
    setLoading(false); // Reset loading state
  }
};

  // Handle file preview for blog image
  const handleImagePreview = (file) => {
    return file ? URL.createObjectURL(file) : null;
  };

   // Handle delete functionality
   const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (confirmDelete) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:8000/api/v1/blogs/${id}`);
        alert("Blog deleted successfully!");
        navigate("/blogs"); // Redirect to blog list after deletion
      } catch (error) {
        console.error("Error deleting blog:", error.response?.data || error.message);
        alert("Error deleting the blog. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.createBlog}>{isEditing ? "Edit Blog" : "Create Blog"}</h2>
      <div className={styles.main}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Blog Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
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
          />
        </div>

        {/* New fields */}
        <div className={styles.formGroup}>
          <label htmlFor="cantentcard">Cantent Card</label>
          <input
            type="text"
            id="cantentcard"
            name="cantentcard"
            value={formData.cantentcard}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="cantentcards">Cantent Cards</label>
          <input
            type="text"
            id="cantentcards"
            name="cantentcards"
            value={formData.cantentcards}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="cantentmain">Cantent Main</label>
          <input
            type="text"
            id="cantentmain"
            name="cantentmain"
            value={formData.cantentmain}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="blogimageUrl">Blog Image</label>
          <input
            type="file"
            id="blogimageUrl"
            name="blogimageUrl"
            onChange={handleChange}
          />
          {formData.blogimageUrl && (
            <img
              src={handleImagePreview(formData.blogimageUrl)}
              alt="Blog Preview"
              className={styles.imagePreview}
            />
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.mainbutton}>
        <button className={styles.submitButton} type="submit" disabled={loading}>
          {loading ? "Submitting..." : isEditing ? "Save Changes" : "Create Blog"}
        </button>
      </div>
    </form>
  );
};

export default Addblog;
