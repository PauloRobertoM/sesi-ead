var total_paginas = 0;
var pagina_atual  = 0;
var tituloScorm = "Linguagens, códigos e suas tecnologias";
var classeEnsino = "ENSINO MÉDIO";

$(document).ready(function () {
    $(".tituloScorm").append(tituloScorm);
    $(".classeEnsino").append(classeEnsino);
});

var desabilitarNavegacao = function(){
    $('.btns-footer').css('display', 'none');
}

var habilitarNavegacao = function(_somOff){
    $('.btns-footer').removeAttr('style');
}

var marcarUltimaPagina = function(){
    if($('body').attr('data-tipo') != 'home') {
        if($('body').attr('data-tipo') == 'meu_percurso' ||
            $('body').attr('data-tipo') == 'home_video' ||
            $('body').attr('data-tipo') == 'fase_atual' ||
            $('body').attr('data-tipo') == 'minhas_medalhas'){

            if($('body').attr('data-tipo') == 'fase_atual'){
                parent.dados.ultimaFaseAcessada 	  = $('body').attr('data-fase');
                parent.dados.ultimoTipoPaginaAcessada = 'fase';
            }else{
                parent.dados.ultimoTipoPaginaAcessada = $('body').attr('data-tipo');
            }
        }else{
            parent.dados.ultimoTipoPaginaAcessada = 'acao';
        }
        parent.setarDados();
    }
}

$(document).ready(function(){
    // Preloader;
    setTimeout(function(){
        $('.carregando').css('display', 'none');
        $('#stage0').removeClass('hidden').css('display', 'none').fadeIn('slow');
    }, 2000);

    // Verifica a navegação;
    if($('body').attr('data-navegacao') == 'false'){
        parent.controlarNavegacao(false);
    }else{
        parent.controlarNavegacao(true, pagina_atual, total_paginas);
        if($('body').attr('data-desabilitado')){
            desabilitarNavegacao();
        }
    }

    // Textarea;
    $('textarea').on('keyup keydown keypress onpaste focus', function (e){
        if($(this).val() == ''){
            $(this).val("\t");
        }
    });

    $("textarea").keydown(function(e) {
        var $this, end, start;

        if (e.keyCode === 9) {
            start = this.selectionStart;
            end = this.selectionEnd;
            $this = $(this);
            $this.val($this.val().substring(0, start) + "\t" + $this.val().substring(end));
            this.selectionStart = this.selectionEnd = start + 1;
            return false;
        }

        if (e.keyCode === 13){
            e.preventDefault();
            start = this.selectionStart;
            end = this.selectionEnd;
            $this = $(this);
            $this.val($this.val().substring(0, start) + "\n\t" + $this.val().substring(end));
            this.selectionStart = this.selectionEnd = start + 2;
            return false;
        }
    });

    $(document).on("input", "textarea", function () {
        var limite = 2000;
        var caracteresDigitados = $(this).val().length;
        var caracteresRestantes = limite - caracteresDigitados;
        $(".limit-text span").text(caracteresRestantes);
    });

    marcarUltimaPagina();
});

// Quiz
var total_erros    = 0;
var total_acertos  = 0;
var total_corretas = 0;

var iniciarPergunta = function(){
    total_erros    = 0;
    total_acertos  = 0;
    total_corretas = 0;

    // Verifica quantas corretas existem;
    $(".alternativas").each(function(index, elemento) {
        if($(elemento).attr('data-correto') == 1){
            total_corretas++;
        }
    });

    var travar_avanco = true;

    if(parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].status != 'concluido'){
        travar_avanco = true;
    }else{
        travar_avanco = false;
    }

    if(travar_avanco){
        desabilitarNavegacao();
    }else{
        habilitarNavegacao();
        $('.btn-verde').css('color', 'transparent');
        $('.btn-verde').css('background-color', 'transparent');
        $('.alternativas').removeAttr('onclick');
        $('.alternativas[data-correto="1"]').addClass('correto');
    }
}

var selecionarAlternativa = function(_alternativa){
    if(total_corretas == 1){
        // Limpa todas as seleções;
        $(".alternativas").each(function(index, elemento) {
            $(elemento).removeClass('selecionado');
        });
    }
    _alternativa.toggleClass('selecionado');
}

var responderPergunta = function(){
    // Verifica quantos acertos obtivemos:
    total_erros   = 0;
    total_acertos = 0;

    $(".alternativas").each(function(index, elemento) {
        if($(elemento).hasClass('selecionado')){
            if($(elemento).attr('data-correto') == 1){
                total_acertos++;
            }else{
                total_erros++;
            }
        }
    });

    // Marca quantidade de alternativas;
    if(parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].status == 'em_andamento'){
        if(total_erros != 0 || total_corretas != total_acertos){
            console.log('aqui!');
            parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].nTentativas[parent.paginaAtual] += 1;
            parent.setarDados();
        }
        parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].nTentativas[parent.paginaAtual] += 1;
        parent.setarDados();
    }

    if(total_erros == 0 && total_corretas == total_acertos){
        $(".alternativas").removeAttr('onclick');
        habilitarNavegacao();
        $('.btn-verde').css('color', 'transparent');
        $('.btn-verde').css('background-color', 'transparent');
        $('.alternativas[data-correto="1"]').addClass('correto-bg');
    }else{
        habilitarNavegacao();
        $('.btn-verde').css('color', 'transparent');
        $('.btn-verde').css('background-color', 'transparent');
        $('.alternativas').removeAttr('onclick');
        $('.alternativas[data-correto="1"]').addClass('correto-bg');
        swal({
            title: 'Atenção!',
            type: 'error',
            text: 'Resposta incorreta. Veja as respostas corretas destacadas em verde.',
            confirmButtonText: 'Ok',
            allowOutsideClick: false,
            showCancelButton: false
        });
    }
}

// Pergunta verdadeiro ou falso
var total_alternativas = 0;
var total_falso				 = 0;
var total_verdadeiro   = 0;

var iniciarPerguntaVerdadeiroOuFalso = function(){
    total_erros   = 0;
    total_acertos = 0;
    total_verdadeiros = 0;
    total_falso       = 0;
    $('.alert').css('display', 'none');

    // Verifica quantas corretas existem;
    $(".alternativas").each(function(index, elemento) {
        total_alternativas++;
        if($(elemento).attr('data-resposta') == 'F'){
            total_falso++;
        }

        if($(elemento).attr('data-resposta') == 'V'){
            total_verdadeiros++;
        }
    });

    var travar_avanco = true;

    if(parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].status != 'concluido'){
        travar_avanco = true;
    }else{
        travar_avanco = false;
    }

    if(travar_avanco){
        desabilitarNavegacao();
    }else{
        habilitarNavegacao();
        $('.btn-verde').css('color', 'transparent');
        $('.btn-verde').css('background-color', 'transparent');
        $('.alternativas[data-resposta="V"]').find('input[value="V"]').prop('checked', true).removeAttr('onclick');
        $('.alternativas[data-resposta="F"]').find('input[value="F"]').prop('checked', true).removeAttr('onclick');
        $('.alternativas').find('input').attr('disabled', 'disabled');
    }
}

var responderPerguntaVerdadeiroOuFalso = function(){
    // Verifica quantos acertos obtivemos:
    total_erros   = 0;
    total_acertos = 0;

    $(".alternativas").each(function(index, elemento) {
        var resposta = $(elemento).attr('data-resposta');
        if(resposta == 'V' && $(elemento).find('input[value="V"]').is(':checked')){
            total_acertos++;
        }else if(resposta == 'F' && $(elemento).find('input[value="F"]').is(':checked')){
            total_acertos++;
        }else{
            total_erros++;
        }
    });

    // Marca quantidade de alternativas;
    if(parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].status != 'concluido'){
        if(total_erros != 0 || total_alternativas != total_acertos){
            parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].nTentativas[parent.paginaAtual] += 1;
            parent.setarDados();
        }
        parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].nTentativas[parent.paginaAtual] += 1;
        parent.setarDados();
    }

    if(total_erros == 0 && total_alternativas == total_acertos){
        habilitarNavegacao();
        $('.btn-verde').css('color', 'transparent');
        $('.btn-verde').css('background-color', 'transparent');
        $('.alternativas[data-resposta="V"]').find('input[value="V"]').prop('checked', true).removeAttr('onclick');
        $('.alternativas[data-resposta="F"]').find('input[value="F"]').prop('checked', true).removeAttr('onclick');
        $('.alternativas').find('input').attr('disabled', 'disabled');
    }else{
        swal({
            title: 'Atenção!',
            type: 'error',
            text: 'Resposta incorreta. Veja as respostas corretas destacadas em verde.',
            allowOutsideClick: false,
            confirmButtonText: 'Ok',
            showCancelButton: false
        });
        
        habilitarNavegacao();
        $('.btn-verde').css('color', 'transparent');
        $('.btn-verde').css('background-color', 'transparent');
        $('.alternativas[data-resposta="V"]').find('input[value="V"]').prop('checked', true).removeAttr('onclick');
        $('.alternativas[data-resposta="V"]').find('input[value="V"]').next().addClass('correto-bg');
        $('.alternativas[data-resposta="F"]').find('input[value="F"]').prop('checked', true).removeAttr('onclick');
        $('.alternativas[data-resposta="F"]').find('input[value="F"]').next().addClass('correto-bg');
        $('.alternativas').find('input').attr('disabled', 'disabled');
    }
}

// Perguntas para categorizar;
// Pergunta verdadeiro ou falso
var total_alternativas = 0;
var total_a = 0;
var total_b = 0;
var total_c = 0;
var total_d = 0;
var total_e = 0;

var iniciarPerguntaCategorizar = function(){
    total_erros   = 0;
    total_acertos = 0;
    total_a = 0;
    total_b = 0;
    total_c = 0;
    total_d = 0;
    total_e = 0;

    $('.alert').css('display', 'none');

    // Verifica quantas corretas existem;
    $(".alternativas").each(function(index, elemento) {
        total_alternativas++;
        if($(elemento).attr('data-resposta') == 'a'){
            total_a++;
        }

        if($(elemento).attr('data-resposta') == 'b'){
            total_b++;
        }

        if($(elemento).attr('data-resposta') == 'c'){
            total_c++;
        }

        if($(elemento).attr('data-resposta') == 'd'){
            total_d++;
        }

        if($(elemento).attr('data-resposta') == 'e'){
            total_e++;
        }
    });

    var travar_avanco = true;

    if(parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].status != 'concluido'){
        travar_avanco = true;
    }else{
        travar_avanco = false;
    }

    if(travar_avanco){
        desabilitarNavegacao();
        mostrarAlerta = true;
    }else{
        habilitarNavegacao();
        mostrarAlerta = false;
        $('.btn-responder').remove();
        $('.alternativas').find('.checkbox').removeAttr('onclick');
        $('.alternativas[data-resposta="a"]').find('.checkbox1').addClass('selecionado');
        $('.alternativas[data-resposta="b"]').find('.checkbox2').addClass('selecionado');
        $('.alternativas[data-resposta="c"]').find('.checkbox3').addClass('selecionado');
        $('.alternativas[data-resposta="d"]').find('.checkbox4').addClass('selecionado');
        $('.alternativas[data-resposta="e"]').find('.checkbox5').addClass('selecionado');
    }
}

var selecionarResposta = function(_checkbox, _numero){
    $('.alternativa-'+_numero).find('.checkbox').removeClass('selecionado');
    _checkbox.toggleClass('selecionado');
    $('.alert').css('display', 'none');
}

var responderPerguntaCategorizar = function(){
    // Verifica quantos acertos obtivemos:
    total_erros   = 0;
    total_acertos = 0;

    $(".alternativas").each(function(index, elemento) {
        var resposta = $(elemento).attr('data-resposta');
        if(resposta == 'a' && $(elemento).find('.checkbox1').hasClass('selecionado')){
            total_acertos++;
        }else if(resposta == 'b' && $(elemento).find('.checkbox2').hasClass('selecionado')){
            total_acertos++;
        }else if(resposta == 'c' && $(elemento).find('.checkbox3').hasClass('selecionado')){
            total_acertos++;
        }else if(resposta == 'd' && $(elemento).find('.checkbox4').hasClass('selecionado')){
            total_acertos++;
        }else if(resposta == 'e' && $(elemento).find('.checkbox5').hasClass('selecionado')){
            total_acertos++;
        }else{
            total_erros++;
        }
    });

    if(total_erros > 0 || total_alternativas != total_acertos){
        swal({
            title: 'Atenção!',
            type: 'error',
            text: 'Resposta incorreta, tente novamente.',
            allowOutsideClick: false,
            confirmButtonText: 'Ok',
            showCancelButton: false
        });
        total_acertos = 0;
        total_erros = 0;
    }

    // Marca quantidade de alternativas;
    if(parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].status != 'concluido'){
        parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].nTentativas[parent.paginaAtual] += 1;
        parent.setarDados();
    }

    if(total_erros == 0 && total_alternativas == total_acertos){

        $(".alternativas .checkbox").removeAttr('onclick');
        $('.btn-responder').removeAttr('onclick').css('opacity', 0.5).css('cursor', 'default');

        $('.alert-success').fadeIn('slow');

        if(parent.paginaAtual == parent.dados_final_fase['fase'+parent.faseAtual]['acao'+parent.acaoAtual]){
            parent.finalizarAcao();
        }else{

            swal({
                title: 'Parabéns!',
                type: 'success',
                allowOutsideClick: false,
                confirmButtonText: 'Avançar',
            }).then(
                function () {
                    parent.avancarTela(true);
                },
                function (dismiss) {
                    habilitarNavegacao();
                }
            );

        }

    }

}

var mostrarAlerta;
var total_vistos = 0;
var total_videos = 0;
var iniciarPlayVideo = function(){

    // Realizar contagem de vídeos;
    total_videos = parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].vistos.length - 1;

    if(parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].status != 'concluido'){
        desabilitarNavegacao();
    }else{
        habilitarNavegacao();
    }

}

var playVideo = function(_video, _numero){

    var video = document.getElementById(_video);

    video.currentTime = 0;
    video.play();

    video.addEventListener("ended", function(){

        if(!parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].vistos[_numero]){

            total_vistos++;

            parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].vistos[_numero] = true;
            parent.setarDados();

        }

        if(total_vistos >= total_videos){
            habilitarNavegacao();
        }

        fecharVideo();

    });

}

var abrirInfo = function(_number){

    $('.fundo-info, .fundo-info .box-info').css('display', 'none');

    $('#info-'+_number).css('display', 'block');
    $('.fundo-info').fadeIn('slow');

}

var fecharInfo = function(){

    $('.fundo-info').fadeOut('slow');

}

var abrirVideo = function(_number, _numberCheck){

    $('.fundo-video, .fundo-video .box-info').css('display', 'none');

    $('#video-'+_number).css('display', 'block');
    $('.fundo-video').fadeIn('slow');

    playVideo('video'+_number, _number, _numberCheck);

}

var fecharVideo = function(){
    $('.fundo-video').fadeOut('slow');
}

var abrirObjeto = function(_numero, _numberCheck){

    $('.fundo-video, .fundo-video .box-info').css('display', 'none');

    $('#pdf-'+_numero).css('display', 'block');
    $('.fundo-video').fadeIn('slow');

    if(_numberCheck){
        $('.video'+_numberCheck+' .check-video').fadeIn('slow');
    }else{
        $('.'+_video+' .check-video').fadeIn('slow');
    }

    if(!parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].vistos[_numero]){

        total_vistos++;

        parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].vistos[_numero] = true;
        parent.setarDados();

    }

    if(total_vistos >= total_videos){
        parent.finalizarAcao();
    }

}

var abrirObjeto2 = function(_correto, _numero, _nivel, _element){

    $('.fundo-video, .fundo-video .box-info').css('display', 'none');

    $('#pdf-'+_numero).css('display', 'block');
    $('.fundo-video').fadeIn('slow');

    if(parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].status == 'em_andamento'){
        parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].selecionados[parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].selecionados.length] = _numero;
        parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].nTentativas[parent.paginaAtual][_nivel] += 1;
        parent.setarDados();
    }

    if(_correto == 1){

        _element.addClass('correto');
        $('.btn-responder-pagina').css('display', 'block');

    }else{
        _element.addClass('incorreto');
    }

}

var abrirPdf = function(_numero, _numberCheck){

    if(_numberCheck){
        $('.video'+_numberCheck+' .check-video').fadeIn('slow');
    }else{
        $('.'+_video+' .check-video').fadeIn('slow');
    }

    if(!parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].vistos[_numero]){

        total_vistos++;

        parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].vistos[_numero] = true;
        parent.setarDados();

    }

    if(total_vistos >= total_videos){
        parent.finalizarAcao();
    }

}

var fecharPdf = function(){

    $('.fundo-video').fadeOut('slow');

}

// Meu album
var iniciarAlbum = function(){

    var status = parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].status;

    if(status != 'em_andamento'){

        $('textarea').attr('disabled', 'disabled').val(parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].textoLivre);
        $('.btn-verde').css('color', 'transparent');
        $('.btn-verde').css('background-color', 'transparent');

        // var limite = 2000;
        // var caracteresDigitados = $('textarea').val().length;
        // var caracteresRestantes = limite - caracteresDigitados;
        //
        // $(".limit-text span").text(caracteresRestantes);

        habilitarNavegacao();

    }else{

        $('textarea').removeAttr('disabled');
        $('.btn-verde').attr('onclick', 'salvarTexto()');

        desabilitarNavegacao();

    }

}

var salvarTexto = function(){

    var texto = $('textarea').val();

    if(texto.length < 50){

        swal({
            title: 'Atenção!',
            type: 'error',
            text: 'Você ainda não escreveu o mínimo de 50 caracteres. Continue seu texto.',
            confirmButtonText: 'Ok',
            allowOutsideClick: false,
            showCancelButton: false
        });

    }else if(texto.length > 300){

        swal({
            title: 'Atenção!',
            type: 'error',
            text: 'Você excedeu o limite de 300 caracteres. Diminua seu texto.',
            confirmButtonText: 'Ok',
            allowOutsideClick: false,
            showCancelButton: false
        });

    }else{

        // parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].status = 'concluido';
        parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].textoLivre = texto;
        parent.setarDados();

        // parent.finalizarAcao();
        habilitarNavegacao();

        $('textarea').attr('disabled', 'disabled');
        $('.btn-verde').css('color', 'transparent');
        $('.btn-verde').css('background-color', 'transparent');

    }

}

// Iniciar SWOT
var iniciarSwot = function(){

    var status = parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].status;

    if(status != 'em_andamento'){

        $('textarea.text1').attr('disabled', 'disabled').val(parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].textoLivre1);
        $('textarea.text2').attr('disabled', 'disabled').val(parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].textoLivre2);
        $('textarea.text3').attr('disabled', 'disabled').val(parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].textoLivre3);
        $('textarea.text4').attr('disabled', 'disabled').val(parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].textoLivre4);
        $('.btn-responder').remove();

        var limite = 2000;
        var caracteresDigitados = $('textarea.text1').val().length;
        var caracteresRestantes = limite - caracteresDigitados;

        $(".limit-text span").text(caracteresRestantes);

        var caracteresDigitados2 = $('textarea.text2').val().length;
        var caracteresRestantes2 = limite - caracteresDigitados2;

        $(".limit-text-2 span").text(caracteresRestantes);

        var caracteresDigitados3 = $('textarea.text3').val().length;
        var caracteresRestantes3 = limite - caracteresDigitados3;

        $(".limit-text-3 span").text(caracteresRestantes3);

        var caracteresDigitados4 = $('textarea.text4').val().length;
        var caracteresRestantes4 = limite - caracteresDigitados4;

        $(".limit-text-4 span").text(caracteresRestantes4);

        habilitarNavegacao();

    }else{

        mostrarAlerta = true;

        $('textarea').removeAttr('disabled');
        $('.btn-responder').attr('onclick', 'salvarSwot()');
        desabilitarNavegacao();

    }

    $('.alert-success').css('display', 'none');
    $('.alert-error').css('display', 'none');

}

var salvarSwot = function(){

    $('.alert-error').css('display', 'none');

    var texto1 = $('textarea.text1').val();
    var texto2 = $('textarea.text2').val();
    var texto3 = $('textarea.text3').val();
    var texto4 = $('textarea.text4').val();

    if (texto1.length == '' || texto2.length == '' || texto3.length == '' || texto4.length == ''){

        swal({
            title: 'Atenção!',
            type: 'error',
            text: 'Você ainda não escreveu em algum campo. Continue seu texto.',
            confirmButtonText: 'Ok',
            allowOutsideClick: false,
            showCancelButton: false
        });

    }else{

        parent.dados.fases['fase' + parent.faseAtual].acoes['acao' + parent.acaoAtual].textoLivre1 = texto1;
        parent.dados.fases['fase' + parent.faseAtual].acoes['acao' + parent.acaoAtual].textoLivre2 = texto2;
        parent.dados.fases['fase' + parent.faseAtual].acoes['acao' + parent.acaoAtual].textoLivre3 = texto3;
        parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].textoLivre4 = texto4;

        parent.setarDados();

        parent.finalizarAcao();

        $('textarea').attr('disabled', 'disabled');
        $('.btn-responder').removeAttr('onclick');

    }

}

// Iniciar Completar
var iniciarCompletar = function(){

    console.log('abrindo');

    var status = parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].status;

    if(status != 'concluido'){

        desabilitarNavegacao();

    }else{

        habilitarNavegacao();

        $('input.resposta').each(function(index, value){

            var resposta = $(this).attr('data-correto');
            $(this).val(resposta).attr('disabled', 'disabled').removeClass('incorreto').addClass('correto');

        });

        $('.btn-verde').css('color', 'transparent');
        $('.btn-verde').css('background-color', 'transparent');

    }

}

var responderCompletar = function(){

    // Verifica quantos acertos obtivemos:
    total_erros   = 0;
    total_acertos = 0;

    var total_respostas = 0;

    $(".resposta").each(function(index, elemento) {

        total_respostas++;

        var _resposta = $(this).val().trim();

        if(_resposta.toLowerCase() == $(this).attr('data-correto').toLowerCase()){
            total_acertos++;
            $(this).removeClass('incorreto').addClass('correto');
        }else{
            total_erros++;
            var resposta = $(this).attr('data-correto');
            $(this).removeClass('correto').addClass('incorreto').val(resposta).attr('style', 'background: #38943a; color: #fff');
        }

    });

    // Marca quantidade de alternativas;
    if(parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].status == 'em_andamento'){

        if(total_erros != 0 || total_respostas != total_acertos){
            parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].nTentativas[parent.paginaAtual] += 1;
            parent.setarDados();
        }

        parent.dados.fases['fase'+parent.faseAtual].acoes['acao'+parent.acaoAtual].nTentativas[parent.paginaAtual] += 1;
        parent.setarDados();

    }

    if(total_erros == 0 && total_respostas == total_acertos){

        $(".resposta").attr('disabled', 'disabled');
        $('.btn-verde').css('color', 'transparent');
        $('.btn-verde').css('background-color', 'transparent');

        habilitarNavegacao();

    }else{

        swal({
            title: 'Atenção!',
            type: 'error',
            text: 'Resposta incorreta. Veja as respostas corretas destacadas em verde.',
            confirmButtonText: 'Ok',
            allowOutsideClick: false,
            showCancelButton: false
        });

        $(".resposta").removeAttr('disabled');
        $(".resposta").each(function(index, elemento) {

            var _resposta = $(this).val().trim();

            if(_resposta.toLowerCase() == $(this).attr('data-correto').toLowerCase()){
                $(this).removeClass('incorreto').addClass('correto');
            }else{
                var resposta = $(this).attr('data-correto');
                $(this).removeClass('correto').addClass('incorreto').val(resposta).attr('style', 'background: #38943a; color: #fff');
            }

        });

        $(".resposta").attr('disabled', 'disabled');

        habilitarNavegacao();

        $('.btn-verde').css('color', 'transparent');
        $('.btn-verde').css('background-color', 'transparent');

    }

}