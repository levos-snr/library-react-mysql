// // ReservationStatus.js

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const ReservationStatus = () => {
//   const [reservations, setReservations] = useState([]);

//   useEffect(() => {
//     // Fetch reservation data from the backend API
//     const fetchReservations = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/reservations');
//         setReservations(response.data);
//       } catch (error) {
//         console.error('Error fetching reservation data:', error);
//       }
//     };

//     fetchReservations();
//   }, []);

//   return (
//     <div className="container mx-auto mt-8">
//       <h2 className="text-2xl font-semibold mb-4">Reservation Status</h2>
//       <div className="grid grid-cols-3 gap-4">
//         {reservations.map((reservation) => (
//           <div key={reservation.Id} className="p-4 border rounded">
//             <p className="text-gray-700">
//               <strong>Book Name:</strong> {reservation.Book_id}
//             </p>
//             <p className="text-gray-700">
//               <strong>Full Name:</strong> {reservation.Member_id}
//             </p>
//             <p className="text-gray-700">
//               <strong>Status:</strong> {reservation.Reservation_status_id}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ReservationStatus;


// ReservationStatus.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReservationStatus = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    // Fetch reservation data with related details from the backend API
    const fetchReservations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reservations/details');
        setReservations(response.data);
      } catch (error) {
        console.error('Error fetching reservation data:', error);
      }
    };

    fetchReservations();
  }, []);

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Reservation Status</h2>
      <div className="grid grid-cols-3 gap-4">
        {reservations.map((reservation) => (
          <div key={reservation.Id} className="p-4 border rounded">
            <p className="text-gray-700">
              <strong>Book Name:</strong> {reservation.Book_title}
            </p>
            <p className="text-gray-700">
              <strong>Full Name:</strong> {reservation.Member_full_name}
            </p>
            <p className="text-gray-700">
              <strong>Status:</strong> {reservation.Reservation_status_value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationStatus;

