// Função para editar as informações de uma tabela
function editar(){
  // Obtém os parâmetros da URL atual
  var urlParams = new URLSearchParams(window.location.search);

  // Obtém o valor do parâmetro "id" que está na URL
  var id = urlParams.get('id');
  
  // Cria uma nova URL com base no "id" da tabela caputrado acima
  var url = '/tabela?id=' + id;
  
  // Obtém os elementos do DOM que serão preenchidos com as informações da tabela
  const titulo = document.querySelector("#titulo");
  const descricao = document.querySelector("#descricao");
  const conjuntoDados = document.querySelector("#conjunto-dados");
  const owner = document.querySelector("#owner");
  const steward = document.querySelector("#steward");
  const database = document.querySelector("#database");
  const caminhoTabela = document.querySelector("#caminho-tabela");
  const defasagem = document.querySelector("#defasagem");
  const engenheiroIngestao = document.querySelector("#engenheiro-ingestao");
  
  // Realiza uma requisição fetch para obter os dados da tabela
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Obtém a tabela a partir dos dados retornados
      let tabela = data[0];
      
      // Preenche os elementos do DOM com as informações da tabela
      titulo.value = tabela.nome;
      descricao.value = tabela.descricao;
      conjuntoDados.value = tabela.categoria;
      owner.value = tabela.owner;
      steward.value = tabela.steward;
      database.value = tabela.database;
      caminhoTabela.value = tabela.caminho;
      defasagem.value = tabela.defasagem;
      engenheiroIngestao.value = tabela.eng_ingestao;
    })
    .catch(error => {
      console.log(error);
    });
  };
  
  // Função para enviar a solicitação de atualização dos metadados
  function enviarSolicitacao() {
    // Armazena os elementos do DOM que serão utilizados
    const titulo = document.querySelector("#titulo");
    const descricao = document.querySelector("#descricao");
    const conjuntoDados = document.querySelector("#conjunto-dados");
    const owner = document.querySelector("#owner");
    const steward = document.querySelector("#steward");
    const database = document.querySelector("#database");
    const caminhoTabela = document.querySelector("#caminho-tabela");
    const defasagem = document.querySelector("#defasagem");
    const engenheiroIngestao = document.querySelector("#engenheiro-ingestao");
    const sql_code = document.querySelector("#sql_code");
    sql_code.value = `UPDATE tabela SET nome='${titulo.value}', descricao='${descricao.value}', categoria='${conjuntoDados.value}', owner='${owner.value}', steward='${steward.value}', database='${database.value}', caminho='${caminhoTabela.value}', defasagem='${defasagem.value}', eng_ingestao='${engenheiroIngestao.value}' WHERE id=61`;
  }
  