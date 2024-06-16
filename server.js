const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your MongoDB connection string
const DB_CONNECTION_STRING = 'mongodb://localhost:27017/coinApp';

mongoose.connect(DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  userId: String,
  coins: { type: Number, default: 0 }
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());
app.use(express.static('public'));

// Route to update coin count
app.post('/updateCoins', (req, res) => {
  const { userId, coins } = req.body;
  User.findOneAndUpdate({ userId }, { coins }, { upsert: true, new: true }, (err, user) => {
    if (err) return res.status(500).send(err);
    res.send(user);
  });
});

// Route to get coin count
app.get('/getCoins', (req, res) => {
  const { userId } = req.query;
  User.findOne({ userId }, (err, user) => {
    if (err) return res.status(500).send(err);
    res.send({ coins: user ? user.coins : 0 });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
