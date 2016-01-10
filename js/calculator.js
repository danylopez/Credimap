 $(function() {

        var amount = $('#amountSlider');
        //rangeslider initialization
        amount.rangeslider({

            // Deactivate the feature detection
            polyfill: false,

            // Callback function
            onInit: function() {
               // valueOutput(this.$element[0]);

            },

            // Callback function
            onSlide: function(position, value) {
                $('#amountText').val(value);
            },
            // Callback function
            onSlideEnd: function(position, value) {
          
            }
        });

    });

$(document).ready(function (){
    //fixing bug add-on currency size
    $(":radio").labelauty({ same_width: true });
    allowJustNumbers();
        
});


function allowJustNumbers(){

    $('#amountText').keydown(function (e){
         if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
             // Allow: Ctrl+C
            (e.keyCode == 67 && e.ctrlKey === true) ||
             // Allow: Ctrl+X
            (e.keyCode == 88 && e.ctrlKey === true) ||
             // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

}