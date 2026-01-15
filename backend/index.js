import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// 1. GET ALL DELIVERIES (READ)
app.get('/api/deliveries', async (req, res) => {
  const { data, error } = await supabase
    .from('deliveries')
    .select('*')
    .order('created_at', { ascending: false }); // Newest first
    
  if (error) return res.status(500).json(error);
  res.json(data);
});

// 2. CREATE NEW DELIVERY (POST)
app.post('/api/deliveries', async (req, res) => {
  const { data, error } = await supabase
    .from('deliveries')
    .insert([req.body])
    .select();

  if (error) return res.status(500).json(error);
  res.json(data[0]);
});

// 3. UPDATE STATUS (PATCH)
app.patch('/api/deliveries/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const { data, error } = await supabase
    .from('deliveries')
    .update({ status })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json(error);
  res.json(data[0]);
});

// 4. DELETE DELIVERY (DELETE)
app.delete('/api/deliveries/:id', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('deliveries')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json(error);
  res.json({ message: 'Deleted successfully' });
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));