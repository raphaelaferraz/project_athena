// Inicia o Jquery
$(document).ready(function() {
    // Variável que armazena o item "nightMode"
    var nightMode = localStorage.getItem('nightMode');

    // Se nightMode for verdadeiro, liga o modo noturno, caso contrário, desliga ele
    if (nightMode === 'true') {
      ligaModoNoturno(); 
    } else {
      desligaModoNoturno() 
    }
  // Botão que define a ativação do switch do modo noturno
    $('#botao-noturno').click(function() {
      toggleModoNoturno(); 
    });

  // Função que remove a classe de css e volta as imagens para seu modo claro
    function desligaModoNoturno() {
      $('body').removeClass('dark-mode');
      $('#night-mode-toggle').text('Enable Night Mode');
      localStorage.setItem('nightMode', 'false');
      logoImage = document.getElementById('pan-logo');
      logoImage.src = '../assets/img/logoBancoPan.svg';
      logoAthena = document.getElementById('athena-logo');
      logoAthena.src = '../assets/img/logoProjeto.svg';
      voltarBotao = document.getElementById('voltar');
      voltarBotao.src = '../assets/img/voltar.svg';
    }

// Função que adiciona a classe css e altera as imagens para modo noturno
    function ligaModoNoturno() {
      $('body').addClass('dark-mode');
      $('#night-mode-toggle').text('Disable Night Mode');
      localStorage.setItem('nightMode', 'true');
      logoImage = document.getElementById('pan-logo');
      logoImage.src = '../assets/img/logoPbranco1.svg';
      logoAthena = document.getElementById('athena-logo');
      logoAthena.src = '../assets/img/athenaLogoBranco.svg';
      voltarBotao = document.getElementById('voltar');
      voltarBotao.src = '../assets/img/voltarBranco.svg';
    }
    
  // Verifica se o modo noturno esta presente ou não e define se ele será ligado ou não baseado nisso
    function toggleModoNoturno() {
      if ($('body').hasClass('dark-mode')) {
        desligaModoNoturno();
      } else {
        ligaModoNoturno();
      }
    }
  });