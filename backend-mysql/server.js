const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const path = require('path'); // Import path module
const app = express();
const PORT = 5000;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing





app.use(cors());
app.use(bodyParser.json());

// Serve book images
app.use('/book-images', express.static(path.join(__dirname, 'book-images')));




// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '27Lewisodero',
    database: 'library',
  });
  // Connect to MySQL
db.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
    } else {
      console.log('Connected to MySQL database');
    }
  });

/// Endpoint for member authentication
app.post('/api/signin', (req, res) => {
  const { email, password } = req.body;

  // Query the database to retrieve the hashed password for the provided email
  db.query('SELECT * FROM member WHERE Email = ?', [email], (error, results) => {
    if (error) {
      console.error('Error during member authentication:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (results.length > 0) {
        const hashedPassword = results[0].Password;

        // Compare the provided password with the hashed password
        bcrypt.compare(password, hashedPassword, (compareError, isMatch) => {
          if (compareError) {
            console.error('Error comparing passwords:', compareError);
            res.status(500).json({ error: 'Internal server error' });
          } else {
            if (isMatch) {
              // Passwords match, generate a token for successful authentication
              const token = jwt.sign({ member_id: results[0].Member_id, email: results[0].Email }, 'your_secret_key');
              res.json({ token });
            } else {
              // Passwords do not match
              res.status(401).json({ error: 'Invalid credentials' });
            }
          }
        });
      } else {
        // No member found with the provided email
        res.status(401).json({ error: 'Invalid credentials' });
      }
    }
  });
});


// API endpoint for joining a new member
app.post('/api/join', async (req, res) => {
  const {
    member_id,
    first_name,
    last_name,
    joined_date,
    email,
    password,
  } = req.body;

  // Simple password validation - at least 6 characters
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
  }

  // Hash the password before storing it in the database
  const hashedPassword = await bcrypt.hash(password, 10);

  // Perform database insertion logic
  const sql = `INSERT INTO Member (Member_id, First_name, Last_name, Joined_date, Email, Password) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [member_id, first_name, last_name, joined_date, email, hashedPassword];

  db.query(sql, values, (error, result) => {
    if (error) {
      console.error('Error joining member:', error);
      res.status(500).json({ success: false, message: 'Error joining member' });
    } else {
      console.log('Member joined successfully');
      res.json({ success: true, message: 'Member joined successfully' });
    }
  });
});

  
  // API route to get all books
  app.get('/api/books', (req, res) => {
    const query = 'SELECT * FROM book';
  
    db.query(query, (err, result) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(result);
      }
    });
  });

  // API route to get book by ID
  app.get('/api/books/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM book WHERE Book_id = ?';
  
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else if (result.length === 0) {
        res.status(404).json({ error: 'Book not found' });
      } else {
        res.json(result[0]);
      }
    });
  });

 // Create a new book
app.post('/api/books', (req, res) => {
    const { Book_id, Book_title, Category_id, Publication_date, Copies_owned, Image_url } = req.body;
    const query = 'INSERT INTO book (Book_id, Book_title, Category_id, Publication_date, Copies_owned, Image_url) VALUES (?, ?, ?, ?, ?, ?)';
  
    db.query(query, [Book_id, Book_title, Category_id, Publication_date, Copies_owned, Image_url], (err, result) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'Book created successfully', id: result.insertId });
      }
    });
  });


  // Define a route to fetch fine details with additional information
app.get('/api/fines/details', (req, res) => {
  const query = `
    SELECT
      f.Id,
      b.Book_title,
      CONCAT(m.First_name, ' ', m.Last_name) AS Member_full_name,
      f.Fine_date,
      f.Fine_amount
    FROM fine f
    JOIN loan l ON f.Loan_id = l.Id
    JOIN book b ON l.Book_id = b.Book_id
    JOIN member m ON f.Member_id = m.Member_id
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching fine details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});



  // Update a book
app.put('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const { Book_title, Category_id, Publication_date, Copies_owned, Image_url } = req.body;
  const query = 'UPDATE book SET Book_title = ?, Category_id = ?, Publication_date = ?, Copies_owned = ?, Image_url = ? WHERE Book_id = ?';

  db.query(query, [Book_title, Category_id, Publication_date, Copies_owned, Image_url, id], (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Book not found' });
    } else {
      res.json({ message: 'Book updated successfully' });
    }
  });
});

 // Delete a book
app.delete('/api/books/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM book WHERE Book_id = ?';
  
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Book not found' });
      } else {
        res.json({ message: 'Book deleted successfully' });
      }
    });
  });

  // Get all authors
app.get('/api/authors', (req, res) => {
    const query = 'SELECT * FROM author';
  
    db.query(query, (err, result) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(result);
      }
    });
  });
  
  // Get all categories
  app.get('/api/categories', (req, res) => {
    const query = 'SELECT * FROM category';
  
    db.query(query, (err, result) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(result);
      }
    });
  });





  // Endpoint to get member details
app.get('/api/member/details', verifyToken, (req, res) => {
  const memberId = req.member.member_id;

  console.log('Member ID:', memberId);

  db.query(
    'SELECT * FROM member_details WHERE Member_id = ?',
    [memberId],
    (error, results) => {
      if (error) {
        console.error('Error retrieving member details:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      console.log('Member details:', results);

      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).json({ error: 'Member not found' });
      }
    }
  );
});

// Token verification middleware
function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    req.member = decoded;
    next();
  });
}

  
  // Get all members
  app.get('/api/members', (req, res) => {
    const query = 'SELECT * FROM member';
  
    db.query(query, (err, result) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(result);
      }
    });
  });

  // Create a new member
app.post('/api/members', (req, res) => {
    const { Member_id, First_name, Last_name, ActiveStatus_Id, Joined_date } = req.body;
    const query = 'INSERT INTO member (Member_id, First_name, Last_name, ActiveStatus_Id, Joined_date) VALUES (?, ?, ?, ?, ?)';
  
    db.query(query, [Member_id, First_name, Last_name, ActiveStatus_Id, Joined_date], (err, result) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'Member created successfully', memberId: result.insertId });
      }
    });
  });
  
  // Update an existing member
  app.put('/api/members/:memberId', (req, res) => {
    const { First_name, Last_name, ActiveStatus_Id, Joined_date } = req.body;
    const { memberId } = req.params;
    const query = 'UPDATE member SET First_name = ?, Last_name = ?, ActiveStatus_Id = ?, Joined_date = ? WHERE Member_id = ?';
  
    db.query(query, [First_name, Last_name, ActiveStatus_Id, Joined_date, memberId], (err) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'Member updated successfully', memberId });
      }
    });
  });
  
  // Delete a member
  app.delete('/api/members/:memberId', (req, res) => {
    const { memberId } = req.params;
    const query = 'DELETE FROM member WHERE Member_id = ?';
  
    db.query(query, [memberId], (err) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'Member deleted successfully', memberId });
      }
    });
  });
  
  // Get all reservations
  app.get('/api/reservations', (req, res) => {
    const query = 'SELECT * FROM reservation';
  
    db.query(query, (err, result) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(result);
      }
    });
  });

  // Create a new reservation
app.post('/api/reservations', (req, res) => {
    const { Id, Book_id, Member_id, Reservation_date, Reservation_status_id } = req.body;
    const query = 'INSERT INTO reservation (Id, Book_id, Member_id, Reservation_date, Reservation_status_id) VALUES (?, ?, ?, ?, ?)';
  
    db.query(query, [Id, Book_id, Member_id, Reservation_date, Reservation_status_id], (err, result) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'Reservation created successfully', reservationId: result.insertId });
      }
    });
  });
  
  // Update an existing reservation
  app.put('/api/reservations/:reservationId', (req, res) => {
    const { Book_id, Member_id, Reservation_date, Reservation_status_id } = req.body;
    const { reservationId } = req.params;
    const query = 'UPDATE reservation SET Book_id = ?, Member_id = ?, Reservation_date = ?, Reservation_status_id = ? WHERE Id = ?';
  
    db.query(query, [Book_id, Member_id, Reservation_date, Reservation_status_id, reservationId], (err) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'Reservation updated successfully', reservationId });
      }
    });
  });
  
  // Delete a reservation
  app.delete('/api/reservations/:reservationId', (req, res) => {
    const { reservationId } = req.params;
    const query = 'DELETE FROM reservation WHERE Id = ?';
  
    db.query(query, [reservationId], (err) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'Reservation deleted successfully', reservationId });
      }
    });
  });
  
  
  // Get all fines
  app.get('/api/fines', (req, res) => {
    const query = 'SELECT * FROM fine';
  
    db.query(query, (err, result) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(result);
      }
    });
  });

  // Create a new fine
app.post('/api/fines', (req, res) => {
    const { Id, Member_id, Loan_id, Fine_date, Fine_amount } = req.body;
    const query = 'INSERT INTO fine (Id, Member_id, Loan_id, Fine_date, Fine_amount) VALUES (?, ?, ?, ?, ?)';
  
    db.query(query, [Id, Member_id, Loan_id, Fine_date, Fine_amount], (err, result) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'Fine created successfully', fineId: result.insertId });
      }
    });
  });
  
  // Update an existing fine
  app.put('/api/fines/:fineId', (req, res) => {
    const { Member_id, Loan_id, Fine_date, Fine_amount } = req.body;
    const { fineId } = req.params;
    const query = 'UPDATE fine SET Member_id = ?, Loan_id = ?, Fine_date = ?, Fine_amount = ? WHERE Id = ?';
  
    db.query(query, [Member_id, Loan_id, Fine_date, Fine_amount, fineId], (err) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'Fine updated successfully', fineId });
      }
    });
  });
  
  // Delete a fine
  app.delete('/api/fines/:fineId', (req, res) => {
    const { fineId } = req.params;
    const query = 'DELETE FROM fine WHERE Id = ?';
  
    db.query(query, [fineId], (err) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'Fine deleted successfully', fineId });
      }
    });
  });
  
  // Create a new fine payment
app.post('/api/fine_payments', (req, res) => {
    const { Id, Member_id, payment_date, payment_amount } = req.body;
    const query = 'INSERT INTO fine_payment (Id, Member_id, payment_date, payment_amount) VALUES (?, ?, ?, ?)';
  
    db.query(query, [Id, Member_id, payment_date, payment_amount], (err, result) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'Fine payment created successfully', paymentId: result.insertId });
      }
    });
  });
  
  // Update an existing fine payment
  app.put('/api/fine_payments/:paymentId', (req, res) => {
    const { Member_id, payment_date, payment_amount } = req.body;
    const { paymentId } = req.params;
    const query = 'UPDATE fine_payment SET Member_id = ?, payment_date = ?, payment_amount = ? WHERE Id = ?';
  
    db.query(query, [Member_id, payment_date, payment_amount, paymentId], (err) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'Fine payment updated successfully', paymentId });
      }
    });
  });
  
  // Delete a fine payment
  app.delete('/api/fine_payments/:paymentId', (req, res) => {
    const { paymentId } = req.params;
    const query = 'DELETE FROM fine_payment WHERE Id = ?';
  
    db.query(query, [paymentId], (err) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'Fine payment deleted successfully', paymentId });
      }
    });
  });

  // Create a new author
app.post('/api/authors', (req, res) => {
    const { Author_id, First_name, Last_name } = req.body;
    const query = 'INSERT INTO author (Author_id, First_name, Last_name) VALUES (?, ?, ?)';
  
    db.query(query, [Author_id, First_name, Last_name], (err, result) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'Author created successfully', authorId: result.insertId });
      }
    });
  });

  // Update an existing author
app.put('/api/authors/:authorId', (req, res) => {
    const { First_name, Last_name } = req.body;
    const { authorId } = req.params;
    const query = 'UPDATE author SET First_name = ?, Last_name = ? WHERE Author_id = ?';
  
    db.query(query, [First_name, Last_name, authorId], (err) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'Author updated successfully', authorId });
      }
    });
  });

  // Delete an author
app.delete('/api/authors/:authorId', (req, res) => {
    const { authorId } = req.params;
    const query = 'DELETE FROM author WHERE Author_id = ?';
  
    db.query(query, [authorId], (err) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'Author deleted successfully', authorId });
      }
    });
  });

// Create a new category
app.post('/api/categories', (req, res) => {
    const { Category_id, Category_name } = req.body;
    const query = 'INSERT INTO category (Category_id, Category_name) VALUES (?, ?)';
  
    db.query(query, [Category_id, Category_name], (err, result) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'Category created successfully', categoryId: result.insertId });
      }
    });
  });
  
  // Update an existing category
  app.put('/api/categories/:categoryId', (req, res) => {
    const { Category_name } = req.body;
    const { categoryId } = req.params;
    const query = 'UPDATE category SET Category_name = ? WHERE Category_id = ?';
  
    db.query(query, [Category_name, categoryId], (err) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'Category updated successfully', categoryId });
      }
    });
  });
  
  // Delete a category
  app.delete('/api/categories/:categoryId', (req, res) => {
    const { categoryId } = req.params;
    const query = 'DELETE FROM category WHERE Category_id = ?';
  
    db.query(query, [categoryId], (err) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'Category deleted successfully', categoryId });
      }
    });
  });
  
 // API route to get data of books and categories
app.get('/api/categories-books', (req, res) => {
  const sql = `
    SELECT book.Book_id, book.Book_title,  book.Copies_owned, book.Image_url,category.Category_name
    FROM book
    JOIN category ON book.Category_id = category.Category_id
  `;

  db.query(sql, (error, results) => {
    if (error) {
      console.error('Error executing SQL query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

// Endpoint to fetch reservation details with related information
app.get('/api/reservations/details', (req, res) => {
  const query = `
    SELECT 
      reservation.Id,
      reservation.Reservation_date,
      book.Book_title,
      CONCAT(member.First_name, ' ', member.Last_name) AS Member_full_name,
      reservation_status.Status_values AS Reservation_status_value
    FROM reservation
    JOIN book ON reservation.Book_id = book.Book_id
    JOIN member ON reservation.Member_id = member.Member_id
    JOIN reservation_status ON reservation.Reservation_status_id = reservation_status.Reservation_id
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching reservation details:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(result);
    }
  });
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


