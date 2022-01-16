const User = require('../model/User');
const Dependent = require('../model/Dependent');
const jwt = require('jsonwebtoken');

const HTTP_CODE_OK = 200;
const HTTP_CODE_CREATED = 201;
const HTTP_CODE_BAD_REQUEST = 400;
const HTTP_CODE_UNAUTHORIZED = 401;
const HTTP_CODE_NOT_FOUND = 404;

const UserController = {
    async store(req, res) {
        const { name, email, password, telefone,
          nascimento, cpf, rg, emissao, filiacao,
          profissao, endereco, regional, numInscricao,
          dataFiliacao, formacaoSuperior, instituicaoSuperior,
          dataFormacao, numRegistroConselho, dataRegistroConselho,
          empresa, salario } = req.body;

        if (name === undefined || email === undefined ||
            password === undefined || telefone === undefined ||
            nascimento === undefined || cpf === undefined ||
            rg === undefined || emissao === undefined ||
            filiacao === undefined || profissao === undefined ||
            endereco.rua === undefined || endereco.bairro === undefined ||
            regional.municipio === undefined || regional.estado === undefined ||
            regional.naturalidade === undefined || regional.nacionalidade === undefined ||
            numInscricao === undefined || dataFiliacao === undefined ||
            formacaoSuperior === undefined || instituicaoSuperior === undefined ||
            dataFormacao === undefined || numRegistroConselho === undefined ||
            dataRegistroConselho === undefined || empresa === undefined ||
            salario === undefined) {
              return res.status(HTTP_CODE_BAD_REQUEST).json({ message: 'Preencha todos os campos.' });
            }

        let user = await User.findOne({ cpf });

        if (!user) {
            var temporalUrl = name.replace(/\s/g, '').toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, "");

            let urlUser = temporalUrl;
            let urlUnavailable = true;

            while (urlUnavailable) {
                let userWithThisURL = await User.findOne({ urlUser });

                if (!userWithThisURL) {
                    urlUnavailable = false;
                } else {
                    urlUser = temporalUrl;
                    let randonNum = Math.floor(Math.random() * 1001);
                    urlUser = temporalUrl + randonNum.toString();
                }
            }

            try {
              user = await User.create({
                  name, email, password,
                  telefone, nascimento,
                  cpf, rg,
                  emissao, filiacao,
                  profissao,
                  endereco, regional,
                  numInscricao, dataFiliacao,
                  formacaoSuperior, instituicaoSuperior, dataFormacao,
                  numRegistroConselho, dataRegistroConselho,
                  empresa, salario,
                  urlUser
              });
            } catch (e) {
              if ((e.hasOwnProperty('code')) && e.code === 11000) {
                return res.status(HTTP_CODE_BAD_REQUEST).json({ message: "Valor de " + Object.keys(e.keyValue)[0] + " já cadastrado." });
              } else {
                return res.status(HTTP_CODE_BAD_REQUEST).json({ message: e.message });
              }
            }

            return res.status(HTTP_CODE_CREATED).json({ message: 'Usuário cadastrado com sucesso.' });
        } else {
            return res.status(HTTP_CODE_BAD_REQUEST).json({ message: 'CPF já cadastrado.' });
        }
    },

    async login(req, res) {
        const { cpf, password } = req.body;
    
        if (cpf === undefined ||
          password === undefined) return res.status(HTTP_CODE_BAD_REQUEST).json({ message: 'Preencha todos os campos.' });
    
        let user = await User.findOne({ cpf });
    
        if (!user) {
          return res.status(HTTP_CODE_UNAUTHORIZED).json({ message: 'CPF não cadastrado' });
        } else {
          if (user.password === password) {
            let idUser = user._id;
            const token = jwt.sign({ idUser }, process.env.JWT_SECRET, {
              expiresIn: 60 * 60 * 24 // expires in 24 hours
            });
      
            let new_token_list = user.token_list;
            new_token_list.push(token);
            user = await User.findByIdAndUpdate(user._id, {
              token_list: new_token_list
            });
    
            let response = {
              auth: true,
              token: `Bearer ` + token,
    
              name: user.name,
              urlUser: user.urlUser
            }
      
            return res.status(HTTP_CODE_OK).json( response );
          } else {
            return res.status(HTTP_CODE_UNAUTHORIZED).json({ message: 'Senha inválida' });
          }
        }
      },

      async logout(req, res) {
        let user = req.user;
        new_token_list = user.token_list.remove(req.token);
    
        user = await User.findByIdAndUpdate(user._id, {
          token_list: new_token_list
        });
    
        return res.status(HTTP_CODE_OK).json({message: 'User has logout.' });
      },

      async userPage(req, res) {
        const urlUser = req.params.urlUser;
    
        let user = await User.findOne({ urlUser });
    
        if (!user) {
          return res.status(HTTP_CODE_NOT_FOUND).json({ message: 'Perfil não encontrado.' });
        } else {
    
          
          dataPage = {
            name: user.name,
            email: user.email,
            telefone: user.telefone,
            nascimento: ((user.nascimento.getDate() )) + "/" + ((user.nascimento.getMonth() + 1)) + "/" + user.nascimento.getFullYear(),
            cpf: user.cpf,
            rg: user.rg,
            emissao: ((user.emissao.getDate() )) + "/" + ((user.emissao.getMonth() + 1)) + "/" + user.emissao.getFullYear(),
            filiacao: user.filiacao,
            dataFiliacao: ((user.dataFiliacao.getDate() )) + "/" + ((user.dataFiliacao.getMonth() + 1)) + "/" + user.dataFiliacao.getFullYear(),
            profissao: user.profissao,
            endereco: user.endereco,
            salario: user.salario,
            empresa: user.empresa,
            numInscricao: user.numInscricao,
            urlUser: user.urlUser
          }
    
          return res.status(HTTP_CODE_OK).json(dataPage);
        }
      },
      
      async setPassword(req, res) {
        const { password, cpf } = req.body;
    
        let user = await User.findOne({ cpf });
    
        if (!user) {
          return res.status(HTTP_CODE_NOT_FOUND).json({ message: 'Perfil não encontrado.' });
        }
    
        if (user._id.equals(req.userId)) {
    
          user = await User.findByIdAndUpdate(user._id, {
            password: (password !== undefined) ? password : user.password
          })
    
          user = await User.findOne({ cpf });
          let response = {    
            message: 'Senha alterada com sucesso.'
          }
          return res.status(HTTP_CODE_OK).json( response );
        }
        return res.status(HTTP_CODE_UNAUTHORIZED).json({ message: 'Usuário não tem permissão.' });
      },

      async setPerfil(req, res) {          
        const urlUser = req.params.urlUser;
    
        let user = await User.findOne({ urlUser });
    
        if (!user) {
          return res.status(HTTP_CODE_NOT_FOUND).json({ message: 'Perfil não encontrado.' });
        }
    
        if (user._id.equals(req.userId)) {
          const newUserData = { 
            name,
            email,
            telefone,
            nascimento,
            rg,
            filiacao,
            endereco, regional,
            numInscricao, dataFiliacao,
            formacaoSuperior, instituicaoSuperior, dataFormacao,
            numRegistroConselho, dataRegistroConselho,
            empresa, salario,
            urlUser
            } = req.body;
    
          user = await User.findByIdAndUpdate(user._id, {
            name: (newUserData.name !== undefined) ? newUserData.name : user.name,
            email: (newUserData.email !== undefined) ? newUserData.email : user.email,
            telefone: (newUserData.telefone !== undefined) ? newUserData.telefone : user.telefone,
            nascimento: (newUserData.nascimento !== undefined) ? newUserData.nascimento : user.nascimento,
            rg: (newUserData.rg !== undefined) ? newUserData.rg : user.rg,
            filiacao: (newUserData.filiacao !== undefined) ? newUserData.filiacao : user.filiacao,
            endereco: (newUserData.filiacao !== undefined) ? newUserData.filiacao : user.filiacao,
            regional: (newUserData.filiacao !== undefined) ? newUserData.filiacao : user.filiacao,
            numInscricao: (newUserData.numInscricao !== undefined) ? newUserData.numInscricao : user.numInscricao,
            dataFiliacao: (newUserData.dataFiliacao !== undefined) ? newUserData.dataFiliacao : user.dataFiliacao,
            formacaoSuperior: (newUserData.formacaoSuperior !== undefined) ? newUserData.formacaoSuperior : user.formacaoSuperior,
            instituicaoSuperior: (newUserData.instituicaoSuperior !== undefined) ? newUserData.instituicaoSuperior : user.instituicaoSuperior,
            dataFormacao: (newUserData.dataFormacao !== undefined) ? newUserData.dataFormacao : user.dataFormacao,
            numRegistroConselho: (newUserData.numRegistroConselho !== undefined) ? newUserData.numRegistroConselho : user.numRegistroConselho,
            dataRegistroConselho: (newUserData.dataRegistroConselho !== undefined) ? newUserData.dataRegistroConselho : user.dataRegistroConselho,
            empresa: (newUserData.empresa !== undefined) ? newUserData.empresa : user.empresa,
            salario: (newUserData.salario !== undefined) ? newUserData.salario : user.salario,
            urlUser: (newUserData.urlUser !== undefined) ? newUserData.urlUser : user.urlUser,
          })
          
          return res.status(HTTP_CODE_OK).json( { message: 'Perfil alterado com sucesso.' } );
        }
        return res.status(HTTP_CODE_UNAUTHORIZED).json({ message: 'Usuário não tem permissão.' });
      },

      async setUser(req, res) {
        if (req.user.admin) {
          const urlUser = req.params.urlUser;
          let user = await User.findOne({ urlUser });
    
          if (!user) {
            return res.status(HTTP_CODE_NOT_FOUND).json({ message: 'Perfil não encontrado.' });
          }
      
          const newUserData = { 
            email,
            telefone,
            filiacao,
            rua,
            bairro,
            complemento,
            numero
            } = req.body;
    
          user = await User.findByIdAndUpdate(user._id, {
            email: (newUserData.email !== undefined) ? newUserData.email : user.email,
            telefone: (newUserData.telefone !== undefined) ? newUserData.telefone : user.telefone,
            filiacao: (newUserData.filiacao !== undefined) ? newUserData.filiacao : user.filiacao,
            rua: (newUserData.rua !== undefined) ? newUserData.rua : user.rua,
            bairro: (newUserData.bairro !== undefined) ? newUserData.bairro : user.bairro,
            complemento: (newUserData.complemento !== undefined) ? newUserData.complemento : user.complemento,
            numero: (newUserData.numero !== undefined) ? newUserData.numero : user.numero,
          })

          return res.status(HTTP_CODE_OK).json( { message: 'Dados do usuário ' + user.name + ' atualizados.' } );
        } else {
          return res.status(HTTP_CODE_UNAUTHORIZED).json({ message: 'Usuário sem permissão para atualizar dados de outro usuário.' });
        }
      },

      async setNewAdmin(req, res) {
        if (req.user.admin) {
          const urlUser = req.params.urlUser;
          let user = await User.findOne({ urlUser });
      
          if (!user) {
            return res.status(HTTP_CODE_NOT_FOUND).json({ message: 'Perfil não encontrado.' });
          }
    
          user = await User.findByIdAndUpdate(user._id, { admin: true })

          return res.status(HTTP_CODE_OK).json( { message: 'Usuário ' + user.name + ', agora, é admin.' } );
        } else {
          return res.status(HTTP_CODE_UNAUTHORIZED).json({ message: 'Usuário sem permissão para tornar outro usuário admin.' });
        }
      },

      async deleteUser(req, res) {
        if (req.user.admin) {
          const urlUser = req.params.urlUser;
          let user = await User.findOne({ urlUser });
      
          if (!user) {
            return res.status(HTTP_CODE_NOT_FOUND).json({ message: 'Perfil não encontrado.' });
          }
    
          user = await User.deleteOne(user)
          .then(deletedUser => {
            if(deletedUser) {
              return res.status(HTTP_CODE_OK).json( { message: `Usuário (${user.name}) deletado com sucesso.` } );
            } else {
              return res.status(HTTP_CODE_UNAUTHORIZED).json({ message: 'Usuário sem permissão para deletar outro usuário.' });
            }
          })
          .catch(err => console.error(`Falha ao buscar e deletar: ${err}`))
        } else {
          return res.status(HTTP_CODE_UNAUTHORIZED).json({ message: 'Usuário sem permissão para deletar outro usuário.' });
        }
      },

      async signUpDep(req, res) {
        const urlUser = req.params.urlUser;
    
        let user = await User.findOne({ urlUser });
    
        if (!user) {
          return res.status(HTTP_CODE_NOT_FOUND).json({ message: 'Perfil não encontrado.' });
        }

        const { name, nascimento, cpf, rg, emissao} = req.body;

        if (name === undefined || nascimento === undefined || cpf === undefined
            || rg === undefined || emissao === undefined) {
          return res.status(HTTP_CODE_BAD_REQUEST).json({ message: 'Preencha todos os campos.' });
        }

        if (user._id.equals(req.userId)) {
          let dependent;
          try {
            dependent = await Dependent.create({
                name,
                nascimento,
                cpf,
                rg,
                emissao,
                idAssociado: req.userId
            });
          } catch (e) {
            if ((e.hasOwnProperty('code')) && e.code === 11000) {
              return res.status(HTTP_CODE_BAD_REQUEST).json({ message: "Valor de " + Object.keys(e.keyValue)[0] + " já cadastrado." });
            } else {
              return res.status(HTTP_CODE_BAD_REQUEST).json({ message: e.message });
            }
          }

          try {
            let dependentes = user.dependentes.concat(`${dependent._id}`)
            user = await User.findByIdAndUpdate(user._id, {
              dependentes
            })
          } catch (e) {
            if ((e.hasOwnProperty('code')) && e.code === 11000) {
              return res.status(HTTP_CODE_BAD_REQUEST).json({ message: "Valor de " + Object.keys(e.keyValue)[0] + " já cadastrado." });
            } else {
              return res.status(HTTP_CODE_BAD_REQUEST).json({ message: e.message });
            }
          }
          
          return res.status(HTTP_CODE_OK).json( { message: 'Dependente cadastrado com sucesso.' } );
        }
        return res.status(HTTP_CODE_UNAUTHORIZED).json({ message: 'Usuário não tem permissão.' });
      },

      async getUsers(req, res) {
        let users = await User.find();
        let usersDTO = [];

        users.forEach(user => {
          usersDTO.push({
            name: user.name,
            nascimento: user.nascimento,
            cpf: user.cpf,
            rg: user.rg,
            emissao: user.emissao,
          })
        })

        return res.status(HTTP_CODE_OK).json(usersDTO);
      },

      async getDependents(req, res) {
        const urlUser = req.params.urlUser;
    
        let user = await User.findOne({ urlUser });
    
        if (!user) {
          return res.status(HTTP_CODE_NOT_FOUND).json({ message: 'Perfil não encontrado.' });
        } else {
    
          let dependentes = user.dependentes;
          let dependetesDTO = [];

          let dep;
          let _id;

          for (var i = 0; i < dependentes.length ; i++) {
            _id = dependentes[i];
            dep = await Dependent.findById({ _id });

            if (!(!dep)) {
              dependetesDTO.push({
                name: dep.name,
                cpf: dep.cpf
              })
            }
          }
          return res.status(HTTP_CODE_OK).json(dependetesDTO);
        }
      }
};

module.exports = UserController;