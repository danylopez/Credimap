$(document).ready(function(){
    $('form').validate({
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

function isValidName(name){


}
