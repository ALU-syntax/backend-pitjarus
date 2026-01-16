require('dotenv').config();
const express = require('express');
const cors = require('cors');

const productRoutes = require('./routes/product.routes');
const brandRoutes = require('./routes/brand.routes');
const storeRoutes = require('./routes/store.routes');
const reportRoutes = require('./routes/report.routes');
const accountRoutes = require('./routes/account.routes');
const areaRoutes = require('./routes/area.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/product', productRoutes);
app.use('/api/brand', brandRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/area', areaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
