$(document).ready(function () {
  // Evento acionado quando o elemento com o ID "input-menu" é clicado
  $('#input-menu').on('click', function () {
    // Verifica se a caixa de seleção está marcada
    if ($(this).prop('checked')) {
      // Atualiza estilos e posição do menu quando marcado
      $('#div-menu').css('position', 'absolute');
      $('#div-menu').css('left', '18.7rem');
      $('#input-menu').css('position', 'absolute');
      $('#input-menu').css('left', '18.7rem');
    } else {
      // Remove estilos e retorna à posição padrão quando não marcado
      $('#div-menu').css('position', 'initial');
      $('#input-menu').css('left', '0rem');
    }
  });
});