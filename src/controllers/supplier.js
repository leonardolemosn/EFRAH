const knex = require("../config/conexao");
const bcrypt = require('bcrypt');

const registerSupplier = async (req, res) => {
    const { profile_type_id, razaoSocial, nomeFantasia, email, telefone, senha, CNPJ, CRM, RQE, country, birth_city } = req.body;

    try {
        // Validate input
        if (!profile_type_id || !email || !telefone || !senha || !country || !birth_city) {
            return res.status(400).json({ mensagem: "Parâmetros obrigatórios estão faltando." });
        }

        // Validate country and city
        const validarPais = await knex("countries").where({ country }).first();
        if (!validarPais) {
            return res.status(404).json({ mensagem: "País não encontrado" });
        }

        const validarCidade = await knex("cities").where({ city_name: birth_city }).first();
        if (!validarCidade) {
            return res.status(404).json({ mensagem: "Cidade não encontrada" });
        }

        // Common validation for email and phone
        const emailExists = await knex("users").where({ email }).first();
        if (emailExists) {
            return res.status(400).json({ mensagem: "Email informado já cadastrado" });
        }

        const phoneExists = await knex("users").where({ telefone }).first();
        if (phoneExists) {
            return res.status(400).json({ mensagem: "Telefone informado já cadastrado" });
        }

        // Hash password
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        // Profile type validation and insertion logic
        let documentTypeId, documentNumber, successMessage;

        if (profile_type_id === '86a057cb-a888-4958-aa7a-ce5c99b72fb2') {
            // Médico profile
            if (!CRM || !RQE) {
                return res.status(400).json({ mensagem: "CRM e RQE são obrigatórios." });
            }

            const crmExists = await knex("users_documents").where({ document_number: CRM }).first();
            if (crmExists) {
                return res.status(400).json({ mensagem: "Médico informado já cadastrado" });
            }

            documentTypeId = "e58edd98-af48-496b-99bd-5535f65611c1";
            documentNumber = CRM;
            successMessage = "Usuário inserido com sucesso";

        } else if (profile_type_id === "c5e6af0c-3a96-4d8b-ad0f-1374f398523d") {
            // Empresa profile
            if (!CNPJ) {
                return res.status(400).json({ mensagem: "CNPJ é obrigatório." });
            }

            const cnpjExists = await knex("users_documents").where({ document_number: CNPJ }).first();
            if (cnpjExists) {
                return res.status(400).json({ mensagem: "Empresa informada já cadastrada" });
            }

            documentTypeId = "0e704fce-e86a-4066-8a5e-5cca03d0b43f";
            documentNumber = CNPJ;
            successMessage = "Empresa inserida com sucesso";
        } else {
            return res.status(400).json({ mensagem: "Tipo de perfil inválido." });
        }

        // Insert into users table
        const [supplierId] = await knex("users")
            .insert({
                profile_type_id,
                email,
                phone_number: telefone,
                password: senhaCriptografada,
                active: true,
                created_at: new Date(),
                updated_at: new Date(),
            })
            .returning('id');

        if (!supplierId) {
            return res.status(400).json({ mensagem: "Erro ao criar usuário" });
        }

        // Insert into users_documents
        await knex("users_documents").insert({
            user_id: supplierId.id,
            document_type_id: documentTypeId,
            document_number: documentNumber,
            active: true,
            created_at: new Date(),
            updated_at: new Date(),
        });

        // Additional document for Médico profile
        if (profile_type_id === '86a057cb-a888-4958-aa7a-ce5c99b72fb2') {
            await knex("users_documents").insert({
                user_id: supplierId.id,
                document_type_id: "a07ef254-6b46-4cf8-8bd8-9f0bd91dd3d4",
                document_number: RQE,
                active: true,
                created_at: new Date(),
                updated_at: new Date(),
            });
        }

        // Insert into suppliers table
        await knex("suppliers").insert({
            user_id: supplierId.id,
            legal_name: razaoSocial,
            free_name: nomeFantasia,
            nationality: validarPais.id,
            birth_city: validarCidade.id,
            active: true,
            created_at: new Date(),
            updated_at: new Date(),
        });

        return res.status(200).json({ mensagem: successMessage });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Ocorreu um erro no servidor" });
    }
};

module.exports = { registerSupplier };
