// Member.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Member = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    // Fetch member data from the backend API
    const fetchMembers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/members');
        setMembers(response.data);
      } catch (error) {
        console.error('Error fetching member data:', error);
      }
    };

    fetchMembers();
  }, []);

  const handleFollow = (memberId) => {
    // Implement follow functionality here, e.g., send a request to the backend to follow the member
    console.log(`Following member with ID: ${memberId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {members.map((member) => (
        <div key={member.Member_id} className="bg-white p-4 rounded-md shadow-md flex flex-col items-center">
          {/* Avatar Image */}
          <img
            src='/images/avator.jpg'
            alt={`${member.First_name} ${member.Last_name}'s Avatar`}
            className="w-16 h-16 rounded-full mb-2"
          />

          {/* Member Information */}
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">
              {member.First_name} {member.Last_name}
            </h2>
            <p className="text-gray-500 mb-2">Status: {member.ActiveStatus_Id}</p>
            <p className="text-gray-500 mb-4">Books Read: {member.booksRead}</p>

            {/* Follow Button */}
            <button
              onClick={() => handleFollow(member.Member_id)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
            >
              Follow
            </button>

            {/* Comment Section */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Comments</h3>
              {/* Add comment section here */}
              {/* You can use a textarea for entering comments and display existing comments */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Member;
