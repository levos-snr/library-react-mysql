import React, { useState } from 'react';
import axios from 'axios';

const SignIn = ({ onSignInSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/signin', formData);

      const { data } = response;

      if (data && data.token) {
        // Save the token to local storage
        localStorage.setItem('token', data.token);
        onSignInSuccess();
      } else {
        console.error('Invalid response from server:', data);
      }
    } catch (error) {
      console.error('Error signing in:', error.message);
    }
  };

  return (
    <div className="mt-6 ">
      <form onSubmit={handleSignIn} className="flex flex-col items-center ">
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
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;
