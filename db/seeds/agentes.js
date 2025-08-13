/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("agentes").del();
  await knex("agentes").insert([
    {
      nome: "João Silva",
      dataDeIncorporacao: "2020-01-15",
      cargo: "Investigador",
    },
    {
      nome: "Maria Oliveira",
      dataDeIncorporacao: "2018-06-10",
      cargo: "Delegada",
    },
  ]);
};
