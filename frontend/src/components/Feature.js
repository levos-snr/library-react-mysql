// Feature.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';


const Feature = () => {
  const [books, setBooks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);


  useEffect(() => {
    // Fetch data from http://localhost:5000/api/books
    axios
      .get('http://localhost:5000/api/books')
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
      });
  }, []);

  const handleSwap = (direction) => {
    // Update currentIndex based on the direction (left or right)
    if (direction === 'left') {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + books.length) % books.length);
    } else if (direction === 'right') {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % books.length);
    }
  };


  const handleSearch = () => {
    // Filter books based on search term
    const result = books.filter(
      (book) =>
        book.Author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.Category_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.Publication_date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.Book_title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSearchResult(result);

    // Show pop-up with the search term
    alert(`Searching for: ${searchTerm}`);
  };

  
  if (books.length === 0) {
    return <div>Loading...</div>;
  }

  const currentBook = searchResult ? searchResult[currentIndex] : books[currentIndex];

  return (
    <>
    <div className="h-[500px] bg-gray-500">
      <div className="container  mx-auto md:px-2 ">
        <section className="mb-2 text-center lg:text-left">
          <div className="py-3 md:px-3 md:px-6">
          <div className="container flex justify-center mb-10">
          
          
          <input
            type="text"
            className="border border-gray-300 p-2 rounded-md mr-2"
            placeholder="Search by author, category, publication date, or title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
           <button
           onClick={handleSearch}
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
  >

            Search
          </button>
         </div> 


            <div className="container mx-auto xl:px-32">
              <div className="flex grid items-center lg:grid-cols-2">
                <div className="mb-2 md:mt-6 lg:mt-0 lg:mb-0">
                  <div className="relative z-[1] block rounded-lg bg-[hsla(0,0%,100%,0.55)] px-4 py-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] backdrop-blur-[25px] dark:bg-[hsla(0,0%,5%,0.55)] dark:shadow-black/20 md:px-8 lg:-mr-11">
                    <h1 className="text-4xl font-bold mb-2">{currentBook.Book_title}</h1>
                    <p className="text-lg mb-2">{currentBook.Publication_date}</p>
                    <p className="text-lg">{currentBook.Category_id}</p>
                  </div>
                </div>
                <div className="md:mb-12 lg:mb-0">
                  <img
                    className="w-60 h-85 object-fit  rounded-lg shadow-lg"
                    src={currentBook.Image_url}
                    alt={currentBook.Book_title}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="flex justify-between absolute left-4 right-4 top-[300px]">
        <button
          onClick={() => handleSwap('left')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Previous
        </button>
        <button
          onClick={() => handleSwap('right')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Next
        </button>
      </div>
      </div>
      
    </>
  );
};

export default Feature;


