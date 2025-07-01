// Simple Express server for authentication and registration
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { Patient, Doctor } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/medical-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { role, firstName, lastName, email, password, phone, dob, license, specialty, hospital } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    if (role === 'patient') {
      const patient = new Patient({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        dob,
        role: 'patient',
      });
      await patient.save();
    } else if (role === 'doctor') {
      const doctor = new Doctor({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        license,
        specialty,
        hospital,
        role: 'doctor',
      });
      await doctor.save();
    } else {
      return res.status(400).json({ error: 'Invalid role' });
    }
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password, role } = req.body;
  let user;
  if (role === 'patient') {
    user = await Patient.findOne({ email });
  } else if (role === 'doctor') {
    user = await Doctor.findOne({ email });
  } else {
    return res.status(400).json({ error: 'Invalid role' });
  }
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
  res.json({ token, user: { id: user._id, role: user.role, firstName: user.firstName, lastName: user.lastName, email: user.email } });
});

app.listen(5000, () => console.log('Backend running on port 5000'));
