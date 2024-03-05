const joi = require("joi");

const validacaoCadastrarUsuario = joi.object({
  nome: joi.string().required().messages({
    "string.empty": "O campo nome é Obrigatório!",
    "string.base": "Formato de nome inválido!",
    "any.required": "O campo nome é Obrigatório!",
  }),
  email: joi.string().email().required().messages({
    "string.empty": "O campo email é Obrigatório!",
    "string.email": "Email inválido!",
    "any.required": "O campo email é Obrigatório!",
  }),
  senha: joi.string().min(6).max(20).required().messages({
    "string.empty": "O campo senha é Obrigatório!",
    "string.base": "Formato de senha inválido!",
    "string.min": "A senha tem que ter no mínimo 6 caracteres",
    "string.max": "A senha tem que ter no máximo 20 caracteres",
    "any.required": "O campo senha é Obrigatório!",
  }),
});

module.exports = validacaoCadastrarUsuario;
