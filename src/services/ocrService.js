// services/ocrService.js
const fs = require("fs");
const computerVisionClient = require("../config/azureConfig");

async function extrairTextoImagem(caminhoImagem) {
  console.log("Lendo o arquivo da imagem...");
  const imagemBuffer = fs.readFileSync(caminhoImagem);

  console.log("Enviando imagem para o serviço de OCR...");
  const resultado = await computerVisionClient.readInStream(imagemBuffer);

  if (!resultado || !resultado.operationLocation) {
    throw new Error("A operação não retornou um 'operationLocation'. Verifique a imagem e o serviço.");
  }

  const operacao = resultado.operationLocation.split("/").pop();
  console.log("Operação iniciada com ID:", operacao);

  let status = "notStarted";
  while (status !== "succeeded") {
    console.log("Verificando o status da operação...");
    const analise = await computerVisionClient.getReadResult(operacao);
    if (!analise) {
      throw new Error("Nenhuma resposta foi recebida ao verificar o status da operação.");
    }

    status = analise.status;
    if (status === "succeeded") {
      console.log("A operação foi concluída com sucesso. Extraindo texto...");
      const textoExtraido = analise.analyzeResult.readResults
        .map((page) => page.lines.map((line) => line.text).join("\n"))
        .join("\n");
      return textoExtraido;
    } else if (status === "failed") {
      throw new Error("A análise da imagem falhou. Verifique a imagem e as configurações do serviço.");
    }

    console.log("Aguardando antes de verificar novamente...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

module.exports = {
  extrairTextoImagem,
};
