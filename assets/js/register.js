import {
    redField, greenField, initialEmail, alertBorder, clearBorder, clearField,
    controlEmail, controlTerms, info, successBorder, checkFields, eyePassword
} from './dom.js';
window.onload = () => {
    const registration_form = document.body.querySelector('#registration_form');
    if (registration_form) {
        const allowEmail = document.body.querySelector('#allowEmail');
        const allowPassword = document.body.querySelector('#allowPassword');
        const allowAgreeTerms = document.body.querySelector('#allowAgreeTerms');
        const message = document.body.querySelector('#message');
        const password_criteria = document.body.querySelector('#password_criteria');
        const password_length_criteria = document.body.querySelector('#password_length_criteria');
        const password_special_character_criteria = document.body.querySelector("#password_special_character_criteria");
        const password_uppercase_criteria = document.body.querySelector("#password_uppercase_criteria");
        const password_number_criteria = document.body.querySelector("#password_number_criteria");
        const password_lowercase_criteria = document.body.querySelector("#password_lowercase_criteria");
        const all_password_criteria = document.body.querySelectorAll("li[data-password-criteria]");
        const registration_form_email = registration_form.querySelector('#registration_form_email');
        const registration_form_plainPassword = registration_form.querySelector('#registration_form_plainPassword');
        const registration_form_agreeTerms = registration_form.querySelector('#registration_form_agreeTerms');
        const registration_form_submit = registration_form.querySelector('#registration_form_submit');
        const registerEye = registration_form.querySelector('#registerEye');
        let information = "Suivez les instructions...";
        info(message, information);

        registration_form_email.addEventListener('focus', function () {
            information = "Indiquez votre adresse email";
            info(message, information);
            clearField(this);
            clearBorder(this);
            initialEmail(allowEmail);
            password_criteria.style.display = "none";
            checkFields(registration_form_email, registration_form_plainPassword, registration_form_agreeTerms, registration_form_submit);
        });

        registration_form_email.addEventListener('input', function () {
            controlEmail(this);
            if (controlEmail(this) === (false)) {
                let text = 'Adresse email incorrecte !'
                redField(allowEmail, text);
            } else if (controlEmail(this) === (true)) {
                let text = 'Adresse email OK!';
                greenField(allowEmail, text);
            }
            checkFields(registration_form_email, registration_form_plainPassword, registration_form_agreeTerms, registration_form_submit);
        });

        registration_form_email.addEventListener('blur', function () {
            if (controlEmail(this) === (false)) {
                let text = 'Adresse email incorrecte !'
                redField(allowEmail, text);
            } else if (controlEmail(this) === (true)) {
                let text = 'Adresse email OK!';
                greenField(allowEmail, text);
            }
            checkFields(registration_form_email, registration_form_plainPassword, registration_form_agreeTerms, registration_form_submit);
        });

        registration_form_plainPassword.addEventListener('focus', function ({ currentTarget }) {
            this.value = "";
            clearBorder(this);
            let password = currentTarget.value;
            if (password.length === 0) {
                all_password_criteria.forEach((li) => (li.className = ""));
                password_length_criteria.textContent = "12 caractères au total";
            }
            information = "indiquez votre mot de passe";
            info(message, information);

            password_criteria.style.display = "block";
            checkFields(registration_form_email, registration_form_plainPassword, registration_form_agreeTerms, registration_form_submit);
        });

        registration_form_plainPassword.addEventListener('input', function ({ currentTarget }) {
            let password = currentTarget.value;
            password_length_criteria.className = `password-criteria-${password.length === 12}`;
            password_special_character_criteria.className = `password-criteria-${/[ !"#$%&'()*+,-.\/:;<=>?@\]^_`{|}~]/.test(password)}`;
            password_uppercase_criteria.className = `password-criteria-${/[A-Z]/.test(password)}`;
            password_number_criteria.className = `password-criteria-${/[0-9]/.test(password)}`;
            password_lowercase_criteria.className = `password-criteria-${/[a-zà-ú]/.test(password)}`;
            password_length_criteria.textContent = `12 caractères au total (${password.length}) `;
            checkFields(registration_form_email, registration_form_plainPassword, registration_form_agreeTerms, registration_form_submit);
        });

        registration_form_plainPassword.addEventListener('blur', function ({ currentTarget }) {
            let password = currentTarget.value;
            if (password.length == 12 && password_length_criteria.classList.contains('password-criteria-true') &&
                password_special_character_criteria.classList.contains('password-criteria-true') &&
                password_uppercase_criteria.classList.contains('password-criteria-true') &&
                password_number_criteria.classList.contains('password-criteria-true') &&
                password_lowercase_criteria.classList.contains('password-criteria-true')) {
                let text = 'Mot de passe OK!';
                greenField(allowPassword, text);
                successBorder(this);
            } else {
                let text = 'Mot de passe incorrect !';
                redField(allowPassword, text);
                alertBorder(this);
            }
            password_criteria.style.display = "none";
            checkFields(registration_form_email, registration_form_plainPassword, registration_form_agreeTerms, registration_form_submit);

        });

        registerEye.addEventListener('click',function(){
            eyePassword(registration_form_plainPassword,registerEye);
        });

        registration_form_agreeTerms.addEventListener('focus', function () {
            information = "Accepter les conditions générales";
            info(message, information);
            checkFields(registration_form_email, registration_form_plainPassword, registration_form_agreeTerms, registration_form_submit);
        });

        registration_form_agreeTerms.addEventListener('input', function () {
            controlTerms(this, information);
            checkFields(registration_form_email, registration_form_plainPassword, registration_form_agreeTerms, registration_form_submit);

        });
        registration_form_agreeTerms.addEventListener('blur', function () {
            controlTerms(this, information);
            checkFields(registration_form_email, registration_form_plainPassword, registration_form_agreeTerms, registration_form_submit);

        });

        registration_form_submit.addEventListener('click', function (e) {
            let inputs = registration_form.getElementsByTagName('input');
            let compteur = 0; let nbBordure = 0; let champsucess = [];
            for (let i = 0; i < inputs.length; i++) {
                if (inputs[i].type == "email" || inputs[i].type == "password" || inputs[i].type == 'checkbox') {
                    champsucess[i] = inputs[i];
                }
            }
            for (let i = 0; i < champsucess.length; i++) {
                if (champsucess[i].type == 'email' && champsucess[i].value == "" || champsucess[i].type=='email' && champsucess[i].classList.contains('border-red-300')) {
                    alertBorder(champsucess[i]);
                    compteur++;
                }else if(champsucess[i].type=='email' && !champsucess[i].value=="" && champsucess[i].classList.contains('border-green-300')){
                    successBorder(champsucess[i]);
                    nbBordure++;
                }
                if (champsucess[i].type == 'password' && champsucess[i].value == "" || champsucess[i].type=='password' && champsucess[i].classList.contains('border-red-300')) {
                    alertBorder(champsucess[i]);
                    compteur++;
                }else if(champsucess[i].type=='email' && !champsucess[i].value=="" && champsucess[i].classList.contains('border-green-300')){
                    successBorder(champsucess[i]);
                    nbBordure++;
                }
                if(champsucess[i].type=="checkbox" && !champsucess[i].checked){
                    champsucess[i].classList.remove('border','border-gray-50');
                    champsucess[i].style.outline='1px solid #FCA5A5';
                    compteur++;
                }else if(champsucess[i].type=="checkbox" && champsucess[i].checked){
                    champsucess[i].classList.remove('border', 'border-gray-50');
                    champsucess[i].style.outline = '2px solid lightGreen';
                    nbBordure++;
                }
            }
            if (!registration_form_agreeTerms.checked || !compteur == 0 || !champsucess.length == nbBordure) {
                e.preventDefault();
                e.stopImmediatePropagation();
                return false;
            }

        });

    }
}
