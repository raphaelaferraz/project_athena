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
  // Caso ocorra um erro na conexão, exibe uma mensagem de erro
  if (err) {
    console.error(err.message);
  }
  // Caso a conexão seja bem sucedida, exibe uma mensagem de sucesso
  console.log("Conexão com o banco de dados SQLite estabelecida.");
});


/********************* ENDPOINTS DO INDEX ********************/
// Endpoint de home page ligado com o index.html
app.get("/", (req, res) => {
  // Renderiza o arquivo EJS 
  res.render("html/index");
});

// Endpoint para renderizar a página de detalhes das tabelas
app.get("/informacoesTabela", (req, res) => {
  // Obtém o ID da tabela da query string
  const idTabela = req.query.id;

  // Renderiza o arquivo EJS e envie a resposta com os dados da tabela
  res.render("html/informacoesTabela", { idTabela });
});

/********************* ENDPOINTS DA TABELA ********************/
// Endpoint para listar todas as tabelas
app.get("/tabelas", (req, res) => {
  // Executa a query para selecionar todas as tabelas
  db.all("SELECT * FROM tabela", [], (err, rows) => {
    // Caso ocorra um erro, exibe uma mensagem de erro
    if (err) {
      return console.error(err.message);
    }
    // Caso a query seja bem sucedida, envia a resposta com os dados das tabelas
    res.json(rows);
  });
});

// Endpoint para listar todas as tabelas a partir do id
app.get("/tabela", (req, res) => {
  // Define o status da resposta
  res.statusCode = 200;
  // Define o cabeçalho da resposta
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Executa a query para selecionar a tabela com o id especificado
  db.all("SELECT * FROM tabela WHERE id= ?", [req.query.id], (err, rows) => {
    // Caso ocorra um erro, exibe uma mensagem de erro
    if (err) {
      return console.error(err.message);
    }
    // Caso a query seja bem sucedida, envia a resposta com os dados da tabela
    res.json(rows);
  });
});


/********************* ENDPOINTS DE SOLICITAÇÕES********************/
// Endpoint para realizar solicitação de alteração, a partir de um sql code
app.post("/solicitar", urlencodedParser, (req, res) => {
  // Define o código SQL que será executado
  const sql = "INSERT INTO solicitacoes (id_usuario, data, sql_code) VALUES (?, ?, ?)";
  // Obtém os dados da solicitação
  const { id_usuario, sql_code } = req.body;
  // Obtém a data atual
  var data = new Date();
  // Converte a data para o formato YYYY-MM-DD HH:MM:SS
  var data = new Date().toISOString().slice(0, 19).replace("T", " ");
  // Define os valores que serão inseridos na tabela
  const valores = [id_usuario, data, sql_code];
  // Executa o comando SQL
  db.run(sql, valores, (err) => {
    // Caso ocorra um erro, exibe uma mensagem de erro
    if (err) {
      throw err;
    } else {
      // Caso o comando seja bem sucedido, renderiza a página de alteração solicitada
      res.render('html/alteracaoSolicitada')
    }
  });
});

// Enpoint para listar todas as solicitações feitas
app.get("/solicitacoes", (req, res) => {
  // Define o código SQL que será executado
  const sql = "SELECT * FROM solicitacoes";
  // Executa o comando SQL
  db.all(sql, (err, rows) => {
    // Caso ocorra um erro, exibe uma mensagem de erro
    if (err) {
      throw err;
    } else {
      // Caso o comando seja bem sucedido, envia a resposta com os dados das solicitações
      res.json(rows);
    }
  });
});

// Endpoint para recusar/excluir uma solicitação feita
app.delete("/recusar", urlencodedParser, (req, res) => {
  // Define o código SQL que será executado
  const sql = `DELETE FROM solicitacoes WHERE id_solicitacao=${req.body.id_solicitacao}`;
  // Executa o comando SQL
  db.run(sql, (err) => {
    // Caso ocorra um erro, exibe uma mensagem de erro
    if (err) {
      throw err;
    } else {
      // Caso o comando seja bem sucedido, envia a resposta com uma mensagem de sucesso
      res.json("Solicitação recusada com sucesso");
    }
  });
});

// Endpoint para a realização da atualização dos metadados, de acordo com o formulário
app.post("/atualizar", urlencodedParser, (req, res) => {
  // Define o cabeçalho da resposta
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Define o código SQL que será executado
  const sql = `SELECT sql_code FROM solicitacoes WHERE id_solicitacao = ${req.body.id_solicitacao}`;
  // Executa o comando SQL
  db.all(sql, (err, rows) => {
    // Caso ocorra um erro, exibe uma mensagem de erro
    if (err) {
      throw err;
    } else {
      // Caso o comando seja bem sucedido, executa o código SQL retornado
      const { sql_code } = rows[0];
      // Executa o comando SQL
      db.run(sql_code, (err) => {
        // Caso ocorra um erro, exibe uma mensagem de erro
        if (err) {
          throw err;
        } else {
          // Caso o comando seja bem sucedido, envia a resposta com uma mensagem de sucesso
          res.send("Pedido executado");
        }
      });
    }
  });
});


/*********** ENDPOINTS DE CAMPOS ***********/
// Endpoint que lista todos os campos que estao em uma tabela
app.get("/campos", (req, res) => {
  // Define o status da resposta
  res.statusCode = 200;
  // Define o cabeçalho da resposta
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Define o código SQL que será executado
  const sql = `SELECT nome_campo, descricao_campo, tipo_campo FROM variaveis WHERE id_variaveis LIKE '%${req.query.id_bd}%'`;
  // Executa o comando SQL
  db.all(sql, [], (err, rows) => {
    // Caso ocorra um erro, exibe uma mensagem de erro
    if (err) {
      console.error(err.message);
      res.status(500).send("Erro ao buscar tabelas.");
    } else {
      // Caso o comando seja bem sucedido, envia a resposta com os dados dos campos
      res.json(rows);
    }
  });
});


/*********** ENDPOINTS DE FAVORITOS ***********/
// Endpoint que lista todos os favoritos
app.get("/favoritos", (req, res) => {
  // Define o status da resposta
  res.statusCode = 200;
  // Define o cabeçalho da resposta
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Define o código SQL que será executado
  const sql = `SELECT favorito.id_tabela, tabela.id, tabela.nome, tabela.descricao, tabela.categoria, tabela.database, tabela.dado_sensivel
  FROM tabela
  INNER JOIN favorito ON tabela.id = favorito.id_tabela`;
  // Executa o comando SQL
  db.all(sql, [], (err, rows) => {
    // Caso ocorra um erro, exibe uma mensagem de erro
    if (err) {
      console.error(err.message);
      res.status(500).send("Erro ao buscar tabelas.");
    } else {
      // Caso o comando seja bem sucedido, envia a resposta com os dados dos favoritos
      res.json(rows);
    }
  });
});

// Endpoint para pegar os ids das tabelas favoritadas
app.get("/favoritos/ids", (req, res) => {
  // Define o cabeçalho da resposta
  res.setHeader(`Acess-Control-Allow-Origin`, "*");
  // Define o código SQL que será executado
  const sql = `SELECT tabela.id FROM tabela JOIN favorito ON tabela.id = favorito.id_tabela`;
  // Executa o comando SQL
  db.all(sql, [], (err, rows) => {
    // Caso ocorra um erro, exibe uma mensagem de erro
    if (err) {
      console.error(err.message);
      res.status(500).send("Erro ao conectar tabelas");
    } else {
      // Caso o comando seja bem sucedido, envia a resposta com os dados dos ids das tabelas favoritadas
      res.json(rows);
    }
  });
});

// Endpoint join para tabela e favorito
app.get("/tabelasFavoritadas", (req, res) => {
  // Define o status da resposta
  res.statusCode = 200;
  // Define o cabeçalho da resposta
  res.setHeader(`Acess-Control-Allow-Origin`, "*");
  // Define o código SQL que será executado
  const sql = `SELECT favorito.id_tabela, tabela.id, tabela.nome, tabela.descricao, tabela.categoria, tabela.database, tabela.dado_sensivel
  FROM tabela
  INNER JOIN favorito ON tabela.id = favorito.id_tabela`;
  // Executa o comando SQL
  db.all(sql, [], (err, rows) => {
    // Caso ocorra um erro, exibe uma mensagem de erro
    if (err) {
      console.error(err.message);
      res.status(500).send("Erro ao conectar tabelas");
    } else {
      // Caso o comando seja bem sucedido, envia a resposta com os dados dos ids das tabelas favoritadas
      res.render("html/favoritos", { tabelas: rows });
    }
  });
});

// Endpoint para inserir tabela aos favoritos
app.get("/favoritos/inserirTabela", urlencodedParser, (req, res) => {
  // Define o status da resposta
  res.statusCode = 200;
  // Define o cabeçalho da resposta
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Armazena a data atual
  let data = new Date().toLocaleDateString("pt-BR"); 
  // Define o código SQL que será executado
  const sql = `INSERT INTO favorito (data, id_usuario, id_tabela) VALUES ('${data}', '1', '${req.query.id_tabela}' )`;
  // Executa o comando SQL
  db.run(sql, [], (err) => {
    // Caso ocorra um erro, exibe uma mensagem de erro
    if (err) {
      throw err;
    }
  });
  // Redireciona para a página de tabelas favoritadas
  res.redirect("/tabelasFavoritadas");
});

// Endpoint para deletar tabela dos favoritos
app.get("/favoritos/delete", urlencodedParser, (req, res) => {
  // Define o status da resposta
  res.statusCode = 200;
  // Define o cabeçalho da resposta
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Define o código SQL que será executado
  const sql = `DELETE FROM favorito WHERE id_tabela='${req.query.id_tabela}'`;
  // Executa o comando SQL
  db.run(sql, [], (err) => {
    if (err) {
      throw err;
    }
    // Redireciona para a página de tabelas favoritadas
    res.redirect("/tabelasFavoritadas");
  });
});


/*********** ENDPOINTS DE FEEDBACK ***********/
// Endpoint para inserir um feedback
app.post("/inserirfeedback", urlencodedParser, (req, res) => {
  // Define o status da resposta
  res.statusCode = 200;
  // Define o cabeçalho da resposta
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Define o código SQL que será executado
  const sql = `INSERT INTO feedback (id_tabela, avaliacao, comentario) VALUES ('${req.body.id_tabela}', '${req.body.avaliacao}', '${req.body.comentario}' )`;
  // Executa o comando SQL
  db.run(sql, [], (err) => {
    // Caso ocorra um erro, exibe uma mensagem de erro
    if (err) {
      throw err;
    }
  });
  // Redireciona para a página de feedback enviado
  res.render("html/feedbackEnviado");
  // Finaliza a resposta
  res.end();
});

// Endpoint para buscar os feedbacks
app.get("/feedbacks", (req, res) => {
  // Define o status da resposta
  res.statusCode = 200;
  // Define o cabeçalho da resposta
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Define o código SQL que será executado
  const sql = `SELECT * FROM feedback`;
  // Executa o comando SQL
  db.all(sql, [], (err, rows) => {
    // Caso ocorra um erro, exibe uma mensagem de erro
    if (err) {
      console.error(err.message);
      res.status(500).send(err);
    } else {
      // Caso o comando seja bem sucedido, envia a resposta com os dados dos feedbacks
      res.json(rows);
    }
  });
});

// Inicia o servidor
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
