const User = require("../model/User");
const Dependent = require("../model/Dependent");
const Imposto = require("../model/Imposto");
const jwt = require("jsonwebtoken");
const createURL = require("../utils/createURL.js");
const { findById, db, collection } = require("../model/Imposto");

const dependenteService = {
  async signUpDep(req, res) {
    const urlUser = req.params.urlUser;

    let user = await User.findOne({ urlUser });

    if (!user) {
      return res
        .status(HTTP_CODE_NOT_FOUND)
        .json({ message: "Perfil não encontrado." });
    }

    let { name, nascimento, cpf, rg, emissao } = req.body;

    if (name === undefined) {
      return res
        .status(HTTP_CODE_BAD_REQUEST)
        .json({ message: "Preencha o campo de nome do Dependente." });
    }

    if (req.user.admin || user._id.equals(req.userId)) {
      var temporalUrl = name
        .replace(/\s/g, "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      let urlDep = temporalUrl;
      let urlUnavailable = true;

      while (urlUnavailable) {
        let depWithThisURL = await Dependent.findOne({ urlDep });

        if (!depWithThisURL) {
          urlUnavailable = false;
        } else {
          urlDep = temporalUrl;
          let randonNum = Math.floor(Math.random() * 1001);
          urlDep = temporalUrl + randonNum.toString();
        }
      }

      // Modificando formato de datas

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

      let dependent;
      try {
        dependent = await Dependent.create({
          name,
          nascimento,
          cpf,
          rg,
          emissao,
          urlDep,
          idAssociado: req.userId,
        });

        let impostosUser = await Imposto.find({ idUser: user._id });

        for (let i = 0; i < impostosUser.length; i++) {
          let impostoDependente = await Imposto.create({
            idUser: dependent.id,
            ano: impostosUser[i].ano,
          });
          dependent = await Dependent.findByIdAndUpdate(dependent.id, {
            impostoDeRenda: impostoDependente._id,
          });
        }
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

      try {
        let dependentes = user.dependentes.concat(`${dependent._id}`);
        user = await User.findByIdAndUpdate(user._id, {
          dependentes,
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
        .status(HTTP_CODE_OK)
        .json({ message: "Dependente cadastrado com sucesso." });
    }
    return res
      .status(HTTP_CODE_UNAUTHORIZED)
      .json({ message: "Usuário não tem permissão." });
  },

  async deleteDep(req, res) {
    const urlDep = req.params.urlDep;

    let dep = await Dependent.findOne({ urlDep });

    let user = req.user;

    if (!dep) {
      return res
        .status(HTTP_CODE_NOT_FOUND)
        .json({ message: "Dependente não encontrado." });
    } else {
      if (user.dependentes.includes(dep._id)) {
        dep = await Dependent.deleteOne(dep)
          .then(async function (deletedUser) {
            if (deletedUser) {
              let newArrayDeps = user.dependentes.pull(dep._id);

              await User.findByIdAndUpdate(user._id, {
                dependentes: newArrayDeps,
              });

              return res.status(HTTP_CODE_OK).json({
                message: `Dependente (${dep.name}) deletado com sucesso.`,
              });
            } else {
              return res.status(HTTP_CODE_UNAUTHORIZED).json({
                message: "Usuário sem permissão para deletar esse dependente.",
              });
            }
          })
          .catch((err) => console.error(`Falha ao buscar e deletar: ${err}`));
      } else {
        return res.status(HTTP_CODE_UNAUTHORIZED).json({
          message:
            "Esse Dependente não pertence ao usuário que solicitou remoção.",
        });
      }
    }
  },

  async getDependents(req, res) {
    const urlUser = req.params.urlUser;

    let user = await User.findOne({ urlUser });

    if (!user) {
      return res
        .status(HTTP_CODE_NOT_FOUND)
        .json({ message: "Perfil não encontrado." });
    }

    if (user._id.equals(req.userId) || req.user.admin) {
      let dependentes = user.dependentes;
      let dependetesDTO = [];

      let dep;
      let _id;

      for (var i = 0; i < dependentes.length; i++) {
        _id = dependentes[i];
        dep = await Dependent.findById({ _id });

        if (!!dep) {
          dependetesDTO.push({
            name: dep.name,
            cpf: dep.cpf,
            nascimento:
              dep.nascimento !== "" &&
              dep.nascimento !== null &&
              dep.nascimento !== undefined
                ? dep.nascimento.getDate() +
                  "/" +
                  (dep.nascimento.getMonth() + 1) +
                  "/" +
                  dep.nascimento.getFullYear()
                : "",
            rg: dep.rg,
            urlDep: dep.urlDep,
            emissao:
              dep.emissao !== "" &&
              dep.emissao !== null &&
              dep.emissao !== undefined
                ? dep.emissao.getDate() +
                  "/" +
                  (dep.emissao.getMonth() + 1) +
                  "/" +
                  dep.emissao.getFullYear()
                : "",
          });
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

      dependetesDTO.sort(compare);

      return res.status(HTTP_CODE_OK).json(dependetesDTO);
    } else {
      return res.status(HTTP_CODE_UNAUTHORIZED).json({
        message:
          "Usuário sem permissão de visualizar os dependentes desse assessor.",
      });
    }
  },
};
