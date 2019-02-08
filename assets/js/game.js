$('.container-menu').html('');
$('.carregando').css('display', 'block');

// Total de pontos que cada ação pode dar
var pontos_totais = [
    null,
    [null, 10 , 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
];

// Porcetagem de conclusao após cada ação;
var arr_porcentagem_conclusao = [
    null,
    [null, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 75, 80, 90, 100]
];

// Tempo para conquistar uma medalha;
var tempo_medalha = [null,
    [null, false, false, false, false, false, false, false, false, false, false, false],
];

var titulos_medalha_fase = [null, 'Medalha 1', 'Medalha 2', 'Medalha 3', 'Medalha 4', 'Medalha 5', 'Medalha 6', 'Medalha 7', 'Medalha 8', 'Medalha 9'];
var titulos_medalha      = {conteudo: 'Leitura', game: 'Jogo', quiz: 'Quiz', completar: 'Completar', video: 'Video'};

// Total de páginas que cada ação tem;
var dados_final_fase = {
    fase1: {
        totalAcoes: 15,
        acao1: 1
    }
}

var contagem_acao;
var contagem_total;
var horas_jogadas    = 0;
var minutos_jogados  = 0;

var horas_acao_jogadas    = 0;
var minutos_acao_jogados  = 0;

var modal_sair = function(){

    swal({
        text: 'Para finalizar clique em (x) Fechar.',
        type: 'warning',
        allowOutsideClick: false,
        showCancelButton: false,
        confirmButtonText: 'Ok'
    });

}

var iniciar_contagem = function(){

    horas_jogadas 	 = dados.horasJogadas;
    minutos_jogados  = dados.minutosJogados;

    return setInterval(function(){

        minutos_jogados++;

        if(minutos_jogados > 59){
            minutos_jogados = 0;
            horas_jogadas++;
        }

        dados.minutosJogados  = minutos_jogados;
        dados.horasJogadas    = horas_jogadas;

        // Preenche o tempo já percorrido em algum lugar;
        //$('.total-tempo-online').html(dados.horasJogadas+'h '+dados.minutosJogados+'m <span>online</span>');

        setarDados();

    }, 60000);

}

var pararContagem = function(){

    clearInterval(contagem_total);

}

var iniciar_contagem_acao = function(){

    horas_acao_jogadas 	  = 0;
    minutos_acao_jogados  = 0;

    return setInterval(function(){

        minutos_acao_jogados++;

        if(minutos_acao_jogados > 59){
            horas_acao_jogadas++;
        }

    }, 60000);

}

var parar_contagem_acao = function(){

    clearInterval(contagem_acao);

}

$(document).ready(function(){

    setTimeout(function(){
        iniciarScorm();
    }, 2000);

});

// Controla setas para alterar de conteudo dentro da ação;
var controlarNavegacao = function(_status, _pagina_atual, _total_paginas){

    if(_status == true){

        $('.container-paginacao').css('display', 'block');

        $('.container-paginacao .telaCurrent').html(_pagina_atual);
        $('.container-paginacao .telaTotal').html(_total_paginas);

    }else{
        $('.container-paginacao').css('display', 'none');
    }

}

var faseAtual   = 1;
var acaoAtual   = 0;
var paginaAtual = 0;

// Atualizar pontuação;
var atualizarPontuacao = function(_pontos, _force){

    if(_force){
        dados.totalPontos = _pontos;
    }else{
        dados.totalPontos += _pontos;
    }

}

// Atualizar porcentagem do objeto;
var atualizarPorcentagem = function(_porcentagem, _force){

    if(_force){
        dados.totalPontos = _pontos;
    }else{
        dados.totalPontos += _pontos;
    }

}

// Atualizar porcentagem da fase;
var iniciarAcao = function(_fase, _acao, _pastaRaiz, _paginaAcessada){

    var URL = document.getElementById("iframe_interno").contentWindow.location.href;
    var _URL = URL.split('fase');

    faseAtual = _fase;
    acaoAtual = _acao;

    console.log('faseAtual inicio: '+faseAtual);
    console.log('acaoAtual inicio: '+acaoAtual);

    if(dados.fases['fase'+faseAtual].acoes['acao'+acaoAtual].status != 'concluido'){

        // BUG FIXED!!!!! Marcar última fase e última ação
        if(dados.faseAtual == 1 && dados.acaoAtual > 9){
            dados.acaoAtual = 1;
        }

        contagem_acao = iniciar_contagem_acao();

        dados.acaoAtual = acaoAtual;

        if(dados.paginaAtual < 1){
            dados.paginaAtual = 1;
        }

        if(_paginaAcessada){
            paginaAtual = _paginaAcessada;
        }else{
            paginaAtual = dados.paginaAtual;
        }

        atualizarDadosAcao(faseAtual, acaoAtual, 'status', 'em_andamento');

        if(dados.fases['fase'+faseAtual].acoes['acao'+acaoAtual].tipo == 'quiz' || dados.fases['fase'+faseAtual].acoes['acao'+acaoAtual].tipo == 'game'){

            // dados.fases['fase'+faseAtual].acoes['acao'+acaoAtual].nTentativas[paginaAtual] = 0;

        }else if(dados.fases['fase'+faseAtual].acoes['acao'+acaoAtual].tipo == 'video'){

            $.each(dados.fases['fase'+faseAtual].acoes['acao'+acaoAtual].vistos, function( index, value ) {
                if(index > 0){
                    dados.fases['fase'+faseAtual].acoes['acao'+acaoAtual].vistos[index] = false;
                }
            });

        }

        setarDados();

    }else{

        if(_paginaAcessada){
            paginaAtual = _paginaAcessada;
        }else{
            paginaAtual = 1;
        }

    }

    // Dados da ultima fase acessada;
    dados.ultimaFaseAcessada = _fase;
    dados.ultimaAcaoAcessada = _acao;
    dados.ultimaPaginaAcessada = paginaAtual;

    // Numeros da navegação;
    // $('#telaCurrent').html(paginaAtual);
    // $('#telaTotal').html(dados_final_fase['fase'+faseAtual]['acao'+acaoAtual]);

    window.interno.location.href = _URL[0]+"fase"+faseAtual+"/acao"+acaoAtual+"/index"+paginaAtual+".html";

    // if(dados.fases['fase'+faseAtual].acoes['acao'+acaoAtual].tipo == 'conteudo'){
    //
    //     // if(_pastaRaiz){
    //     //     console.log('aqui');
    //     //     // Adicionar a pasta raiz para redirecionamento;
    //     //
    //     // }else{
    //     //     console.log('aqui 2');
    //     //     window.interno.location.href = _URL+"acao"+acaoAtual+"/index"+paginaAtual+".html";
    //     // }
    //
    // }else{
    //
    //     if(_pastaRaiz){
    //         console.log('aqui 3');
    //         // Adicionar a pasta raiz para redirecionamento;
    //         window.interno.location.href = _URL+"fase"+faseAtual+"/acao"+acaoAtual+"/index"+paginaAtual+".html";
    //     }else{
    //
    //         console.log('aqui 4');
    //         window.interno.location.href = "acao"+acaoAtual+"/index"+paginaAtual+".html";
    //     }
    //
    // }

}

var atualizarPagina = function(_pagina){

    if(dados.fases['fase'+faseAtual].acoes['acao'+acaoAtual].status != 'concluido'){

        dados.paginaAtual = _pagina;

        atualizarDadosAcao(faseAtual, acaoAtual, 'atividadeAtual', _pagina);

        setarDados();

    }

}

var finalizarAcao = function(){

    var URL = document.getElementById("iframe_interno").contentWindow.location.href;
    var _URL = URL.split('fase');

    if(dados.fases['fase'+faseAtual].acoes['acao'+acaoAtual].status != 'concluido'){

        parar_contagem_acao();

        atualizarDadosAcao(faseAtual, acaoAtual, 'horasJogadas', horas_acao_jogadas);
        atualizarDadosAcao(faseAtual, acaoAtual, 'minutosJogados', minutos_acao_jogados);

        atualizarDadosAcao(faseAtual, acaoAtual, 'status', 'concluido');

        // Libera a próxima ação;
        var total_acoes = 0;
        var total_concluidos = 0;

        $.each(dados.fases['fase'+faseAtual].acoes, function(index, value) {
            total_acoes++
            if(value.status == 'concluido'){
                total_concluidos++;
            }
        });

        console.log('Total de acoes: '+total_acoes);
        console.log('Total Concluidos: '+total_concluidos);

        if(total_concluidos == total_acoes){

            dados.faseAtual = faseAtual+1;

            if(dados.faseAtual > 1){
                dados.faseAtual = 1;
            }

            dados.acaoAtual = 1;
            var finalizado = true;
            var redirecionamento = _URL[0]+"fase1/fase.html"; // Volta para a pagina da fase;

        }else{

            dados.acaoAtual 	= acaoAtual+1;
            var finalizado = false;
            var redirecionamento = _URL[0]+"fase"+faseAtual+"/acao"+acaoAtual+"/index"+paginaAtual+".html"; // Volta para a pagina da fase;

        }

        // Verifica se existem medalhas para serem coletadas;
        var _mensagem = '';
        var tipo_acao = dados.fases['fase'+faseAtual].acoes['acao'+acaoAtual].tipo;

        var pontos = calculaPontuacao(faseAtual, acaoAtual);

        if(tipo_acao == 'conteudo' || tipo_acao == 'quiz' || tipo_acao == 'game'){

            var ganhou 				 = false;
            var peso_medalha 	 = acaoAtual;
            var titulo_medalha = titulos_medalha_fase[faseAtual]+' '+titulos_medalha[''+tipo_acao];

            // Requisitos para ganhar a medalha;
            if(tipo_acao == 'conteudo'){

                ganhou 			 = true;
                peso_medalha = 1;

            }else if(tipo_acao == 'quiz' || tipo_acao == 'game'){

                if(horas_acao_jogadas == 0 && minutos_acao_jogados <= tempo_medalha[faseAtual][acaoAtual] && pontos == pontos_totais[faseAtual][acaoAtual]){
                    ganhou = true;
                    peso_medalha = 3;
                }else if(horas_acao_jogadas == 0 && minutos_acao_jogados <= tempo_medalha[faseAtual][acaoAtual]){
                    ganhou = false;
                    peso_medalha = 2;
                }

            }

            if(ganhou){

                dados.fases['fase'+faseAtual].acoes['acao'+acaoAtual].medalha = ganhou;
                dados.fases['fase'+faseAtual].medalha += 1;
                // dados.fases['fase'+faseAtual].medalhas[dados.fases['fase'+faseAtual].medalhas.length] = titulo_medalha+' '+peso_medalha;
                setarDados();

                // _mensagem = '<p>Você adquiriu a medalha <strong>'+titulo_medalha+' '+peso_medalha+'</strong>!</p> <p>Realizou a atividade em <strong>'+horas_acao_jogadas+'h '+minutos_acao_jogados+'m</strong> minutos</p>';

            }

        }

        dados.paginaAtual = 1;

        var total_acoes = 0;
        var total_concluidos = 0;

        $.each(dados.fases['fase'+faseAtual].acoes, function(index, value) {
            total_acoes++;
            if(value.status == 'concluido'){
                total_concluidos++;
            }
        });

        dados.fases['fase'+faseAtual].progresso = total_concluidos/total_acoes*100;

        if(pontos === 0){

            if (_mensagem != '') {
                _mensagem += 'e ganhou ' + pontos + ' ponto.';
            } else {
                _mensagem = 'Você ganhou ' + pontos + ' ponto e realizou a atividade em ' + horas_acao_jogadas + 'h ' + minutos_acao_jogados + 'm minutos.';
            }


        }else{
            if(_mensagem != ''){
                _mensagem += 'e ganhou '+pontos+' pontos.';
            }else{
                _mensagem = 'Você ganhou '+pontos+' pontos e realizou a atividade em '+horas_acao_jogadas+'h '+minutos_acao_jogados+'m minutos.';
            }
        }

        setarDados();
        calcularPorcentagemConclusao();

        faseAtual = dados.faseAtual;
        acaoAtual = dados.acaoAtual;
        
        
        if (pontos === 0) {

            swal({
                        title: '',
                        text: _mensagem,
                        type: 'success',
                        allowOutsideClick: false,
                        confirmButtonText: 'Avançar',
                    },
                    
                    function () {

                        if (!finalizado) {
                            console.log('aqui eita');
                            iniciarAcao(faseAtual, acaoAtual, true);
                        } else {
                            console.log('aqui eita n');
                            window.interno.location.href = redirecionamento;
                        }

                    });

         }else{

        
            swal({
                title: 'Parabéns!',
                text: _mensagem,
                type: 'success',
                allowOutsideClick: false,
                confirmButtonText: 'Avançar',
            }, function(){

                if(!finalizado){
                    console.log('aqui eita');
                    iniciarAcao(faseAtual, acaoAtual, true);
                }else{
                    console.log('aqui eita n');
                    window.interno.location.href = redirecionamento;
                }

            });
        }

    }else{

        if(parseInt(acaoAtual)+1 > dados_final_fase['fase'+faseAtual].totalAcoes){
            window.interno.location.href = _URL[0]+"fase1/fase.html"; // Volta para a pagina da fase;
        }else{
            acaoAtual = parseInt(acaoAtual)+1;
            window.interno.location.href = _URL[0]+"fase"+faseAtual+"/acao"+acaoAtual+"/index"+paginaAtual+".html"; // Volta para a pagina da fase;
        }

    }

}

var calcularPorcentagemConclusao = function(){

    var fase1 = dados.fases.fase1.progresso;

    porcentagem_conclusao = Math.ceil((fase1)/1);

    // Mostra a porcentagem em algum lugar;
    // $('.total_porcentagem').html(porcentagem_conclusao);
    // $('.progress-radial').attr('id', 'progress-'+porcentagem_conclusao);

    if(api){
        api.LMSSetValue("cmi.core.score.raw", ""+porcentagem_conclusao);
        api.LMSCommit("");
    }

}

var calculaPontuacao = function(_fase, _acao){

    var _max_pontos = pontos_totais[_fase][_acao];
    var _tipo = dados.fases['fase'+_fase].acoes['acao'+_acao].tipo;

    if(_tipo == 'conteudo' || _tipo == 'album' || _tipo == 'video'){

        // Pontos fixos;
        dados.totalPontos += _max_pontos;
        dados.fases['fase'+_fase].acoes['acao'+_acao].pontos += _max_pontos;

        setarDados();

        var pontos_atuais = _max_pontos;

    }else if(_tipo == 'quiz' || _tipo == 'completar'){

        // Calcula pontos de acordo com os acertos;

        var total_questoes = dados.fases['fase'+_fase].acoes['acao'+_acao].nTentativas.length - 1;

        var pontos_por_questao = Math.ceil(_max_pontos/total_questoes);

        var total_pontos = 0;
        $.each(dados.fases['fase'+_fase].acoes['acao'+_acao].nTentativas, function( index, value ) {
            if(index > 0 && value == 1){
                total_pontos += pontos_por_questao;
            }
        });

        if(total_pontos > _max_pontos){
            total_pontos = _max_pontos;
        }

        dados.totalPontos += total_pontos;
        dados.fases['fase'+_fase].acoes['acao'+_acao].pontos += total_pontos;

        setarDados();

        var pontos_atuais = total_pontos;

    }else if(_tipo == 'game'){

        // Calcula pontos de acordo com os acertos;
        var total_questoes = dados.fases['fase'+_fase].acoes['acao'+_acao].nTentativas.length - 1;

        var pontos_por_questao = Math.ceil(_max_pontos/total_questoes);

        var total_pontos = 0;
        $.each(dados.fases['fase'+_fase].acoes['acao'+_acao].nTentativas, function( index, value ) {

            if(index > 0){

                var pontos_totais_desta_questao = Math.ceil(pontos_por_questao / (value.length - 1));

                $.each(value, function( index2, value2 ) {
                    if(value2 == 1){
                        total_pontos += pontos_totais_desta_questao;
                    }
                });

            }

        });

        if(total_pontos > _max_pontos){
            total_pontos = _max_pontos;
        }

        dados.totalPontos += total_pontos;
        dados.fases['fase'+_fase].acoes['acao'+_acao].pontos += total_pontos;

        setarDados();

        var pontos_atuais = total_pontos;

    }

    // Mostra os pontos em algum lugar;
    // $('.container-pontos-menu').html(dados.totalPontos+' <span>pontos</span>');

    return pontos_atuais;

}

var atualizarNumeroAcima = function(){

    // $('#telaCurrent').html(paginaAtual);

}

var avancarTela = function(_interna){

    atualizarDadosAcao(faseAtual, paginaAtual, 'horasJogadas', horas_acao_jogadas);
    atualizarDadosAcao(faseAtual, paginaAtual, 'minutosJogados', minutos_acao_jogados);

    atualizarDadosAcao(faseAtual, paginaAtual, 'status', 'concluido');

    paginaAtual++;
    dados.ultimaPaginaAcessada = paginaAtual;

    parar_contagem_acao();

    atualizarDadosAcao(faseAtual, paginaAtual, 'status', 'em_andamento');


    if(dados.fases['fase'+faseAtual].acoes['acao'+acaoAtual].status != 'concluido'){
        dados.paginaAtual = paginaAtual;
        setarDados();
    }

    if(paginaAtual > dados_final_fase['fase'+faseAtual]['acao'+acaoAtual]){
        finalizarAcao();
    }else{

        // $('#telaCurrent').html(paginaAtual);

        if(_interna){
            // Esta ação veio de um iframe;
            window.interno.location.href = "index"+paginaAtual+".html";
        }else{
            window.interno.location.href = "fase"+faseAtual+"/acao"+acaoAtual+"/index"+paginaAtual+".html";
        }

    }

}

var voltarTela = function(_interna){

    paginaAtual--;
    dados.ultimaPaginaAcessada = paginaAtual;

    if(paginaAtual < 1){
        window.interno.location.href = "../fase.html"; // Volta para a pagina da fase;
    }else{

        // $('#telaCurrent').html(paginaAtual);

        if(_interna){
            // Esta ação veio de um iframe;
            window.interno.location.href = "index"+paginaAtual+".html";
        }else{
            window.interno.location.href = "fase"+faseAtual+"/acao"+acaoAtual+"/index"+paginaAtual+".html";
        }

    }

}

window.dados_final_fase = dados_final_fase;
window.avancarTela = avancarTela;
window.setarDados  = setarDados;
window.faseAtual 	 = faseAtual;
window.acaoAtual 	 = acaoAtual;
window.paginaAtual = paginaAtual;
window.atualizarNumeroAcima = atualizarNumeroAcima;
window.pontos_totais = pontos_totais;

window.controlarNavegacao = controlarNavegacao;

window.iniciarAcao 		 = iniciarAcao;
window.atualizarPagina = atualizarPagina;
window.finalizarAcao	 = finalizarAcao;
