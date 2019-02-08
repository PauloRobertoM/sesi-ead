(function($, window) {
    $("#choice-block li").click(function() {
        var numItems = $('.user_clicked').length;
        if ($(this).hasClass("user_clicked" )){            
            $(this).removeClass( "user_clicked" );
        } else if (numItems == 2) {
            swal({
                type: 'error',
                title: 'Oops...',
                text: '2 respostas já selecionadas, desmarque alguma resposta para mudar suas escolhas.',
            })
        } else {
            $(this).addClass( "user_clicked" );
        }
    });

    $("#choice-block-vf li").click(function() {
        var numItems = $('.user_clicked').length;
        if ($(this).hasClass("user_clicked" )){            
            $(this).removeClass( "user_clicked" );
        } else if (numItems == 2) {
            swal({
                type: 'error',
                title: 'Oops...',
                text: '2 respostas já selecionadas, desmarque alguma resposta para mudar suas escolhas.',
            })
        } else {
            $(this).addClass( "user_clicked" );
        }
    });

    $("#submitbutton").click(function() {
        var numItems = $('.user_clicked').length;
        if (numItems < 2) {
            swal({
                type: 'error',
                title: 'Oops...',
                text: 'selecione as 2 respostas.',
            })
        } else {
            $('.user_clicked').each(function(){
                var resposta = $(this).attr("data-index");
                console.log(resposta);
                if (resposta != 1) {
                    swal({
                        type: 'error',
                        title: 'Oops...',
                        text: 'Combinação incorreta, Leia o conteúdo e responda novamente!',
                    })
                    $(this).removeClass("correta user_clicked");
                } else if (resposta == 1) {
                    swal({
                        type: 'success',
                        title: 'Muito bem!',
                        text: 'Você respondeu corretamente, ganhou 3 pontos!',
                    })
                    $(this).addClass("correta");
                }
            });
        }
    });
})(jQuery, window);