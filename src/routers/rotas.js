const express = require("express");
const cors = require("cors");
const multer = require("multer"); // Para lidar com uploads de arquivos
const rotas = express();
const usuario = require("../controllers/user");
const validarBodyRequisicao = require("../middlewares/validarBodyRequisicao");
const validacaoCadastrarUsuario = require("../scheme/validarCadastroUser");
const validacaoLoginUsuario = require("../scheme/validarLoginUsuario");
const validarAutenticacao = require("../middlewares/validarAutenticacaoJwt");
const registerCustomer = require("../controllers/customer");
const validacaoCadastrarCustomer = require("../scheme/validateRegisterUpdateCustomer");
const validacaoUpdateCustomer = require("../scheme/validateRegisterUpdateCustomer");
const updateCustomer = require("../controllers/customer");
const ocrController = require("../controllers/ocrController"); // Controlador do OCR

// Configuração para upload de arquivos
const upload = multer({ dest: "uploads/" });

// Aplicar o CORS a todas as rotas
rotas.use(cors());

rotas.post("/register/user", validarBodyRequisicao(validacaoCadastrarUsuario), usuario.cadastrarUsuario);
rotas.post("/register/user/supplier");
rotas.post("/create/user/customerProfile", validarAutenticacao, validarBodyRequisicao(validacaoCadastrarCustomer), registerCustomer.registerCustomer);
rotas.put("/update/customer", validarAutenticacao, validarBodyRequisicao(validacaoUpdateCustomer), updateCustomer.updateCustomer);
rotas.get("/profile", validarAutenticacao);
rotas.post("/login", validarBodyRequisicao(validacaoLoginUsuario), usuario.loginUsuarioEmail);
rotas.get("/usuario", usuario.listarUsuarios);
rotas.put("/usuario/:id", validarAutenticacao, usuario.atualizarUsuario);
rotas.delete("/usuario/:id", usuario.deletarUsuario);

// Nova rota para processar OCR
rotas.post("/process-image", upload.single("image"), ocrController.processarImagem);

module.exports = rotas;
