const Joi = require("joi");

const validacaoCadastrarUsuario = Joi.object({

  tipo: Joi.string().required().valid('email', 'telefone').messages({
    "string.empty": "O campo tipo é obrigatório!",
    "any.only": "O tipo deve ser 'email' ou 'telefone'!",
    "any.required": "O campo tipo é obrigatório!",
  }),
  nome: Joi.string().required().messages({
    "string.empty": "O campo nome é obrigatório!",
    "string.base": "Formato de nome inválido!",
    "any.required": "O campo nome é obrigatório!",
  }),
  profile_type: Joi.string().required().valid('C', 'S').messages({
    "string.empty": "O campo profile_type é obrigatório!",
    "any.only": "O profile_type deve ser 'C' ou 'S'!",
    "any.required": "O campo profile_type é obrigatório!",
  }),
  email: Joi.string().email().when('tipo', { is: 'email', then: Joi.required(), otherwise: Joi.forbidden() }).messages({
    "string.email": "Email inválido!",
    "any.required": "O campo email é obrigatório para cadastro com email!",
    "any.forbidden": "O campo email não deve ser fornecido para cadastro com telefone!",
  }),
  telefone: Joi.string().pattern(/^[1-9][0-9]\d{8,9}$/).when('tipo', { is: 'telefone', then: Joi.required(), otherwise: Joi.forbidden() }).messages({
    "string.pattern.base": "Formato de telefone inválido! Use o formato brasileiro sem espaços ou símbolos (ex: 81999999999).",
    "any.required": "O campo telefone é obrigatório para cadastro com telefone!",
    "any.forbidden": "O campo telefone não deve ser fornecido para cadastro com email!",
  }),
  senha: Joi.string().min(6).max(20).required().messages({
    "string.empty": "O campo senha é obrigatório!",
    "string.min": "A senha deve ter no mínimo 6 caracteres",
    "string.max": "A senha deve ter no máximo 20 caracteres",
    "any.required": "O campo senha é obrigatório!",
  }),

});

module.exports = validacaoCadastrarUsuario;
