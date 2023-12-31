import React, { useState, useEffect } from 'react';
import SignIn from './SignIn'; // Import the SignIn component
import Join from './Join'; // Import the Join component
import { Link } from 'react-router-dom';

const Navbar = ({ user }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isSigninOpen, setSigninOpen] = useState(false);
  const [isSignedIn, setSignedIn] = useState(false);
  const [isJoinOpen, setJoinOpen] = useState(false);

  useEffect(() => {
    // Check if the authentication token exists in local storage
    const token = localStorage.getItem('token');
    if (token) {
      setSignedIn(true);
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleJoin = () => {
    setJoinOpen(!isJoinOpen);
  };

  const toggleSignin = () => {
    setSigninOpen(!isSigninOpen);
  };

  const handleJoinSuccess = () => {
    console.log('User joined successfully');
    setSignedIn(true);
    setJoinOpen(false); // Close the Join form after successful registration
  };

  const handleSignInSuccess = () => {
    // Handle successful sign-in, e.g., redirect the user or update the UI
    console.log('User signed in successfully');
     console.log(user)
    setSignedIn(true);
  };

  const handleSignOut = () => {
    // Clear the token from local storage
    localStorage.removeItem('token');
    setSignedIn(false);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/">
          <div className="text-white font-semibold text-lg"> Library App</div>
        </Link>

        {/* Responsive Navigation */}
        <div className="flex items-center space-x-4">
          <Link to="/">
            <span className="text-white hover:text-gray-300">Home</span>
          </Link>

          <Link to="/">
            <span className="text-white hover:text-gray-300">Books</span>
          </Link>
          <Link to="/Member">
            <span className="text-white hover:text-gray-300">Members</span>
          </Link>

          {/* Dropdown Menu */}
          <div className="relative inline-block text-left">
            <button
              type="button"
              className="text-white hover:text-gray-300 focus:outline-none"
              onClick={toggleDropdown}
            >
              More
            </button>
            {isDropdownOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Link
                    to="/Reservation"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={toggleDropdown}
                  >
                    <span>Reservations</span>
                  </Link>
                  <Link
                    to="/Fine"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={toggleDropdown}
                  >
                    <span>Fines</span>
                  </Link>
                  <Link
                    to="/Member"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={toggleDropdown}
                  >
                    <span>Memberships</span>
                  </Link>
                  <Link
                    to="#"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={toggleDropdown}
                  >
                    <span>Statistics</span>
                  </Link>
                  {/* Add more dropdown items as needed */}
                </div>
              </div>
            )}
          </div>

          {/* Conditional rendering based on sign-in status */}
          {!isSignedIn ? (
            <div className="flex items-center space-x-4">
              {/* Sign In Button */}
              <div className="relative inline-block text-left">
                <button
                  type="button"
                  className="text-white hover:text-gray-300 focus:outline-none"
                  onClick={toggleSignin}
                >
                  Sign In
                </button>
                {isSigninOpen && (
                  <div className="origin-top-right absolute right-0 mt-2  w-60 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <SignIn onSignInSuccess={handleSignInSuccess} />
                  </div>
                )}
              </div>
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={toggleJoin}
              >
                Join
              </button>
              {isJoinOpen && (
                <div className="origin-top-right absolute right-8 top-[50px] z-50 mt-2 w-60 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Join onJoinSuccess={handleJoinSuccess} />
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Display avatar, user email, and Sign Out button when signed in */}
              <img
                src="/images/avator.jpg" // Update with the correct path to your avatar image
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
              {/* <p className="text-white">{user.email}</p> */}
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
