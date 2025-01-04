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
//    const match = texto.match(/Idade:\s*(\d+)\s*anos/);
    const match = texto.match(/\d{2}\/\d{2}\/\d{4}/);
    if(match){
        return calcularIdade(match[0]);
    }
    // retornar valor em string
    return null; // Retorna o número como inteiro ou null
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
function calcularIdade(dataTexto) {
    // Converte o texto para um objeto Date
    const [dia, mes, ano] = dataTexto.split('/').map(Number);
    const dataNascimento = new Date(ano, mes - 1, dia);
    const hoje = new Date();

    // Calcula a diferença em milissegundos
    const diferencaTempo = hoje - dataNascimento;

    if (diferencaTempo < 0) {
        return "Data inválida"; // Verifica se a data de nascimento é no futuro
    }

    // Calcula dias, meses e anos
    const dias = Math.floor(diferencaTempo / (1000 * 60 * 60 * 24));
    const anos = hoje.getFullYear() - dataNascimento.getFullYear();
    const meses = hoje.getMonth() - dataNascimento.getMonth() + (anos * 12);
    const mesesAjustados = (meses % 12 + 12) % 12; // Ajusta para valores corretos

    if (dias < 30) {
        return `${dias} dias`; // Menor de 30 dias
    } else if (anos < 2) {
        const anosParciais = Math.floor(meses / 12);
        return `${anosParciais} ano${anosParciais === 1 ? '' : 's'} e ${mesesAjustados} mês${mesesAjustados === 1 ? '' : 'es'}`;
    } else {
        return `${anos} ano${anos === 1 ? '' : 's'}`; // Maior ou igual a 2 anos
    }
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