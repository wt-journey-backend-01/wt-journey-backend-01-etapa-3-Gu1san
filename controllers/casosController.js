const casosRepository = require("../repositories/casosRepository");
const {
  verifyStatus,
  verifyAgent,
  invalidPayloadResponse,
  notFoundResponse,
} = require("../utils/errorHandler");

// GET /casos
async function getAllCasos(req, res) {
  const casos = await casosRepository.getAllCasos();
  res.json(casos);
}

// GET /casos/:id
async function getCasoById(req, res) {
  const caso = await casosRepository.getCasoById(req.params.id);
  if (!caso) return notFoundResponse(res, "Caso não encontrado");
  res.json(caso);
}

// POST /casos
async function createCaso(req, res) {
  const { titulo, descricao, status, agente_id } = req.body;
  const errors = [];

  if (!titulo || !descricao || !status || !agente_id) {
    errors.push({ fields: "Campos obrigatórios ausentes" });
  }

  const agenteExiste = await verifyAgent(agente_id);
  if (!agenteExiste) {
    return notFoundResponse(res, "Agente não encontrado");
  }

  if (!verifyStatus(status)) {
    errors.push({
      status: "O campo 'status' pode ser somente 'aberto' ou 'solucionado'",
    });
  }

  if (errors.length > 0) {
    return invalidPayloadResponse(res, errors);
  }

  const novoCaso = await casosRepository.createCaso({
    titulo,
    descricao,
    status,
    agente_id,
  });

  res.status(201).json(novoCaso[0]);
}

// PUT /casos/:id
async function updateCaso(req, res) {
  const errors = [];
  const { id, titulo, descricao, status, agente_id } = req.body;

  if (id && id !== req.params.id) {
    errors.push({
      id: "Não é permitido alterar o ID do caso",
    });
  }

  if (!titulo || !descricao || !status || !agente_id) {
    errors.push({
      fields: "Campos obrigatórios ausentes",
    });
  }

  if (!verifyStatus(status)) {
    errors.push({
      status: "O campo 'status' pode ser somente 'aberto' ou 'solucionado'",
    });
  }

  if (errors.length > 0) {
    return invalidPayloadResponse(res, errors);
  }

  const agenteExiste = await verifyAgent(agente_id);
  if (!agenteExiste) {
    return notFoundResponse(res, "Agente não encontrado");
  }

  const atualizado = await casosRepository.updateCaso(req.params.id, {
    titulo,
    descricao,
    status,
    agente_id,
  });

  if (!atualizado.length) return notFoundResponse(res, "Caso não encontrado");

  res.json(atualizado[0]);
}

// PATCH /casos/:id
async function patchCaso(req, res) {
  const errors = [];
  const data = req.body;

  if (
    !data ||
    typeof data !== "object" ||
    Array.isArray(data) ||
    Object.keys(data).length === 0
  ) {
    return invalidPayloadResponse(res, { body: "Payload inválido ou vazio" });
  }

  if ("id" in data) {
    errors.push({
      id: "Não é permitido alterar o ID do caso",
    });
  }

  if (data.status && !verifyStatus(data.status)) {
    errors.push({
      status: "O campo 'status' pode ser somente 'aberto' ou 'solucionado'",
    });
  }

  if (data.agente_id) {
    const agenteExiste = await verifyAgent(data.agente_id);
    if (!agenteExiste) {
      return notFoundResponse(res, "Agente não encontrado");
    }
  }

  if (errors.length > 0) return invalidPayloadResponse(res, errors);

  const atualizado = await casosRepository.patchCaso(req.params.id, data);

  if (!atualizado.length) return notFoundResponse(res, "Caso não encontrado");

  res.json(atualizado[0]);
}

// DELETE /casos/:id
async function deleteCaso(req, res) {
  try {
    const sucesso = await casosRepository.deleteCaso(req.params.id);
    if (!sucesso) return notFoundResponse(res, "Caso não encontrado");
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar caso" });
  }
}

module.exports = {
  getAllCasos,
  getCasoById,
  createCaso,
  updateCaso,
  patchCaso,
  deleteCaso,
};
