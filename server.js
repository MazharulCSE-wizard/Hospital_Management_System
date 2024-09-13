const express = require('express');
const app = express();
const patientRoutes = require('./routes/patient');

app.use(express.json());

app.use('/patient', patientRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
