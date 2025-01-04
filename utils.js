//fazer função que pega informações do paciente
function extrairEnfermaria(texto) {
    // Usa regex para capturar as partes da string
    const match = texto.match(/(C I P)\s+.*(\d)$/);
    if (match) {
        const enfermaria = match[1]; // Captura "C I P"
        const ultimoNumero = match[2]; // Captura o último número
        return `${enfermaria} - ${ultimoNumero}`; // Retorna no formato desejado
    } else if (texto.match(/UIR\s+(\d+)/)) {
        const primeiroNumeroMatch = texto.match(/UIR\s+(\d+)/);
        const enfermaria = primeiroNumeroMatch ? parseInt(primeiroNumeroMatch[1], 10) : null;

        // Captura o último número no texto
        const ultimoNumeroMatch = texto.match(/(\d+)$/);
        const ultimoNumero = ultimoNumeroMatch ? parseInt(ultimoNumeroMatch[1], 10) : null;
        return `${enfermaria} - ${ultimoNumero}`; // Retorna no formato desejado
    } else {
        const primeiroNumeroMatch = texto.match(/UIR\s+(\d+)/);
        const enfermaria = primeiroNumeroMatch ? parseInt(primeiroNumeroMatch[1], 10) : null;

        // Captura o último número no texto
        const ultimoNumeroMatch = texto.match(/(\d+)$/);
        const ultimoNumero = ultimoNumeroMatch ? parseInt(ultimoNumeroMatch[1], 10) : null;
        return `${enfermaria} - ${ultimoNumero}`; // Retorna no formato desejado
    }
    return null; // Retorna null se o padrão não for encontrado
}

function extractValor(texto) {
    return texto.split(': ')[1].trim(); // Divide a string e pega a segunda parte
}

function extrairData(texto) {
    // Usa uma expressão regular para encontrar uma data no formato DD/MM/AAAA
    const match = texto.match(/\d{2}\/\d{2}\/\d{4}/);
    return match ? match[0] : null; // Retorna a data ou null se não encontrar
}

function extrairIdade(texto) {
    // Usa uma expressão regular para capturar o número antes da palavra "anos"
    const match = texto.match(/Idade:\s*(\d+)\s*anos/);

    // retornar valor em string
    return match ? match[1] : null; // Retorna o número como inteiro ou null
    //   return match ? parseInt(match[1], 10) : null; // Retorna o número como inteiro ou null
}

class Paciente {
    constructor(re, nome, dataNascimento, idade, leito) {
        this.re = re;
        this.nome = nome;
        this.dataNascimento = dataNascimento;
        this.idade = idade;
        this.leito = leito;
    }
}
const getInfoPaciente = function () {
    const registro = extractValor($('#Conteudo > div:nth-child(12) > div > div >  #pac_box > div > div.col-lg-3 > p:nth-child(1)').text());
    const nome = extractValor($('#Conteudo > div:nth-child(12) > div > div >  #pac_box > div > div.col-lg-3 > p:nth-child(2)').text());
    const leito = extrairEnfermaria($('#pac_box > div > div:nth-child(3) > p:nth-child(1) > b:nth-child(2)').text());
    const dataNascimento = extrairData($('#pac_box > div > div:nth-child(3) > p:nth-child(2)').text());
    const idade = extrairIdade($('#pac_box > div > div:nth-child(3) > p:nth-child(2)').text());
    return new Paciente(registro, nome, dataNascimento, idade, leito);
}
function syncPaciente(paciente) {
    console.log('Sincronizando paciente', paciente);
    console.log(JSON.stringify(paciente));

    ajaxPost("https://hicd-backend.fly.dev/pacientes", paciente, function (response) {
        console.log(response);
        alert('paciente sincronizado: ' + paciente.nome);
    }, function (e) {
        console.log(e);
    });

    // Fazer a sincronização com o sistema extern
    /*unsafeWindow.GM_xmlhttpRequest({
        method: "POST",
        url: "https://hicd-backend.fly.dev/pacientes",
        data: JSON.stringify(paciente),
        headers: {
            "Content-Type": "application/json"
        },
        onload: function (response) {
            console.log(response.responseText);
            alert('paciente sincronizado: ' + paciente.nome);
        }

    }); */

}

function ajaxPost(url, data, loadCallback, errorCallback) {
    unsafeWindow.GM_xmlhttpRequest({
        method: "POST",
        url: url,
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        },
        onload: function (response) {
            loadCallback.apply(response);
        },
        error: function (e) {
            error.apply(e);
        },

    });
}