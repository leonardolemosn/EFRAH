const BuscaProcesso = require("busca-processos-judiciais");

async function buscarProcesso() {
  const busca = new BuscaProcesso(
    "TRF5",
    "APIKey cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw",
  );
  return busca.getCleanResult("05197418920184058300");
}

buscarProcesso()
  .then((data) => console.log(data))
  .catch((erro) => console.log(erro));