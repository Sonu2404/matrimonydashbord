const API_BASE_URL = "https://matrimonybackend-nd5n.onrender.com/api/v1";

export const registerBrideGroom = async (formData) => {
  try {
    const formDataToSend = new FormData();
    
    const formattedFormData = {
      ...formData,
      dateOfBirth: formData.dateOfBirth ? 
        new Date(formData.dateOfBirth).toISOString().split('T')[0] : '',
      timeOfBirth: formData.timeOfBirth || ''
    };

    console.log("Form data being sent:", {
      ...formattedFormData,
      profilePhoto: formattedFormData.profilePhoto ? 'File present' : 'No file',
      aadharPhoto: formattedFormData.aadharPhoto ? 'File present' : 'No file'
    });

    Object.entries(formattedFormData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && key !== "profilePhoto" && key !== "aadharPhoto") {
        formDataToSend.append(key, value);
      }
    });

    // Handle file uploads explicitly
    if (formData.profilePhoto && formData.profilePhoto instanceof File) {
      formDataToSend.append("profilePhoto", formData.profilePhoto, formData.profilePhoto.name);
      console.log("Profile photo added:", formData.profilePhoto.name);
    }
    
    if (formData.aadharPhoto && formData.aadharPhoto instanceof File) {
      formDataToSend.append("aadharPhoto", formData.aadharPhoto, formData.aadharPhoto.name);
      console.log("Aadhar photo added:", formData.aadharPhoto.name);
    }

    const response = await fetch(`${API_BASE_URL}/bride-groom/create`, {
      method: "POST",
      body: formDataToSend,
    });

    const result = await response.json();
    
    console.log("Server response:", {
      status: response.status,
      body: result
    });

    if (!response.ok) {
      const errorMessage = result.error || result.message || `Server error: ${response.status}`;
      throw new Error(errorMessage);
    }

    return result;
  } catch (error) {
    console.error("❌ Detailed API Error:", {
      message: error.message,
      stack: error.stack,
      formDataSummary: {
        hasProfilePhoto: !!formData.profilePhoto,
        hasAadharPhoto: !!formData.aadharPhoto,
        profilePhotoType: formData.profilePhoto?.constructor.name,
        aadharPhotoType: formData.aadharPhoto?.constructor.name
      }
    });
    throw new Error(error.message || "Failed to register bride/groom");
  }
};