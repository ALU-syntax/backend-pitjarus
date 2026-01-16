require('dotenv').config();
const express = require('express');
const cors = require('cors');

const storeRoutes = require('./routes/store.routes');
const reportRoutes = require('./routes/report.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/store', storeRoutes);
app.use('/api/report', reportRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
