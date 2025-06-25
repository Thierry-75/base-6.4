import { info, controlPseudo, successBorder, alertBorder, checkAvatarForm, validateImage } from './dom.js';

window.onload = () => {
    const avatar_form = document.body.querySelector('#avatar_form');
    if (avatar_form) {
        const avatar_form_pseudo = avatar_form.querySelector('#avatar_form_pseudo');
        const avatar_form_image = avatar_form.querySelector('#avatar_form_image');
        const avatar_form_submit = avatar_form.querySelector('#avatar_form_submit');
        let information = "Indiquez votre pseudonyme";
        info(message, information);

        avatar_form_pseudo.addEventListener('focus', function () {
            information = "Max 30 lettres sans accent !  ex:  Belphegor#175  ";
            info(message, information);
        });

        avatar_form_pseudo.addEventListener('input', function () {
            controlPseudo(this);
            checkAvatarForm(avatar_form_pseudo, avatar_form_image, avatar_form_submit);
        });

        avatar_form_pseudo.addEventListener('blur', function () {
            controlPseudo(this);
            checkAvatarForm(avatar_form_pseudo, avatar_form_image, avatar_form_submit);
        });

        avatar_form_image.addEventListener('focus', function () {
            information = "Image au format png max 1Mo";
            info(message, information);

        });

        avatar_form_image.addEventListener('change', function () {
            if (validateImage(this) == true) {
                successBorder(this);
            }
            else {
                alertBorder(this);
            }
            checkAvatarForm(avatar_form_pseudo, avatar_form_image, avatar_form_submit);

        });
        avatar_form_image.addEventListener('blur', function () {
            if (validateImage(this) == true) {
                successBorder(this);
                information ="";
                info(message,information);
            }
            else {
                alertBorder(this);
            }
            checkAvatarForm(avatar_form_pseudo, avatar_form_image, avatar_form_submit);
        });

        avatar_form_submit.addEventListener('focus',function(){
            information ="";
            info(message,information);
        });

        avatar_form_submit.addEventListener('click', function (event) {
            let inputs = avatar_form.getElementsByTagName('input');
            let cpt = 0; let nbBorder = 0; let fieldSuccess = [];
            for (let i = 0; i < inputs.length; i++) {
                if (inputs[i].type == 'text' || inputs[i].type == 'file') {
                    fieldSuccess[i] = inputs[i];
                }
            }
            for (let i = 0; i < fieldSuccess.length; i++) {
                if (fieldSuccess[i].type == "text" && fieldSuccess[i].value == "" || fieldSuccess[i].type == "text" && fieldSuccess[i].classList.contains('border-red-300')) {
                    alertBorder(fieldSuccess[i]);
                    cpt++;
                } else if (fieldSuccess[i].type == "text" && !fieldSuccess[i].value == "" && fieldSuccess[i].type == "text" && fieldSuccess[i].classList.contains('border-green-300')) {
                    successBorder(fieldSuccess[i]);
                    nbBorder++;
                }
                if (fieldSuccess[i].type == "file" && fieldSuccess[i].value == "" || fieldSuccess.type == "file" && fieldSuccess[i].classList.contains('border-red-300')) {
                    alertBorder(fieldSuccess[i]);
                    cpt++;
                } else if (fieldSuccess[i].type == "file" && !fieldSuccess[i].value == "" && fieldSuccess[i].type == "file" && fieldSuccess[i].classList.contains('border-green-300')) {
                    successBorder(fieldSuccess[i]);
                    nbBorder++;
                }
            }
          //  alert(`cpt:${cpt} nbBorder:${nbBorder} fields:${fieldSuccess.length}`);
            if(!cpt==0 || !fieldSuccess.length == nbBorder){
            event.preventDefault();
            event.stopImmediatePropagation();

            return false;
            }

        });
    }
}

