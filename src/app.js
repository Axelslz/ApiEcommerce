const express = require('express');
const cors = require('cors'); 
const app = express();

app.use(express.json()); 
app.use(cors()); 

const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoutes');
const polizaRoutes = require('./routes/polizaRoutes');


app.use('/api/users', userRoutes);
app.use('/api/clientes', clientRoutes);
app.use('/api/polizas', polizaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
