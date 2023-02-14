const request = require("supertest");
const app = require("../../app");

const User = require("../../model/User");
const store = require("../../service/userFunctions/store");


describe("Teste da função store", () => {
  test("Deve retornar status 400 quando não são passados todos os campos obrigatórios", async () => {
    const response = await request(app)
      .post("/signUp")
      .send({
        // Passar apenas alguns campos, não todos
      });

    expect(response.statusCode).toBe(400);
  });

  test("Deve retornar status 400 quando o CPF já está cadastrado", async () => {
    const response = await request(app)
      .post("/signUp")
      .send({
        // Passar um CPF que já está cadastrado
      });

    expect(response.statusCode).toBe(400);
  });

  test("Deve retornar status 201 quando o usuário é cadastrado com sucesso", async () => {
    const response = await request(app)
      .post("/signUp")
      .send({
        // Passar todos os campos necessários para cadastrar um usuário
      });

    expect(response.statusCode).toBe(201);
  });
});
