/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("casos").del();
  await knex("casos").insert([
    {
      titulo: "Roubo ao Banco Central",
      descricao: "Assalto à agência do Banco Central no centro.",
      status: "aberto",
      agente_id: 1, // ID do João Silva
    },
    {
      titulo: "Tráfico de Drogas na Zona Leste",
      descricao:
        "Investigação sobre tráfico de drogas em bairro da zona leste.",
      status: "solucionado",
      agente_id: 2, // ID da Maria Oliveira
    },
  ]);
};
