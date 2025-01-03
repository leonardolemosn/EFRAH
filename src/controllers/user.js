const knex = require("../config/conexao");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtPassword } = require("../config/security/jwtPassword");


function validarSenha(password) {
  const regras = [
    { regex: /[A-Z]/, mensagem: "Deve conter pelo menos uma letra maiúscula" },
    { regex: /[a-z]/, mensagem: "Deve conter pelo menos uma letra minúscula" },
    { regex: /[0-9]/, mensagem: "Deve conter pelo menos um número" },
    { regex: /[@$!%*?&]/, mensagem: "Deve conter pelo menos um caractere especial (@$!%*?&)" },
    { regex: /.{8,}/, mensagem: "Deve conter pelo menos 8 caracteres" },
  ];

  const erros = regras.filter(regra => !regra.regex.test(password)).map(regra => regra.mensagem);

  return erros.length > 0 ? erros : null;
}

const cadastrarUsuario = async (req, res) => {
  const { profile_type_id, nome, email, telefone, password, password_confirmation, document_number, document_type_id } = req.body;
  try {
    // Verifica se a senha atende às regras
    const errosSenha = validarSenha(password);
    if (errosSenha) {
      return res.status(400).json({ mensagem: "A senha não atende aos critérios", erros: errosSenha });
    }

    const usuarioExistente = await knex("users_documents").where({ document_number }).first();
    if (usuarioExistente) {
      return res.status(400).json({ mensagem: "Usuário já cadastrado" });
    }

    const validarTelefone = await knex("users").where({ phone_number: telefone }).first();
    if (validarTelefone) {
      return res.status(400).json({ mensagem: "Telefone informado já cadastrado" });
    }

    const validarEmail = await knex("users").where({ email }).first();
    if (validarEmail) {
      return res.status(400).json({ mensagem: "Email informado já cadastrado" });
    }

    const profileType = await knex("profile_type").where({ id: profile_type_id }).first();
    if (!profileType) {
      return res.status(404).json({ mensagem: "Tipo de perfil não encontrado" });
    }

    if (password !== password_confirmation) {
      return res.status(400).json({ mensagem: "Senha não confere" });
    }

    const senhaCriptografada = await bcrypt.hash(password, 10);

    const [userId] = await knex("users").insert({
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

    const docType = await knex("document_types").where({ id: document_type_id }).first();
    if (!docType) {
      return res.status(404).json({ mensagem: "Tipo de documento não encontrado" });
    }

    await knex("users_documents").insert({
      user_id: userId.id,
      document_type_id: docType.id,
      document_number,
      active: true,
      created_at: new Date(),
      updated_at: new Date()
    });

    await knex("customers").insert({
      user_id: userId.id,
      full_name: nome,
      active: true,
      document_type_id: docType.id,
      document_number,
      created_at: new Date(),
      updated_at: new Date()
    });

    return res.status(200).json({ mensagem: "Usuário e documentos inseridos com sucesso" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Server error", error: error.message });
  }
};


const loginUsuarioEmail = async (req, res) => { 
  const { profile_type_id, email, senha } = req.body;

    try {
      const processandoLogin = await knex("users").where({ email, profile_type_id });

      if (processandoLogin.length === 0 || !(await bcrypt.compare(senha, processandoLogin[0].senha))) {
        return res.status(400).json({ mensagem: "Email ou senha incorretos" });
      }

      const token = jwt.sign({ id: processandoLogin[0].id }, jwtPassword, {
        expiresIn: "7d",
      });

      return res.status(200).json({ token });
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro no servidor!" });
    }
  };

const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await knex("usuarios").select("*");
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao listar usuários" });
  }
};

const atualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nome, email, senhaAntiga, senhaNova } = req.body;
  try {

    const processingUpdate = await knex("users").where({ id });

    if (processingUpdate.length === 0 || !(await bcrypt.compare(senhaAntiga, processingUpdate[0].password))) {
      return res.status(400).json({ mensagem: "Senha incorreta" });
    }
    const senhaCriptografada = await bcrypt.hash(senhaNova, 10);

    await knex("users").where({ id }).update({ nome, email, password: senhaCriptografada });
    res.status(200).json({ mensagem: "Usuário atualizado com sucesso" });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao atualizar usuário" });
  }
};

const deletarUsuario = async (req, res) => {
  const { id } = req.params;
  const { senha } = req.body
  try {

    const processingDelete = await knex("users").where({ id });

    if (processingDelete.length === 0 || !(await bcrypt.compare(senha, processingDelete[0].password))) {
      return res.status(400).json({ mensagem: "Senha incorreta" });
    }
    await knex("users").where({ id }).update({ active: false});
    res.status(200).json({ mensagem: "Usuário deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao deletar usuário" });
  }
};

module.exports = {
  cadastrarUsuario,
  loginUsuarioEmail,
  listarUsuarios,
  atualizarUsuario,
  deletarUsuario
};




