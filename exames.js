// ==UserScript==
// @name         Copiar Valores de Exames
// @namespace    http://tampermonkey.net/
// @version      2024-11-20
// @description  Copia na Area de Transferencia os Resultados dos Exames
// @author       Cristiano Gutierrez
// @match        https://hicd-hospub.sesau.ro.gov.br/prontuario/generator/sadt/app/exame.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.br
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js
// @resource     bootstrapCSS https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css
// @run-at       document-end
// ==/UserScript==

(function () {
    function parseExamTPA(text,examType) {
        // Regular expressions for parsing
        const dateRegex = /Coleta:\s+(\d{2}\/\d{2}\/\d{2,4})/;
        const itemRegex = /(Tempo do Paciente|Atividade Protrombinica|R\.N\.I\.).*?([0-9.,]+).*?Vr\.:\s*([0-9.,]+\s*a\s*[0-9.,]+)/g;

        // Extract date of collection
        const dateMatch = text.match(dateRegex);
        const collectionDate = dateMatch ? dateMatch[1] : null;

        // Map custom siglas
        const customSiglas = {
            "Tempo do Paciente": "TPP",
            "Atividade Protrombinica": "ATP",
            "R.N.I.": "RNI"
        };

        // Extract items and values
        const items = {};
        let match;
        while ((match = itemRegex.exec(text)) !== null) {
            const description = match[1];
            const value = match[2];
            const vr = match[3];

            // Determine the sigla
            const sigla = customSiglas[description] || description.slice(0, 3).toUpperCase();

            // Add to the result object
            items[sigla] = {value, vr};
        }

        // Return the result object
        return {
            examType,
            collectionDate,
            items
        };
    }

    function parseExamHmg(text,examType) {
        // Regular expressions for parsing
        const dateRegex = /Coleta:\s+(\d{2}\/\d{2}\/\d{2,4})/;
        const itemRegex = /(Hematocrito|Hemoglobina|Hemacia|VCM|HCM|CHCM|RDW|Leucocitos|Blastos|Basofilos|Eosinofilos|Mielocitos|Metamielocitos|Bastoes|Segmentados|Linfocitos|Monocitos|Plaquetas).*?([0-9.,]+).*?VR:\s*[A-Z]?\s*([0-9.,]+\s*a\s*[0-9.,]+)/g;

        // Extract date of collection
        const dateMatch = text.match(dateRegex);
        const collectionDate = dateMatch ? dateMatch[1] : null;

        // Map custom siglas
        const customSiglas = {
            Hematocrito: 'HT',
            Hemoglobina: 'HB',
            Plaquetas: 'PLQ',
            CHCM: 'CHCM'
        };

        // Extract items and values
        const items = {};
        let match;
        while ((match = itemRegex.exec(text)) !== null) {
            const description = match[1];
            const value = match[2];
            const vr = match[3];

            // Determine the sigla
            const sigla = customSiglas[description] || description.slice(0, 3).toUpperCase();

            // Add to the result object
            items[sigla] = {sigla, value, vr};
        }

        // Return the result object
        return {
            examType,
            collectionDate,
            items
        };
    }

    function parseExamData(text, examType) {
        if (examType === 'HPL') {
            return parseExamHmg(text,examType);
        } else if (examType === 'TTP') {
            return parseExamTPA(text,examType);
        } else if(examType === 'TAP') {
            return parseExamTPA(text,examType);
        }else {
            console.log(text);
            return "";
        }
    }

    'use strict';
    // Adiciona o CSS do Bootstrap ao cabeçalho da página
    const bootstrapLink = document.createElement('link');
    bootstrapLink.rel = 'stylesheet';
    bootstrapLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';
    document.head.appendChild(bootstrapLink);

    // Certifique-se de que o jQuery está carregado
    $(document).ready(function () {

        // Cria e estiliza o botão
        const button = $('<button>')
            .addClass('btn btn-primary btn-lg position-fixed')
            .text('Clique aqui')
            .css({
                bottom: '20px',
                right: '20px',
                zIndex: 1000,
            })
            .attr('id', 'meuBotao');

        // Adiciona o botão ao corpo da página
        $('body').append(button);

        // Evento de clique no botão
        $('#meuBotao').click(function () {
            document.onselectstart = new Function("return true")

            const labels = $('#conteudo > table > tbody > tr>  td:nth-child(1');
            $('#conteudo > table > tbody > tr>  td:nth-child(2)').each((x, y) => {
                const text = y.innerText;
                const exxmType = labels[x].innerText;
                const result = parseExamData(text, exxmType);
                console.log(result);
            });
            alert('Você clicou no botão!');
        });
    });
})();
