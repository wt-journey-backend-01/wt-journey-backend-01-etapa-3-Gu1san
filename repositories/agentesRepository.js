const db = require("../db/db");

async function getAllAgentes() {
  return await db("agentes").select("*");
}

async function getAgenteById(id) {
  return await db("agentes").where({ id }).first();
}

async function createAgente(agente) {
  return await db("agentes").insert(agente).returning("*");
}

async function updateAgente(id, agente) {
  return await db("agentes").where({ id }).update(agente).returning("*");
}

async function deleteAgente(id) {
  return await db("agentes").where({ id }).del();
}

module.exports = {
  getAllAgentes,
  getAgenteById,
  createAgente,
  updateAgente,
  deleteAgente,
};
