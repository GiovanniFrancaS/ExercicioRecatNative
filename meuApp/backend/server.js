const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Tarefa = require('./models/Tarefa');

const app = express();

app.use(cors({
  origin: '*'
}));

app.use(express.json());

mongoose.connect(
  'mongodb+srv://dbUser:Banguela1@cluster0.aecfpvj.mongodb.net/tarefas?retryWrites=true&w=majority',
)
.then(() => console.log('MongoDB Atlas conectado'))
.catch(err => console.log(err));

app.post('/tarefas', async (req,res) => {
  const t = await Tarefa.create(req.body);
  res.json(t);
});

app.get('/tarefas', async (req,res) => {
  const t = await Tarefa.find();
  res.json(t);
});

app.get('/tarefas/:id', async (req,res) => {
  const tarefa = await Tarefa.findById(req.params.id);
  res.json(tarefa);
});

app.put('/tarefas/:id', async (req,res) => {
  const t = await Tarefa.findByIdAndUpdate(req.params.id, req.body, { new:true });
  res.json(t);
});
app.delete('/tarefas/:id', async (req,res) => {
  await Tarefa.findByIdAndDelete(req.params.id);
  res.json({ ok:true });
});

app.listen(3000, '0.0.0.0', () => console.log('Servidor rodando'));