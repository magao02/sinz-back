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
        let { name, email, password, telefone,
          nascimento, cpf, rg, emissao, filiacao,
          profissao, endereco, regional, numInscricao,
          dataAfiliacao, formacaoSuperior, instituicaoSuperior,
          dataFormacao, numRegistroConselho, dataRegistroConselho,
          empresa, salario } = req.body;

        // Verificações Não Emergenciais
        
        // if (name === undefined || email === undefined ||
        //     password === undefined || telefone === undefined ||
        //     nascimento === undefined || cpf === undefined ||
        //     rg === undefined || emissao === undefined ||
        //     filiacao === undefined || profissao === undefined || endereco === undefined ||
        //     endereco.rua === undefined || endereco.bairro === undefined ||
        //     regional.municipio === undefined || regional.estado === undefined ||
        //     regional.naturalidade === undefined || regional.nacionalidade === undefined ||
        //     numInscricao === undefined || dataAfiliacao === undefined ||
        //     formacaoSuperior === undefined || instituicaoSuperior === undefined ||
        //     dataFormacao === undefined || numRegistroConselho === undefined ||
        //     dataRegistroConselho === undefined || empresa === undefined ||
        //     salario === undefined) {
        //       return res.status(HTTP_CODE_BAD_REQUEST).json({ message: 'Preencha todos os campos.' });
        //     }

        if (name === undefined || cpf === undefined) {
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

            // Estruturação de dados Não Emergenciais

            if (nascimento !== undefined || nascimento !== "" || nascimento !== null) {
              nascimento = nascimento.split('/')
              nascimento = new Date(`${nascimento[2]}-${nascimento[1]}-${nascimento[0]}T01:00:00+01:00`);
            }
            if (emissao !== undefined || emissao !== "" || emissao !== null) {
              emissao = emissao.split('/')
              emissao = new Date(`${emissao[2]}-${emissao[1]}-${emissao[0]}T01:00:00+01:00`);
            }
            if (dataAfiliacao !== undefined || dataAfiliacao !== "" || dataAfiliacao !== null) {
              dataAfiliacao = dataAfiliacao.split('/')
              dataAfiliacao = new Date(`${dataAfiliacao[2]}-${dataAfiliacao[1]}-${dataAfiliacao[0]}T01:00:00+01:00`);
            }
            if (dataFormacao !== undefined || dataFormacao !== "" || dataFormacao !== null) {
              dataFormacao = dataFormacao.split('/')
              dataFormacao = new Date(`${dataFormacao[2]}-${dataFormacao[1]}-${dataFormacao[0]}T01:00:00+01:00`);
            }
            if (dataRegistroConselho !== undefined || dataRegistroConselho !== "" || dataRegistroConselho !== null) {
              dataRegistroConselho = dataRegistroConselho.split('/')
              dataRegistroConselho = new Date(`${dataRegistroConselho[2]}-${dataRegistroConselho[1]}-${dataRegistroConselho[0]}T01:00:00+01:00`);
            }            
            
            // Criação de dado emergencial
            // if (telefone === undefined || telefone === "") telefone = "00000000000"
            if (password === undefined || password === "") password = cpf
            
            try {
              user = await User.create({
                  name, email, password,
                  telefone, nascimento,
                  cpf, rg,
                  emissao, filiacao,
                  profissao,
                  endereco, regional,
                  numInscricao, dataAfiliacao,
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
              admin: user.admin,
    
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
            email: (user.email !== "" && user.email !== null && user.email !== undefined) ? user.email : "",
            telefone: (user.telefone !== "" && user.telefone !== null && user.telefone !== undefined) ? user.telefone : "",
            nascimento: (user.nascimento !== "" && user.nascimento !== null && user.nascimento !== undefined) ? ((user.nascimento.getDate())) + "/" + ((user.nascimento.getMonth() + 1)) + "/" + user.nascimento.getFullYear() : "",
            cpf: user.cpf,
            rg: user.rg,
            emissao: (user.emissao !== "" && user.emissao !== null && user.emissao !== undefined) ? ((user.emissao.getDate() )) + "/" + ((user.emissao.getMonth() + 1)) + "/" + user.emissao.getFullYear() : "",
            filiacao: user.filiacao,
            dataAfiliacao: (user.dataAfiliacao !== "" && user.dataAfiliacao !== null && user.dataAfiliacao !== undefined) ? ((user.dataAfiliacao.getDate())) + "/" + ((user.dataAfiliacao.getMonth() + 1)) + "/" + user.dataAfiliacao.getFullYear() : "",
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
            numInscricao, dataAfiliacao,
            formacaoSuperior, instituicaoSuperior, dataFormacao,
            numRegistroConselho, dataRegistroConselho,
            empresa, salario,
            urlUser
            } = req.body;

          if (nascimento !== undefined || nascimento !== "" || nascimento !== null) {
            nascimento = nascimento.split('/')
            nascimento = new Date(`${nascimento[2]}-${nascimento[1]}-${nascimento[0]}T01:00:00+01:00`);
          }
          if (dataAfiliacao !== undefined || dataAfiliacao !== "" || dataAfiliacao !== null) {
            dataAfiliacao = dataAfiliacao.split('/')
            dataAfiliacao = new Date(`${dataAfiliacao[2]}-${dataAfiliacao[1]}-${dataAfiliacao[0]}T01:00:00+01:00`);
          }
          if (dataFormacao !== undefined || dataFormacao !== "" || dataFormacao !== null) {
            dataFormacao = dataFormacao.split('/')
            dataFormacao = new Date(`${dataFormacao[2]}-${dataFormacao[1]}-${dataFormacao[0]}T01:00:00+01:00`);
          }
          if (dataRegistroConselho !== undefined || dataRegistroConselho !== "" || dataRegistroConselho !== null) {
            dataRegistroConselho = dataRegistroConselho.split('/')
            dataRegistroConselho = new Date(`${dataRegistroConselho[2]}-${dataFormacdataRegistroConselhoao[1]}-${dataRegistroConselho[0]}T01:00:00+01:00`);
          }

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
            dataAfiliacao: (newUserData.dataAfiliacao !== undefined) ? newUserData.dataAfiliacao : user.dataAfiliacao,
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
          .then(async function (deletedUser) {
            if(deletedUser) {
              for (let i = 0; i < user.dependentes.length; i++) {
                await Dependent.findByIdAndDelete(user.dependentes[i]);
              }
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

        let { name, nascimento, cpf, rg, emissao} = req.body;

        // if (name === undefined || nascimento === undefined || cpf === undefined
        //     || rg === undefined || emissao === undefined) {
        //   return res.status(HTTP_CODE_BAD_REQUEST).json({ message: 'Preencha todos os campos.' });
        // }

        if (name === undefined) {
        return res.status(HTTP_CODE_BAD_REQUEST).json({ message: 'Preencha todos os campos.' });
      }

        var temporalUrl = name.replace(/\s/g, '').toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, "");

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

        // Estruturação de dados que não são de emergencia

        if (nascimento !== undefined || nascimento !== "" || nascimento !== null) {
          nascimento = nascimento.split('/')
          nascimento = new Date(`${nascimento[2]}-${nascimento[1]}-${nascimento[0]}T01:00:00+01:00`);
        }
        if (emissao !== undefined || emissao !== "" || emissao !== null) {
          emissao = emissao.split('/')
          emissao = new Date(`${emissao[2]}-${emissao[1]}-${emissao[0]}T01:00:00+01:00`);
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
                urlDep,
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

      async deleteDep(req, res) {
        const urlDep = req.params.urlDep;
    
        let dep = await Dependent.findOne({ urlDep });

        let user = req.user;

        if (!dep) {
          return res.status(HTTP_CODE_NOT_FOUND).json({ message: 'Dependente não encontrado.' });
        } else {
          if (user.dependentes.includes(dep._id)) {
            dep = await Dependent.deleteOne(dep)
            .then(async function (deletedUser) {
              if(deletedUser) {
                let newArrayDeps = user.dependentes.pull(dep._id);

                await User.findByIdAndUpdate(user._id, {
                   dependentes: newArrayDeps
                });

                return res.status(HTTP_CODE_OK).json( { message: `Dependente (${dep.name}) deletado com sucesso.` } );
              } else {
                return res.status(HTTP_CODE_UNAUTHORIZED).json({ message: 'Usuário sem permissão para deletar esse dependente.' });
              }
            })
            .catch(err => console.error(`Falha ao buscar e deletar: ${err}`))
          } else {
            return res.status(HTTP_CODE_UNAUTHORIZED).json({ message: 'Esse Dependente não pertence ao usuário que solicitou remoção.' });
          }
        }
      },

      async getUsers(req, res) {
        if (req.user.admin) {
          let users = await User.find();
          let usersDTO = [];

          // (newUserData.email !== undefined) ? newUserData.email : user.email,
          users.forEach(user => {
            usersDTO.push({
              name: (user.name !== "") ? user.name : "",
              nascimento: (user.nascimento !== "" && user.nascimento !== null && user.nascimento !== undefined) ? ((user.nascimento.getDate() + 1)) + "/" + ((user.nascimento.getMonth() + 1)) + "/" + user.nascimento.getFullYear() : "",
              cpf: (user.cpf !== "") ? user.cpf : "",
              rg: (user.rg !== "" && user.rg !== null && user.rg !== undefined) ? user.rg : "",
              urlUser: (user.urlUser !== "") ? user.urlUser : "",
              emissao: (user.emissao !== "" && user.emissao !== null && user.emissao !== undefined) ? ((user.emissao.getDate() + 1)) + "/" + ((user.emissao.getMonth() + 1)) + "/" + user.emissao.getFullYear() : "",
            })
          })

          function compare( a, b ) {
            if ( a.name < b.name ){
              return -1;
            }
            if ( a.name > b.name ){
              return 1;
            }
            return 0;
          }
          
          usersDTO.sort( compare );

          return res.status(HTTP_CODE_OK).json(usersDTO);
        } else {
          return res.status(HTTP_CODE_UNAUTHORIZED).json({ message: 'Usuário sem permissão de visualizar os assessores.' });
        }
      },

      async getDependents(req, res) {
        const urlUser = req.params.urlUser;
    
        let user = await User.findOne({ urlUser });
    
        if (!user) {
          return res.status(HTTP_CODE_NOT_FOUND).json({ message: 'Perfil não encontrado.' });
        }

        if (user._id.equals(req.userId) || req.user.admin) {
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
                cpf: dep.cpf,
                nascimento: (dep.nascimento !== "" && dep.nascimento !== null && dep.nascimento !== undefined) ? ((dep.nascimento.getDate())) + "/" + ((dep.nascimento.getMonth() + 1)) + "/" + dep.nascimento.getFullYear() : "",
                rg: dep.rg,
                urlDep: dep.urlDep,
                emissao: (dep.emissao !== "" && dep.emissao !== null && dep.emissao !== undefined) ? ((dep.emissao.getDate())) + "/" + ((dep.emissao.getMonth() + 1)) + "/" + dep.emissao.getFullYear() : ""
              })
            }
          }

          function compare( a, b ) {
            if ( a.name < b.name ){
              return -1;
            }
            if ( a.name > b.name ){
              return 1;
            }
            return 0;
          }
          
          dependetesDTO.sort( compare );

          return res.status(HTTP_CODE_OK).json(dependetesDTO);
        } else {
          return res.status(HTTP_CODE_UNAUTHORIZED).json({ message: 'Usuário sem permissão de visualizar os dependentes desse assessor.' });
        }
      },

      async setImpostoDeRenda(req, res) {
        if (req.user.admin) {
          const urlUser = req.params.urlUser;
          let user = await User.findOne({ urlUser });
      
          if (!user) {
            return res.status(HTTP_CODE_NOT_FOUND).json({ message: 'Perfil não encontrado.' });
          }

          const { impostoDeRenda } = req.body;

          if (impostoDeRenda.janeiro === undefined &&
              impostoDeRenda.fevereiro === undefined &&
              impostoDeRenda.marco === undefined &&
              impostoDeRenda.abril === undefined &&
              impostoDeRenda.maio === undefined &&
              impostoDeRenda.junho === undefined &&
              impostoDeRenda.julho === undefined &&
              impostoDeRenda.agosto === undefined &&
              impostoDeRenda.setembro === undefined &&
              impostoDeRenda.outubro === undefined &&
              impostoDeRenda.novembro === undefined &&
              impostoDeRenda.dezembro === undefined
            ) {
              return res.status(HTTP_CODE_BAD_REQUEST).json({ message: 'Preencha algum dos campos.' });
            }
    
          user = await User.updateOne(
            { _id: user._id }, { $set: { impostoDeRenda : {
              janeiro: (impostoDeRenda.janeiro !== undefined) ? impostoDeRenda.janeiro : user.impostoDeRenda.janeiro,
              fevereiro: (impostoDeRenda.fevereiro !== undefined) ? impostoDeRenda.fevereiro : user.impostoDeRenda.fevereiro,
              marco: (impostoDeRenda.marco !== undefined) ? impostoDeRenda.marco : user.impostoDeRenda.marco,
              abril: (impostoDeRenda.abril !== undefined) ? impostoDeRenda.abril : user.impostoDeRenda.abril,
              maio: (impostoDeRenda.maio !== undefined) ? impostoDeRenda.maio : user.impostoDeRenda.maio,
              junho: (impostoDeRenda.junho !== undefined) ? impostoDeRenda.junho : user.impostoDeRenda.junho,
              julho: (impostoDeRenda.julho !== undefined) ? impostoDeRenda.julho : user.impostoDeRenda.julho,
              agosto: (impostoDeRenda.agosto !== undefined) ? impostoDeRenda.agosto : user.impostoDeRenda.agosto,
              setembro: (impostoDeRenda.setembro !== undefined) ? impostoDeRenda.setembro : user.impostoDeRenda.setembro,
              outubro: (impostoDeRenda.outubro !== undefined) ? impostoDeRenda.outubro : user.impostoDeRenda.outubro,
              novembro: (impostoDeRenda.novembro !== undefined) ? impostoDeRenda.novembro : user.impostoDeRenda.novembro,
              dezembro: (impostoDeRenda.dezembro !== undefined) ? impostoDeRenda.dezembro : user.impostoDeRenda.dezembro,
              }
            }
          })

          return res.status(HTTP_CODE_OK).json( { message: 'Imposto de Renda atualizado.' } );
        } else {
          return res.status(HTTP_CODE_UNAUTHORIZED).json({ message: 'Usuário sem permissão para atualizar imposto de renda.' });
        }
      },

      async setImpostoDeRendaDep(req, res) {
        if (req.user.admin) {
          const urlUser = req.params.urlUser;
          const urlDep = req.params.urlDep;
          let user = await User.findOne({ urlUser });
      
          if (!user) {
            return res.status(HTTP_CODE_NOT_FOUND).json({ message: 'Perfil não encontrado.' });
          }

          const { impostoDeRenda } = req.body;
          
          if (impostoDeRenda.janeiro === undefined &&
            impostoDeRenda.fevereiro === undefined &&
            impostoDeRenda.marco === undefined &&
            impostoDeRenda.abril === undefined &&
            impostoDeRenda.maio === undefined &&
            impostoDeRenda.junho === undefined &&
            impostoDeRenda.julho === undefined &&
            impostoDeRenda.agosto === undefined &&
            impostoDeRenda.setembro === undefined &&
            impostoDeRenda.outubro === undefined &&
            impostoDeRenda.novembro === undefined &&
            impostoDeRenda.dezembro === undefined
            ) {
              return res.status(HTTP_CODE_BAD_REQUEST).json({ message: 'Preencha algum dos campos.' });
            }
          
          let dependent = await Dependent.findOne( { urlDep })
          if (!dependent) {
            return res.status(HTTP_CODE_NOT_FOUND).json({ message: 'Dependente não encontrado.' });
          }

          if (user.dependentes.includes(dependent._id)) {
            dependent = await Dependent.updateOne(
              { urlDep: urlDep }, { $set: { impostoDeRenda : {
                janeiro: (impostoDeRenda.janeiro !== undefined) ? impostoDeRenda.janeiro : dependent.impostoDeRenda.janeiro,
                fevereiro: (impostoDeRenda.fevereiro !== undefined) ? impostoDeRenda.fevereiro : dependent.impostoDeRenda.fevereiro,
                marco: (impostoDeRenda.marco !== undefined) ? impostoDeRenda.marco : dependent.impostoDeRenda.marco,
                abril: (impostoDeRenda.abril !== undefined) ? impostoDeRenda.abril : dependent.impostoDeRenda.abril,
                maio: (impostoDeRenda.maio !== undefined) ? impostoDeRenda.maio : dependent.impostoDeRenda.maio,
                junho: (impostoDeRenda.junho !== undefined) ? impostoDeRenda.junho : dependent.impostoDeRenda.junho,
                julho: (impostoDeRenda.julho !== undefined) ? impostoDeRenda.julho : dependent.impostoDeRenda.julho,
                agosto: (impostoDeRenda.agosto !== undefined) ? impostoDeRenda.agosto : dependent.impostoDeRenda.agosto,
                setembro: (impostoDeRenda.setembro !== undefined) ? impostoDeRenda.setembro : dependent.impostoDeRenda.setembro,
                outubro: (impostoDeRenda.outubro !== undefined) ? impostoDeRenda.outubro : dependent.impostoDeRenda.outubro,
                novembro: (impostoDeRenda.novembro !== undefined) ? impostoDeRenda.novembro : dependent.impostoDeRenda.novembro,
                dezembro: (impostoDeRenda.dezembro !== undefined) ? impostoDeRenda.dezembro : dependent.impostoDeRenda.dezembro,
                }
              }
            })
            return res.status(HTTP_CODE_OK).json( { message: 'Imposto de Renda do Dependente atualizado.' } );
          } else {
            return res.status(HTTP_CODE_OK).json( { message: 'O Dependente informado não pertence ao Associado informado.' } );
          }

        } else {
          return res.status(HTTP_CODE_UNAUTHORIZED).json({ message: 'Usuário sem permissão para atualizar imposto de renda.' });
        }
      },

      async getPDF(req, res) {
        const urlUser = req.params.urlUser;
        let user = await User.findOne({ urlUser });

        if (!user) {
          return res.status(HTTP_CODE_NOT_FOUND).json({ message: 'Perfil não encontrado.' });
        } else {
          if (req.user.admin || user._id.equals(req.userId)) { 
              let impRendaDeps = []
              let dep;
              let depDTO;
              for (let i = 0 ; i < user.dependentes.length ; i++) {
                dep = await Dependent.findById(user.dependentes[i]);
  
                if (!(!dep)) {
                  depDTO = {
                    name: dep.name,
                    impostoDeRenda: dep.impostoDeRenda
                  }
                  impRendaDeps.push(depDTO);
                }
              }
              return res.status(HTTP_CODE_OK).json( { name: user.name, impostoDeRenda: user.impostoDeRenda, dependentes: impRendaDeps } );
            } else {
            return res.status(HTTP_CODE_UNAUTHORIZED).json({ message: 'Usuário sem permissão para baixar esse imposto de renda.' });
        }
      }
    }
};

module.exports = UserController;