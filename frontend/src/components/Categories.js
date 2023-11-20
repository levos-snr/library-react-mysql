// Categories.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Categories = () => {
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    // Fetch data from both book and category tables and join them
    axios
      .get('http://localhost:5000/api/categories-books')
      .then((response) => {
        setCategoryData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching category and book data:', error);
      });
  }, []);

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-3xl font-bold mb-4">Books</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {categoryData.map((category) => (
          <div key={category.Book_id} className="bg-white p-4 rounded-md shadow-md">
            <img
              src={category.Image_url}
              alt={category.Book_title}
              className="w-full h-32 object-cover mb-4 rounded-md"
            />
            <h2 className="text-md font-bold mb-2">Title: {category.Book_title}</h2>
            <p className="text-gray-700 mb-1">{category.Author_name}</p>
            <p className="text-gray-700 mb-2">Category: {category.Category_name}</p>
            <p className="text-gray-500">Number of Copies: {category.Copies_owned}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
