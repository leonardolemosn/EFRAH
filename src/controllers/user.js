const knex = require("../config/conexao");
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    const {nome, email, senha} = req.body;

    try{
        const usuario = await knex("usuarios").where({ email });
    
        if (usuario.length > 0) {
            return res
            .status(400)
            .json({mensagem: "Email informado já cadastrado"})
        }
        const senhaCriptografada = await bcrypt.hash(senha, 10);
        const usuarioCompleto = {
            nome, 
            email,
            senha: senhaCriptografada,
        };
        const publicarUsuario = await knex ("usuarios").insert(usuarioCompleto);
        
        return res
        .status(200)
        .json({mensagem: "Usuário inserido com sucesso"})
    } catch (error){
        return res.status(500).json({mensagem: "erro no server"});
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
    listarUsuarios,
    atualizarUsuario,
    deletarUsuario
};