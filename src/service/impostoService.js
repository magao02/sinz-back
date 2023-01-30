const User = require("../model/User");
const Dependent = require("../model/Dependent");
const Imposto = require("../model/Imposto");
const jwt = require("jsonwebtoken");
const createURL = require("../utils/createURL.js");
const { findById, db, collection } = require("../model/Imposto");

const impostoService = {
  async createNewImpostoByYearUser(req, res) {
    const urlUser = req.params.urlUser;
    let user = await User.findOne({ urlUser });

    if (!user) {
      return res
        .status(HTTP_CODE_NOT_FOUND)
        .json({ message: "Perfil não encontrado " });
    }

    let impostos = await Imposto.find({ idUser: user._id });

    for (let i = 0; i < impostos.length; i++) {
      if (impostos[i].ano === +req.params.ano) {
        return res
          .status(HTTP_CODE_BAD_REQUEST)
          .json({ message: "Imposto com o ano selecionado já existente" });
      }
    }

    let imposto = await Imposto.create({
      idUser: user._id,
      ano: req.params.ano,
    });

    user = await User.findByIdAndUpdate(user._id, {
      impostoDeRenda: imposto._id,
    });

    return res.status(HTTP_CODE_CREATED).json({ message: "Imposto criado" });
  },

  async setImpostoDeRenda(req, res) {
    if (req.user.admin) {
      const urlUser = req.params.urlUser;
      let user = await User.findOne({ urlUser });

      if (!user) {
        return res
          .status(HTTP_CODE_NOT_FOUND)
          .json({ message: "Perfil não encontrado." });
      }

      let impostoDeRenda = req.body;
      let impostos = await Imposto.find({ idUser: user._id });

      //Seleciona o imposto do ano correto.
      for (var i = 0; i < impostos.length; i++) {
        if (impostos[i].ano === +req.params.ano) {
          var antigoImposto = await Imposto.find({
            idUser: user.id,
            ano: +req.params.ano,
          });
          break;
        }
      }

      if (antigoImposto === undefined || antigoImposto.length === 0) {
        return res
          .status(HTTP_CODE_BAD_REQUEST)
          .json({ message: "Imposto do ano inserido não existe " });
      }

      antigoImposto = antigoImposto[0];

      const novoImposto = await Imposto.updateOne(
        { idUser: user.id, ano: +req.params.ano },
        {
          $set: {
            janeiro:
              impostoDeRenda.janeiro !== undefined &&
              impostoDeRenda.janeiro !== null &&
              impostoDeRenda.janeiro !== "" &&
              impostoDeRenda.janeiro !== 0
                ? impostoDeRenda.janeiro
                : antigoImposto.janeiro,
            fevereiro:
              impostoDeRenda.fevereiro !== undefined &&
              impostoDeRenda.fevereiro !== null &&
              impostoDeRenda.fevereiro !== "" &&
              impostoDeRenda.fevereiro !== 0
                ? impostoDeRenda.fevereiro
                : antigoImposto.fevereiro,
            marco:
              impostoDeRenda.marco !== undefined &&
              impostoDeRenda.marco !== null &&
              impostoDeRenda.marco !== "" &&
              impostoDeRenda.marco !== 0
                ? impostoDeRenda.marco
                : antigoImposto.marco,
            abril:
              impostoDeRenda.abril !== undefined &&
              impostoDeRenda.abril !== null &&
              impostoDeRenda.abril !== "" &&
              impostoDeRenda.abril !== 0
                ? impostoDeRenda.abril
                : antigoImposto.abril,
            maio:
              impostoDeRenda.maio !== undefined &&
              impostoDeRenda.maio !== null &&
              impostoDeRenda.maio !== "" &&
              impostoDeRenda.maio !== 0
                ? impostoDeRenda.maio
                : antigoImposto.maio,
            junho:
              impostoDeRenda.junho !== undefined &&
              impostoDeRenda.junho !== null &&
              impostoDeRenda.junho !== "" &&
              impostoDeRenda.junho !== 0
                ? impostoDeRenda.junho
                : antigoImposto.junho,
            julho:
              impostoDeRenda.julho !== undefined &&
              impostoDeRenda.julho !== null &&
              impostoDeRenda.julho !== "" &&
              impostoDeRenda.julho !== 0
                ? impostoDeRenda.julho
                : antigoImposto.julho,
            agosto:
              impostoDeRenda.agosto !== undefined &&
              impostoDeRenda.agosto !== null &&
              impostoDeRenda.agosto !== "" &&
              impostoDeRenda.agosto !== 0
                ? impostoDeRenda.agosto
                : antigoImposto.agosto,
            setembro:
              impostoDeRenda.setembro !== undefined &&
              impostoDeRenda.setembro !== null &&
              impostoDeRenda.setembro !== "" &&
              impostoDeRenda.setembro !== 0
                ? impostoDeRenda.setembro
                : antigoImposto.setembro,
            outubro:
              impostoDeRenda.outubro !== undefined &&
              impostoDeRenda.outubro !== null &&
              impostoDeRenda.outubro !== "" &&
              impostoDeRenda.outubro !== 0
                ? impostoDeRenda.outubro
                : antigoImposto.outubro,
            novembro:
              impostoDeRenda.novembro !== undefined &&
              impostoDeRenda.novembro !== null &&
              impostoDeRenda.novembro !== "" &&
              impostoDeRenda.novembro !== 0
                ? impostoDeRenda.novembro
                : antigoImposto.novembro,
            dezembro:
              impostoDeRenda.dezembro !== undefined &&
              impostoDeRenda.dezembro !== null &&
              impostoDeRenda.dezembro !== "" &&
              impostoDeRenda.dezembro !== 0
                ? impostoDeRenda.dezembro
                : antigoImposto.dezembro,
          },
        }
      );
      return res
        .status(HTTP_CODE_OK)
        .json({ message: "Imposto de Renda atualizado." });
    } else {
      return res.status(HTTP_CODE_UNAUTHORIZED).json({
        message: "Usuário sem permissão para atualizar imposto de renda.",
      });
    }
  },

  async setImpostoDeRendaDep(req, res) {
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
      let impostoDeRenda = req.body.impostoDeRenda;
      let impostos = await Imposto.find({ idUser: dep._id });

      //Seleciona o imposto do ano correto.
      for (var i = 0; i < impostos.length; i++) {
        if (impostos[i].ano === +req.params.ano) {
          var antigoImposto = await Imposto.find({ idUser: dep.id });
          break;
        }
      }

      if (antigoImposto === undefined || antigoImposto.length === 0) {
        return res
          .status(HTTP_CODE_BAD_REQUEST)
          .json({ message: "Imposto do ano inserido não existe " });
      }

      antigoImposto = antigoImposto[0];

      const novoImposto = await Imposto.updateOne(
        { idUser: dep.id, ano: +req.params.ano },
        {
          $set: {
            janeiro:
              impostoDeRenda.janeiro !== undefined &&
              impostoDeRenda.janeiro !== null &&
              impostoDeRenda.janeiro !== "" &&
              impostoDeRenda.janeiro !== 0
                ? impostoDeRenda.janeiro
                : antigoImposto.janeiro,
            fevereiro:
              impostoDeRenda.fevereiro !== undefined &&
              impostoDeRenda.fevereiro !== null &&
              impostoDeRenda.fevereiro !== "" &&
              impostoDeRenda.fevereiro !== 0
                ? impostoDeRenda.fevereiro
                : antigoImposto.fevereiro,
            marco:
              impostoDeRenda.marco !== undefined &&
              impostoDeRenda.marco !== null &&
              impostoDeRenda.marco !== "" &&
              impostoDeRenda.marco !== 0
                ? impostoDeRenda.marco
                : antigoImposto.marco,
            abril:
              impostoDeRenda.abril !== undefined &&
              impostoDeRenda.abril !== null &&
              impostoDeRenda.abril !== "" &&
              impostoDeRenda.abril !== 0
                ? impostoDeRenda.abril
                : antigoImposto.abril,
            maio:
              impostoDeRenda.maio !== undefined &&
              impostoDeRenda.maio !== null &&
              impostoDeRenda.maio !== "" &&
              impostoDeRenda.maio !== 0
                ? impostoDeRenda.maio
                : antigoImposto.maio,
            junho:
              impostoDeRenda.junho !== undefined &&
              impostoDeRenda.junho !== null &&
              impostoDeRenda.junho !== "" &&
              impostoDeRenda.junho !== 0
                ? impostoDeRenda.junho
                : antigoImposto.junho,
            julho:
              impostoDeRenda.julho !== undefined &&
              impostoDeRenda.julho !== null &&
              impostoDeRenda.julho !== "" &&
              impostoDeRenda.julho !== 0
                ? impostoDeRenda.julho
                : antigoImposto.julho,
            agosto:
              impostoDeRenda.agosto !== undefined &&
              impostoDeRenda.agosto !== null &&
              impostoDeRenda.agosto !== "" &&
              impostoDeRenda.agosto !== 0
                ? impostoDeRenda.agosto
                : antigoImposto.agosto,
            setembro:
              impostoDeRenda.setembro !== undefined &&
              impostoDeRenda.setembro !== null &&
              impostoDeRenda.setembro !== "" &&
              impostoDeRenda.setembro !== 0
                ? impostoDeRenda.setembro
                : antigoImposto.setembro,
            outubro:
              impostoDeRenda.outubro !== undefined &&
              impostoDeRenda.outubro !== null &&
              impostoDeRenda.outubro !== "" &&
              impostoDeRenda.outubro !== 0
                ? impostoDeRenda.outubro
                : antigoImposto.outubro,
            novembro:
              impostoDeRenda.novembro !== undefined &&
              impostoDeRenda.novembro !== null &&
              impostoDeRenda.novembro !== "" &&
              impostoDeRenda.novembro !== 0
                ? impostoDeRenda.novembro
                : antigoImposto.novembro,
            dezembro:
              impostoDeRenda.dezembro !== undefined &&
              impostoDeRenda.dezembro !== null &&
              impostoDeRenda.dezembro !== "" &&
              impostoDeRenda.dezembro !== 0
                ? impostoDeRenda.dezembro
                : antigoImposto.dezembro,
          },
        }
      );

      return res
        .status(HTTP_CODE_OK)
        .json({ message: "Imposto de Renda atualizado." });
    } else {
      return res.status(HTTP_CODE_UNAUTHORIZED).json({
        message: "Usuário sem permissão para atualizar imposto de renda.",
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

  async addImpostos() {
    let users = await User.find();
    let deps = await Dependent.find();

    /* Add pros associados */
    for (let i = 0; i < users.length; i++) {
      let user = users[i];

      let impostoFinal = user.impostoDeRenda[0];
      impostoFinal.ano = 2022;

      let idUser = user._id;
      await Imposto.create({
        ano: impostoFinal.ano,
        idUser: idUser,
        janeiro: impostoFinal.janeiro,
        fevereiro: impostoFinal.fevereiro,
        marco: impostoFinal.marco,
        abril: impostoFinal.abril,
        maio: impostoFinal.maio,
        junho: impostoFinal.junho,
        julho: impostoFinal.julho,
        agosto: impostoFinal.agosto,
        setembro: impostoFinal.setembro,
        outubro: impostoFinal.outubro,
        novembro: impostoFinal.novembro,
        dezembro: impostoFinal.dezembro,
      });
    }

    /* Add pros dependentes */
    for (let i = 0; i < deps.length; i++) {
      let dep = deps[i];

      let impostoFinal = dep.impostoDeRenda[0];
      impostoFinal.ano = 2022;

      let idUser = dep._id;
      let impostoTemp = await Imposto.create({
        ano: impostoFinal.ano,
        idUser: idUser,
        janeiro: impostoFinal.janeiro,
        fevereiro: impostoFinal.fevereiro,
        marco: impostoFinal.marco,
        abril: impostoFinal.abril,
        maio: impostoFinal.maio,
        junho: impostoFinal.junho,
        julho: impostoFinal.julho,
        agosto: impostoFinal.agosto,
        setembro: impostoFinal.setembro,
        outubro: impostoFinal.outubro,
        novembro: impostoFinal.novembro,
        dezembro: impostoFinal.dezembro,
      });
    }
    return;
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
