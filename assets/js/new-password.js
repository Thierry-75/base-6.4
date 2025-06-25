import { redField, greenField, alertBorder, clearBorder, clearField, info
    ,successBorder,checkPasswords, initialEmail,eyePassword } from "./dom.js";

window.onload = () => {
    const change_password_form = document.body.querySelector('#reset_password_form');
    if(change_password_form){
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
        const password_plainPassword_first = change_password_form.querySelector('#change_password_form_plainPassword_first'); 
        const password_plainPassword_second = change_password_form.querySelector('#change_password_form_plainPassword_second'); 
        const resetEyeOne = change_password_form.querySelector('#resetEyeOne');
        const resetEyeTwo = change_password_form.querySelector('#resetEyeTwo');
        const registration_form_submit = change_password_form.querySelector('#change_password_form_submit'); //change_password_form_submit
        let information = "Suivez les instructions...";
        info(message, information);

        password_plainPassword_first.addEventListener('focus', function ({ currentTarget }){
            information ="Indiquez votre mot de passe";
            info(message,information);
            let text =" ";
            allowEmail.style.display = 'block'; 
            allowEmail.innerHTML=text;
            clearField(this);
            clearBorder(this);
            initialEmail(allowEmail);
            password_criteria.style.display = "block";
            let password = currentTarget.value;
            if(password.length === 0){
                all_password_criteria.forEach((li) => (li.className = ""));
                password_length_criteria.textContent = "12 caractères au total";
            }
            checkPasswords(password_plainPassword_first,password_plainPassword_second,registration_form_submit);
        });

        password_plainPassword_first.addEventListener('input',function({ currentTarget}){
            let password = currentTarget.value;
            password_length_criteria.className = `password-criteria-${password.length === 12}`;
            password_special_character_criteria.className = `password-criteria-${/[ !"#$%&'()*+,-.\/:;<=>?@\]^_`{|}~]/.test(password)}`;
            password_uppercase_criteria.className = `password-criteria-${/[A-Z]/.test(password)}`;
            password_number_criteria.className = `password-criteria-${/[0-9]/.test(password)}`;
            password_lowercase_criteria.className = `password-criteria-${/[a-zà-ú]/.test(password)}`;
            password_length_criteria.textContent = `12 caractères au total (${password.length}) `;
            checkPasswords(password_plainPassword_first,password_plainPassword_second,registration_form_submit);
        });

        password_plainPassword_first.addEventListener('blur',function( { currentTarget}){
            let password = currentTarget.value;
            if (password.length == 12 && password_length_criteria.classList.contains('password-criteria-true') &&
            password_special_character_criteria.classList.contains('password-criteria-true') &&
            password_uppercase_criteria.classList.contains('password-criteria-true') &&
            password_number_criteria.classList.contains('password-criteria-true') &&
            password_lowercase_criteria.classList.contains('password-criteria-true')) {
            let text = '1ère saisie OK!';
            greenField(allowEmail, text);
            successBorder(this);
        } else {
            let text = '';
            redField(allowEmail, text);
            alertBorder(this);
        }
        checkPasswords(password_plainPassword_first,password_plainPassword_second,registration_form_submit);
        password_criteria.style.display = "none";
        });

        resetEyeOne.addEventListener('click',function(){
            eyePassword(password_plainPassword_first,resetEyeOne);
        });
        password_plainPassword_second.addEventListener('focus', function ({ currentTarget }){
            this.value = "";
            clearBorder(this);
            let password = currentTarget.value;
            if(password.length === 0){
                all_password_criteria.forEach((li) => (li.className = ""));
                password_length_criteria.textContent = "12 caractères au total";
            }
            information ="Confirmez votre mot de passe";
            info(message,information);
            let text =" ";
            allowPassword.style.display = 'block'; 
            allowPassword.innerHTML=text;
            password_criteria.style.display = "block";
            checkPasswords(password_plainPassword_first,password_plainPassword_second,registration_form_submit);
            
        });

        password_plainPassword_second.addEventListener('input',function({ currentTarget}){
            let password = currentTarget.value;
            password_length_criteria.className = `password-criteria-${password.length === 12}`;
            password_special_character_criteria.className = `password-criteria-${/[ !"#$%&'()*+,-.\/:;<=>?@\]^_`{|}~]/.test(password)}`;
            password_uppercase_criteria.className = `password-criteria-${/[A-Z]/.test(password)}`;
            password_number_criteria.className = `password-criteria-${/[0-9]/.test(password)}`;
            password_lowercase_criteria.className = `password-criteria-${/[a-zà-ú]/.test(password)}`;
            password_length_criteria.textContent = `12 caractères au total (${password.length}) `;
            checkPasswords(password_plainPassword_first,password_plainPassword_second,registration_form_submit);
        });

        password_plainPassword_second.addEventListener('blur',function( { currentTarget}){
            let password = currentTarget.value;
            if (password.length == 12 && password_length_criteria.classList.contains('password-criteria-true') &&
            password_special_character_criteria.classList.contains('password-criteria-true') &&
            password_uppercase_criteria.classList.contains('password-criteria-true') &&
            password_number_criteria.classList.contains('password-criteria-true') &&
            password_lowercase_criteria.classList.contains('password-criteria-true') &&
            password_plainPassword_first.value.localeCompare(password_plainPassword_second.value)===0) {
            let text = '2ème saisie OK!';
            greenField(allowPassword, text);
            successBorder(this);
            information="";
            info(message,information);
        } else {
            let text = ' ';
            redField(allowPassword, text);
            alertBorder(this);
        }
        checkPasswords(password_plainPassword_first,password_plainPassword_second,registration_form_submit);
        password_criteria.style.display = "none";

        });

        resetEyeTwo.addEventListener('click',function(){
            eyePassword(password_plainPassword_second,resetEyeTwo);
        });

        registration_form_submit.addEventListener('focus',function(){
            checkPasswords(password_plainPassword_first,password_plainPassword_second,registration_form_submit);
        });

        registration_form_submit.addEventListener('click',function(e){
            let inputs = change_password_form.getElementsByTagName('input');
            let cpt =0; let nbBorder = 0; let fieldSuccess = [];let num =0;let compare1;let compare2;
            for(let i =0; i < inputs.length; i++){
                if(inputs[i].type=="password"){
                    fieldSuccess[i]=inputs[i];
                }
                for(let i =0; i < fieldSuccess.length; i++ ){
                    if(fieldSuccess[i].value =='' || fieldSuccess[i].classList.contains('border-red-300'))
                    {
                        alertBorder(fieldSuccess[i]);
                        cpt++;
                    }
                    else if(!fieldSuccess[i].value =='' && fieldSuccess[i].classList.contains('border-green-300'))
                    {
                        successBorder(fieldSuccess[i]);
                        nbBorder++;
                        if(num == 0){
                            compare1=fieldSuccess[num];
                        }else{
                            compare2=fieldSuccess[num]
                        }
                        num++;
                    }
                }                
            }
            if(!cpt==0 || !fieldSuccess.length == nbBorder || compare1.value !== compare2.value ){
                e.preventDefault();
                e.stopImmediatePropagation();
                return false;
            }
        });
    }
}