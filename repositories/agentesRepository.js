const db = require("../db/db");

async function getAllAgentes() {
  return await db("agentes").select("*");
}

async function getAgenteById(id) {
  return await db("agentes").where({ id }).first();
}

async function getAgentesByCargo(cargo) {
  return await db("agentes").where({ cargo });
}

async function createAgente(agente) {
  return await db("agentes").insert(agente).returning("*");
}

async function patchAgente(id, agente) {
  return await db("agentes").where({ id }).update(agente).returning("*");
}

async function updateAgente(id, agente) {
  return await db("agentes").where({ id }).update(agente).returning("*");
}

async function deleteAgente(id) {
  const deletedRows = await db("agentes").where({ id }).del();

  return deletedRows > 0;
}

module.exports = {
  getAllAgentes,
  getAgenteById,
  getAgentesByCargo,
  createAgente,
  patchAgente,
  updateAgente,
  deleteAgente,
};
