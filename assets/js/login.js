import { alertBorder, clearField, controlEmail, controlPassword, controlRemember, clearRemember, checkFields, successBorder,eyePassword } from './dom.js';
window.onload = () => {
    /*----form_login----*/
    const form_login = document.body.querySelector('#form_login');
    if (form_login) {
        const inputEmail = form_login.querySelector('#inputEmail');
        inputEmail.addEventListener('focus', function () {
            clearField(this);
            checkFields(inputEmail, inputPassword, inputRemember, inputSubmit);
        });
        inputEmail.addEventListener('innput', function () {
            controlEmail(this);
            checkFields(inputEmail, inputPassword, inputRemember, inputSubmit);
        });
        inputEmail.addEventListener('blur', function () {
            controlEmail(this);
            checkFields(inputEmail, inputPassword, inputRemember, inputSubmit);
        });
        const inputPassword = form_login.querySelector('#inputPassword');
        const showPassword = form_login.querySelector('#loginEye');
        inputPassword.addEventListener('focus', function () {
            clearField(this);
            checkFields(inputEmail, inputPassword, inputRemember, inputSubmit);
        });
        inputPassword.addEventListener('input', function () {
            controlPassword(this);
            checkFields(inputEmail, inputPassword, inputRemember, inputSubmit);
        });
        inputPassword.addEventListener('blur', function () {
            controlPassword(this);
            checkFields(inputEmail, inputPassword, inputRemember, inputSubmit);
        });

        showPassword.addEventListener('click',function(){
            eyePassword(inputPassword,showPassword);
        });

        const inputRemember = form_login.querySelector('#remember_me');
        inputRemember.addEventListener('focus', function () {
            clearRemember(this);
            checkFields(inputEmail, inputPassword, inputRemember, inputSubmit);
        });
        inputRemember.addEventListener('input', function () {
            controlRemember(this);
            checkFields(inputEmail, inputPassword, inputRemember, inputSubmit);
        });
        inputRemember.addEventListener('blur', function () {
            controlRemember(this);
            checkFields(inputEmail, inputPassword, inputRemember, inputSubmit);
        });
        const inputSubmit = form_login.querySelector('#inputSubmit')
        inputSubmit.addEventListener('click', function (event) {
            const inputs = form_login.getElementsByTagName('input');
            let fieldSuccess = [];
            let counter = 0;
            let nbBorder = 0;
            for (var i = 0; i < inputs.length; i++) {
                if (inputs[i].type == 'email' || inputs[i].type == 'password' || inputs[i].type == 'checkbox') {
                    fieldSuccess[i] = inputs[i];
                   // console.log(fieldSuccess.length);
                    if (fieldSuccess[i].type == 'email' && fieldSuccess[i].value == '' || fieldSuccess[i].type == "email" && fieldSuccess[i].classList.contains('border-red-300')
                        || fieldSuccess[i].type == 'password' && fieldSuccess[i].value == '' || fieldSuccess[i].type == "password" && fieldSuccess[i].classList.contains('border-red-300')
                    ) {
                        alertBorder(fieldSuccess[i]);
                        counter++;
                    }
                    if (fieldSuccess[i].type == "email" && !fieldSuccess[i].value == "" && fieldSuccess[i].classList.contains('border-green-300')
                        || fieldSuccess[i].type == "password" && !fieldSuccess[i].value == "" && fieldSuccess[i].classList.contains('border-green-300')
                    ) {
                        successBorder(fieldSuccess[i]);
                        nbBorder++;
                    }
                    if (fieldSuccess[i].type == 'checkbox' && !fieldSuccess[i].checked) {
                        fieldSuccess[i].style.outline = "2px solid #fca5a5";
                        counter++;
                    }
                    if (fieldSuccess[i].type == 'checkbox' && fieldSuccess[i].checked) {
                        fieldSuccess[i].style.outline = "2px solid #0cfa40"
                        nbBorder++;
                    }
                }
            }
            if (!counter == 0 || !fieldSuccess.length == nbBorder) {
                event.preventDefault();
                event.stopImmediatePropagation();
                return false;
            }
        });

    }
}

