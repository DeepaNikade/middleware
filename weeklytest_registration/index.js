import express from 'express';
const app = express();
const port = 4000;

app.use(express.json());


let users = [];

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// User registration route
app.post('/register', (req, res, next) => {
  const { firstName, lastName, password, email, phone } = req.body;

  // Check for missing fields
  if (!firstName || !lastName || !password || !email || !phone) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Validate first name and last name
  if (!/^[A-Z]/.test(firstName) || !/^[A-Z]/.test(lastName)) {
    return res.status(400).json({ error: 'First name and last name must start with a capital letter' });
  }

  // Validate password
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character' });
  }

  // Validate email address
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // Validate phone number
  const phoneRegex = /^\d{10,}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ error: 'Phone number must be at least 10 digits long' });
  }

  // Check if user already exists
  if (users.find(user => user.email === email)) {
    return res.status(409).json({ error: 'User with this email already exists' });
  }

  // If all validations pass, proceed with registration
  const newUser = { firstName, lastName, password, email, phone };
  users.push(newUser);

  res.status(201).json({ message: 'Registration successful' });
});

// User sign-in route
app.post('/signin', (req, res, next) => {
  const { email, password } = req.body;

  // Check for missing fields
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Find the user by email
  const user = users.find(user => user.email === email);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Check if the password matches
  if (user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  res.status(200).json({ message: 'Sign-in successful' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
