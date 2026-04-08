const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

const FILE = './products.json';

app.get('/products', (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE));
  res.json(data);
});

app.get('/products/:id/stock', (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE));
  const product = data.find(p => p.id == req.params.id);

  if (!product) return res.status(404).send('Not found');

  res.json({ stock: product.stock });
});

app.get('/', (req, res) => {
  res.send('Warehouse working');
});

app.post('/products', (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE));
  data.push(req.body);

  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
  res.send('Added');
});

app.put('/products/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE));
  const index = data.findIndex(p => p.id == req.params.id);

  if (index === -1) return res.status(404).send('Not found');

  data[index] = { ...data[index], ...req.body };

  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
  res.send('Updated');
});

app.delete('/products/:id', (req, res) => {
  let data = JSON.parse(fs.readFileSync(FILE));
  data = data.filter(p => p.id != req.params.id);

  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
  res.send('Deleted');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Warehouse running'));
