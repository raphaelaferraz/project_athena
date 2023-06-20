// Seleciona os elementos do DOM
const template = document.querySelector("[data-template]");
const container = document.querySelector("[data-container]");
const inputPesquisa = document.querySelector("[data-input-pesquisa]");
const dropdown = document.querySelector("[dropdown]");
const paginationLinks = document.querySelectorAll(".paginacao-link");
const resultadosTela = document.getElementById("quantidade");
const barraResultados = document.getElementById("texto-quantidade");
const barra = document.getElementById("barra");
const verificado = document.getElementById("verificado"); 
const listaPaginacao = document.getElementById("paginacao");

// Armazena os dados das tabelas
let tabelas = [];

// Armazena o objeto Fuse.js
let fuse;

// Armazena o número máximo de cartões mostrados
let cartoesMaximos = 5;

// Armazena os filtros selecionados pelo usuário
var filtros = [];

// Armazena o id das tabelas favoritadas
var listaFavoritos = [];

// Inicia o modo escuro ao carregar a página
$(document).ready(() => { 
  // Armazena o estado da div que exibe os filtros (aberto ou fechado)
  var toggle = true;

  // Inicia o modo escuro ao clicar no botão
  $(document).on('click', '#btn-filtro', () => {
    // Ao clicar, caso esteja fechado ele abre
    if (toggle){
      $("#btn-filtro").removeClass("btn-filtro ");
      $("#btn-filtro").addClass("btn-filtro-ativado ");
      $( ".secao-pesquisa__div-filtro" ).slideDown( 300 );
      $( ".secao-pesquisa__div-filtro" ).css( "display", "inline-grid");
      $( ".secao-pesquisa__div-filtro" ).css( "height", "150px");

      toggle = !toggle;
    // caso esteja aberto ele fecha
    } else {
      $("#btn-filtro").addClass("btn-filtro ");
      $("#btn-filtro").removeClass("btn-filtro-ativado ");
      $( ".secao-pesquisa__div-filtro" ).slideUp( 300 );
      
      toggle = !toggle;
    }
  });

  // Ao selecionar um filtro
  $(document).on('click', '.filtro-button', (event) => {

    // caso o array filtros não incluir o filtro selecionado
    if(!filtros.includes(event.target.textContent)) {
      // Adiciona a categoria ao array filtros
      filtros.push(event.target.textContent);

      // Altera as cores do botão
      $(`#${event.target.id}`).css('background-color', '#4DA9FF');
      $(`#${event.target.id}`).css('color', '#FFFFFF');

      // Realiza a pesquisa novamente
      pesquisaDifusa($('#input-pesquisa').val(), 1);
    } else {
      // Remove a categoria ao array filtros
      filtros.splice (filtros.indexOf(event.target.textContent), 1);

      // Altera as cores do botão
      $(`#${event.target.id}`).css('background-color', 'transparent');
      if ($('body').hasClass('dark-mode')) {
        $(`#${event.target.id}`).css('color', 'var(--azul)');
      } else {
        $(`#${event.target.id}`).css('color', '#4DA9FF');
      }
      
      // Realiza a pesquisa novamente
      pesquisaDifusa($('#input-pesquisa').val(), 1)
    }
  })
})

// Inicializa o Fuse.js com os dados
function inicializaFuze(dados) {
  // Define as configurações para o Fuse.js
  const opcoes = {
    keys: ["id", "nome", "categoria", "descricao", "owner", "defasagem", "database", "caminho", "verificacao_governanca", "dado_sensivel"],
    includeScore: true,
    threshold: 0.3,
    ignoreLocation: true,
    minMatchCharLength: 2
  };

  // Inicializa o Fuse.js com os dados e configurações
  fuse = new Fuse(dados, opcoes);
}

// Oculta a barra de resultados e a paginação
listaPaginacao.style.display = "none";

// Função que executa a pesquisa difusa
function pesquisaDifusa(valor, pagina) {
  // Verifica se o input do valor é vazio
  if (valor === '') {
    // Esconde a barra e o número de resultados
    barra.style.display = "none";
    barraResultados.textContent = '';
    listaPaginacao.style.display = "none";
    return;
  }

  // Executa o "fuzzy search" e filtra de acordo com o array filtros
  const resultados = fuse.search(valor).filter(resultado => {
    if (filtros.includes(resultado.item.categoria) || filtros[0] === undefined){
      return true;
    }
  });

  // Ordena os itens pelos resultados
  const resultadosOrdenados = resultados.map(({ item, score }) => ({ item, score }))
  .sort((a, b) => {

    // Verifica se "verificacao_governanca" contém "S"
    const aTemS = a.item.verificacao_governanca.includes("S");
    const bTemS = b.item.verificacao_governanca.includes("S");

    // Ordena de acordo com a presença de "S" em "verificacao_governanca"
    if (aTemS && !bTemS) {
      // a vem antes de b
      return -1; 
    } else if (!aTemS && bTemS) {
      // b vem antes de a
      return 1; 
    } else {
      // Sem mudança na ordenação
      return 0; 
    }
  });

  // Armazena os elementos visíveis e o número de cartões mostrados
  const visibilidadeItem = new Set();
  let cartoesMostrados = 0;

  // Verifica se o número de resultados é menor ou igual ao cartoesMaximos
  if (resultadosOrdenados.length <= cartoesMaximos) {
    resultadosOrdenados.forEach(({ item }) => {
      if (!item) {
        return;
      }
      // Remove a classe "hide" do elemento
      item.element.classList.remove("hide");

      // Adiciona o elemento ao conjunto de elementos visíveis
      visibilidadeItem.add(item.element);

      // Incrementa o contador de cartões mostrados
      cartoesMostrados++;
    });
  } else {
    // Calcula o índice inicial e final dos resultados a serem mostrados na página
    const indiceInicial = (pagina - 1) * cartoesMaximos;
    const indiceFinal = Math.min(indiceInicial + cartoesMaximos, resultadosOrdenados.length);

    // Exibe os itens correspondentes nos resultados da pesquisa
    for (let i = indiceInicial; i < indiceFinal; i++) {
      const { item, score } = resultadosOrdenados[i];
      if (!item) {
        break;
      }
      // Remove a classe "hide" do elemento
      item.element.classList.remove("hide");

      // Adiciona o elemento ao conjunto de elementos visíveis
      visibilidadeItem.add(item.element);

      // Incrementa o contador de cartões mostrados
      cartoesMostrados++;
    }
  }

  // Oculta os itens que não estão nos resultados da pesquisa
  for (const tabela of tabelas) {
    // Verifica se o elemento não está no conjunto de elementos visíveis
    if (!visibilidadeItem.has(tabela.element)) {
      // Adiciona a classe "hide" ao elemento
      tabela.element.classList.add("hide");
    }
  }

  // Atualiza a barra de resultados e a paginação
  if (cartoesMostrados !== 0) {
    // Exibe a barra de resultados e a paginação
    barraResultados.textContent = "Resultados: " + resultados.length;
    // Exibe a barra de resultados e a paginação
    barra.style.display = "block";
    listaPaginacao.style.display = "block";
  }
}

// Adiciona um "EventListener" colocando um click a cada item do link, que são os botões da paginação
paginationLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    // Obtém o número da página
    const pagina = parseInt(link.textContent);
    // Executa a pesquisa difusa
    pesquisaDifusa(inputPesquisa.value.toLowerCase().replace(/[^a-zA-Z0-9_.-/]/g, ""), pagina);
  });
});

// Evento acionado quando houver alterações no campo de entrada
inputPesquisa.addEventListener("input", (e) => {
  // Obtém o valor do campo de entrada
  const valor = e.target.value.toLowerCase().replace(/[^a-zA-Z0-9_.-/]/g, "");
  // Executa a pesquisa difusa
  pesquisaDifusa(valor, 1);
});

// Função que muda a quantidade máxima de cartões a serem mostrados
function quantidadeMaxima(opcao) {
  cartoesMaximos = parseInt(opcao);
  // Executa a pesquisa difusa novamente
  const valor = inputPesquisa.value.toLowerCase().replace(/[^a-zA-Z0-9_.-/]/g, "");
  pesquisaDifusa(valor, 1);
}

// Realiza uma requisição fetch para mostrar todas as tabelas favoritadas
fetch("/favoritos/ids")
  .then((res) => res.json())
  .then((data) => {
    // Mapeia os dados retornados pelo endpoint
    data = data.map((favorito) => {
      // Retorna o id da tabela e armazena no array listaFavoritos
      listaFavoritos.push(favorito.id);
    });
  // Realiza uma requisição fetch para mostrar todas as tabelas e inicializa o Fuse.js
  fetch("/tabelas")
  .then((res) => res.json())
  .then((data) => {
    // Mapeia os dados da tabela para criar elementos de cartão e armazenar informações
    tabelas = data.map((tabela) => {
      // Preenche os elementos do DOM com as informações da tabela
      const card = template.content.cloneNode(true).children[0];
      const nome = card.querySelector("[data-nome]");
      const assunto = card.querySelector("[data-assunto]");
      const desc = card.querySelector("[data-desc]");
      const origem = card.querySelector("[data-origem]");
      const idTabela = card.querySelector("[data-id-tabela]");
      const idBd = card.querySelector("[data-id-bd]");
      const idTabelaFavorito = card.querySelector("[data-id-tabela-favorito]");
      const divDado = card.querySelector('[data-icone-sensivel]');
      const dadoSensivel = card.querySelector('[data-sensivel]');
      const favorito = card.querySelector('[data-imagem-favorito]');
      const divVerificacao = card.querySelector('[data-icone-verificacao]')
      const verificacao = card.querySelector('[data-verificacao]');

      nome.textContent = tabela.nome;
      assunto.textContent = tabela.categoria;
      desc.textContent = tabela.descricao;
      origem.textContent = tabela.database;
      idTabela.value = tabela.id;
      idBd.value = tabela.id_bd;
      idTabelaFavorito.value = tabela.id;
      dadoSensivel.value = tabela.dado_sensivel;
      verificacao.value = tabela.verificacao_governanca;
      container.append(card);

      // Verifica se a tabela é sensível e exibe o ícone
      if(dadoSensivel.value == "S"){
        divDado.style.display = "block";
      } else {
        divDado.style.display = "none";
      }

      // Verifica se a tabela é verificada e exibe o ícone
      if(verificacao.value == "S"){
        divVerificacao.style.display = "block";
      } else {
        divVerificacao.style.display = "none";
      }

      // Verifica se a tabela é favorita e, caso seja, exibe o ícone de favorito preenchido
      if(listaFavoritos.includes(tabela.id)){
        favorito.src = "../assets/img/favoritoPreenchido.svg";
      }

      // Retorna um objeto com as informações da tabela
      return {
        nome: tabela.nome,
        categoria: tabela.categoria,
        descricao: tabela.descricao,
        owner: tabela.owner,
        defasagem: tabela.defasagem,
        database: tabela.database,
        caminho: tabela.caminho,
        id: tabela.id,
        verificacao_governanca: tabela.verificacao_governanca,
        dadoSensivel: tabela.dado_sensivel,
        verificacao: tabela.verificacao_governanca,
        element: card
      };
    });

    // Inicializa o Fuse.js com os dados da tabela
    inicializaFuze(tabelas);

    // Exibe todos os resultados em uma única página se a quantidade for menor ou igual ao cartoesMaximos
    if (tabelas.length <= cartoesMaximos) {
      // Executa a pesquisa difusa
      pesquisaDifusa("", 1);
    }
  })
  .catch((error) => {
    // Tratamento de erros para qualquer um dos fetches
    console.error(error);
  });
});