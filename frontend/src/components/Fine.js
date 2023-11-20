import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Fine = () => {
  const [fines, setFines] = useState([]);

  useEffect(() => {
    // Fetch fine details with additional information from the server
    axios
      .get('http://localhost:5000/api/fines/details')
      .then((response) => {
        setFines(response.data);
      })
      .catch((error) => {
        console.error('Error fetching fine details:', error);
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Fine Details</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b text-left">ID</th>
              <th className="py-2 px-4 border-b text-left">Book Name</th>
              <th className="py-2 px-4 border-b text-left">Member Full Name</th>
              <th className="py-2 px-4 border-b text-left">Fine Date</th>
              <th className="py-2 px-4 border-b text-left">Fine Amount</th>
            </tr>
          </thead>
          <tbody>
            {fines.map((fine) => (
              <tr key={fine.Id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b text-left">{fine.Id}</td>
                <td className="py-2 px-4 border-b text-left">{fine.Book_title}</td>
                <td className="py-2 px-4 border-b text-left">{fine.Member_full_name}</td>
                <td className="py-2 px-4 border-b text-left">{fine.Fine_date}</td>
                <td className="py-2 px-4 border-b text-left">Ksh. {fine.Fine_amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Fine;
