import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = process.env.PORT || 5000;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(cors());
app.use(express.json());

// 1. ROUTE TO GET DATA (You likely have this)
app.get('/api/deliveries', async (req, res) => {
  const { data, error } = await supabase.from('deliveries').select('*');
  if (error) return res.status(500).json(error);
  res.json(data);
});

// 2. NEW ROUTE TO SAVE DATA (This is what you're missing!)
app.post('/api/deliveries', async (req, res) => {
  const { data, error } = await supabase
    .from('deliveries')
    .insert([req.body])
    .select();

  if (error) return res.status(500).json(error);
  res.json(data[0]);
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));