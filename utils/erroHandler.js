const agentesRepository = require("../repositories/agentesRepository");

function verifyStatus(status) {
  const validStatuses = ["aberto", "solucionado"];
  if (!validStatuses.includes(status)) {
    return false;
  }
  return true;
}

function verifyDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  const now = new Date();

  if (isNaN(date.getTime())) return false; // Data inválida
  if (date > now) return false; // Data no futuro
  return true;
}

function verifyAgent(agentID) {
  const agenteExiste = agentesRepository.findById(agentID);
  if (!agenteExiste) {
    return false;
  }
  return true;
}

function invalidPayloadResponse(res, error, message = "Parâmetros inválidos") {
  return res.status(400).json({
    status: 400,
    message: message,
    errors: error,
  });
}

function notFoundResponse(res, message) {
  return res.status(404).json({ status: 404, error: message });
}

module.exports = {
  verifyStatus,
  verifyDate,
  verifyAgent,
  invalidPayloadResponse,
  notFoundResponse,
};
