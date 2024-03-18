const Joi = require("joi");

const validacaoCadastrarCustomer = Joi.object({
    country: Joi.string().required().messages({
        "string.empty": "O campo País é obrigatório!",
        "any.required": "O campo País é obrigatório!",
    }),
    birth_city: Joi.string().required().messages({
        "string.email": "Cidade inválida!",
        "any.required": "O campo cidade é obrigatório para cadastro!",
    }),
    birth_date: Joi.date().required().messages({
        "date.base": "Formato de data inválido!",
        "any.required": "O campo data de nascimento é obrigatório!"
    }),
    sex: Joi.string().required().valid('M','W').messages({
        "string.empty": "O campo Sexo é obrigatório!",
        "any.required": "O campo Sexo é obrigatório!",
    }),
    gender: Joi.string().required().messages({
        "string.empty": "O campo Gênero é obrigatório!",
        "any.required": "O campo Gênero é obrigatório!",
    }),
    blood_type: Joi.string().required().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-').messages({
        "string.empty": "O campo Tipo Sanguíneo é obrigatório!",
        "any.required": "O campo Tipo Sanguíneo é obrigatório!",
        "any.only": "Tipo Sanguíneo inválido. Deve ser um dos seguintes: A+, A-, B+, B-, AB+, AB-, O+, O-."
    }),    
});

const validacaoUpdateCustomer = Joi.object({
    country: Joi.string().optional().messages({
        "string.empty": "O campo País não pode ser vazio!",
    }),
    birth_city: Joi.string().optional().messages({
        "string.empty": "O campo Cidade não pode ser vazio!",
    }),
    birth_date: Joi.date().optional().messages({
        "date.base": "Formato de data inválido!",
    }),
    sex: Joi.string().valid('M', 'F').optional().messages({
        "string.empty": "O campo Sexo não pode ser vazio!",
        "any.only": "Sexo deve ser 'M' para masculino ou 'F' para feminino",
    }),
    gender: Joi.string().optional().messages({
        "string.empty": "O campo Gênero não pode ser vazio!",
    }),
    blood_type: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-').optional().messages({
        "string.empty": "O campo Tipo Sanguíneo não pode ser vazio!",
        "any.only": "Tipo Sanguíneo inválido",
    }),
}).min(1).messages({
    "object.min": "Pelo menos um campo deve ser atualizado."
});

module.exports = {
    validacaoCadastrarCustomer,
    validacaoUpdateCustomer
};
