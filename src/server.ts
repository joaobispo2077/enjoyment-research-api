import express from 'express';

const app = express();

const PORT = 3333;

app.get('/users', (req, res) => {
  res.send('ok')
});

app.listen(PORT, () => console.log(`server is running at port ${PORT}`))