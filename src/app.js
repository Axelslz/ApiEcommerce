const express = require('express');
const cors = require('cors'); 
const app = express();
const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoutes');

app.use(express.json());
app.use(cors()); 

app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
