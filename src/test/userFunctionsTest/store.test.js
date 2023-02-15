const request = require("supertest");
const app = require("../../app");

const User = require("../../model/User");
const store = require("../../service/userFunctions/store");

jest.setTimeout(10000);

describe("Teste da função store", () => {
  test("Deve retornar status 201 quando o usuário é cadastrado com sucesso", async () => {
    const response = await request(app)
      .post("/signUp")
      .send({
        name: "Usuário de Teste",
        email: "emailUsarioDeTeste@gmail.com",
        password: "777851197490",
        telefone: "8121278058",
        nascimento: "30/03/2004",
        cpf: "46675863118",
        rg: "218335088",
        emissao: "20/10/1327",
        filiacao: "Nenhuma",
        profissao: "Nenhuma",
        endereco: {
          rua: "Rua Francisco Gabriel da Silva",
          bairro: "Malvinas",
          numero: "555",
          complemento: "",
        },
        regional: {
          municipio: "Fortaleza",
          estado: "PB",
          naturalidade: "asd",
          nacionalidade: "czxc",
        },
        numInscricao: "6754",
        dataAfiliacao: "19/06/2003",
        formacaoSuperior: "Nenhuma",
        instituicaoSuperior: "IFPB",
        dataFormacao: "19/07/2008",
        numRegistroConselho: "123123",
        dataRegistroConselho: "15/04/2007",
        empresa: "Codex",
        salario: "2500",
      });

    expect(response.statusCode).toBe(201);
  });
});
