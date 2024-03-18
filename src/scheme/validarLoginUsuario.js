const Joi = require("joi");

const validacaoLoginUsuario = Joi.object({
  tipo: Joi.string().required().valid('email', 'telefone').messages({
    "string.empty": "O campo tipo é obrigatório!",
    "any.only": "O tipo deve ser 'email' ou 'telefone'!",
    "any.required": "O campo tipo é obrigatório!",
  }),
  email: Joi.string().email().when('tipo', { is: 'email', then: Joi.required(), otherwise: Joi.forbidden() }).messages({
    "string.empty": "O campo email é obrigatório!",
    "string.email": "Email inválido!",
    "any.required": "O campo email é obrigatório para login com email!",
    "any.forbidden": "O campo email não deve ser fornecido para login com telefone!",
  }),
  profile_type_id: Joi.string().required().valid('Customer', 'Supplier').messages({
    "string.empty": "O campo profile_type é obrigatório!",
    "any.only": "O profile_type deve ser 'Customer' ou 'Supplier'!",
    "any.required": "O campo profile_type é obrigatório!",
  }),
  telefone: Joi.string().pattern(/^[1-9][0-9]\d{8,9}$/).when('tipo', { is: 'telefone', then: Joi.required(), otherwise: Joi.forbidden() }).messages({
    "string.empty": "O campo telefone é obrigatório!",
    "string.pattern.base": "Formato de telefone inválido! Use o formato brasileiro sem espaços ou símbolos (ex: 11987654321).",
    "any.required": "O campo telefone é obrigatório para login com telefone!",
    "any.forbidden": "O campo telefone não deve ser fornecido para login com email!",
  }),
  senha: Joi.string().min(6).max(20).required().messages({
    "string.empty": "O campo senha é obrigatório!",
    "string.base": "Formato de senha inválido!",
    "string.min": "A senha deve ter no mínimo 6 caracteres",
    "string.max": "A senha deve ter no máximo 20 caracteres",
    "any.required": "O campo senha é obrigatório!",
  }),
});

module.exports = validacaoLoginUsuario;
