// Reservation.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reservation = () => {
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [reservationDate, setReservationDate] = useState('');

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

    // Fetch book data from the backend API
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/books');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching book data:', error);
      }
    };

    fetchMembers();
    fetchBooks();
  }, []);

  const handleMemberChange = (event) => {
    const memberId = event.target.value;
    const selectedMember = members.find((member) => member.Member_id === memberId);
    setSelectedMember(selectedMember);
  };

  const handleBookChange = (event) => {
    const bookId = event.target.value;
    const selectedBook = books.find((book) => book.Book_id === bookId);
    setSelectedBook(selectedBook);
  };

  const handleReservationDateChange = (event) => {
    setReservationDate(event.target.value);
  };

  const handleReservationSubmit = () => {
    // Implement reservation submission here, e.g., send a request to the backend to create a reservation
    console.log('Reservation submitted:', {
      memberId: selectedMember.Member_id,
      fullName: `${selectedMember.First_name} ${selectedMember.Last_name}`,
      email: selectedMember.Email,
      bookId: selectedBook.Book_id,
      bookTitle: selectedBook.Book_title,
      reservationDate,
    });
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Book Reservation</h2>
      <form className="max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
        {/* Member Dropdown */}
        <div className="mb-4">
          <label htmlFor="member" className="block text-gray-700 text-sm font-bold mb-2">
            Select Member
          </label>
          <select
            id="member"
            name="member"
            onChange={handleMemberChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="" disabled selected>
              Select a member
            </option>
            {members.map((member) => (
              <option key={member.Member_id} value={member.Member_id}>
                {`${member.First_name} ${member.Last_name}`}
              </option>
            ))}
          </select>
        </div>

        {/* Book Dropdown */}
        <div className="mb-4">
          <label htmlFor="book" className="block text-gray-700 text-sm font-bold mb-2">
            Select Book
          </label>
          <select
            id="book"
            name="book"
            onChange={handleBookChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="" disabled selected>
              Select a book
            </option>
            {books.map((book) => (
              <option key={book.Book_id} value={book.Book_id}>
                {book.Book_title}
              </option>
            ))}
          </select>
        </div>

        {/* Reservation Date */}
        <div className="mb-4">
          <label htmlFor="reservationDate" className="block text-gray-700 text-sm font-bold mb-2">
            Reservation Date
          </label>
          <input
            type="date"
            id="reservationDate"
            name="reservationDate"
            onChange={handleReservationDateChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Display Selected Member and Book Info */}
        {selectedMember && selectedBook && (
          <div className="mb-4">
            <p className="text-gray-700">
              <strong>Selected Member:</strong> {`${selectedMember.First_name} ${selectedMember.Last_name}`}
            </p>
            <p className="text-gray-700">
              <strong>Email:</strong> {selectedMember.Email}
            </p>
            <p className="text-gray-700">
              <strong>Selected Book:</strong> {selectedBook.Book_title}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleReservationSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit Reservation
        </button>
      </form>
    </div>
  );
};

export default Reservation;
