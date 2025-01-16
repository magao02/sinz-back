const nodemailer = require('nodemailer');

async function handler(message) {
  
    // Configuração do transporte
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Ou outro serviço de e-mail
      auth: {
        user: 'emailautomaticossoftinnovate@gmail.com',
        pass: 'oyew holm giiu ogah',
      },
    });

    try {
      await transporter.sendMail({
        from: 'emailautomaticossoftinnovate@gmail.com',
        to: 'lucasjuazeiro190@gmail.com',
        subject: 'Novo Cadastro',
        text: message ,
      });
      console.log('Email enviado com sucesso');
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
}

module.exports = handler;
