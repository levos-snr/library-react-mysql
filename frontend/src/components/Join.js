import React, { useState } from 'react';
import axios from 'axios';

const Join = ({ onJoinSuccess }) => {
  const [formData, setFormData] = useState({
    member_id: '',
    first_name: '',
    last_name: '',
    joined_date: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleJoin = async (e) => {
    e.preventDefault();

    // Add validation for password and confirmation
    if (formData.password !== formData.confirmPassword) {
      console.error('Password and Confirm Password do not match');
      return;
    }

    try {
      // Make a request to your backend API for member registration
      const response = await axios.post('http://localhost:5000/api/join', formData);

      // Assuming the backend returns a token upon successful registration
      const { token } = response.data;

      // Save the token to local storage or context for future authenticated requests
      localStorage.setItem('token', token);

      // Trigger a callback (provided by the parent component) to handle successful registration
      onJoinSuccess();
    } catch (error) {
      console.error('Error joining:', error);
      // Handle registration failure, show an error message, etc.
    }
  };

  return (
    <div className="mt-6">
      <form onSubmit={handleJoin} className="flex flex-col items-center">
        <input
          type="text"
          name="member_id"
          placeholder="Member No"
          value={formData.member_id}
          onChange={handleChange}
          className="mb-2 p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          className="mb-2 p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          className="mb-2 p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="joined_date"
          placeholder="Joined Date"
          value={formData.joined_date}
          onChange={handleChange}
          className="mb-2 p-2 border border-gray-300 rounded-md"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="mb-2 p-2 border border-gray-300 rounded-md"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="mb-2 p-2 border border-gray-300 rounded-md"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="mb-2 p-2 border border-gray-300 rounded-md"
        />
        <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Join
        </button>
      </form>
    </div>
  );
};

export default Join;
