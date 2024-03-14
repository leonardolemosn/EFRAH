const express = require("express");
const rotas = express();
const usuario = require("../controllers/user")
const validarBodyRequisicao = require("../middlewares/validarBodyRequisicao");
const validacaoCadastrarUsuario = require("../scheme/validarBodyUsuario");
const validacaoLoginUsuario = require("../scheme/validarLoginUsuario");


rotas.post("/usuario", validarBodyRequisicao(validacaoCadastrarUsuario), usuario.cadastrarUsuario);
rotas.post("/login", validarBodyRequisicao(validacaoLoginUsuario), usuario.loginUsuarioEmail);
rotas.get("/usuario", usuario.listarUsuarios);
rotas.put("/usuario/:id", usuario.atualizarUsuario);
rotas.delete("/usuario/:id", usuario.deletarUsuario);
  

module.exports = rotas;