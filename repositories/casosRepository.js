const db = require("../db/db");

async function getAllCasos() {
  return await db("casos").select("*");
}

async function getCasoById(id) {
  return await db("casos").where({ id }).first();
}

async function createCaso(caso) {
  return await db("casos").insert(caso).returning("*");
}

async function updateCaso(id, caso) {
  return await db("casos").where({ id }).update(caso).returning("*");
}

async function patchCaso(id, caso) {
  return await db("casos").where({ id }).update(caso).returning("*");
}

async function deleteCaso(id) {
  const deletedRows = await db("casos").where({ id }).del();

  return deletedRows > 0;
}

async function getCasosByAgenteId(agenteId) {
  return await db("casos").where({ agente_id: agenteId });
}

module.exports = {
  getAllCasos,
  getCasoById,
  createCaso,
  updateCaso,
  patchCaso,
  deleteCaso,
  getCasosByAgenteId,
};
