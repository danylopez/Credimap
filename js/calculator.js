var financialEntJson;


$(document).ready(function (){
    //fixing bug add-on currency size
    initRangeSliders();
    $(":radio").labelauty({  minimum_width: "50px"});
    allowJustNumbers();
     $('[data-toggle="tooltip"]').tooltip(); 
    fillPeriodSelect('a');
   $("input[name=timeUnitsRadio]:radio").change(function (){
        onPeriodKindChange();
       
    });
    
    $('#amountText').change(function (){
        onAmauntChange();
    });
    
    $.getJSON("test.json", function(json) {
        financialEntJson = json;
    });
});

function drawBest(bestEntities){
    if(bestEntities.length>0){
        $('#totalPayment').text(bestEntities[0].totalPayment);
        $('#montlyPayment').text(bestEntities[0].montlyPayment);        
        $('#taxesPaid').text(bestEntities[0].taxes);
        $('#taxPercentage').text(bestEntities[0].tax_rate);
        $('#divBest').css('display','block');
    }
    
}

//make the calculation of the best
function onAmauntChange(){
 
    var productId=  1;
    var amount = parseInt($('#amountText').val());
    var term =  parseInt($('#termSelect').find(':selected').text());
    var timeUnits = $('input[name=timeUnitsRadio]:checked').val();
    var finalEntities= [];
    
    if(timeUnits=='a') term = term*12;
    
    for(var i =0;i<financialEntJson.financial_entities.length;i++){
        var finEntity = financialEntJson.financial_entities[i];
        for(var z=0;z<finEntity.products.length;z++ ) {
            var product= finEntity.products[z];
            if(product.id==productId){
                var fe={};
                var totalPayment =  amount + (amount * product.tax_rate * term);
                var montlyPayment =  totalPayment/term;
                var taxes = (amount * product.tax_rate * term);
                fe.name = finEntity.name;
                fe.address = finEntity.address;
                fe.totalPayment= totalPayment;
                fe.montlyPayment =  montlyPayment;
                fe.taxes = taxes;
                fe.tax_rate  = product.tax_rate;
                finalEntities.push(fe);
            }
        }
    }
    
    sortFinalEntities(finalEntities);
    drawBest(finalEntities);
    
}


function sortFinalEntities(finalEntities){
    
    finalEntities.sort(function (a,b){
        return a.totalPayment - b.totalPayment;
    });
}

function onPeriodKindChange(){
    $('#termSelect').find('option:enabled').remove(); //optimize this later
    var timeUnits = $('input[name=timeUnitsRadio]:checked').val();
    fillPeriodSelect(timeUnits);
    
}

function fillPeriodSelect(timeUnits){
    var units;
    var months = [1,3,6,9,15,18,30];
    var years =[1,2,3,4,5,6,7,8,9,10,11,12,13,15,15];
    if(timeUnits=='a'){units=years;}
    if(timeUnits=='m'){units=months;}
    
    for(var i=0;i<units.length;i++){
        $('#termSelect').append($('<option>', {
            value: units[i],
            text: units[i]
        }));
    }
}

function setBestTaxRate(){    
  var amount = $('#bestTaxRate');
  amount.val(50);  
}

function initRangeSliders(){
    var amount = $('#amountSlider');
    var bestTaxRateSlider = $('#bestTaxRate');
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
              onAmauntChange();
        },
        // Callback function
        onSlideEnd: function(position, value) {

        }
    });
    
    bestTaxRateSlider.rangeslider({

        // Deactivate the feature detection
        polyfill: false
      
    });
}

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
