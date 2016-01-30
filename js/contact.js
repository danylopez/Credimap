$(document).ready(function(){
    $('#feedbackForm').validate({
        rules: {
            name: {
                minlength: 3,
                maxlength: 20,
                required: true,
            },
            phone: {
                minlength: 10,
                maxlength: 10,
                number: true
            },
            email: {
                required: true
            },
            message: {
                required: false
            }
        },
        highlight: function(element) {
            $(element).closest('.form-group')
                      .removeClass('has-success')
                      .addClass('has-error');    
        },
        unhighlight: function(element) {

            $(element).closest('.form-group')
                      .removeClass('has-error')
                      .addClass('has-success');     
        },
        errorElement: 'span',
            errorClass: 'help-block',
            errorPlacement: function(error, element) {
                if(element.length) {
                    error.insertAfter(element);
                } else {
                error.insertAfter(element);
                }
            },
        isValidName: function (name) {
        
        }
    });
});

jQuery.extend(jQuery.validator.messages, {
	email: "Por favor escriba un e-mail v&#225lido.",
    required: "Necesita llenar este campo.",
    number: "Por favor solo escriba n&#250meros.",
    maxlength: jQuery.validator.format("Por favor no escriba m&#225s de {0} caracteres."),
    minlength: jQuery.validator.format("Por favor escriba al menos {0} caracteres.")
});

function setEntity()
{
  window.location.href = "#contacto";
  var fin = "Financiera a Contactar: ";
  var x = document.getElementById("financiera");
  x.value = fin.concat(finalEntities[0].name);
}