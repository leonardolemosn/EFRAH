const computerVisionClient = require("./azureConfig"); // Corrigido o caminho do arquivo

(async () => {
  try {
    console.log("Testando conexão com o Azure Vision API...");
    const description = await computerVisionClient.describeImage("https://via.placeholder.com/150");
    console.log("Conexão bem-sucedida! Resposta:", description);
  } catch (error) {
    console.error("Erro ao conectar ao Azure Vision API:", error);
  }
})();
