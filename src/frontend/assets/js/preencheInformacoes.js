// Obtém os parâmetros da URL atual
let url = new URL(window.location.href);
let params = url.searchParams;

// Obtém o valor do parâmetro "id" que está na URL
let idTabela = params.get('id');

// Cria uma nova URL com base no "id" da tabela caputrado acima
url = '/tabela?id=' + idTabela;

// Obtém os elementos do DOM que serão preenchidos com as informações da tabela
const voltar = document.querySelector('.cabecalho__div-voltar__imagem');
const linkVoltar = document.querySelector('#voltar');
const tituloTabela = document.querySelector('[data-nome-tabela]');
const descricaoTabela = document.querySelector('[data-descricao-tabela]');
const ownerTabela = document.querySelector('[data-owner-tabela]');
const categoriaTabela = document.querySelector('[data-conjunto-dados-tabela]');
const stewardTabela = document.querySelector('[data-steward-tabela]');
const databaseTabela = document.querySelector('[data-database-tabela]');
const engenheiroIngestaoTabela = document.querySelector(
  '[data-engenheiro-sustentacao-tabela]'
);
const caminhoTabela = document.querySelector('[data-caminho-tabela]');
const defasagemTabela = document.querySelector('[data-defasagem-tabela]');

// Realiza uma requisição fetch para obter os dados da tabela
fetch(url)
  .then(response => response.json())
  .then(data => {
    // Obtém a tabela a partir dos dados retornados
    let tabela = data[0];

    // Armazena o elemento do DOM que será preenchido com o ícone de dado sensível
    const divDado = document.querySelector('[data-icone-sensivel]');
    const dadoSensivel = document.querySelector('[data-sensivel]');

    // Preenche os elementos do DOM com as informações da tabela
    tituloTabela.innerText = tabela.nome;
    descricaoTabela.innerText = tabela.descricao;
    categoriaTabela.value = tabela.categoria;
    ownerTabela.value = tabela.owner;
    stewardTabela.value = tabela.steward;
    databaseTabela.value = tabela.database;
    engenheiroIngestaoTabela.value = tabela.eng_ingestao;
    defasagemTabela.value = tabela.defasagem;
    caminhoTabela.value = tabela.caminho;
    dadoSensivel.value = tabela.dado_sensivel;

    // Define o estilo dos elementos de voltar ao realizar a requisição fetch
    voltar.style.display = 'block';
    voltar.style.position = 'absolute';
    voltar.style.zIndex = '1';
    voltar.style.margin = '1rem';

    // Verifica se a tabela é sensível e exibe o ícone
    if (dadoSensivel.value == 'S') {
      divDado.style.display = 'block';
    } else {
      divDado.style.display = 'none';
    }
  })
  .catch(error => {
    console.log(error);
  });

// Armazena o valor da estrela clicada
function guarda(valor) {
  // Armazena o valor da estrela clicada no campo "estrela"
  document.getElementById('estrela').value = valor;
}
// Armazena o valor do id da tabela no campo "id_tabela"
document.getElementById('id_tabela').value = idTabela;
