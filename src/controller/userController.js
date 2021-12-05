const User = require('../model/User');
const jwt = require('jsonwebtoken');

const HTTP_CODE_OK = 200;
const HTTP_CODE_CREATED = 201;
const HTTP_CODE_BAD_REQUEST = 400;
const HTTP_CODE_UNAUTHORIZED = 401;
const HTTP_CODE_NOT_FOUND = 404;

const UserController = {
    async store(req, res) {
        const { name, email, password, telefone,
          aniversario, cpf, rg, emissao, filiacao,
          profissao, rua, bairro, complemento,
          numero } = req.body;

        if (name === undefined || email === undefined ||
            password === undefined || telefone === undefined ||
            aniversario === undefined || cpf === undefined ||
            rg === undefined || emissao === undefined ||
            filiacao === undefined || profissao === undefined ||
            rua === undefined || bairro === undefined) {
              return res.status(HTTP_CODE_BAD_REQUEST).json({ message: 'Preencha todos os campos.' });
            }

        let regexCPF = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
        if (!(regexCPF.test(cpf))) {
            return res.status(HTTP_CODE_BAD_REQUEST).json({ message: "O campo de CPF deve possuir o formato: xxx.xxx.xxx-xx" });
        }
        let regexTelefone = /^(?:\+)[0-9]{2}\s? (?:\()[0-9]{2}(?:\))\s? [0-9]{4,5}(?:-)[0-9]{4}$/;
        if (!(regexTelefone.test(telefone))) {
            return res.status(HTTP_CODE_BAD_REQUEST).json({ message: "O campo de Telefone deve possuir o formato: +xx (xx) xxxxx-xxxx" });
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

            user = await User.create({
                name,
                email,
                password,
                telefone,
                aniversario,
                cpf,
                rg,
                emissao,
                filiacao,
                profissao,
                rua,
                bairro,
                complemento,
                numero,
                urlUser
            });

            return res.status(HTTP_CODE_CREATED).json({ message: 'Usuário cadastrado com sucesso.' });
        } else {
            return res.status(HTTP_CODE_BAD_REQUEST).json({ message: 'CPF já cadastrado.' });
        }
    },

    async login(req, res) {
        const { email, password } = req.body;
    
        if (email === undefined ||
          password === undefined) return res.status(HTTP_CODE_BAD_REQUEST).json({ message: 'Preencha todos os campos.' });
    
        let user = await User.findOne({ email });
    
        if (!user) {
          return res.status(HTTP_CODE_UNAUTHORIZED).json({ message: 'Email não cadastrado' });
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
      }
};

module.exports = UserController;