const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB conectado'))
  .catch((err) => console.error(err));

app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});