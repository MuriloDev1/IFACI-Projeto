const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const dados = [];

const normalizeSensorPayload = (body) => {
  return {
    id: body.id ?? Date.now(),
    Sensor: body.Sensor || body.sensor || `Sensor ${dados.length + 1}`,
    Codigo: body.Codigo || body.codigo || `${dados.length + 1}`,
    temp: body.temp ?? body.temperature ?? null,
    umid: body.umid ?? body.humidity ?? null,
    pressao: body.pressao ?? body.pressure ?? null,
    status_f: body.status_f ?? body.status ?? false,
    trava_seg: body.trava_seg ?? body.securityLock ?? false,
    createdAt: new Date().toISOString(),
  };
};

app.get(["/", "/iot"], (req, res) => {
  res.json(dados);
});

app.get("/sensor/:id", (req, res) => {
  const searchId = req.params.id;
  const index = dados.findIndex(
    (item) => String(item.id) === searchId || String(item.Codigo) === searchId,
  );

  if (index === -1) {
    return res.status(404).json({ error: "Sensor não encontrado", index: -1 });
  }

  res.json(dados[index]);
});

app.post("/newdata", (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: "Payload inválido" });
  }

  const sensor = normalizeSensorPayload(req.body);
  dados.push(sensor);

  res.status(201).json({ message: "Dados criados com sucesso!", sensor });
});

// Compatibilidade com Node-RED ou outros clientes que usam /iot para criar dados
app.post("/iot", (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: "Payload inválido" });
  }

  const sensor = normalizeSensorPayload(req.body);
  dados.push(sensor);

  res.status(201).json({ message: "Dados criados com sucesso!", sensor });
});

app.put("/sensor/:id", (req, res) => {
  const searchId = req.params.id;
  const index = dados.findIndex(
    (item) => String(item.id) === searchId || String(item.Codigo) === searchId,
  );

  if (index === -1) {
    return res.status(404).json({ error: "Sensor não encontrado", index: -1 });
  }

  const existing = dados[index];
  const updates = req.body || {};
  const updatedSensor = {
    ...existing,
    ...updates,
    id: existing.id,
    Sensor: updates.Sensor ?? existing.Sensor,
    Codigo: updates.Codigo ?? existing.Codigo,
  };

  dados[index] = updatedSensor;
  res.json({
    message: "Sensor atualizado com sucesso!",
    sensor: updatedSensor,
  });
});

// deletar todos
app.delete("/destroy", (req, res) => {
  dados.splice(0, dados.length);
  res.send("Dados excluídos com sucesso!");
});

// deletar item por índice
app.delete("/destroy/:id", (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id) || id < 0 || id >= dados.length) {
    return res.status(400).send(`ID inválido: ${req.params.id}`);
  }

  dados.splice(id, 1);
  res.send(`item ${req.params.id} deletado com sucesso!`);
});

app.listen(8080, () => {
  console.log("server running on port 8080");
});
