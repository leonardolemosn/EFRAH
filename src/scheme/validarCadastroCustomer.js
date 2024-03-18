const Joi = require("joi");

// Função para validar CPF
const isValidCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }

    let resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }

    resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.charAt(10));
};

const validacaoCadastrarUsuario = Joi.object({
    nome: Joi.string().required().messages({
        "string.empty": "O campo nome é obrigatório!",
        "string.base": "Formato de nome inválido!",
        "any.required": "O campo nome é obrigatório!",
    }),
    profile_type_id: Joi.string().required().messages({
        "string.empty": "O campo profile_type é obrigatório!",
        "any.required": "O campo profile_type é obrigatório!",
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Email inválido!",
        "any.required": "O campo email é obrigatório para cadastro com email!",
    }),
    telefone: Joi.string().pattern(/^[1-9][0-9]\d{8,9}$/).required().messages({
        "string.pattern.base": "Formato de telefone inválido! Use o formato brasileiro sem espaços ou símbolos (ex: 81999999999).",
        "any.required": "O campo telefone é obrigatório para cadastro com telefone!",
    }),
    senha: Joi.string().min(6).max(20).required().messages({
        "string.empty": "O campo senha é obrigatório!",
        "string.min": "A senha deve ter no mínimo 6 caracteres",
        "string.max": "A senha deve ter no máximo 20 caracteres",
        "any.required": "O campo senha é obrigatório!",
    }),
    document_type_id: Joi.string().required().valid('83555b9e-4064-44d1-b449-fc49cc067863', 'bed0fa7c-3c8b-4288-904a-ef8456d2a9e3').messages({
      "string.empty": "O campo profile_type é obrigatório!",
      "any.only": "O profile_type deve ser 'Customer' ou 'Supplier'!",
      "any.required": "O campo profile_type é obrigatório!",
    }),
    document_number: Joi.string().custom((value, helpers) => {
        if (!isValidCPF(value)) {
            return helpers.error("any.invalid");
        }
        return value;
    }).required().messages({
        "any.required": "O campo CPF é obrigatório!",
        "any.invalid": "O CPF informado é inválido!",
    }),
});

module.exports = validacaoCadastrarUsuario;
