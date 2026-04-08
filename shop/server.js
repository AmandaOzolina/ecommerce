const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const FILE = './products.json';

// vēlāk nomainīsi uz Render URL
const WAREHOUSE_URL = 'https://warehouse-url.onrender.com';

// GET veikala produkti
app.get('/products', (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE));
  res.json(data);
});

// DELETE visi produkti
app.delete('/products', (req, res) => {
  fs.writeFileSync(FILE, '[]');
  res.send('Deleted');
});

// Importēt no noliktavas
app.get('/import-products', async (req, res) => {
  const response = await fetch(`${WAREHOUSE_URL}/products`);
  const data = await response.json();

  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
  res.send('Imported');
});

// Update stock vienam produktam
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