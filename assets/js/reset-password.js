import { clearField,info,controlEmail, redField, greenField, checkEmail, alertBorder, successBorder } from "./dom.js";

window.onload = () => {
    const form_reset_password = document.body.querySelector('#reset_password_request');  //reset_password_request

    if(form_reset_password){
        const inputEmail = form_reset_password.querySelector('#reset_password_request_form_email');
        const message = document.body.querySelector('#message');
        const allowEmail = document.body.querySelector('#allowEmail');    
        const request_form_submit = form_reset_password.querySelector('#request_form_submit'); 
        inputEmail.addEventListener('focus',function(){
            clearField(this);
            let text="";
            redField(allowEmail,text);
            let information="Indiquez votre adresse courriel";
            info(message,information);
            checkEmail(inputEmail,request_form_submit);
        });
        inputEmail.addEventListener('input',function(){
            controlEmail(this);
            if(controlEmail(this)===false){
                let text = 'adresse couriel incorrecte !';
                redField(allowEmail,text);
                alertBorder(this);
            } else if(controlEmail(this)===true){
                let text = 'Adresse courriel ok !';
                greenField(allowEmail,text);
                successBorder(this);
            }
            checkEmail(inputEmail,request_form_submit);
        });
        inputEmail.addEventListener('blur',function(){
            controlEmail(this);
            if(controlEmail(this)===false){
                let text = 'adresse couriel incorrecte !';
                redField(allowEmail,text);
            } else if(controlEmail(this)===true){
                let text = 'Adresse courriel ok !';
                greenField(allowEmail,text);
            }
            checkEmail(inputEmail,request_form_submit);
        });

        request_form_submit.addEventListener('click',function(e){
            if(!controlEmail(inputEmail)===true  && !inputEmail.classList.contains('border-green-300')){
                let text = 'adresse couriel incorrecte !';
                redField(allowEmail,text);
                let information="";
                info(message,information);
                e.preventDefault();
                e.stopImmediatePropagation();
                return false;
            }
        });
    }
}