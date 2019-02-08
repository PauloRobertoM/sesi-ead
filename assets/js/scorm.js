var dados = {
    totalPontos: 0,
    horasJogadas: 0,
    minutosJogados: 0,
    totalAcessos: 0,
    faseAtual: 1,
    acaoAtual: 1,
    paginaAtual: 0,
    ultimoTipoPaginaAcessada: '',
    ultimaFaseAcessada: 0,
    ultimaAcaoAcessada: 0,
    ultimaPaginaAcessada: 0,
    fases: {
        fase1: {
            progresso: 0,
            acoes: {
                acao1: { // Concluido
                    status: 'pendente',
                    tipo: 'video',
                    vistos: [null, false],
                    pontos: 0,
                    horasJogadas: 0,
                    minutosJogados: 0,
                    medalha: false
                },
                acao2: { // Concluido
                    status: 'pendente',
                    tipo: 'conteudo',
                    pontos: 0,
                    horasJogadas: 0,
                    minutosJogados: 0,
                    medalha: false
                },
                acao3: { // Concluido
                    status: 'pendente',
                    tipo: 'completar',
                    nTentativas: [null, 0],
                    pontos: 0,
                    horasJogadas: 0,
                    minutosJogados: 0,
                    medalha: false
                },
                acao4: { // Concluido
                    status: 'pendente',
                    tipo: 'quiz',
                    nTentativas: [null, 0],
                    pontos: 0,
                    horasJogadas: 0,
                    minutosJogados: 0,
                    medalha: false
                },
                acao5: { // Concluido
                    status: 'pendente',
                    tipo: 'quiz',
                    nTentativas: [null, 0],
                    pontos: 0,
                    horasJogadas: 0,
                    minutosJogados: 0,
                    medalha: false
                },
                acao6: { // Concluido
                    status: 'pendente',
                    tipo: 'conteudo',
                    pontos: 0,
                    horasJogadas: 0,
                    minutosJogados: 0,
                    medalha: false
                },
                acao7: { // Concluido
                    status: 'pendente',
                    tipo: 'quiz',
                    nTentativas: [null, 0],
                    pontos: 0,
                    horasJogadas: 0,
                    minutosJogados: 0,
                    medalha: false
                },
                acao8: { // Completo
                    status: 'pendente',
                    tipo: 'quiz',
                    nTentativas: [null, 0],
                    pontos: 0,
                    horasJogadas: 0,
                    minutosJogados: 0,
                    medalha: false
                },
                acao9: { // Completo
                    status: 'pendente',
                    tipo: 'completar',
                    nTentativas: [null, 0],
                    pontos: 0,
                    horasJogadas: 0,
                    minutosJogados: 0,
                    medalha: false
                    
                },
                acao10: { // Completo
                    status: 'pendente',
                    tipo: 'conteudo',
                    pontos: 0,
                    horasJogadas: 0,
                    minutosJogados: 0,
                    medalha: false
                },
                acao11: {
                    status: 'pendente',
                    tipo: 'completar',
                    nTentativas: [null, 0],
                    pontos: 0,
                    horasJogadas: 0,
                    minutosJogados: 0,
                    medalha: false
                },
                acao12: {
                    status: 'pendente',
                    tipo: 'quiz',
                    nTentativas: [null, 0],
                    pontos: 0,
                    horasJogadas: 0,
                    minutosJogados: 0,
                    medalha: false
                },
                acao13: {
                    status: 'pendente',
                    tipo: 'completar',
                    nTentativas: [null, 0],
                    pontos: 0,
                    horasJogadas: 0,
                    minutosJogados: 0,
                    medalha: false
                },
                acao14: {
                    status: 'pendente',
                    tipo: 'conteudo',
                    textoLivre: "",
                    pontos: 0,
                    horasJogadas: 0,
                    minutosJogados: 0,
                    medalha: false
                },
                acao15: {
                    status: 'pendente',
                    tipo: 'album',
                    textoLivre: "",
                    pontos: 0,
                    horasJogadas: 0,
                    minutosJogados: 0,
                    medalha: false
                },
            }
        }
    }
}

window.dados = dados;

// Funções da API
var apiHandle = null;
function getAPIHandle() {

    if (apiHandle == null)    {

        apiHandle = getAPI();

    }

    return apiHandle;

}

function getAPI() {

    var theAPI = findAPI(window);

    if ((theAPI == null) && (window.opener != null) && (typeof(window.opener) != "undefined"))    {
        theAPI = findAPI(window.opener);
    }

    if (theAPI == null)  {
        // alert("Unable to find an API adapter");
    }

    return theAPI
}

function findAPI(win) {
    var findAPITries = 0;
    while ((win.API == null) && (win.parent != null) && (win.parent != win))    {
        findAPITries++;
        /* Note: 7 is an arbitrary number, but should be more than sufficient */
        if (findAPITries > 7){
            alert("Error finding API -- too deeply nested.");
            return null;
        }
        win = win.parent;
    }
    return win.API;
}

var api = getAPIHandle();

// Inicia o SCORM;
var iniciarScorm = function(){

    if(api){
        api.LMSInitialize("");
    }

    resgataDados();

    contagem_total = iniciar_contagem();

}

// Resgata todos os dados do aluno;
var porcentagem_conclusao = 0;
var resgataDados = function(){

    resgatarDados();

    if(dados.acaoAtual > 1 && dados.ultimoTipoPaginaAcessada != 'home'){

        swal({
            title: 'Deseja continuar da última página acessada?',
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não'
        },
        function(){

            if(dados.ultimoTipoPaginaAcessada == 'fase'){
                window.interno.location = 'fase1/fase.html';
            }else if(dados.ultimoTipoPaginaAcessada == 'acao'){
                iniciarAcao(dados.ultimaFaseAcessada, dados.ultimaAcaoAcessada, true, dados.ultimaPaginaAcessada);
            }else{
                window.interno.location = 'fase1/fase.html';
            }

        });

    }else{

        if(api){

            var nome_cadastro = api.LMSGetValue('cmi.core.student_name');
            var nome_corrigido = nome_cadastro.split(",");

            var titulo = 'Olá, '+nome_corrigido[1]+' '+nome_corrigido[0];

        }else{
            var titulo ='Olá!';
        }

        swal({
            title: titulo,
            allowOutsideClick: false,
            text: 'Seja bem-vindo.',
            type: 'info',
            showCancelButton: false,
            confirmButtonText: 'Iniciar'
        });

    }

}

window.porcentagem_conclusao = porcentagem_conclusao;

// Guarda os dados do aluno no Suspend_data do SCORM;
var setarDados = function(){

    if(api){

        // Aqui voc6e seta a última fase e ultima ação para marcar o OED como concluído
        if(dados.fases.fase1.acoes.acao11.status == 'concluido'){
            api.LMSSetValue('cmi.core.lesson_status', 'completed');
        }else{
            api.LMSSetValue('cmi.core.lesson_status', 'incomplete');
        }

        api.LMSSetValue("cmi.core.lesson_location", "page"+dados.paginaAtual);

        api.LMSSetValue('cmi.suspend_data', JSON.stringify(dados));
        api.LMSCommit("");

    }else{
        // alert('API SCORM NÃO IDENTIFICADA');
    }

}

// Resgata os dados do aluno guardados no suspended_data do SCORM;
var resgatarDados = function(){

    if(api){

        var dadosTemp = api.LMSGetValue('cmi.suspend_data');

        if(dadosTemp){
            dados = JSON.parse(dadosTemp);
        }

        window.dados = dados;

        porcentagem_conclusao = api.LMSGetValue("cmi.core.score.raw");

    }else{
        porcentagem_conclusao = 0;
    }

    atualizarObjeto();

}

var atualizarDadosFase = function(_fase, _acao, _atributo, _valor){

    dados.fases['fase'+_fase][''+_atributo] = _valor;

    setarDados();

}

var atualizarDadosAcao = function(_fase, _acao, _atributo, _valor){

    dados.fases['fase'+_fase].acoes['acao'+_acao][''+_atributo] = _valor;

    setarDados();

}

window.atualizarDadosAcao = atualizarDadosAcao;
var nomeJogador;
// Atualiza os gráficos, números e acesso as fases pelo objeto;
var atualizarObjeto = function(){

    // $('.container-pontos-menu').html(dados.totalPontos+' <span>pontos</span>');
    // $('.total-tempo-online').html(dados.horasJogadas+'h '+dados.minutosJogados+'m <span>online</span>');
    //
    // if(porcentagem_conclusao > 0){
    //     $('.total_porcentagem').html(parseInt(porcentagem_conclusao));
    //     $('.progress-radial').attr('id', 'progress-'+parseInt(porcentagem_conclusao));
    // }else{
    //     $('.total_porcentagem').html(0);
    //     $('.progress-radial').attr('id', 'progress-0');
    // }

    // Atualiza a quantiade de vezes que o usuário loga;

    dados.totalAcessos += 1;
    setarDados();

    // $('.total-acessos').html(dados.totalAcessos+' <span>acessos</span>');

    if(api){

        var nome_cadastro = api.LMSGetValue('cmi.core.student_name');
        // var nome_corrigido = nome_cadastro.split(",");

        nomeJogador = nome_cadastro;

        var titulo = 'Olá, ' + nomeJogador+ ', Seja Bem vindo!';

        // $('.container-dados h1').html(titulo);

    }else{
        // $('.container-dados h1').html('Olá!');
    }

    // window.interno.location = 'home.html';

}

window.nomeJogador = nomeJogador;
