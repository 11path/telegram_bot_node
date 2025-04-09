const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = "TU_TOKEN_AQUI"; // pega tu token de BotFather aquí

app.use(bodyParser.json());

const productos = {
  "pasillo 1": ["carne", "queso", "jamon"],
  "pasillo 2": ["leche", "yogurth", "cereal"],
  "pasillo 3": ["bebidas", "jugos"],
  "pasillo 4": ["pan", "pasteles", "tortas"],
  "pasillo 5": ["detergente", "lavaloza"]
};

app.post("/webhook", async (req, res) => {
  const message = req.body.message;

  if (!message || !message.text) {
    return res.sendStatus(200);
  }

  const text = message.text.toLowerCase();
  const chatId = message.chat.id;

  let respuesta = "Lo siento, no entiendo la pregunta.";

  for (const [pasillo, items] of Object.entries(productos)) {
    if (items.some(item => text.includes(item))) {
      respuesta = `El producto se encuentra en ${pasillo}.`;
      break;
    }
  }

  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: respuesta })
  });

  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send("Bot del supermercado activo.");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});