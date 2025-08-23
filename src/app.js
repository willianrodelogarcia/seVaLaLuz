const express = require('express');
const app = express();

const PORT = 3000;

const start = async () => {
  app.use(express.json());

  app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

module.exports = {
  start,
};
