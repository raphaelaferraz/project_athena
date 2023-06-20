// Importa o módulo 'express' para criar um servidor web
const express = require("express");

// Importa o módulo 'path' para manipular caminhos de arquivos
const path = require("path");

// Importa e armazena o módulo 'body-parser'
const bodyParser = require("body-parser");

// Armazena a conversão dos dados do formato URL para um objeto JavaScript// Armazena a conversão dos dados do formato URL para um objeto JavaScript
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Armazena as funcionalidades do express
const app = express();

// Importa o módulo 'sqlite3' para se conectar e interagir com bancos de dados
const sqlite3 = require("sqlite3").verbose();

// Armazena o endereço IP do localhost
const hostname = "127.0.0.1";

// Armazena a porta que será utilizada para rodar o servidor web
const port = 1234;

// Armazena o caminho do arquivo que contém o banco de dados do projeto
const DBPATH = "./backend/data/db_projeto.db";

// Define o EJS como o motor de renderização de páginas HTML
app.set("view engine", "ejs");

// Define o diretório 'views' como o diretório raiz das páginas HTML​
app.set("views", "./Frontend/");

// Define o diretório 'frontend' como o diretório raiz do servidor web
app.use(express.static("./Frontend/"));

// Define o express para receber dados em formato JSON
app.use(express.json());

// Abre conexão com o banco de dados SQLite
const db = new sqlite3.Database(DBPATH, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Conexão com o banco de dados SQLite estabelecida.");
});

/********************* ENDPOINTS DO INDEX ********************/
//endpoint de home page ligado com o index.html
app.get("/", (req, res) => {
  res.render("html/index");
});

// Endpoint para renderizar a página de detalhes das tabelas
app.get("/informacoesTabela", (req, res) => {
  // Obtém o ID da tabela da query string
  const idTabela = req.query.id;

  // Renderize o arquivo EJS e envie a resposta com os dados da tabela
  res.render("html/informacoesTabela", { idTabela });
});

/********************* ENDPOINTS DA TABELA ********************/
//Endpoint para listar todas as tabelas
app.get("/tabelas", (req, res) => {
  db.all("SELECT * FROM tabela", [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.json(rows);
  });
});

//Endpoint para listar todas as tabelas a partir do id
app.get("/tabela", (req, res) => {
  res.statusCode = 200;
  res.setHeader("Access-Control-Allow-Origin", "*");
  db.all("SELECT * FROM tabela WHERE id= ?", [req.query.id], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.json(rows);
  });
});

/********************* ENDPOINTS DE SOLICITAÇÕES********************/
//Endpoint para realizar solicitação de alteração, a partir de um sql code
app.post("/solicitar", urlencodedParser, (req, res) => {
  const sql =
    "INSERT INTO solicitacoes (id_usuario, data, sql_code) VALUES (?, ?, ?)";
  const { id_usuario, sql_code } = req.body;
  var data = new Date();
  var data = new Date().toISOString().slice(0, 19).replace("T", " ");
  console.log(data);
  const valores = [id_usuario, data, sql_code];

  db.run(sql, valores, (err) => {
    if (err) {
      throw err;
    } else {
      res.render('html/alteracaoSolicitada')
    }
  });
});

//Enpoint para listar todas as solicitações feitas
app.get("/solicitacoes", (req, res) => {
  const sql = "SELECT * FROM solicitacoes";
  db.all(sql, (err, rows) => {
    if (err) {
      throw err;
    } else {
      res.json(rows);
    }
  });
});

//Endpoint para recusar/excluir uma solicitação feita
app.delete("/recusar", urlencodedParser, (req, res) => {
  var sql = `DELETE FROM solicitacoes WHERE id_solicitacao=${req.body.id_solicitacao}`;
  db.run(sql, (err) => {
    if (err) {
      throw err;
    } else {
      res.json("Solicitação recusada com sucesso");
    }
  });
});

//Endpoint para a realização da atualização dos metadados, de acordo com o formulário
app.post("/atualizar", urlencodedParser, (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  var sql = `SELECT sql_code FROM solicitacoes WHERE id_solicitacao = ${req.body.id_solicitacao}`;
  db.all(sql, (err, rows) => {
    if (err) {
      throw err;
    } else {
      const { sql_code } = rows[0];
      console.log(sql_code);
      db.run(sql_code, (err) => {
        if (err) {
          throw err;
        } else {
          res.send("Pedido executado");
        }
      });
    }
  });
});


/*********** ENDPOINTS DE CAMPOS ***********/
// Endpoint que lista todos os campos que estao em uma tabela
app.get("/campos", (req, res) => {
  res.statusCode = 200;
  res.setHeader("Access-Control-Allow-Origin", "*");
  const sql = `SELECT nome_campo, descricao_campo, tipo_campo FROM variaveis WHERE id_variaveis LIKE '%${req.query.id_bd}%'`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Erro ao buscar tabelas.");
    } else {
      res.json(rows);
    }
  });
});


/*********** ENDPOINTS DE FAVORITOS ***********/
//Endpoint que lista todos os favoritos
app.get("/favoritos", (req, res) => {
  res.statusCode = 200;
  res.setHeader("Access-Control-Allow-Origin", "*");
  const sql = `SELECT favorito.id_tabela, tabela.id, tabela.nome, tabela.descricao, tabela.categoria, tabela.database, tabela.dado_sensivel
  FROM tabela
  INNER JOIN favorito ON tabela.id = favorito.id_tabela`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Erro ao buscar tabelas.");
    } else {
      res.json(rows);
    }
  });
});

// Endpoint para pegar os ids das tabelas favoritadas
app.get("/favoritos/ids", (req, res) => {
  res.setHeader(`Acess-Control-Allow-Origin`, "*");
  const sql = `SELECT tabela.id FROM tabela JOIN favorito ON tabela.id = favorito.id_tabela`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Erro ao conectar tabelas");
    } else {
      res.json(rows);
    }
  });
});

//Endpoint join para tabela e favorito
app.get("/tabelasFavoritadas", (req, res) => {
  res.statusCode = 200;
  res.setHeader(`Acess-Control-Allow-Origin`, "*");
  const sql = `SELECT favorito.id_tabela, tabela.id, tabela.nome, tabela.descricao, tabela.categoria, tabela.database, tabela.dado_sensivel
  FROM tabela
  INNER JOIN favorito ON tabela.id = favorito.id_tabela`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Erro ao conectar tabelas");
    } else {
      res.render("html/favoritos", { tabelas: rows });
    }
  });
});

//Endpoint para inserir tabela aos favoritos
app.get("/favoritos/inserirTabela", urlencodedParser, (req, res) => {
  res.statusCode = 200;
  res.setHeader("Access-Control-Allow-Origin", "*");
  let data = new Date().toLocaleDateString("pt-BR"); // data atual
  const sql = `INSERT INTO favorito (data, id_usuario, id_tabela) VALUES ('${data}', '1', '${req.query.id_tabela}' )`;
  console.log(sql);
  db.run(sql, [], (err) => {
    if (err) {
      throw err;
    }
  });
  res.redirect("/tabelasFavoritadas");
});

//Endpoint para deletar tabela dos favoritos
app.get("/favoritos/delete", urlencodedParser, (req, res) => {
  res.statusCode = 200;
  res.setHeader("Access-Control-Allow-Origin", "*");
  sql = `DELETE FROM favorito WHERE id_tabela='${req.query.id_tabela}'`;
  db.run(sql, [], (err) => {
    if (err) {
      throw err;
    }
    res.redirect("/tabelasFavoritadas");
  });
});

/*********** ENDPOINTS DE FEEDBACK ***********/
//Endpoint para inserir um feedback
app.post("/inserirfeedback", urlencodedParser, (req, res) => {
  res.statusCode = 200;
  res.setHeader("Access-Control-Allow-Origin", "*");
  const sql = `INSERT INTO feedback (id_tabela, avaliacao, comentario) VALUES ('${req.body.id_tabela}', '${req.body.avaliacao}', '${req.body.comentario}' )`;
  console.log(sql);
  db.run(sql, [], (err) => {
    if (err) {
      throw err;
    }
  });
  res.render("html/feedbackEnviado");
  res.end();
});

//Endpoint para buscar os feedbacks
app.get("/feedbacks", (req, res) => {
  res.statusCode = 200;
  res.setHeader("Access-Control-Allow-Origin", "*");
  const sql = `SELECT * FROM feedback`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send(err);
    } else {
      res.json(rows);
    }
  });
});

// Inicia o servidor
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
