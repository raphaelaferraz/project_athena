// Aguarda o carregamento completo do documento HTML antes de executar o código
$(document).ready(function () {
  // Evento acionado quando há entrada de texto no elemento com o ID "input-pesquisa"
  $('#input-pesquisa').on('input', function () {
    // Obtém o valor atual do campo de entrada de texto
    var inputValue = $(this).val();

    // Verifica se há algum texto digitado
    if (inputValue.length > 0) {
      // Atualiza estilos e posições para a pesquisa ativa
      $('#secao-input').css('top', '25%');
      $('.secao-pesquisa__titulo').css('font-size', '40px');
      $('.secao-pesquisa__div-pesquisa__input').css('width', '450px');
      $('.secao-tabelas__lista').css('display', 'block');
      $('.secao-pesquisa').css('position', 'initial');
      $('.secao-pesquisa').css('transform', 'none');
      $('.cabecalho__div-voltar__imagem').css('display', 'block');
      $('.cabecalho__div-voltar__imagem').css('margin-top', '1rem');
      $('.cabecalho__div-voltar__imagem').css('margin-left', '1.2rem');
    } else {
      // Atualiza estilos e posições para a pesquisa inativa
      $('#secao-input').css('top', '50%');
      $('.secao-pesquisa__titulo').css('font-size', '70px');
      $('.secao-pesquisa__div-pesquisa__input').css('width', '550px');
      $('.secao-tabelas__lista').css('display', 'none');
      $('.secao-pesquisa').css('position', 'absolute');
      $('.secao-pesquisa').css('transform', 'translate(-50%, -50%)');
      $('.cabecalho__div-voltar__imagem').css('display', 'none');
    }
  });

  // Evento acionado quando um item da lista é clicado
  $(document).on('click', '.secao-tabelas__lista__item__div-paragrafo', function (event) {
    // Obtém o ID da tabela associado ao item clicado
    var idTabela = $(this).find('[data-id-tabela]').val();
    var idBd = $(this).find('[data-id-bd]').val();
    var url = 'informacoesTabela?id=' + idTabela + "&id_bd=" + idBd;
    // Redireciona para a URL com base no ID da tabela
    window.location.href = url;
  });

  // Evento acionado quando o botão de favorito é clicado
  $(document).on('click', '.secao-tabelas__lista__item__div-informacoes__div-icones__botao-favorito', function (event) {
    var idTabelaFavorito = $(this).find('[data-id-tabela-favorito]').val();
    var url = '/favoritos/inserirTabela?id_tabela=' + idTabelaFavorito;
    window.location.href = url;
  });

  // Evento acionado quando o elemento com o ID "visao-geral" é clicado
  $(document).on('click', '#visao-geral', function (event) {
    // Verifica se a caixa de seleção está marcada
    if ($(this).is(':checked')) {
      // Atualiza a altura da tag main quando o input 'visao-geral' for ativo
      $('.principal-detalhes-tabelas').css('min-height', '160vh');
    }
  });

  // Evento acionado quando o elemento com o ID "campos" é clicado
  $(document).on('click', '#campos', function(event) {
    // Verifica se a caixa de seleção está marcada
    if ($(this).is(':checked')) {
      // Atualiza a altura da tag main quando o input 'campos' for ativo
      $('.secao-conteudo__secao-campos__lista').css('margin-bottom', '2rem');
  
      // Armazena o elemento <main>
      var elemento = $('#main');
  
      // Obtém a altura do elemento <main>
      var alturaElemento = elemento.prop('scrollHeight');
      
      // Aplica a altura calculada
      elemento.css('height', alturaElemento + 'px');
    }
  });

  $(document).on('click', '#feedback', function (event) {
    // Verifica se a caixa de seleção está marcada
    if ($(this).is(':checked')) {
      // Atualiza a altura da tag main quando o input 'feedback' for ativo
      $('.principal-detalhes-tabelas').css('min-height', '130vh');
    }
  });

  // Altera a imagem do botão que exibe os filtros
  $('#btn-filtro').hover(() => {
    $('#Preenchido').css('display', 'inline')
    $('#Vazio').css('display', 'none')
  }, () => {
    $('#Preenchido').css('display', 'none')
    $('#Vazio').css('display', 'inline')
  })

  // Altera a imagem do botão que exibe os filtros
  $('#btn-favoritos').hover(() => {
    $('#FavoritoPreenchido').css('display', 'inline')
    $('#FavoritoVazio').css('display', 'none')
  }, () => {
    $('#FavoritoPreenchido').css('display', 'none')
    $('#FavoritoVazio').css('display', 'inline')
  })

  // Armazena o botão de edição 
  const botaoEditar = document.querySelectorAll(".secao-conteudo__secao-descricao__div__botao-editar");

  // Armazena a tag main
  const main = document.querySelector(".principal-detalhes-tabelas");

  // Percorre por todos os botões de edição
  botaoEditar.forEach((botao) => {
    // Adiciona um evento de clique para cada botão de edição
    botao.addEventListener("click", () => {
      
      // Armazena o pop-up de edição
      const popUp = document.getElementById("editar-pop-up");
      // Exibe o pop-up de edição
      popUp.style.display = "block";

      // Atualiza a altura da tag main
      main.style.minHeight = "170vh";
      
      // Armazena o botão de salvar edição
      const salvarEdicao = document.getElementById("enviar-solicitacao");

      // Adiciona um evento de clique para o botão de salvar edição
      salvarEdicao.addEventListener("click", () => {
        // Armazena os novos valores de cada input de acordo com o ID
        const novoDescricao = document.getElementById("descricao").value;
        const novoConjuntoDados = document.getElementById("conjunto-dados").value;
        const novoOwner = document.getElementById("owner").value;
        const novoSteward = document.getElementById("steward").value;
        const novoAtivo = document.getElementById("ativo").value;
        const novoTipoAtivo = document.getElementById("tipo-ativo").value;
        const novoDatabase = document.getElementById("database").value;
        const novoCaminhoTabela = document.getElementById("caminho-tabela").value;
        const novoUltimaAtualizacao = document.getElementById("ultima-atualizacao").value;
        const novoDataCriacao = document.getElementById("data-criacao").value;
        const novoDefasagem = document.getElementById("defasagem").value;
        const novoFrequenciaAtualizacao = document.getElementById("frequencia-atualizacao").value;
        const novoEngenheiroIngestao = document.getElementById("engenheiro-ingestao").value; 
      
        // Atualiza os valores de cada input de acordo com o ID
        botao.parentElement.querySelector("").textContent = novoDescricao;
        botao.parentElement.querySelector("").textContent = novoConjuntoDados;
        botao.parentElement.querySelector("").textContent = novoOwner;
        botao.parentElement.querySelector("").textContent = novoSteward;
        botao.parentElement.querySelector("").textContent = novoAtivo;
        botao.parentElement.querySelector("").textContent = novoTipoAtivo;
        botao.parentElement.querySelector("").textContent = novoDatabase;
        botao.parentElement.querySelector("").textContent = novoCaminhoTabela;
        botao.parentElement.querySelector("").textContent = novoUltimaAtualizacao;
        botao.parentElement.querySelector("").textContent = novoDataCriacao;
        botao.parentElement.querySelector("").textContent = novoDefasagem;
        botao.parentElement.querySelector("").textContent = novoFrequenciaAtualizacao;
        botao.parentElement.querySelector("").textContent = novoEngenheiroIngestao;
        
        // Oculta o pop-up de edição
        popUp.style.display = "none";
      });
      
      // Armazena o botão de fechar pop-up
      const fecharPopUp = document.getElementById("fechar-pop-up");

      // Adiciona um evento de clique para o botão de fechar pop-up
      fecharPopUp.addEventListener("click", () => {
        // Oculta o pop-up de edição
        popUp.style.display = "none";

        // Atualiza a altura da tag main
        main.style.minHeight = "160vh";
      });
      
      // Fecha o pop-up de edição quando o usuário clicar fora do pop-up
      window.addEventListener("click", (event) => {
        // Verifica se o usuário clicou fora do pop-up
        if (event.target === popUp) {
          // Oculta o pop-up de edição
          popUp.style.display = "none";

          // Atualiza a altura da tag main
          main.style.minHeight = "160vh";
        }
      });
    });
  });

});

