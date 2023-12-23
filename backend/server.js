const express = require('express');
const axios = require('axios');
const cors = require('cors'); 

const app = express();
const baseURL = 'https://celestrak.org/NORAD/elements/gp.php';

app.use(cors());

app.get('/', (req, res) => {
  res.send(`Server running on port ${PORT} ...`);
});

// Ruta para obtener la información JSON
app.get('/info', async (req, res) => {
  try {
    const response = await axios.get(`${baseURL}?NAME=SSOT&FORMAT=JSON`);
    const data = response.data;
    // Aquí puedes manipular 'data' según lo que necesites hacer con la información JSON obtenida
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Hubo un problema al obtener la información' });
  }
});

// Ruta para obtener los datos TLE
app.get('/tle', async (req, res) => {
  try {
    const response = await axios.get(`${baseURL}?NAME=SSOT&FORMAT=TLE`);
    const data = response.data;
    // Aquí puedes manipular 'data' según lo que necesites hacer con la información TLE obtenida
    res.send(data);
  } catch (error) {
    res.status(500).json({ error: 'Hubo un problema al obtener los datos TLE' });
  }
});

// Ruta para obtener información según el nombre del satélite proporcionado desde el frontend
app.get('/satellite/:name', async (req, res) => {
  const { name } = req.params; // Obtén el nombre del satélite desde la URL
  
  try {
    // Usa el nombre proporcionado en la URL para construir la URL deseada
    const response = await axios.get(`${baseURL}?NAME=${name}&FORMAT=TLE`);
    let data = response.data;
    data = data.replace(/\\r\\n/g, '\n');


    // Aquí puedes manipular 'data' según lo que necesites hacer con la información TLE obtenida
    res.send(data);
  } catch (error) {
    res.status(500).json({ error: 'Hubo un problema al obtener la información' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});