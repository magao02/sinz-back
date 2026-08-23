const express = require('express');
const ImpostoRoutes = require('./routes/impostoRoutes');
const UserRoutes = require('./routes/usuarioRoutes');
const DependenteRoutes = require('./routes/dependenteRoutes');
const homePageRoutes = require('./routes/homePageRoutes');
const apartmentRoutes = require("./routes/apartmentRoutes");
const recreationAreaRoutes = require("./routes/recreationAreaRoutes");
const lancamentoRoutes = require('./routes/lancamentoRoutes');
const livroCaixaRoutes = require('./routes/livroCaixaRoutes');
const app  = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(express.json());
app.use(cors({
    origin: '*'
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', homePageRoutes);
app.use('/user', UserRoutes);
app.use('/imposto', ImpostoRoutes);
app.use('/dependente', DependenteRoutes);
app.use("/apartment", apartmentRoutes);
app.use("/recreationArea", recreationAreaRoutes);
app.use('/lancamentos', lancamentoRoutes);
app.use('/livroCaixa', livroCaixaRoutes);

module.exports = app;