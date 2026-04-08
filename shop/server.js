const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const FILE = './products.json';

const WAREHOUSE_URL = 'https://ecommerce-2-7adp.onrender.com';

app.get('/products', (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE));
  res.json(data);
});

app.put('/update-local/:id', (req, res) => {
  const products = JSON.parse(fs.readFileSync(FILE));
  const p = products.find(x => x.id == req.params.id);

  if (!p) return res.status(404).send('Not found');

  if (req.body.stock !== undefined) p.stock = req.body.stock;
  if (req.body.price !== undefined) p.price = req.body.price;
  if (req.body.name !== undefined) p.name = req.body.name;

  fs.writeFileSync(FILE, JSON.stringify(products, null, 2));
  res.send('Updated');
});

app.delete('/products', (req, res) => {
  fs.writeFileSync(FILE, '[]');
  res.send('Deleted');
});

app.get('/import-products', async (req, res) => {
  const response = await fetch(`${WAREHOUSE_URL}/products`);
  const data = await response.json();

  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
  res.send('Imported');
});

app.get('/update-stock/:id', async (req, res) => {
  const response = await fetch(`${WAREHOUSE_URL}/products/${req.params.id}/stock`);
  const stockData = await response.json();

  const products = JSON.parse(fs.readFileSync(FILE));
  const product = products.find(p => p.id == req.params.id);

  if (product) {
    product.stock = stockData.stock;
    fs.writeFileSync(FILE, JSON.stringify(products, null, 2));
  }

  res.send('Updated');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Shop running'));
