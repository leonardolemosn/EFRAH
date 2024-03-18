const express = require("express");
const rotas = express();
const usuario = require("../controllers/user")
const validarBodyRequisicao = require("../middlewares/validarBodyRequisicao");
const validacaoCadastrarUsuario = require("../scheme/validarCadastroUser");
const validacaoLoginUsuario = require("../scheme/validarLoginUsuario");
const validarAutenticacao = require("../middlewares/validarAutenticacaoJwt");
const registerCustomer = require("../controllers/customer");
const validacaoCadastrarCustomer = require("../scheme/validateRegisterUpdateCustomer");
const validacaoUpdateCustomer = require("../scheme/validateRegisterUpdateCustomer")
const updateCustomer = require("../controllers/customer");


rotas.post("/register/user", validarBodyRequisicao(validacaoCadastrarUsuario), usuario.cadastrarUsuario);
rotas.post("/register/user/supplier");
rotas.post("/create/user/customerProfile", validarAutenticacao, validarBodyRequisicao(validacaoCadastrarCustomer),registerCustomer.registerCustomer);
rotas.put("update/customer", validarAutenticacao, validarBodyRequisicao(validacaoUpdateCustomer), updateCustomer.updateCustomer);
rotas.get("/profile", validarAutenticacao)
rotas.post("/login", validarBodyRequisicao(validacaoLoginUsuario), usuario.loginUsuarioEmail);
rotas.get("/usuario", usuario.listarUsuarios);
rotas.put("/usuario/:id", validarAutenticacao, usuario.atualizarUsuario);
rotas.delete("/usuario/:id", usuario.deletarUsuario);
  

module.exports = rotas;