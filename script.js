const inputs = document.querySelectorAll('.input');
const spans = document.querySelectorAll('.span');
const warningIcon = document.querySelectorAll('.warning');
const bandeira = document.getElementById('bandeira');
const nomeCreditCard = document.getElementsByClassName('nome-titular');
const placeholder = document.getElementsByClassName('placeholder');
const h3 = document.getElementsByClassName('h3-in-placeholder');
const back = document.getElementById('back');

const arrayPlaceholder = Array.from(placeholder);
const arrayH3 = Array.from(h3);
const placeholderNumber = arrayPlaceholder.slice(0,16);
const placeholderValidade = arrayPlaceholder.slice(16,20);
const placeholderCvv = arrayPlaceholder.slice(20);
const h3Number = arrayH3.slice(0,16);
const h3Validade = arrayH3.slice(16,20);
const h3Cvv = arrayH3.slice(20);


function setError(index) {
    inputs[index].style.border = '1.5px solid #FB7185';
    spans[index].style.color = '#FB7185';
    warningIcon[index].style.display = 'flex';
}

function removeError(index) {
    inputs[index].style.border = '';
    spans[index].style.color = '#1F2937';  
    warningIcon[index].style.display = 'none' 
}

function validateCardNumber() {
    back.style.display = 'none'; // Flip do cartão

    let value = inputs[0].value.replace(/\D/g, ''); // Impede letras
    
    // Inclui os espaços para atingir a formatação **** **** **** ****
    if (value.length > 4) {
        value = value.slice(0, 4) + ' ' + value.slice(4);
    }
    if (value.length > 9) {
        value = value.slice(0, 9) + ' ' + value.slice(9);
    }
    if (value.length > 14) {
        value = value.slice(0, 14) + ' ' + value.slice(14);
    }
    
    inputs[0].value = value;
    
    if(value.length<13){
        setError(0);
    } else {
        removeError(0);
    }
    
    substituiPlaceholder(placeholderNumber, h3Number, value);
    
    // Verifica bandeira

    value = value.replace(/\s+/g, ''); // Remove espaços
    const prefix = value.substring(0, 4);

    if (prefix.startsWith('4') && (value.length === 13 || value.length === 16)) {
        bandeira.style.backgroundImage = 'url(./assets/Bandeiras=Visa.png)';
        return value;
    } else if ((prefix.startsWith('51') || prefix.startsWith('52') || prefix.startsWith('53') || prefix.startsWith('54') || prefix.startsWith('55') || 
                (parseInt(prefix) >= 2221 && parseInt(prefix) <= 2720)) && value.length === 16) {
        bandeira.style.backgroundImage = 'url(./assets/Bandeiras=Mastercard.png)';
        return value;
    } else if (['5067', '5090', '5016', '4170', '4916', '4312'].includes(prefix) && value.length === 16) {
        bandeira.style.backgroundImage = 'url(./assets/Bandeiras=Elo.png)';
        return value;
    } else {
        setError(0);
    }
}

function validateName() {
    back.style.display = 'none'; // Flip do cartão

    let value = inputs[1].value.replace(/[^a-zA-ZÀ-ÖØ-Ýà-öø-ÿ\s]/g, ''); // Impede números
    inputs[1].value = value;
    nomeCreditCard[0].textContent = value;
    
    if(value===''){
        nomeCreditCard[0].classList.remove('highlight');
        nomeCreditCard[0].textContent = 'Seu nome aqui';
        setError(1);
    } else {
        nomeCreditCard[0].classList.add('highlight');
        removeError(1);
        return value;
    }
}

function validateValidade() {
    back.style.display = 'none'; // Flip do cartão

    let value = inputs[2].value.replace(/\D/g, ''); // Impede letras
    
    if (value.length > 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    }
    
    inputs[2].value = value;

    substituiPlaceholder(placeholderValidade, h3Validade, value);
    
    const monthInput = Number(value.slice(0, 2));
    const yearInput = Number(value.slice(3));
    const validMonth = String(new Date().getMonth() + 1).padStart(2, '0');
    const validYear = new Date().getFullYear().toString().slice(-2);

    if(value.length<5){
        setError(2);
    } // teste do mês inserido
    else if(monthInput>12 || monthInput===0) {
        setError(2);
    } // teste do ano inserido
    else if(yearInput<Number(validYear) || 
            (yearInput===Number(validYear) && monthInput<Number(validMonth)) 
            || yearInput>(Number(validYear)+5)) {
        setError(2);
    } else {
        removeError(2);
        return value;
    }
}

function validateCvv() {
    back.style.display = 'flex'; // Flip do cartão

    let value = inputs[3].value.replace(/\D/g, ''); // Impede letras
    inputs[3].value = value;

    substituiPlaceholder(placeholderCvv, h3Cvv, value);
        
    if(value.length<3){
        setError(3);
    } else {
        removeError(3);
        return value;
    }
}

function substituiPlaceholder(placeholderArray, h3Array, value) {
    
    const valor = value.replace(/\D/g, ''); // Remove espaços e caracteres não numéricos
    const index = valor.length; 
    let place = 0;

    for(let i = 0; i < index; i++) {
        let number = valor[i];
        h3Array[place].textContent = number;
        placeholderArray[place].style.opacity = '0';
        place++;
    }
    if(index!==placeholderArray.length){
        h3Array[place].textContent = '';
        placeholderArray[place].style.opacity = '1';
    }

}

function submit() {

    const cardNumber = validateCardNumber();
    const nome = validateName();
    const cvv = validateCvv();
    const validade = validateValidade();

    if(cardNumber && nome && validade && cvv){
        alert(`Número do cartão: ${cardNumber}
            \nNome do titular: ${nome}
            \nValidade: ${validade}
            \nCVV: ${cvv}`);
    }
}
