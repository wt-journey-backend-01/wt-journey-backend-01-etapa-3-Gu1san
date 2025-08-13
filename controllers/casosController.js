const casosRepository = require("../repositories/casosRepository");
const {
  verifyStatus,
  verifyAgent,
  invalidPayloadResponse,
  notFoundResponse,
} = require("../utils/erroHandler");

// GET /casos
async function getAllCasos(req, res) {
  const casos = await casosRepository.findAll();
  res.json(casos);
}

// GET /casos/:id
async function getCasoById(req, res) {
  const caso = await casosRepository.findById(req.params.id);
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

  const novoCaso = await casosRepository.create({
    titulo,
    descricao,
    status,
    agente_id,
  });

  res.status(201).json(novoCaso);
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

  const agenteExiste = await verifyAgent(agente_id);
  if (!agenteExiste) {
    return notFoundResponse(res, "Agente não encontrado");
  }

  if (errors.length > 0) {
    return invalidPayloadResponse(res, errors);
  }

  const atualizado = await casosRepository.update(req.params.id, {
    titulo,
    descricao,
    status,
    agente_id,
  });

  if (!atualizado) return notFoundResponse(res, "Caso não encontrado");

  res.json(atualizado);
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

  const atualizado = await casosRepository.patch(req.params.id, data);

  if (!atualizado) return notFoundResponse(res, "Caso não encontrado");

  res.json(atualizado);
}

// DELETE /casos/:id
async function deleteCaso(req, res) {
  const sucesso = await casosRepository.remove(req.params.id);

  if (!sucesso) return notFoundResponse(res, "Caso não encontrado");

  res.status(204).send();
}

module.exports = {
  getAllCasos,
  getCasoById,
  createCaso,
  updateCaso,
  patchCaso,
  deleteCaso,
};
