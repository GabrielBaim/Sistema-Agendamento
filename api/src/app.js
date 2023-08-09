const express = require("express");
const cors = require("cors");
const agendamentoRoutes = require("./routes/agendamentos");

const app = express();

// Adicione o middleware cors antes dos outros middlewares e rotas.
const whitelist = ["http://localhost:5173"]; // Lista de permissões
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app.use(cors(corsOptions));

app.use(express.json());
app.use("/agendamento", agendamentoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
