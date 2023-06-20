// Armazena os elementos do DOM que serão preenchidos com as informações da tabela
const idTabela = document.querySelector("[data-id-tabela]");
const idTabelaFavoritada = document.querySelector('[data-id-tabela-favoritada]');
const divDado = document.querySelector('[data-icone-sensivel]');
const dadoSensivel = document.querySelector('[data-sensivel]');
const favorito = document.querySelector('[data-imagem-favorito]');
const divLixeira = document.querySelector('[data-icone-lixeira]');

// Realiza uma requisição fetch para obter os dados da tabela
$(document).on('click', '.secao-tabelas__lista__item__div-informacoes__div-icones__lixeira', function (event) {
  // Obtém o ID da tabela associado ao item clicado
  var idTabela = $(this).closest('.secao-tabelas__lista__item').find('[data-id-tabela-favoritada]').val();

  // Obtém o ID da tabela associado ao item clicado
  var url = 'favoritos/delete?id_tabela=' + idTabela;

  // Redireciona para a URL com base no ID da tabela
  window.location.href = url;
});

// Evento acionado quando um item da lista é clicado
$(document).on('click', '.secao-tabelas__lista__item__paragrafo-div', function (event) {
  // Obtém o ID da tabela associado ao item clicado
  var idTabela = $(this).find('[data-id-tabela]').val();

  // Cria uma nova URL com base no "id" da tabela caputrado acima
  var url = 'informacoesTabela?id=' + idTabela;
  
  // Redireciona para a URL com base no ID da tabela
  window.location.href = url;
});