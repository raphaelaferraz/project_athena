// Seleciona os elementos do DOM
const template = document.querySelector("[data-template]");
const container = document.querySelector("[data-container]");
const inputPesquisaCampos = document.querySelector("[data-input-pesquisa]");

// Armazena os dados dos favoritos
let favoritos = [];

// Armazena o objeto Fuse.js
let fuse;

// Armazena os filtros selecionados pelo usuário
var filtros = [];

// Assim que a página carregar será verificado se o input de pesquisa está vazio
$(document).ready(() => {
  // Caso esteja vazio, exibe todos os favoritos
  if($("#input-pesquisa") == "") {
    container.innerHTML = '';
    exibir();
  } 

  // Armazena o estado da div que exibe os filtros (aberto ou fechado)
  var toggle = true;
  $(document).on("click", "#btn-filtro", () => {
    // Ao clicar, caso esteja fechado ele abre
    if (toggle) {
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
  $(document).on("click", ".filtro-button", (event) => {
    // caso o array filtros não incluir o filtro selecionado
    if (!filtros.includes(event.target.textContent)) {
      // Adiciona a categoria ao array filtros
      filtros.push(event.target.textContent);

      // Altera as cores do botão
      $(`#${event.target.id}`).css("background-color", "#4DA9FF");
      $(`#${event.target.id}`).css("color", "#FFF");

      // Realiza a pesquisa novamente
      $("#input-pesquisa").val() !== ""
        pesquisaDifusa($("#input-pesquisa").val());
    } else {
      // Remove a categoria ao array filtros
      filtros.splice(filtros.indexOf(event.target.textContent), 1);

      // Altera as cores do botão
      $(`#${event.target.id}`).css("background-color", "transparent");
      $(`#${event.target.id}`).css("color", "#4DA9FF");

      // Realiza a pesquisa novamente
      $("#input-pesquisa").val() !== ""
        pesquisaDifusa($("#input-pesquisa").val());
    }
  });
});

// Inicializa o Fuse.js com os dados
function inicializaFuze(dados) {
  // Define as configurações para o Fuse.js
  const opcoes = {
    keys: ["tipo", "nome", "descricao"],
    includeScore: true,
    threshold: 0.3,
    ignoreLocation: true,
    minMatchCharLength: 2,
  };
  // Inicializa o Fuse.js com os dados e configurações
  fuse = new Fuse(dados, opcoes);
}

// Função que executa a pesquisa difusa
function pesquisaDifusa(valor) {
  if (valor !== "") {
    // Executa o "fuzzy search" e filtra de acordo com o array filtros
    const resultados = fuse.search(valor).filter((resultado) => {
      // Verifica se o array filtros inclui a categoria do resultado
      if (
        filtros.includes(resultado.item.categoria) ||
        filtros[0] === undefined
      ) {
        return true;
      }
    });

    // Verifica se o array filtros está vazio
    if (filtros[0] !== undefined && valor === "") {
      filtros.map(filtro => {
        let teste = fuse.search(filtro).filter(resultado => {
          // Verifica se o array filtros inclui a categoria do resultado
          if (
            filtros.includes(resultado.item.categoria) ||
            filtros[0] === undefined
          ) {
            return true;
          }
        }).map(search => {
          resultados.push(search);
          console.log(resultados);
        });
      });
    }

    // Armazena os elementos visíveis
    const visibilidadeItem = new Set();

    // Exibe os itens correspondentes nos resultados da pesquisa
    for (const { item, score } of resultados) {
      // Remove a classe "hide" do elemento
      item.element.classList.remove("hide");

      // Adiciona o elemento ao conjunto de elementos visíveis
      visibilidadeItem.add(item.element);
    }

    // Oculta os itens que não estão nos resultados da pesquisa
    for (const favorito of favoritos) {
      // Verifica se o elemento não está no conjunto de elementos visíveis
      if (!visibilidadeItem.has(favorito.element)) {
        // Adiciona a classe "hide" ao elemento
        favorito.element.classList.add("hide");
      }
    }
  } else {
    // Caso o campo de pesquisa esteja vazio, exibe todos os favoritos 
    container.innerHTML = '';
    exibir();
  }
}

// Evento acionado quando houver alterações no campo de entrada
inputPesquisaCampos.addEventListener("input", (e) => {
  // Obtém o valor do campo de entrada
  const valor = e.target.value.toLowerCase().replace(/[^a-zA-Z0-9_.-]/g, "");

  // Executa a pesquisa difusa
  pesquisaDifusa(valor);
});

function exibir () {
  // Realiza uma requisição fetch e inicializa o Fuse.js
  fetch("/favoritos")
    .then((res) => res.json())
    .then((data) => {
      // Mapeia os dados de favoritos para criar elementos de cartão e armazenar informações
      favoritos = data.map((favoritos) => {
        if (filtros.includes(favoritos.categoria) || filtros[0] === undefined) {
          // Preenche os elementos do DOM com as informações da tabela
          const card = template.content.cloneNode(true).children[0];
          const tipo = card.querySelector("[data-categoria]");
          const nome = card.querySelector("[data-nome]");
          const desc = card.querySelector("[data-descricao]");
          const origem = card.querySelector("[data-origem]");
          const categoria = card.querySelector("[data-categoria]");
          const divDado = card.querySelector("[data-icone-sensivel]");
          const dadoSensivel = card.querySelector("[data-sensivel]");
          const id = card.querySelector("[data-id-tabela]");
          const idTabelaFavoritada = card.querySelector(
            "[data-id-tabela-favoritada]"
          );
          id.value = favoritos.id_tabela;
          idTabelaFavoritada.value = favoritos.id_tabela;
          tipo.textContent = favoritos.tipo;
          nome.textContent = favoritos.nome;
          desc.textContent = favoritos.descricao;
          categoria.textContent = favoritos.categoria;
          dadoSensivel.value = favoritos.dado_sensivel;
          origem.textContent = favoritos.database;
          container.append(card);
    
          // Verifica se a tabela é sensível e exibe o ícone
          if (dadoSensivel.value == "S") {
            divDado.style.display = "block";
          } else {
            divDado.style.display = "none";
          }
    
          // Retorna um objeto com as informações de favoritos
          return {
            id: favoritos.id_tabela,
            idTabelaFavoritada: favoritos.id_tabela,
            tipo: favoritos.tipo,
            nome: favoritos.nome,
            desc: favoritos.descricao,
            categoria: favoritos.categoria,
            dadoSensivel: favoritos.dado_sensivel,
            origem: favoritos.database,
            element: card,
          };
        }
      });
      // Inicializa o Fuse.js com os dados de favoritos
      inicializaFuze(favoritos);
    });
}

exibir();
