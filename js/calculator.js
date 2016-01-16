var financialEntJson={};

/*
$(document).ready(function (){

    //fixing bug add-on currency size
   // $("#success-alert").hide();
  
    initRangeSliders();
    allowJustNumbers();
    fillPeriodSelect('años');
    registerInputEvents();
    getFinantialEntitiesJson();
    $('[data-toggle="tooltip"]').tooltip(); 
    $(":radio").labelauty({  minimum_width: "50px"});           
   
});
*/

function initCalculator(){
    
     initRangeSliders();
    allowJustNumbers();
    fillPeriodSelect('años');
    registerInputEvents();
    getFinantialEntitiesJson();
    $('[data-toggle="tooltip"]').tooltip(); 
    $(":radio").labelauty({  minimum_width: "50px"});
   
  
    
    /*$.getJSON("test.json", function(json) {
        financialEntJson = json;
    }); */   
                               
    
}


//json entities :  id,name,address,phone,website
function getFinantialEntitiesJson(){
    //initialize();
    financialEntJson.financial_entities = {};        
    financialEntJson.financial_entities =  JSON.parse(localStorage.getItem('financial_entities'));
   
    for(var i=0;i<financialEntJson.financial_entities.length;i++){
        var fe= financialEntJson.financial_entities[i];
        fe.products= [];
        var product ={id:1,tax_rate:getRandomTaxRate()};
        fe.products.push(product);       
    }
}

function getRandomTaxRate(){
       
    return  (Math.random() * 10) + 5;
}

function registerInputEvents(){
 
    $('#amountText').keyup(function() {
        var amount=$(this).val();
        if(amount!='' && amount!=undefined ){
            $('#amountSlider').val(amount).change();   
            if(validateNotEmptyFields())
                onAmauntChange();        
        }
        else
        $('#amountSlider').val(0).change();
  });   
    
    $('select').change(function (){
        var amount= $('#amountText').val();
        if(amount!='' && validateNotEmptyFields()){
            onAmauntChange();
        }
    });
    
    $("input[name=timeUnitsRadio]:radio").change(function (){
        onPeriodKindChange();       
    });   
}

function localizeBest(){
    
    initialize();
    $("#goFinancial").click(function (){
        
    });

}
function validateNotEmptyFields(){
    
     var term =  $('#termSelect').find(':selected').val();
     var pFrequency  = $('#pFrequencySelect').find(':selected').val();
     var loanKind = $('#loanKind').find(':selected').val();  
     if(term!='notSelected' && pFrequency!='notSelected' && loanKind!='notSelected'){
        return true;
     }
    
    return false;
}

function getFrequencyPayment(pFrequencySelect){
  
    if(pFrequencySelect=="semanal") return "semanas";
    if(pFrequencySelect=="quincenal") return "quincenas"; 
    if(pFrequencySelect=="mensual") return "meses";
}

function drawBest(bestEntities){
    if(bestEntities.length>0){
        var pFrequencySelect =  $('#pFrequencySelect').find(':selected').val();
        $('#totalPayment').text(bestEntities[0].totalPayment + " $");
        $('#payment').text(bestEntities[0].payment + " $");        
        $('#taxesPaid').text(bestEntities[0].taxes + " $");
        $('#taxPercentage').text(bestEntities[0].tax_rate + " %");     
        $('#frequencyPay').text(pFrequencySelect);
        $('#totalTimeSpan').text("Intereses pagados en " + Math.round(term) + " ");                           $('#frequencyPay2').text(getFrequencyPayment(pFrequencySelect));
        $('#bestEntityNameSpan').text("La mejor opcion "  + bestEntities[0].name);
        $('#divBest').css('display','block');
        saveBestLocalStorage( bestEntities[0].id);
        saveAll(bestEntities);
        $('#separatorCalc').css('display','block');
    }
    
}

function saveAll(bestEntities){
       localStorage.setItem('feProcessed',JSON.stringify(bestEntities));
}

function saveBestLocalStorage(id){
    localStorage.setItem("bestOne", id);
}

//make the calculation of the best
function onAmauntChange(){
 
    var productId=  1;
    var amount = parseInt($('#amountText').val());
    term =  parseInt($('#termSelect').find(':selected').text());
    var timeUnits = $('input[name=timeUnitsRadio]:checked').val();
    var pFrequencySelect =  $('#pFrequencySelect').find(':selected').val();
    var finalEntities= [];
    var periodicity ,tax_factor;
    
    if(timeUnits=='años') term = term*12;
    
    tax_factor = getTaxFactor(pFrequencySelect);
    if(pFrequencySelect=='semanal')
        term = (term*30)/7;
    else
        term*=tax_factor;    
    
    
    for(var i =0;i<financialEntJson.financial_entities.length;i++){
        var finEntity = financialEntJson.financial_entities[i];
        for(var z=0;z<finEntity.products.length;z++ ) {
            var product= finEntity.products[z];
            if(product.id==productId){
                var fe={};
                var totalPayment =  amount + (amount * ((product.tax_rate/100)/tax_factor) * term);
                var payment =  totalPayment/term;
                var taxes = (amount * ((product.tax_rate/100)/tax_factor) * term);
                fe.id = finEntity.id;
                fe.name = finEntity.name;
                fe.address = finEntity.address;
                fe.phone = finEntity.phone;            
                fe.website= finEntity.web;
                fe.totalPayment= totalPayment;
                fe.payment =  payment;
                fe.taxes = taxes;
                fe.tax_rate  = product.tax_rate/tax_factor;
                fe.frequency=pFrequencySelect;
                finalEntities.push(fe);
                roundNumbers(fe);
            }
        }
    }
    
    sortFinalEntities(finalEntities);
    drawBest(finalEntities);
    
}

function roundNumbers(fe){
    
    fe.totalPayment= Math.round(fe.totalPayment*100)/100;
    fe.payment =  Math.round(fe.payment*100)/100;
    fe.taxes = Math.round(fe.taxes*100)/100;
    fe.tax_rate  = Math.round(fe.tax_rate*100)/100;
}

function calculate(){
    /*$("#success-alert").alert();
    $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
        //$("#success-alert").alert('close');
         $("#success-alert").hide();
    });   */
    if(validateNotEmptyFields() && $('#amountText').val()!=''){
        onAmauntChange();
    }
    else{
        alert('Es necesario llenar todos los campos.');      
    }
    
}

function getTaxFactor(pFrequencySelect){
 
    if(pFrequencySelect=="semanal") return 4;
    if(pFrequencySelect=="quincenal") return 2; 
    if(pFrequencySelect=="mensual") return 1;
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
        
        polyfill: false,
        // Callback function
        onSlide: function(position, value) {       
            var amount = $('#amountText').val();
            if(value=>0){                  
                if( parseInt(amount)%1000==0)
                 $('#amountText').val(value);
                 
                if(Math.abs(value-amount)>=1000)
                     $('#amountText').val(value);
                if(validateNotEmptyFields())
                 onAmauntChange();
            }
        },      
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
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105))                e.preventDefault();       
        
    });
}



