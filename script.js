// ----------------------------------------------------------------------
// 1. Variáveis Globais
// ----------------------------------------------------------------------

// Procura pelos respectivos campos de texto no documento HTML
const txt_cep = document.querySelector("#cep");
const txt_rua = document.querySelector("#rua");
const txt_num = document.querySelector("#numero");
const txt_cidade = document.querySelector("#cidade");
const txt_bairro = document.querySelector("#bairro");
const slt_estado = document.querySelector("#estado");

// Procura pelo elemento de spinner 'Carregando' no documento HTML
const loadingOverlay = document.querySelector("#loadingOverlay");

// ----------------------------------------------------------------------
// 2. Funções de Lógica
// ----------------------------------------------------------------------

function consultaCEP() {
    // Lê o CEP digitado no campo "CEP" da página HTML
    // para a variável 'cep'.
    let cep = txt_cep.value;
    
    // Verifica se o CEP digitado corresponde ao padrão '00000-000',
    // Ou seja, se é um CEP válido.
    if (cep.match(/^\d{5}-\d{3}$/)) {
        // alert("CEP válido: "+cep);
        
        // Uma API permite que a gente obtenha informações
        // sem sair da página HTML atual.
        // Nosso objetivo é obter as informações do CEP digitado.
        // A URL da API de CEP possui o seguinte formato:
        // https://viacep.com.br/ws/12345123/json/
        // Onde "12345123" é o CEP (sem traço, apenas números).
        
        // Remove o "-" (traço) da variável 'cep'.
        cep = cep.replace("-", "");
        
        limpaCampos();
        
        // Exibe o spinner de 'Carregando' antes de chamar a API.
        loadingOverlay.classList.add('d-flex');
        loadingOverlay.classList.remove('d-none');
        
        fetch('https://viacep.com.br/ws/'+cep+'/json/')
        .then(function(response) {
            // Oculta o spinner de 'Carregando' ao receber a resposta da API.
            loadingOverlay.classList.add('d-none');
            loadingOverlay.classList.remove('d-flex');
            
            // Converte a resposta para JSON.
            return response.json();
        })
        .then(function(jsonResponse) {
            // Exibe a resposta convertida da API na Console do navegador Web.
            console.log(jsonResponse);
            
            // A API da ViaCEP retorna a chave 'erro' quando o CEP
            // digitado é inválido.
            if (jsonResponse.erro) {
                console.log("CEP inválido!");
                // Exibe a mensagem de "CEP inválido!" abaixo do campo de CEP.
                txt_cep.classList.add("is-invalid");
            } else {
                // Remove a mensagem de "CEP inválido!" abaixo do campo de CEP (se existir).
                txt_cep.classList.remove("is-invalid");
                // Preenche os campos de texto com as informações retornadas pela API.
                if  (jsonResponse.logradouro !== "") {
                    txt_rua.value = jsonResponse.logradouro;
                    txt_rua.disabled = true;
                }
                if (jsonResponse.bairro !== "") {
                    txt_bairro.value = jsonResponse.bairro;
                    txt_bairro.disabled = true;
                }
                if (jsonResponse.localidade !== "") {
                    txt_cidade.value = jsonResponse.localidade;
                    txt_cidade.disabled = true;
                }
                if (jsonResponse.estado !== "") {
                    slt_estado.value = jsonResponse.uf;
                    slt_estado.disabled = true;
                }
                
            }
        });
    }
}

function limpaCampos() {
    txt_rua.disabled = "";
    txt_cidade.disabled = "";
    txt_bairro.disabled = "";
    txt_num.value
    slt_estado.disabled = "";

    txt_rua.disabled = false;
    txt_cidade.disabled = false;
    txt_bairro.disabled = false;
    slt_estado.disabled = false;
}

// ----------------------------------------------------------------------
// 3. Escutadores de Eventos e Início
// ----------------------------------------------------------------------

// Executa função ao digitar qualquer tecla no campo "CEP"
txt_cep.addEventListener("keyup", consultaCEP);

jQuery(function($){
    // Adiciona máscara ao campo de CEP
    $("#cep").mask("99999-999");
    // Formata o campo "Número" para aceitar somente números.
    $('#numero').mask('#0', {
        translation: {
            '0': {pattern: /[0-9]/, recursive: true }
        }
    });
});