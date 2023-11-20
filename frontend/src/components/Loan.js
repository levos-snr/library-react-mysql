// Loan.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Loan = () => {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [loanDate, setLoanDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  useEffect(() => {
    // Fetch books and members data from your API
    axios.get('http://localhost:5000/api/books').then((response) => {
      setBooks(response.data);
    });

    axios.get('http://localhost:5000/api/members').then((response) => {
      setMembers(response.data);
    });
  }, []);

  const handleLoanSubmission = (event) => {
    event.preventDefault();

    // Perform the loan submission logic here
    // You can make a POST request to your API endpoint to handle the loan submission
    // For example, axios.post('http://localhost:5000/api/loans', { bookId, memberId, loanDate, returnDate })
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Loan a Book</h1>
      <form onSubmit={handleLoanSubmission}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Select Book:</label>
          <select
            className="border border-gray-300 p-2 rounded-md w-full"
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
          >
            <option value="">Select a book</option>
            {books.map((book) => (
              <option key={book.Book_id} value={book.Book_id}>
                {book.Book_title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Select Member:</label>
          <select
            className="border border-gray-300 p-2 rounded-md w-full"
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
          >
            <option value="">Select a member</option>
            {members.map((member) => (
              <option key={member.Member_id} value={member.Member_id}>
                {`${member.First_name} ${member.Last_name}`}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Loan Date:</label>
          <input
            type="date"
            className="border border-gray-300 p-2 rounded-md w-full"
            value={loanDate}
            onChange={(e) => setLoanDate(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Return Date:</label>
          <input
            type="date"
            className="border border-gray-300 p-2 rounded-md w-full"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit Loan
        </button>
      </form>
    </div>
  );
};

export default Loan;
