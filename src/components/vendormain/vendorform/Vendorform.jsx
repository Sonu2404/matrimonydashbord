import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Vendorform.module.css';
import { useParams, useNavigate } from 'react-router-dom';

const VendorForm = () => {
  const { id } = useParams(); // Get vendor ID from URL params
  const navigate = useNavigate();
  const [vendorData, setVendorData] = useState({
    title: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    services: [],
    profilePic: [],
    galleryImages: [{ title: '', description: '', image: null, feedback: '' }],
    description: '',
    isVerified: false,
    ratings: 0,
  });
  const [successMessage, setSuccessMessage] = useState(false);

  // Fetch existing vendor data if editing
  useEffect(() => {
    if (id) {
      const fetchVendor = async () => {
        try {
          const response = await axios.get(`https://matrimonybackend-nd5n.onrender.com/api/v1/vendors/${id}`);
          const data = response.data.data;
          setVendorData({
            ...data,
            profilePic: data.profilePicUrl || [],
            services: data.services || [],
            galleryImages: data.galleryImages.length > 0 ? data.galleryImages : [{ title: '', description: '', image: null, feedback: '' }],
          });
        } catch (error) {
          console.error('Error fetching vendor:', error);
        }
      };
      fetchVendor();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVendorData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGalleryImageChange = (e, index, field) => {
    const { value } = e.target;
    const updatedGalleryImages = [...vendorData.galleryImages];
    updatedGalleryImages[index][field] = value;
    setVendorData({ ...vendorData, galleryImages: updatedGalleryImages });
  };

  const handleFileChange = (e, fieldName, index = null) => {
    const file = e.target.files[0];
    if (file) {
      if (index !== null) {
        const updatedGalleryImages = [...vendorData.galleryImages];
        updatedGalleryImages[index].image = file;
        setVendorData({ ...vendorData, galleryImages: updatedGalleryImages });
      } else {
        setVendorData({ ...vendorData, [fieldName]: [file] });
      }
    }
  };

  const handleAddGalleryImage = () => {
    setVendorData((prevData) => ({
      ...prevData,
      galleryImages: [
        ...prevData.galleryImages,
        { title: '', description: '', image: null, feedback: '' },
      ],
    }));
  };

  const handleRemoveGalleryImage = (index) => {
    const updatedGalleryImages = vendorData.galleryImages.filter((_, i) => i !== index);
    setVendorData({ ...vendorData, galleryImages: updatedGalleryImages });
  };

  const handleServiceChange = (e) => {
    const { value, checked } = e.target;
    setVendorData((prevData) => {
      let updatedServices = [...prevData.services];
      if (checked) {
        updatedServices.push(value);
      } else {
        updatedServices = updatedServices.filter(service => service !== value);
      }
      return { ...prevData, services: updatedServices };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', vendorData.title);
    formData.append('name', vendorData.name);
    formData.append('email', vendorData.email);
    formData.append('phone', vendorData.phone);
    formData.append('address', vendorData.address);
    formData.append('services', vendorData.services.join(','));
    formData.append('description', vendorData.description);
    formData.append('isVerified', vendorData.isVerified);
    formData.append('ratings', vendorData.ratings);

    if (vendorData.profilePic[0]) {
      formData.append('profilePicUrl', vendorData.profilePic[0]);
    }

    vendorData.galleryImages.forEach((galleryImage, index) => {
      if (galleryImage.image) {
        formData.append(`galleryImages[${index}][image]`, galleryImage.image);
      }
      if (galleryImage.title) {
        formData.append(`galleryImages[${index}][title]`, galleryImage.title);
      }
      if (galleryImage.description) {
        formData.append(`galleryImages[${index}][description]`, galleryImage.description);
      }
      if (galleryImage.feedback) {
        formData.append(`galleryImages[${index}][feedback]`, galleryImage.feedback);
      }
    });

    try {
      if (id) {
        // Update existing vendor
        const response = await axios.put(`http://localhost:8000/api/v1/vendors/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('Vendor updated:', response.data);
      } else {
        // Create new vendor
        const response = await axios.post('http://localhost:8000/api/v1/vendors/create', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('Vendor created:', response.data);
      }
      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
        navigate('/'); // Redirect back to VendorMain after success
      }, 3000);
    } catch (error) {
      console.error('Error submitting vendor:', error);
    }
  };

  // Rest of the form JSX remains largely the same, just adding a dynamic title
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>{id ? 'Edit Vendor' : 'Add New Vendor'}</h2>
      <div className={styles.main}>
        <div className={styles.inputGroup}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            value={vendorData.title}
            onChange={handleInputChange}
            placeholder="Title"
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={vendorData.name}
            onChange={handleInputChange}
            required
            placeholder="Vendor Name"
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={vendorData.email}
            onChange={handleInputChange}
            required
            placeholder="Vendor Email"
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            name="phone"
            value={vendorData.phone}
            onChange={handleInputChange}
            required
            placeholder="Vendor Phone"
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="address">Address</label>
          <input
            type="text"
            name="address"
            value={vendorData.address}
            onChange={handleInputChange}
            required
            placeholder="Vendor Address"
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="description">Description</label>
          <input
            type="text"
            name="description"
            value={vendorData.description}
            onChange={handleInputChange}
            required
            placeholder="Description"
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="services">Services</label>
          <div className={styles.checkboxGroup}>
            {['Catering', 'Photography', 'Decoration', 'DJ', 'Makeup', 'Other'].map(service => (
              <label key={service}>
                <input
                  type="checkbox"
                  name="services"
                  value={service}
                  checked={vendorData.services.includes(service)}
                  onChange={handleServiceChange}
                />
                {service}
              </label>
            ))}
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="profilePicUrl">Profile Picture</label>
          <input type="file" onChange={(e) => handleFileChange(e, 'profilePic')} />
          {vendorData.profilePic[0] && typeof vendorData.profilePic[0] === 'string' && (
            <img src={vendorData.profilePic[0]} alt="Current Profile" className={styles.previewImage} />
          )}
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="ratings">Ratings</label>
          <input
            type="number"
            name="ratings"
            value={vendorData.ratings}
            onChange={handleInputChange}
            min="0"
            max="5"
            step="0.1"
            placeholder="Ratings (0-5)"
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="isVerified">Verified</label>
          <input
            type="checkbox"
            name="isVerified"
            checked={vendorData.isVerified}
            onChange={() => setVendorData((prev) => ({ ...prev, isVerified: !prev.isVerified }))}
          />
        </div>
      </div>
      <div className={styles.inputGroup}>
        <label>Gallery Images</label>
        <div className={styles.addgallery}>
          {vendorData.galleryImages.map((image, index) => (
            <div key={index}>
              <input type="file" onChange={(e) => handleFileChange(e, 'galleryImages', index)} />
              {image.image && typeof image.image === 'string' && (
                <img src={image.image} alt="Gallery Preview" className={styles.previewImage} />
              )}
              <input
                type="text"
                value={image.title}
                onChange={(e) => handleGalleryImageChange(e, index, 'title')}
                placeholder="Image Title"
                className={styles.file}
              />
              <input
                type="text"
                value={image.description}
                onChange={(e) => handleGalleryImageChange(e, index, 'description')}
                placeholder="Image Description"
                className={styles.file}
              />
              <input
                type="text"
                value={image.feedback}
                onChange={(e) => handleGalleryImageChange(e, index, 'feedback')}
                placeholder="Feedback"
              />
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => handleRemoveGalleryImage(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={handleAddGalleryImage}>
          Add Gallery Image
        </button>
      </div>
      <button className={styles.submitButton} type="submit">
        {id ? 'Update Vendor' : 'Submit Vendor'}
      </button>
      {successMessage && (
        <div className={styles.successPopup}>
          <p>Vendor {id ? 'updated' : 'created'} successfully!</p>
        </div>
      )}
    </form>
  );
};

export default VendorForm;