var financialEntJson;

$(document).ready(function (){
    //fixing bug add-on currency size
    initRangeSliders();
    $(":radio").labelauty({  minimum_width: "50px"});
    allowJustNumbers();
     $('[data-toggle="tooltip"]').tooltip(); 
    fillPeriodSelect('años');
   $("input[name=timeUnitsRadio]:radio").change(function (){
        onPeriodKindChange();       
    });    
    
    $('#amountText').keyup(function() {
      var amount=$(this).val();
      if(amount!='' && amount!=undefined ){
        $('#amountSlider').val(amount).change();   
         var term =  $('#termSelect').find(':selected').val();
         if(term!='notSelected'){
            onAmauntChange();            
        }
      }
      else
        $('#amountSlider').val(0).change();
      
  });
   
    $('#termSelect').change(function (){
        var amount= $('#amountText').val();
        if(amount!=''){
             onAmauntChange();
        }
    })
    
    $.getJSON("test.json", function(json) {
        financialEntJson = json;
    });
   
});

function drawBest(bestEntities){
    if(bestEntities.length>0){
        $('#totalPayment').text( Math.round(bestEntities[0].totalPayment*100)/100 + " $");
        $('#montlyPayment').text(Math.round(bestEntities[0].montlyPayment*100)/100 + " $");        
        $('#taxesPaid').text(Math.round(bestEntities[0].taxes*100)/100 + " $");
        $('#taxPercentage').text(bestEntities[0].tax_rate + " %");     
        var timeUnits = $('input[name=timeUnitsRadio]:checked').val();        
        var term =  parseInt($('#termSelect').find(':selected').text());
        $('#totalTimeSpan').text("Intereses pagados en " + term + " "+ timeUnits);
        $('#bestEntityNameSpan').text("La mejor opcion "  + bestEntities[0].name);
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
    
    if(timeUnits=='años') term = term*12;
    
    for(var i =0;i<financialEntJson.financial_entities.length;i++){
        var finEntity = financialEntJson.financial_entities[i];
        for(var z=0;z<finEntity.products.length;z++ ) {
            var product= finEntity.products[z];
            if(product.id==productId){
                var fe={};
                var totalPayment =  amount + (amount * (product.tax_rate/100) * term);
                var montlyPayment =  totalPayment/term;
                var taxes = (amount * (product.tax_rate/100) * term);
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
    if(timeUnits=='años'){units=years;}
    if(timeUnits=='meses'){units=months;}
    
    for(var i=0;i<units.length;i++){
        $('#termSelect').append($('<option>', {
            value: units[i],
            text: units[i]
        }));
    }
}

function initRangeSliders(){
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
            var term =  $('#termSelect').find(':selected').val();
            var amount = $('#amountText').val();
            if(value=>0){                  
                if( parseInt(amount)%1000==0)
                 $('#amountText').val(value);
                 
                if(Math.abs(value-amount)>=1000)
                     $('#amountText').val(value);
                if(term!='notSelected')
                 onAmauntChange();
            }
        },
        // Callback function
        onSlideEnd: function(position, value) {

        }
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
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105))      {        
            e.preventDefault();
            }     
        
    });

}
