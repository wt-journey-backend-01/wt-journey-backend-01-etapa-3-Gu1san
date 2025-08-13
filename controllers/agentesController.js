const agentesRepository = require("../repositories/agentesRepository");
const {
  verifyDate,
  invalidPayloadResponse,
  notFoundResponse,
} = require("../utils/erroHandler");

async function getAllAgentes(req, res) {
  try {
    const agentes = await agentesRepository.getAllAgentes();
    res.json(agentes);
  } catch (err) {
    console.error("Erro ao buscar agentes:", err);
    res.status(500).json({ error: "Erro ao buscar agentes" });
  }
}

async function getAgenteById(req, res) {
  try {
    const agente = await agentesRepository.getAgenteById(req.params.id);
    if (!agente) return notFoundResponse(res, "Agente não encontrado");
    res.json(agente);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar agente" });
  }
}

async function getAgentesByCargo(req, res) {
  try {
    const agentes = await agentesRepository.getAgentesByCargo(req.query.cargo);
    if (!agentes.length)
      return notFoundResponse(res, "Agentes não encontrados");
    res.json(agentes);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar agentes por cargo" });
  }
}

async function createAgente(req, res) {
  const errors = [];
  const { nome, dataDeIncorporacao, cargo } = req.body;

  if (!nome || !dataDeIncorporacao || !cargo) {
    errors.push({ fields: "Campos obrigatórios ausentes" });
  }
  if (!verifyDate(dataDeIncorporacao)) {
    errors.push({ date: "Data inválida" });
  }
  if (errors.length > 0) return invalidPayloadResponse(res, errors);

  try {
    const novoAgente = await agentesRepository.createAgente({
      nome,
      dataDeIncorporacao,
      cargo,
    });
    res.status(201).json(novoAgente[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar agente" });
  }
}

async function updateAgente(req, res) {
  const errors = [];
  const { id, nome, dataDeIncorporacao, cargo } = req.body;

  if (id && id !== req.params.id) {
    errors.push({ id: "Não é permitido alterar o ID do agente" });
  }
  if (!nome || !dataDeIncorporacao || !cargo) {
    errors.push({ fields: "Campos obrigatórios ausentes" });
  }
  if (!verifyDate(dataDeIncorporacao)) {
    errors.push({ date: "Data inválida" });
  }
  if (errors.length > 0) return invalidPayloadResponse(res, errors);

  try {
    const atualizado = await agentesRepository.updateAgente(req.params.id, {
      nome,
      dataDeIncorporacao,
      cargo,
    });
    if (!atualizado.length)
      return notFoundResponse(res, "Agente não encontrado");
    res.json(atualizado[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar agente" });
  }
}

async function patchAgente(req, res) {
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
    errors.push({ id: "Não é permitido alterar o ID do agente" });
  }
  if (data.dataDeIncorporacao && !verifyDate(data.dataDeIncorporacao)) {
    errors.push({ date: "Data de incorporação inválida" });
  }
  if (errors.length > 0) return invalidPayloadResponse(res, errors);

  try {
    const atualizado = await agentesRepository.patchAgente(req.params.id, data);
    if (!atualizado.length)
      return notFoundResponse(res, "Agente não encontrado");
    res.json(atualizado[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar parcialmente agente" });
  }
}

async function deleteAgente(req, res) {
  try {
    const sucesso = await agentesRepository.deleteAgente(req.params.id);
    if (!sucesso) return notFoundResponse(res, "Agente não encontrado");
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar agente" });
  }
}

module.exports = {
  getAllAgentes,
  getAgenteById,
  getAgentesByCargo,
  createAgente,
  updateAgente,
  patchAgente,
  deleteAgente,
};
