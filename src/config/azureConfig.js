// config/azureConfig.js
const { ComputerVisionClient } = require('@azure/cognitiveservices-computervision');
const { ApiKeyCredentials } = require('@azure/ms-rest-js');

// Configuração do Azure Vision
const endpoint = "https://efrahtech.cognitiveservices.azure.com/";
const apiKey = "EBQf54IeboNM6Zlx6nQdrelfhqqE3VkyZBKI5Z2SbdDo2NE4WZLaJQQJ99ALACZoyfiXJ3w3AAAFACOGiB9R";

const credentials = new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': apiKey } });
const computerVisionClient = new ComputerVisionClient(credentials, endpoint);

module.exports = computerVisionClient;