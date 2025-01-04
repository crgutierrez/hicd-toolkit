// ==UserScript==
// @name         HICD Toolkit
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adiciona um botão na tela usando jQuery
// @author       Cristiano Gutierrez
// @match       https://hicd-hospub.sesau.ro.gov.br/prontuario/frontend/index.php
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @require     https://raw.githubusercontent.com/crgutierrez/hicd-toolkit/refs/heads/main/utils.js
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js
// @resource     bootstrapCSS https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';
    // const bootstrapLink = document.createElement('link');
    // bootstrapLink.rel = 'stylesheet';
    // bootstrapLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';
    // document.head.appendChild(bootstrapLink);
    //fazer função que adciciona botão com icone e texto do bootstrap em javascript


    function createForm(idContainer, idForm, formFields) {
        console.log('Criando Formulario');
        console.log(formFields)
        // Cria o formulário
        const form = $('<form>').attr('id', idForm);

        // Adiciona os campos do formulário
        formFields.forEach(field => {
            const formGroup = $('<div>').addClass('mb-3');
            const label = $('<label>').addClass('form-label').attr('for', field.id).text(field.label);
            const input = $('<input>').addClass('form-control').attr('type', field.type).attr('id', field.id).attr('name', field.name);
            formGroup.append(label, input);
            form.append(formGroup);
        });
        console.log(idContainer);
        const container = $('#' + idContainer);
        console.log(container);
        console.log(form)
        container.append(form);
    }

    function createBootstrapCard(idCard, title, text, buttonText, idContainer, buttonCallback, contentCallback) {
        // Cria o container do card
        const cardContainer = $('<div>').addClass('container mt-8');

        // Cria o card
        const card = $('<div>').addClass('panel panel-primary').css('width', '28rem').attr("id", idCard);

        const header = $('<div>').addClass('panel-heading').attr('id', idCard + "Header");

        // Cria o corpo do card
        const cardBody = $('<div>').addClass('panel-body').attr('id', idCard + "Body");

        // Adiciona o título do card
        const cardTitle = $('<h3>').addClass('panel-title').text(title);

        // Adiciona o texto do card
        const cardText = $('<p>').addClass('card-text').text(text);
        const footer = $('<div>').addClass('panel-footer').attr('id', idCard + 'Footer');

        // Adiciona o botão do card
        const cardButton = $('<button>').addClass('btn btn-primary').text(buttonText);
        cardButton.click(buttonCallback);

        const cardButtonCancel = $('<button>').addClass('btn btn-danger').text('Fechar');
        cardButtonCancel.click(() => {
            $('#' + idCard).remove();
        });
        // Monta o card
        header.append(cardTitle);
        card.append(header);

        footer.append(cardButton);
        footer.append(cardButtonCancel);

        card.append(cardBody);
        card.append(footer);
        cardContainer.append(card);

        // Adiciona o card ao corpo da página
        $(idContainer).append(cardContainer);
        contentCallback.apply();
    }

    const novoRegeMenu = function (ParamModule, IdPac, aba, edit, param, TIPOBUSCA, position, title) {
        //alert("jaklçsfjaçlksjf");
        //< !-- Se estiver saindo da aba "Evolucao Ambulatorial" salva o que foi digitado na descricao -- >
        //alert(aba);
        //$("#debug_top").html("ParamModule: <b>" + ParamModule + "</b> - IdPac: <b>" + IdPac + "</b> - aba: <b>" + aba + "</b> - edit: <b>" + edit + "</b> - param: " + param +
        //							" - TIPOBUSCA: <b>" + TIPOBUSCA + "</b> - position: <b>" + position + "</b> - title: <b>" + title + "</b><br><br>");
        if (BTN_ATUAL != "-1" && aba != "-1") {
            changeAbaPront(aba);
        }
        if (aba == "-1") {
            //alert(BTN_ATUAL);
            //$("#abaPront_"+BTN_ATUAL).html("<b style='color:red;'><u>" + $("#hddAba_"+BTN_ATUAL).val() + "</u></b>");
        }
        if ((ParamModule == "ConsAmb" || ParamModule == "EvolucaoAmb") && $("#cons_sta").val() != 7) {
            fecharConsulta();
            $("#Evolucao").css({display: ""});
        } else {
            $("#Evolucao").css({display: "none"});
        }
        SAV_ABA = aba;
        TIPO_ACESSO = TIPOBUSCA;
        PARAM_MODULE = ParamModule;
        var mEvo = $("#mEvo").attr("checked");
        var filter = $("#filter").val();
        var cpf = $("#ic0cpf").val();
        var filtroTipo = $("#filtroTipo").val();
        var params = "Param=REGE&ParamModule=" + ParamModule + "&IdPac=";
        params += IdPac + "&Filtro=" + $("#selFiltro").val();
        params += "&edit=" + edit + "&param=" + param + "&mEvo=" + mEvo;
        params += "&filter=" + filter;
        params += "&cpf=" + cpf;
        params += "&filtroTipo=" + filtroTipo;
        params += "&TIPOBUSCA=" + TIPOBUSCA;
        $("#aba_title").html(title);
        //$("#Evolucao").html("");
        $("#ConteudoAbasRege").html("");
        $("#aba_aguarde").css({display: ""});
        //alert(params);
        console.log('aba', aba);
        console.log(aba);
        if (aba == 3) {
            const btnEvolucao = $('# btnEvolucao');
            if (!btnEvolucao) {

                addButton('btnEvolucao', 'Botao Evolucao', '#grupo', function () {
                    console.log('Clicou no botão Evolução');
                });
            }
        }
        $.ajax({
            type: "POST",
            url: "controller/controller.php",
            data: params,
            success: function (data) {
                //alert(data);
                $("#aba_aguarde").css({display: "none"});
                if (data == "OPCAO INVALIDA") {
                    var strParams = "";
                    var itens = params.split("&");
                    for (var j = 0; j < itens.length; j++) {
                        strParams += itens[j] + "<br>";
                    }
                    $("#ConteudoAbasRege").html(data + "<br>" + strParams);
                } else {
                    $("#ConteudoAbasRege").html(data);
                }
                if (template == "FINALIZA&atilde;‡&atilde;ƒO DO ATENDIMENTO OBST&atilde;‰TRICO") {
                    $("#mTodos").trigger("click");
                    $("#btPrint").trigger("click");
                }

            }
        });
        // buscaInfoParecer1();

        $('#divParecer').html("");
        //alert(36163)
        var params = "Param=REGE&ParamModule=include&pagina=do_evo_parecer&id=36163"
            + "&TIPOBUSCA=PRONT&tipo=99";
        // alert(params)
        $.ajax({
            type: "POST",
            url: "controller/controller.php",
            data: params,
            success: function (data) {
                console.log(data);
                $('#divParecer').html(data);


            }
        });
    }



    const novoPaciente = function getPaciente(pront) {
        $("#Conteudo").show();
        var params = "Param=REGE&ParamModule=CONSPAC_OPEN&PACIENTE=" + pront;
        params += "&TIPOBUSCA=" + 'PRONT' + "&TIPOSEXO=" + $("#TIPOSEXO").val();
        params += "&IDADE=" + $("#IDADE").val();
        params += "&TIPOBUSCA_LOCAL=" + $("#TIPOBUSCA_LOCAL").val();
        //alert(params);
        $("#ConteudoPaciente").html("<center><img src='images/globais/loading.gif'> Aguarde... </center>");
        $.ajax({
            type: "POST",
            url: "controller/controller.php",
            data: params,
            success: function (data) {
                //alert(data);
                //alert('ok');
                $('html,body').scrollTop(0);
                $("#divBuscaPac").css({display: "none"});
                $("#Conteudo").html(data);
                //alert('ok');
                const pac = getInfoPaciente();
                addGroupButtn('grupo', '#Conteudo > div:nth-child(12) > div > div > div.panel-heading > div:nth-child(2) > span:nth-child(1)')
                addButton('idBtnPaciente', 'Sincronizar Paciente', '#grupo', function () {
                    syncPaciente(pac);
                    console.log(pac);
                    //      alert('Clicou no botão 3');
                }, "fa fa-save");

                addButton('idAddAnotacao', 'Anotar Sobre Paciente', '#grupo', function () {
                    createBootstrapCard('idCardAnotacao', 'Informações do Paciente', 'Nome: ' + $('#nome').text() + '<br>Registro: ' + $('#registro').text() + '<br>Leito: ' + $('#leito').text(), ' Paciente', '#page-content-wrapper > div.col-lg-12.center-block', function () {

                        const data = {nota: $('#inputNota').val()}
                        console.log(pac)
                        ajaxPost('http://hicd-backend.fly.dev/nota/' + pac.re, data, (response) => {
                            alert('Nota Adicionada com Sucesso');
                        }, (error) => {
                            alert("Error: " + error);
                        })
                        $('#idCardAnotacao').remove();
                    }, function () {
                        const formFields = [
                            {id: 'inputNota', label: 'Nota', type: 'text', name: 'nota'}
                        ];
                        createForm('idCardAnotacaoBody', 'idFormularioAnotacao', formFields);

                    }, "fa fa-edit");
                });

                unsafeWindow.getRegeMenu = novoRegeMenu;
            }
        });
    }

    function addGroupButtn(idGroup, parent) {

        const groupButton = $('<div>')
            .addClass('btn-group')
            .attr('role', 'group')
            .attr('aria-label', 'Basic example')
            .attr('id', idGroup);
        $(parent).append(groupButton);
    }

    function addButton(idButton, label, parent, callback, icon) {
        const button = $('<button>')
            .addClass('btn btn-primary btn-xs')
            .text(label)
            .css({
                zIndex: 1000,
            })
            .attr('id', idButton);
        if (icon) {
            const iconElement = $('<i>')
                .text(" ")
                .addClass(icon);
            button.prepend(iconElement);
        }


        // Adiciona o botão ao corpo da página
        $(parent).append(button);

        // Evento de clique no botão
        $('#' + idButton).click(function () {
            callback.apply();
        });
    }

    const novoConteudo = function getConteudo() {
        //alert(tipordem);
        if ($("#clinica").val() == "") {
            alert("Clinica nao indicada");
            return;
        }
        var params = "Param=SIGHO&ParamModule=544&idPai=Do581&clinica=" + $("#clinica").val() + "&nome=" + $("#nome").val();
        params += "&selRefClinica=" + $("#selRefClinica").val();
        params += "&selOrderInter=" + $("#selOrderInter").val();
        //params += "&tipordem=" + tipordem;
        //params += "&ori=pesq_htm";
        //alert(params);
        //$("#debug").html(params);
        $("#Conteudo").html("<center><img src='images/globais/loading.gif'> Aguarde... </center>");
        $.ajax({
            type: "POST",
            url: "controller/controller.php",
            data: params,
            success: function (data) {
                $("#Conteudo").html(data);
                addButton('novoBotao', 'Botao 2', '#Conteudo', function () {
                    console.log('Clicou no botão 2');
                });
                unsafeWindow.getPaciente = novoPaciente;
            }
        });
    }

    const menuNovo = function getMenu(Menu, ParamModule) {
        console.log('dentro do meu metodo');

        console.log(Menu);
        console.log(ParamModule);


        var params = "Param=" + Menu + "&ParamModule=" + ParamModule;
        if (Menu.indexOf(";") > -1) {
            var parts = Menu.split(";");
            if (parts[0] == "A" || parts[0] == "P") {
                getMenu('SYSTEM', 'PRINCIPAL');
                loadUrl(parts[1], parts[0]);
            }
        } else {
            /*
            $("#loading")
                .ajaxStart(function(){
                    $(this).show();
                    $(this).html("Aguarde...");
                })
                .ajaxComplete(function(){
                    $(this).hide();
            }); */
            var debug = ""
            //debug = "<br>" + params;
            $.ajax({
                type: "POST",
                url: LOCAL_WEB + "controller/controller.php",
                data: params,
                success: function (data) {
                    restoreMenu();
                    if (data == '') {
                        $("#contentcolumn").html('vazio (' + LOCAL_WEB + ')' + debug);
                    } else {
                        $("#contentcolumn").html(data + debug);
                    }
                    if (Menu == 'SIGHO' && ParamModule == '2904') {
                        unsafeWindow.getConteudo = novoConteudo;
                        addButton('botao', 'Olha o botão', '#Conteudo', function () {
                            console.log('callback');
                        });
                    }
                }
            });
        }
    };

    $(document).ready(function () {
        console.log('funcionando');

        if (unsafeWindow.getMenu) {
            unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest;
            unsafeWindow.getMenu = menuNovo;
            console.log('getMenu Substituido')
        }


    });

})();
