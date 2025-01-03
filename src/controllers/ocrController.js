// controllers/ocrController.js
const { extrairTextoImagem } = require("../services/ocrService");
const fs = require("fs");

async function processarImagem(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhuma imagem foi enviada." });
    }

    const caminhoImagem = req.file.path;

    console.log("Chamando o serviço de OCR para processar a imagem...");
    const textoExtraido = await extrairTextoImagem(caminhoImagem);

    // Remover o arquivo temporário após o processamento
    fs.unlinkSync(caminhoImagem);

    res.status(200).json({ texto: textoExtraido });
  } catch (error) {
    console.error("Erro ao processar a imagem:", error);
    res.status(500).json({ error: "Erro ao processar a imagem." });
  }
}

module.exports = {
  processarImagem,
};
