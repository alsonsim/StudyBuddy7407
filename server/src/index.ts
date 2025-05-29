import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 4000;

app.use(cors()); // Allow frontend to talk to backend
app.use(express.json()); // Parse JSON bodies

app.get('/', (req, res) => {
  res.send('API is working!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
