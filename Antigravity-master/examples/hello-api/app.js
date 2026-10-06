const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

app.get('/api/v1/hello', (req, res) => {
  const name = req.query.name || 'World';
  res.status(200).json({ message: `Hello, ${name}!` });
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
