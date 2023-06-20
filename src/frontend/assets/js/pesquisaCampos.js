// Seleciona os elementos do DOM
const template = document.querySelector("[data-template]");
const container = document.querySelector("[data-container]");
const inputPesquisaCampos = document.querySelector("[data-input-pesquisa]");
const filtroInput = document.querySelector("#tipo-campo");

// Armazena a URL atual
let urlCampos = new URL(window.location.href);

// Armazena os parâmetros da URL
let paramsCampos = urlCampos.searchParams;

// Obtém o valor do parâmetro "id" que está na URL
let idBd = paramsCampos.get('id_bd');

// Cria uma nova URL com base no "id" da tabela caputrado acima
urlCampos = '/campos?id_bd=' + idBd;

// Armazena os dados dos campos
let campos = [];

// Armazena o objeto Fuse.js
let fuse;

// Armazena o valor do filtro de campos
let filtro = "";

// Monitora a mudança do filtro de campos
filtroInput.onchange = (event) => {
  // caso o valor selecionado for igual a "tipo-campo" significa que nenhum campo foi selecionado
  event.target.value === "tipo-campo"
    ? (filtro = "")
    // caso contrario a variavel filtro deve possuir o mesmo valor do input select
    : (filtro = event.target.value);
  exibir(filtro)
};

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
    // Executa a pesquisa difusa
    const resultados = fuse.search(valor);
  
    // Armazena os elementos visíveis
    const visibilidadeItem = new Set();
  
    // Exibe os itens correspondentes nos resultados da pesquisa
    for (const { item, score } of resultados) {
      console.log(item);
      // Remove a classe "hide" do elemento
      item.element.classList.remove("hide");
  
      // Adiciona o elemento ao conjunto de elementos visíveis
      visibilidadeItem.add(item.element);
    }
  
    // Oculta os itens que não estão nos resultados da pesquisa
    for (const campo of campos) {
      // Verifica se o elemento não está no conjunto de elementos visíveis
      if (!visibilidadeItem.has(campo.element)) {
        // Adiciona a classe "hide" ao elemento
        campo.element.classList.add("hide");
      }
    }
  } else {
    container.innerHTML = '';
    exibir('');
  }
}

// Evento acionado quando houver alterações no campo de entrada
inputPesquisaCampos.addEventListener("input", (e) => {
  // Obtém o valor do campo de entrada
  const valor = e.target.value.toLowerCase().replace(/[^a-zA-Z0-9_.-]/g, "");

  // Executa a pesquisa difusa
  pesquisaDifusa(valor);
});

// Função que exibe os campos
function exibir(filtro) {
  container.innerHTML = ''
  // Realiza uma requisição fetch e inicializa o Fuse.js
  fetch(urlCampos)
    .then((res) => res.json())
    .then((data) => {
      // Mapeia os dados do campo para criar elementos de cartão e armazenar informações
      campos = data.map((variaveis) => {
        if (variaveis.tipo_campo === filtro || filtro === "") {
          // Preenche os elementos do DOM com as informações da tabela
          const card = template.content.cloneNode(true).children[0];
          const tipo = card.querySelector("[data-tipo]");
          const nome = card.querySelector("[data-nome]");
          const desc = card.querySelector("[data-desc]");
          tipo.textContent = variaveis.tipo_campo;
          nome.textContent = variaveis.nome_campo;
          desc.textContent = variaveis.descricao_campo;
          container.append(card);

          // Retorna um objeto com as informações do campo
          return {
            tipo: variaveis.tipo_campo,
            nome: variaveis.nome_campo,
            descricao: variaveis.descricao_campo,
            element: card,
          };
        }
      });
      filtroInput.innerHTML = options
      // Inicializa o Fuse.js com os dados do campo
      inicializaFuze(campos);
    });
}

// Executa a função exibir
exibir("");

// Adiciona os filtros possiveis para esta tabela
fetch(urlCampos)
.then(res => res.json())
.then(data => {
    // Armazena os filtros que já foram adicionados na tag Select
    var lastOptions = []
    // Armazena o html que contem todas as options
    var options = '<option value="tipo-campo" class="secao-conteudo__div-pesquisa__select__opcao">Tipo Campo</option>'

    data.map(variaveis => {
        // Caso o filtro ainda não tenha sido adicionada no array lastOptions
        if(!lastOptions.includes(variaveis.tipo_campo)) {
            // Adiciona o html na string options
            options += `<option value="${variaveis.tipo_campo}" class="secao-conteudo__div-pesquisa__select__opcao">${variaveis.tipo_campo}</option>`
            // Adiciona no array lastOptions
            lastOptions.push(variaveis.tipo_campo)
        }
    })
    // Implementa a string Options como filha do input de filtros no documento html
    filtroInput.innerHTML = options
}) 