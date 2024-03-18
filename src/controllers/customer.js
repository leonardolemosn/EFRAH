const knex = require("../config/conexao");
const { differenceInYears } = require('date-fns');

const registerCustomer = async (req, res) => {
    const { country, birth_city, birth_date, sex, gender, blood_type } = req.body;
    try {

        const validarPais = await knex("countries").where({ country }).first();
        if (!validarPais) {
            return res.status(404).json({ mensagem: "País não encontrado" });
        }

        const validarCidade = await knex("cities").where({ city_name: birth_city }).first();
        if (!validarCidade) {
            return res.status(404).json({ mensagem: "Cidade não encontrada" });
        }

        const dataNascimento = new Date(birth_date);
        const hoje = new Date();
        const age = differenceInYears(hoje, dataNascimento);



        const customerProfile = await knex("customers").insert({

            nationality: validarPais.id,
            birth_city: validarCidade.id,
            birth_date: age,
            sex,
            gender,
            blood_type,
            active: true,
            created_at: new Date(),
            updated_at: new Date()
        });

        if (!customerProfile) {
            return res.status(400).json({ mensagem: "Erro ao criar usuário" });
        }


        return res.status(200).json({ mensagem: "Usuário e documentos inseridos com sucesso" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Server error", error: error.message });
    }
};

const updateCustomer = async (req, res) => {
    const { id } = req.params;
    const { country, birth_city, birth_date, sex, gender, blood_type } = req.body;
    try {
        const customerExistente = await knex("customers").where({ id }).first();
        if (!customerExistente) {
            return res.status(404).json({ mensagem: "Cliente não encontrado" });
        }

        let countryId = customerExistente.nationality;
        let cityId = customerExistente.birth_city;

        if (country) {
            const validarPais = await knex("countries").where({ country }).first();
            if (!validarPais) {
                return res.status(404).json({ mensagem: "País não encontrado" });
            }
            countryId = validarPais.id;
        }

        if (birth_city) {
            const validarCidade = await knex("cities").where({ city_name: birth_city }).first();
            if (!validarCidade) {
                return res.status(404).json({ mensagem: "Cidade não encontrada" });
            }
            cityId = validarCidade.id;
        }

        const updateData = {
            nationality: countryId,
            birth_city: cityId,
            updated_at: new Date()
        };

        if (birth_date) {
            updateData.birth_date = birth_date;
        }

        if (sex) {
            updateData.sex = sex;
        }

        if (gender) {
            updateData.gender = gender;
        }

        if (blood_type) {
            updateData.blood_type = blood_type;
        }

        await knex("customers").where({ id }).update(updateData);

        return res.status(200).json({ mensagem: "Dados do cliente atualizados com sucesso" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Server error", error: error.message });
    }
};


module.exports = {
    registerCustomer,
    updateCustomer
};