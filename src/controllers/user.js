const knex = require("../config/conexao");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtPassword } = require("../config/security/jwtPassword");


const cadastrarUsuario = async (req, res) => {
  const { tipo, profile_type, nome, email, telefone, senha } = req.body;
  if (tipo === 'email') {
    try {
      const usuario = await knex("usuarios").where({ email, profile_type });

      if (usuario.length > 0) {
        return res.status(400).json({ mensagem: "Email informado já cadastrado" })
      }
      const senhaCriptografada = await bcrypt.hash(senha, 10);
      const usuarioCompleto = {
        nome,
        profile_type,
        email,
        senha: senhaCriptografada,
      };
      const publicarUsuario = await knex("usuarios").insert(usuarioCompleto);

      return res
        .status(200)
        .json({ mensagem: "Usuário inserido com sucesso" })
    } catch (error) {
      return res.status(500).json({ mensagem: "erro no server" });
    }
  } else if (tipo === 'telefone') {
    try {
      const usuario = await knex("usuarios").where({ telefone, profile_type });

      if (usuario.length > 0) {
        return res.status(400).json({ mensagem: "Telefone informado já cadastrado" })
      }
      const senhaCriptografada = await bcrypt.hash(senha, 10);
      const usuarioCompleto = {
        nome,
        profile_type,
        telefone,
        senha: senhaCriptografada,
      };
      const publicarUsuario = await knex("usuarios").insert(usuarioCompleto);

      return res
        .status(200)
        .json({ mensagem: "Usuário inserido com sucesso" })
    } catch (error) {
      return res.status(500).json({ mensagem: "erro no server" });
    }
  }
};

const loginUsuarioEmail = async (req, res) => {
  const { tipo, profile_type, email, telefone, senha } = req.body;

  if (tipo === 'email') {
    try {
      const processandoLogin = await knex("usuarios").where({ email, profile_type });

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
  } else if (tipo === 'telefone') {
    try {
      const processandoLogin = await knex("usuarios").where({ telefone, profile_type });

      if (processandoLogin.length === 0 || !(await bcrypt.compare(senha, processandoLogin[0].senha))) {
        return res.status(400).json({ mensagem: "Telefone ou senha incorretos" });
      }

      const token = jwt.sign({ id: processandoLogin[0].id }, jwtPassword, {
        expiresIn: "7d",
      });

      return res.status(200).json({ token });
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro no servidor!" });
    }
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
  const { nome, email, senha } = req.body;
  try {
    await knex("usuarios").where({ id }).update({ nome, email, senha });
    res.status(200).json({ mensagem: "Usuário atualizado com sucesso" });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao atualizar usuário" });
  }
};

const deletarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    await knex("usuarios").where({ id }).del();
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




