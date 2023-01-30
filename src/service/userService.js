const User = require("../model/User");
const Dependent = require("../model/Dependent");
const Imposto = require("../model/Imposto");
const jwt = require("jsonwebtoken");
const createURL = require("../utils/createURL.js");
const { findById, db, collection } = require("../model/Imposto");

const userService = {
  async camposIndefinidos(reqBody) {
    return (
      reqBody.name === undefined ||
      reqBody.email === undefined ||
      reqBody.password === undefined ||
      reqBody.telefone === undefined ||
      reqBody.nascimento === undefined ||
      reqBody.cpf === undefined ||
      reqBody.rg === undefined ||
      reqBody.emissao === undefined ||
      reqBody.filiacao === undefined ||
      reqBody.profissao === undefined ||
      reqBody.endereco === undefined ||
      reqBody.endereco.rua === undefined ||
      reqBody.endereco.bairro === undefined ||
      reqBody.endereco.numero === undefined ||
      reqBody.regional.municipio === undefined ||
      reqBody.regional.estado === undefined ||
      reqBody.regional.naturalidade === undefined ||
      regional.nacionalidade === undefined ||
      reqBody.numInscricao === undefined ||
      reqBody.dataAfiliacao === undefined ||
      reqBody.formacaoSuperior === undefined ||
      reqBody.instituicaoSuperior === undefined ||
      reqBody.dataFormacao === undefined ||
      reqBody.numRegistroConselho === undefined ||
      reqBody.dataRegistroConselho === undefined ||
      reqBody.empresa === undefined ||
      reqBody.salario === undefined
    );
  },

  async store(req, res) {
    let {
      name,
      email,
      password,
      telefone,
      nascimento,
      cpf,
      rg,
      emissao,
      filiacao,
      profissao,
      endereco,
      regional,
      numInscricao,
      dataAfiliacao,
      formacaoSuperior,
      instituicaoSuperior,
      dataFormacao,
      numRegistroConselho,
      dataRegistroConselho,
      empresa,
      salario,
    } = req.body;

    if (this.campoIndefinido(req.body)) {
      return res
        .status(HTTP_CODE_BAD_REQUEST)
        .json({ message: "Preencha todos os campos." });
    }

    if (endereco.complemento === "") {
      endereco.complemento = "Nenhum";
    }

    let user = await User.findOne({ cpf });

    if (!user) {
      let urlUser = await createURL(name);

      // Modificando formato das datas

      if (
        nascimento !== undefined &&
        nascimento !== "" &&
        nascimento !== null
      ) {
        nascimento = nascimento.split("/");
        nascimento = new Date(
          `${nascimento[2]}-${nascimento[1]}-${nascimento[0]}T01:00:00+01:00`
        );
      }
      if (emissao !== undefined && emissao !== "" && emissao !== null) {
        emissao = emissao.split("/");
        emissao = new Date(
          `${emissao[2]}-${emissao[1]}-${emissao[0]}T01:00:00+01:00`
        );
      }
      if (
        dataAfiliacao !== undefined &&
        dataAfiliacao !== "" &&
        dataAfiliacao !== null
      ) {
        dataAfiliacao = dataAfiliacao.split("/");
        dataAfiliacao = new Date(
          `${dataAfiliacao[2]}-${dataAfiliacao[1]}-${dataAfiliacao[0]}T01:00:00+01:00`
        );
      }
      if (
        dataFormacao !== undefined &&
        dataFormacao !== "" &&
        dataFormacao !== null
      ) {
        dataFormacao = dataFormacao.split("/");
        dataFormacao = new Date(
          `${dataFormacao[2]}-${dataFormacao[1]}-${dataFormacao[0]}T01:00:00+01:00`
        );
      }
      if (
        dataRegistroConselho !== undefined &&
        dataRegistroConselho !== "" &&
        dataRegistroConselho !== null
      ) {
        dataRegistroConselho = dataRegistroConselho.split("/");
        dataRegistroConselho = new Date(
          `${dataRegistroConselho[2]}-${dataRegistroConselho[1]}-${dataRegistroConselho[0]}T01:00:00+01:00`
        );
      }

      try {
        user = await User.create({
          name,
          email,
          password,
          telefone,
          nascimento,
          cpf,
          rg,
          emissao,
          filiacao,
          profissao,
          endereco,
          regional,
          numInscricao,
          dataAfiliacao,
          formacaoSuperior,
          instituicaoSuperior,
          dataFormacao,
          numRegistroConselho,
          dataRegistroConselho,
          empresa,
          salario,
          urlUser,
        });
        let imposto = await Imposto.create({ idUser: user._id });
        user = await User.findByIdAndUpdate(user._id, {
          impostoDeRenda: imposto._id,
        });
      } catch (e) {
        if (e.hasOwnProperty("code") && e.code === 11000) {
          return res.status(HTTP_CODE_BAD_REQUEST).json({
            message:
              "Valor de " + Object.keys(e.keyValue)[0] + " já cadastrado.",
          });
        } else {
          return res.status(HTTP_CODE_BAD_REQUEST).json({ message: e.message });
        }
      }

      return res
        .status(HTTP_CODE_CREATED)
        .json({ message: "Usuário cadastrado com sucesso." });
    } else {
      return res
        .status(HTTP_CODE_BAD_REQUEST)
        .json({ message: "CPF já cadastrado." });
    }
  },

  async login(req, res) {
    const { cpf, password } = req.body;

    if (cpf === undefined || password === undefined)
      return res
        .status(HTTP_CODE_BAD_REQUEST)
        .json({ message: "Preencha todos os campos." });

    let user = await User.findOne({ cpf });

    if (!user) {
      return res
        .status(HTTP_CODE_UNAUTHORIZED)
        .json({ message: "CPF não cadastrado" });
    } else {
      if (user.password === password) {
        let idUser = user._id;
        const token = jwt.sign({ idUser }, process.env.JWT_SECRET, {
          expiresIn: 60 * 60 * 24, // expires in 24 hours
        });

        let new_token_list = user.token_list;
        new_token_list.push(token);
        user = await User.findByIdAndUpdate(user._id, {
          token_list: new_token_list,
        });

        let response = {
          auth: true,
          token: `Bearer ` + token,
          admin: user.admin,

          name: user.name,
          urlUser: user.urlUser,
        };

        return res.status(HTTP_CODE_OK).json(response);
      } else {
        return res
          .status(HTTP_CODE_UNAUTHORIZED)
          .json({ message: "Senha inválida" });
      }
    }
  },

  async logout(req, res) {
    let user = req.user;
    new_token_list = user.token_list.remove(req.token);

    user = await User.findByIdAndUpdate(user._id, {
      token_list: new_token_list,
    });

    return res.status(HTTP_CODE_OK).json({ message: "User has logout." });
  },

  async userPage(req, res) {
    const urlUser = req.params.urlUser;

    let user = await User.findOne({ urlUser });

    if (!user) {
      return res
        .status(HTTP_CODE_NOT_FOUND)
        .json({ message: "Perfil não encontrado." });
    } else {
      dataPage = {
        name: user.name,
        email: user.email,
        telefone: user.telefone,
        nascimento:
          user.nascimento !== "" &&
          user.nascimento !== null &&
          user.nascimento !== undefined
            ? user.nascimento.getDate() +
              "/" +
              (user.nascimento.getMonth() + 1) +
              "/" +
              user.nascimento.getFullYear()
            : "",
        cpf: user.cpf,
        rg: user.rg,
        emissao:
          user.emissao !== "" &&
          user.emissao !== null &&
          user.emissao !== undefined
            ? user.emissao.getDate() +
              "/" +
              (user.emissao.getMonth() + 1) +
              "/" +
              user.emissao.getFullYear()
            : "",
        filiacao: user.filiacao,
        dataAfiliacao:
          user.dataAfiliacao !== "" &&
          user.dataAfiliacao !== null &&
          user.dataAfiliacao !== undefined
            ? user.dataAfiliacao.getDate() +
              "/" +
              (user.dataAfiliacao.getMonth() + 1) +
              "/" +
              user.dataAfiliacao.getFullYear()
            : "",
        regional:
          user.regional !== null &&
          user.regional !== "" &&
          user.regional !== undefined
            ? user.regional
            : "",
        profissao: user.profissao,
        endereco: user.endereco,
        salario: user.salario,
        empresa: user.empresa,
        numInscricao: user.numInscricao,
        formacaoSuperior: user.formacaoSuperior,
        instituicaoSuperior: user.instituicaoSuperior,
        dataFormacao:
          user.dataFormacao !== "" &&
          user.dataFormacao !== null &&
          user.dataFormacao !== undefined
            ? user.dataFormacao.getDate() +
              1 +
              "/" +
              (user.dataFormacao.getMonth() + 1) +
              "/" +
              user.dataFormacao.getFullYear()
            : "",
        numRegistroConselho: user.numRegistroConselho,
        dataRegistroConselho:
          user.dataRegistroConselho !== "" &&
          user.dataRegistroConselho !== null &&
          user.dataRegistroConselho !== undefined
            ? user.dataRegistroConselho.getDate() +
              1 +
              "/" +
              (user.dataRegistroConselho.getMonth() + 1) +
              "/" +
              user.dataRegistroConselho.getFullYear()
            : "",
      };
      return res.status(HTTP_CODE_OK).json(dataPage);
    }
  },

  async setPassword(req, res) {
    const { password, cpf } = req.body;

    let user = await User.findOne({ cpf });

    if (!user) {
      return res
        .status(HTTP_CODE_NOT_FOUND)
        .json({ message: "Perfil não encontrado." });
    }

    if (user._id.equals(req.userId)) {
      user = await User.findByIdAndUpdate(user._id, {
        password: password !== undefined ? password : user.password,
      });

      let response = {
        message: "Senha alterada com sucesso.",
      };
      return res.status(HTTP_CODE_OK).json(response);
    }
    return res
      .status(HTTP_CODE_UNAUTHORIZED)
      .json({ message: "Usuário não tem permissão." });
  },

  async setPerfil(req, res) {
    const urlUser = req.params.urlUser;

    let user = await User.findOne({ urlUser });

    if (!user) {
      return res
        .status(HTTP_CODE_NOT_FOUND)
        .json({ message: "Perfil não encontrado." });
    }

    if (user._id.equals(req.userId) || req.user.admin) {
      let {
        name,
        email,
        telefone,
        nascimento,
        rg,
        filiacao,
        endereco,
        regional,
        numInscricao,
        dataAfiliacao,
        formacaoSuperior,
        instituicaoSuperior,
        dataFormacao,
        numRegistroConselho,
        dataRegistroConselho,
        empresa,
        salario,
        password,
        profissao,
      } = req.body;

      if (
        nascimento !== undefined &&
        nascimento !== "" &&
        nascimento !== null
      ) {
        nascimento = nascimento.split("/");
        nascimento = new Date(
          `${nascimento[2]}-${nascimento[1]}-${nascimento[0]}T01:00:00+01:00`
        );
      }
      if (
        dataAfiliacao !== undefined &&
        dataAfiliacao !== "" &&
        dataAfiliacao !== null
      ) {
        dataAfiliacao = dataAfiliacao.split("/");
        dataAfiliacao = new Date(
          `${dataAfiliacao[2]}-${dataAfiliacao[1]}-${dataAfiliacao[0]}T01:00:00+01:00`
        );
      }
      if (
        dataFormacao !== undefined &&
        dataFormacao !== "" &&
        dataFormacao !== null
      ) {
        dataFormacao = dataFormacao.split("/");
        dataFormacao = new Date(
          `${dataFormacao[2]}-${dataFormacao[1]}-${dataFormacao[0]}T01:00:00+01:00`
        );
      }
      if (
        dataRegistroConselho !== undefined &&
        dataRegistroConselho !== "" &&
        dataRegistroConselho !== null
      ) {
        dataRegistroConselho = dataRegistroConselho.split("/");
        dataRegistroConselho = new Date(
          `${dataRegistroConselho[2]}-${dataRegistroConselho[1]}-${dataRegistroConselho[0]}T01:00:00+01:00`
        );
      }

      user = await User.findByIdAndUpdate(user._id, {
        name: name !== undefined && name !== "" ? name : user.name,
        email: email !== undefined && email !== "" ? email : user.email,
        telefone:
          telefone !== undefined && telefone !== "" ? telefone : user.telefone,
        nascimento:
          nascimento !== undefined && nascimento !== ""
            ? nascimento
            : user.nascimento,
        rg: rg !== undefined && rg !== "" ? rg : user.rg,
        filiacao:
          filiacao !== undefined && filiacao !== "" ? filiacao : user.filiacao,
        numInscricao:
          numInscricao !== undefined && numInscricao !== ""
            ? numInscricao
            : user.numInscricao,
        dataAfiliacao:
          dataAfiliacao !== undefined && dataAfiliacao !== ""
            ? dataAfiliacao
            : user.dataAfiliacao,
        formacaoSuperior:
          formacaoSuperior !== undefined && formacaoSuperior !== ""
            ? formacaoSuperior
            : user.formacaoSuperior,
        instituicaoSuperior:
          instituicaoSuperior !== undefined && instituicaoSuperior !== ""
            ? instituicaoSuperior
            : user.instituicaoSuperior,
        dataFormacao:
          dataFormacao !== undefined && dataFormacao !== ""
            ? dataFormacao
            : user.dataFormacao,
        numRegistroConselho:
          numRegistroConselho !== undefined && numRegistroConselho !== ""
            ? numRegistroConselho
            : user.numRegistroConselho,
        dataRegistroConselho:
          dataRegistroConselho !== undefined && dataRegistroConselho !== ""
            ? dataRegistroConselho
            : user.dataRegistroConselho,
        empresa:
          empresa !== undefined && empresa !== "" ? empresa : user.empresa,
        salario:
          salario !== undefined && salario !== "" ? salario : user.salario,
        password:
          password !== undefined && password !== "" ? password : user.password,
        profissao:
          profissao !== undefined && profissao !== ""
            ? profissao
            : user.profissao,
        endereco: {
          rua:
            endereco !== undefined &&
            endereco.rua !== undefined &&
            endereco.rua !== ""
              ? endereco.rua
              : user.endereco.rua,
          bairro:
            endereco !== undefined &&
            endereco.bairro !== undefined &&
            endereco.bairro !== ""
              ? endereco.bairro
              : user.endereco.bairro,
          complemento:
            endereco !== undefined &&
            endereco.complemento !== undefined &&
            endereco.complemento !== ""
              ? endereco.complemento
              : user.endereco.complemento,
          numero:
            endereco !== undefined &&
            endereco.numero !== undefined &&
            endereco.numero !== ""
              ? endereco.numero
              : user.endereco.numero,
        },
        regional: {
          municipio:
            regional !== undefined &&
            regional.municipio !== undefined &&
            regional.municipio !== ""
              ? regional.municipio
              : user.regional.municipio,
          estado:
            regional !== undefined &&
            regional.estado !== undefined &&
            regional.estado !== ""
              ? regional.estado
              : user.regional.estado,
          naturalidade:
            regional !== undefined &&
            regional.naturalidade !== undefined &&
            regional.naturalidade !== ""
              ? regional.naturalidade
              : user.regional.naturalidade,
          nacionalidade:
            regional !== undefined &&
            regional.nacionalidade !== undefined &&
            regional.nacionalidade !== ""
              ? regional.nacionalidade
              : user.regional.nacionalidade,
        },
      });

      return res
        .status(HTTP_CODE_OK)
        .json({ message: "Perfil alterado com sucesso." });
    }
    return res
      .status(HTTP_CODE_UNAUTHORIZED)
      .json({ message: "Usuário não tem permissão." });
  },

  async setUser(req, res) {
    if (req.user.admin) {
      const urlUser = req.params.urlUser;
      let user = await User.findOne({ urlUser });

      if (!user) {
        return res
          .status(HTTP_CODE_NOT_FOUND)
          .json({ message: "Perfil não encontrado." });
      }

      let { email, telefone, filiacao, endereco } = req.body;
      //Corrigir o problema de não estar modificando o valor de endereço.
      user = await User.findByIdAndUpdate(user._id, {
        email: email !== undefined && email !== "" ? email : user.email,
        telefone:
          telefone !== undefined && telefone !== "" ? telefone : user.telefone,
        filiacao:
          filiacao !== undefined && filiacao !== "" ? filiacao : user.filiacao,
        endereco: {
          rua:
            endereco !== undefined &&
            endereco.rua !== undefined &&
            endereco.rua !== ""
              ? endereco.rua
              : user.endereco.rua,
          bairro:
            endereco !== undefined &&
            endereco.bairro !== undefined &&
            endereco.bairro !== ""
              ? endereco.bairro
              : user.endereco.bairro,
          complemento:
            endereco !== undefined &&
            endereco.complemento !== undefined &&
            endereco.complemento !== ""
              ? endereco.complemento
              : user.endereco.complemento,
          numero:
            endereco !== undefined &&
            endereco.numero !== undefined &&
            endereco.numero !== ""
              ? endereco.numero
              : user.endereco.numero,
        },
      });

      return res
        .status(HTTP_CODE_OK)
        .json({ message: "Dados do usuário " + user.name + " atualizados." });
    } else {
      return res.status(HTTP_CODE_UNAUTHORIZED).json({
        message: "Usuário sem permissão para atualizar dados de outro usuário.",
      });
    }
  },

  async setNewAdmin(req, res) {
    if (req.user.admin) {
      const urlUser = req.params.urlUser;
      let user = await User.findOne({ urlUser });

      if (!user) {
        return res
          .status(HTTP_CODE_NOT_FOUND)
          .json({ message: "Perfil não encontrado." });
      }

      user = await User.findByIdAndUpdate(user._id, { admin: true });

      return res
        .status(HTTP_CODE_OK)
        .json({ message: "Usuário " + user.name + ", agora, é admin." });
    } else {
      return res.status(HTTP_CODE_UNAUTHORIZED).json({
        message: "Usuário sem permissão para tornar outro usuário admin.",
      });
    }
  },

  async deleteUser(req, res) {
    if (req.user.admin) {
      const urlUser = req.params.urlUser;
      let user = await User.findOne({ urlUser });

      if (!user) {
        return res
          .status(HTTP_CODE_NOT_FOUND)
          .json({ message: "Perfil não encontrado." });
      }

      user = await User.deleteOne(user)
        .then(async function (deletedUser) {
          if (deletedUser) {
            for (let i = 0; i < user.dependentes.length; i++) {
              await Dependent.findByIdAndDelete(user.dependentes[i]);
            }
            return res.status(HTTP_CODE_OK).json({
              message: `Usuário (${user.name}) deletado com sucesso.`,
            });
          } else {
            return res.status(HTTP_CODE_UNAUTHORIZED).json({
              message: "Usuário sem permissão para deletar outro usuário.",
            });
          }
        })
        .catch((err) => console.error(`Falha ao buscar e deletar: ${err}`));
    } else {
      return res
        .status(HTTP_CODE_UNAUTHORIZED)
        .json({ message: "Usuário sem permissão para deletar outro usuário." });
    }
  },

  async getUsers(req, res) {
    if (req.user.admin) {
      let users = await User.find();
      let usersDTO = [];

      users.forEach((user) => {
        usersDTO.push({
          name: user.name !== "" ? user.name : "",
          nascimento:
            user.nascimento !== "" &&
            user.nascimento !== null &&
            user.nascimento !== undefined
              ? user.nascimento.getDate() +
                1 +
                "/" +
                (user.nascimento.getMonth() + 1) +
                "/" +
                user.nascimento.getFullYear()
              : "",
          cpf: user.cpf !== "" ? user.cpf : "",
          rg:
            user.rg !== "" && user.rg !== null && user.rg !== undefined
              ? user.rg
              : "",
          urlUser: user.urlUser !== "" ? user.urlUser : "",
          emissao:
            user.emissao !== "" &&
            user.emissao !== null &&
            user.emissao !== undefined
              ? user.emissao.getDate() +
                1 +
                "/" +
                (user.emissao.getMonth() + 1) +
                "/" +
                user.emissao.getFullYear()
              : "",
        });
      });

      function compare(a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      }

      usersDTO.sort(compare);

      return res.status(HTTP_CODE_OK).json(usersDTO);
    } else {
      return res.status(HTTP_CODE_UNAUTHORIZED).json({
        message: "Usuário sem permissão de visualizar os assessores.",
      });
    }
  },

  async getPDF(req, res) {
    const urlUser = req.params.urlUser;
    let user = await User.findOne({ urlUser });

    if (!user) {
      return res
        .status(HTTP_CODE_NOT_FOUND)
        .json({ message: "Perfil não encontrado." });
    } else {
      if (req.user.admin || user._id.equals(req.userId)) {
        let impRendaDeps = [];
        let dep;
        let depDTO;

        let impostosDoUser = await Imposto.find({ idUser: user._id });
        for (let i = 0; i < impostosDoUser.length; i++) {
          if (impostosDoUser[i].ano === +req.params.ano) {
            var impostoAtualUser = await Imposto.find({
              idUser: user.id,
              ano: +req.params.ano,
            });
            break;
          }
        }

        if (impostoAtualUser === undefined) {
          return res
            .status(HTTP_CODE_BAD_REQUEST)
            .json({ message: "Imposto do ano inserido não existe " });
        }

        for (let i = 0; i < user.dependentes.length; i++) {
          dep = await Dependent.findById(user.dependentes[i]);

          if (!!dep) {
            let impostosDoDependente = await Imposto.find({ idUser: dep._id });

            for (let j = 0; j < impostosDoDependente.length; j++) {
              if (impostosDoDependente[j].ano === +req.params.ano) {
                var impostoAtualDependente = await Imposto.find({
                  idUser: dep.id,
                  ano: +req.params.ano,
                });
                break;
              }
            }
            depDTO = {
              name: dep.name,
              cfp: dep.cpf,
              impostoDeRenda: impostoAtualDependente,
            };
            impRendaDeps.push(depDTO);
          }
        }

        function compare(a, b) {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        }

        impRendaDeps.sort(compare);

        return res.status(HTTP_CODE_OK).json({
          name: user.name,
          cpf: user.cpf,
          impostoDeRenda:
            impostoAtualUser.length !== 0 ? impostoAtualUser[0] : {},
          dependentes: impRendaDeps,
        });
      } else {
        return res.status(HTTP_CODE_UNAUTHORIZED).json({
          message: "Usuário sem permissão para baixar esse imposto de renda.",
        });
      }
    }
  },

  async getUserYears(req, res) {
    const urlUser = req.params.urlUser;
    let user = await User.findOne({ urlUser });

    if (!user) {
      return res
        .status(HTTP_CODE_NOT_FOUND)
        .json({ message: "Perfil não encontrado." });
    }

    let impostos = await Imposto.find({ idUser: user._id });

    let anos = [];

    for (var i = 0; i < impostos.length; i++) {
      anos.push(impostos[i].ano);
    }
    return res.status(HTTP_CODE_OK).json({ anosUsuario: anos });
  },

  async createNewImpostoByYearDep(req, res) {
    if (req.user.admin) {
      const urlUser = req.params.urlUser;
      let user = await User.findOne({ urlUser });
      if (!user) {
        return res
          .status(HTTP_CODE_NOT_FOUND)
          .json({ message: "Perfil não encontrado." });
      }

      const urlDep = req.params.urlDep;
      let dep = await Dependent.findOne({ urlDep });

      if (!dep) {
        return res
          .status(HTTP_CODE_NOT_FOUND)
          .json({ message: "Dependente não encontrado." });
      }

      let impostos = await Imposto.find({ idUser: dep._id });

      for (let i = 0; i < impostos.length; i++) {
        if (impostos[i].ano === +req.params.ano) {
          return res
            .status(HTTP_CODE_BAD_REQUEST)
            .json({ message: "Imposto com o ano selecionado já existente" });
        }
      }

      let imposto = await Imposto.create({
        idUser: dep._id,
        ano: req.params.ano,
      });

      user = await User.findByIdAndUpdate(dep._id, {
        impostoDeRenda: imposto._id,
      });

      return res.status(HTTP_CODE_CREATED).json({ message: "Imposto criado" });
    } else {
      return res.status(HTTP_CODE_UNAUTHORIZED).json({
        message: "Usuário sem permissão para atualizar imposto de renda.",
      });
    }
  },
};
