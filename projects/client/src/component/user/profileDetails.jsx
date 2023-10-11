import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";



function ProfileDetails({ user, onChange }) {
  const token = useSelector((state) => state.auth.token);
  const [image, setImage] = useState({});

  const handleImageChange = async (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);

    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const res = await axios.patch(
        "http://localhost:8000/api/user/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onChange()

      console.log("Profile image updated successfully");
    } catch (error) {
      console.error("Error updating profile image:", error.response.data);
    }
  };

  return (
    <div className="bg-white w-full h-auto flex flex-col text-jetblack p-3 sm:w-full flex-1">
      <div className="w-full">
        <img
          className="w-60 h-60 justify-center mx-auto m-2 object-cover"
          src={
            user.imgProfile
              ? `http://localhost:8000${user.imgProfile}`
              : "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
          }
          alt={user.username || "/"}
        />
      </div>
      <div className="flex flex-col text-center gap-4 mt-4">
        <div className="flex-1 font-lora text-2xl">{user.username}</div>
        <div className="font-josefin text-lg">Store Name: {user.storeName}</div>
        <div className="font-josefin text-lg">Email: {user.email}</div>
        <div className="font-josefin text-lg">Phone: {user.phone}</div>
        <div className="font-josefin text-lg">Address: {user.address}</div>
        <label className="font-ysa relative text-jetblack">Update Image:</label>
        <input
          className="border border-gray-300 h-9 text-xs w-full focus:border-darkgreen focus:ring-0"
          type="file"
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
}

export default ProfileDetails;
