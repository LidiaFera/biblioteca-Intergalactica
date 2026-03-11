import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve os arquivos estáticos gerados pelo build (pasta dist)
app.use(express.static(path.join(__dirname, 'dist')));

// Para qualquer rota que não seja um arquivo estático, serve o index.html
// Isso garante que o React Router funcione mesmo em refresh ou acesso direto
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});