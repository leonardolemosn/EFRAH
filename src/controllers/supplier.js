const knex = require("../config/conexao");
const bcrypt = require('bcrypt');

const registerSupplier = async (req, res) => {
    const { profile_type_id, razaoSocial, nomeFantasia, email, telefone, senha, CNPJ, CRM, RQE, country, birth_city } = req.body;
    if (profile_type_id === '86a057cb-a888-4958-aa7a-ce5c99b72fb2') {
        try {
            const usuario = await knex("users_documents").where({ document_number: CRM });

            if (usuario.length > 0) {
                return res.status(400).json({ mensagem: "Médico informado já cadastrado" })
            }

            const validarPais = await knex("countries").where({ country }).first();

            if (!validarPais) {
                return res.status(404).json({ mensagem: "País não encontrado" });
            }

            const validarCidade = await knex("cities").where({ city_name: birth_city }).first();
            if (!validarCidade) {
                return res.status(404).json({ mensagem: "Cidade não encontrada" });
            }

            const validarEmail = await knex("users").where({ email });

            if (validarEmail.length > 0) {
                return res.status(400).json({ mensagem: "Email informado já cadastrado" })
            }

            const validarTelefone = await knex("users").where({ telefone });

            if (validarTelefone.length > 0) {
                return res.status(400).json({ mensagem: "Telefone informado já cadastrado" })
            }

            const senhaCriptografada = await bcrypt.hash(senha, 10);

            const [supplierId] = await knex("users").insert({

                profile_type_id,
                email,
                phone_number: telefone,
                password: senhaCriptografada,
                active: true,
                created_at: new Date(),
                updated_at: new Date()
            }).returning('id');

            if (!userId) {
                return res.status(400).json({ mensagem: "Erro ao criar usuário" });
            }

            await knex("users_documents").insert({
                user_id: supplierId.id,
                document_type_id: "e58edd98-af48-496b-99bd-5535f65611c1",
                document_number: CRM,
                active: true,
                created_at: new Date(),
                updated_at: new Date()
            });

            await knex("users_documents").insert({
                user_id: supplierId.id,
                document_type_id: "a07ef254-6b46-4cf8-8bd8-9f0bd91dd3d4",
                document_number: RQE,
                active: true,
                created_at: new Date(),
                updated_at: new Date()
            });

            await knex("suppliers").insert({
                user_id: supplierId.id,
                legal_name:razaoSocial,
                free_name: nomeFantasia,
                nationality: validarPais.id,
                birth_city: validarCidade.id,
                active: true,
                created_at: new Date(),
                updated_at: new Date()
            })

            return res
                .status(200)
                .json({ mensagem: "Usuário inserido com sucesso" })
        } catch (error) {
            return res.status(500).json({ mensagem: "Server error" });
        }
    } else if (profile_type_id === "c5e6af0c-3a96-4d8b-ad0f-1374f398523d") {
        try {
            const usuario = await knex("users_documents").where({ document_number: CNPJ });

            if (usuario.length > 0) {
                return res.status(400).json({ mensagem: "Empresa informada já cadastrada" })
            }

            const validarPais = await knex("countries").where({ country }).first();

            if (!validarPais) {
                return res.status(404).json({ mensagem: "País não encontrado" });
            }

            const validarCidade = await knex("cities").where({ city_name: birth_city }).first();
            if (!validarCidade) {
                return res.status(404).json({ mensagem: "Cidade não encontrada" });
            }

            const validarEmail = await knex("users").where({ email });

            if (validarEmail.length > 0) {
                return res.status(400).json({ mensagem: "Email informado já cadastrado" })
            }

            const validarTelefone = await knex("users").where({ telefone });

            if (validarTelefone.length > 0) {
                return res.status(400).json({ mensagem: "Telefone informado já cadastrado" })
            }

            const senhaCriptografada = await bcrypt.hash(senha, 10);

            const [supplierId] = await knex("users").insert({

                profile_type_id,
                email,
                phone_number: telefone,
                password: senhaCriptografada,
                active: true,
                created_at: new Date(),
                updated_at: new Date()
            }).returning('id');

            if (!userId) {
                return res.status(400).json({ mensagem: "Erro ao criar usuário" });
            }

            await knex("users_documents").insert({
                user_id: supplierId.id,
                document_type_id: "0e704fce-e86a-4066-8a5e-5cca03d0b43f",
                document_number: CNPJ,
                active: true,
                created_at: new Date(),
                updated_at: new Date()
            });

            await knex("suppliers").insert({
                user_id: supplierId.id,
                legal_name: razaoSocial,
                free_name: nomeFantasia,
                nationality: validarPais.id,
                birth_city: validarCidade.id,
                active: true,
                created_at: new Date(),
                updated_at: new Date()
            })

            return res
                .status(200)
                .json({ mensagem: "Empresa inserida com sucesso" })
        } catch (error) {
            return res.status(500).json({ mensagem: "Server error" });
        }
    }
};