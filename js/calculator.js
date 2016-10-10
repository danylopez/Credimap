var financialEntJson={};
var showedBest = 0;
var maploaded =0;
$(document).ready(function (){

  $("#warning-alert").hide();
  $('#myNavbar a').click(function (){
     
         var ariaExpanded = $('[aria-expanded = "true"]');
         if(ariaExpanded.length!=0)
            $('.navbar-toggle').click();
  });

});


function initCalculator(){    

	
    initRangeSliders();
    allowJustNumbers();
    fillPeriodSelect('anos');
    registerInputEvents();
    getFinancialEntitiesJson();
    $('[data-toggle="tooltip"]').tooltip();
    $(":radio").labelauty({  minimum_width: "50px"});
    fillComparingCombo();
    $('input.combobox').css('text-align','center');
    $('.searchCombo1').tooltip({title:'! Compara con otra de las entidades financieras !','placement':'top',trigger:'focus'});
    $('.searchCombo2').tooltip({title:'Busca alguna entidad financiera y localizala en azul.','placement':'top',trigger:'focus'});
   	$(window).resize(onResizeScreen);
}

function onResizeScreen(){
    $('#map').height($('#calculatorDiv').width());
    $('#map').width($('#calculatorDiv').width());
}

function fillComparingCombo(){
    var comparingSelect=    $('#comparingSelect');
    var comparignSelectModal = $('#comparingSelectModal');
    for(var i=0;i<financialEntJson.financial_entities.length;i++) {
        var fe = financialEntJson.financial_entities[i];
        comparingSelect.append($('<option>', {
            value: fe.id,
            text : fe.name
        }));
        comparignSelectModal.append($('<option>', {
            value: fe.id,
            text : fe.name
        }));
    }
    $('#comparingSelect').combobox();
    $('#comparingSelect').data('combobox').clearTarget();
    $('#comparingSelect').data('combobox').clearElement();

    $('#comparingSelectModal').combobox();
    $('#comparingSelectModal').data('combobox').clearTarget();
    $('#comparingSelectModal').data('combobox').clearElement();
}


//json entities :  id,name,address,phone,website
function getFinancialEntitiesJson(){
    
    financialEntJson.financial_entities = {};        
    financialEntJson.financial_entities =  JSON.parse(localStorage.getItem('financial_entities'));
    for(var i=0;i<financialEntJson.financial_entities.length;i++){
        var fe= financialEntJson.financial_entities[i];
        fe.products= [];
        var product1 ={id:1,tax_rate:getRandomTaxRate()};
        fe.products.push(product1,{id:2,tax_rate:product1.tax_rate+1.2});
    }

    /*products IDs
        1-> individual
        2-> grupal
    */
}

function getRandomTaxRate(){
       
    return  (Math.random() * 10) + 5;
}

function localizeBest(){

    zoomMarker(bestId);
}

function registerInputEvents(){
 
    $('#amountText').keyup(function(e) {

        var amount=$(this).val();
        if(amount!='' && amount!=undefined ){
            $('#amountSlider').val(amount).change();   
            if(validateNotEmptyFields())
                onAmountChange();
        }
        else
        $('#amountSlider').val(0).change();
  });   
    
    $('select').change(function (){
        var amount= $('#amountText').val();
        if(amount!='' && validateNotEmptyFields()){
            onAmountChange();
        }
    });
    
    $("input[name=timeUnitsRadio]:radio").change(function (){
        onPeriodKindChange();
        if($('#amountText').val()!='' && validateNotEmptyFields())
            onAmountChange();
    });
    $('#comparingSelect').change(function (){
        var idFe = $(this).find(':selected').val();
        for(var i=0;i<financialEntJson.financial_entities.length;i++){
            var fe = financialEntJson.financial_entities[i];
            if(fe.id==idFe){
                writeValuesComp(fe);
                break;
            }
        }
    });
}



function writeValuesComp(fe){
    var productId=  parseInt($('#loanKind').find(':selected').val())-1;
    $('#totalPaymentComp').text('$'+fe.financial[productId].totalPayment );
    $('#paymentComp').text('$'+fe.financial[productId].payment );
    $('#taxesPaidComp').text('$'+fe.financial[productId].taxes);
    $('#taxPercentageComp').text(fe.financial[productId].tax_rate+'%' );
    $('#paymentEachTComp').text('$'+fe.financial[productId].paymentEachT );
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
        var productId=  parseInt($('#loanKind').find(':selected').val())-1;
        var pFrequencySelect =  $('#pFrequencySelect').find(':selected').val();
        $('#totalPayment').text("$"+bestEntities[0].financial[productId].totalPayment);
        $('#payment').text("$"+bestEntities[0].financial[productId].payment);
        $('#taxesPaid').text("$"+bestEntities[0].financial[productId].taxes );
        $('#taxPercentage').text(bestEntities[0].financial[productId].tax_rate + " %");
        $('#frequencyPay').text(pFrequencySelect);
        $('#paymentEachT').text("$"+bestEntities[0].financial[productId].paymentEachT );
        $('#totalTimeSpan').text("Intereses pagados en " + Math.round(term) + " ");
        $('#percentageFreq').text(pFrequencySelect);
        $('#frequencyPay2').text(getFrequencyPayment(pFrequencySelect));
        $('#bestEntityNameSpan').text(bestEntities[0].name);
        $('#divBest').css('display','block');
        saveBestLocalStorage( bestEntities[0].id);
        bestId = bestEntities[0].id; //change this to o hashmap structure
        bestName = bestEntities[0].name; //also this
        saveAll(bestEntities);
        $('#separatorCalc').css('display','block');

        //change this later , not optimized
        var idFe = $('#comparingSelect').find(':selected').val();
        for(var i=0;i<financialEntJson.financial_entities.length;i++){
            var fe = financialEntJson.financial_entities[i];
            if(fe.id==idFe){
                writeValuesComp(fe);
                break;
            }
        }
    }


    if(showedBest==0) {
        changeBest(bestId);
        $('[data-toggle="tooltip"]').tooltip('hide');
        $('.searchCombo1').focus();
        showComparingAlert();
        showedBest=1;
        searchFe();
        saveGlobalInfo();

    }
}

function showComparingAlert(){
     $('.searchCombo1').tooltip('show');
}

function contactBest(){
    setEntity(bestName);
}

function saveAll(bestEntities){
      localStorage.removeItem('feProcessed');
      localStorage.setItem('feProcessed',JSON.stringify(bestEntities));
}

function saveBestLocalStorage(id){
    localStorage.setItem("bestOne", id);
}

//when the asyncronous method of google maps getting places info (website,phone) ends
function writeExtraInfoPlaces(){

    var auxFe =  JSON.parse(localStorage.getItem('financial_entities'));
    for(var i=0;i<financialEntJson.financial_entities.length;i++){
        var fe = financialEntJson.financial_entities[i];
        fe.info = {};
        fe.info.name = auxFe[i].name;
        fe.info.website= auxFe[i].website;
        fe.info.phone= auxFe[i].phone;
        fe.info.address = auxFe[i].address;
    }
    saveAll(financialEntJson.financial_entities);
    maploaded = 1;
}

//make the calculation of the best
function onAmountChange(){

    //refactor this messy code
    var amount = parseInt($('#amountText').val());
    if(isNaN(amount)) amount  =0 ;
    term =  parseInt($('#termSelect').find(':selected').text());
    var timeUnits = $('input[name=timeUnitsRadio]:checked').val();
    var pFrequencySelect =  $('#pFrequencySelect').find(':selected').val();
    var tax_factor;
    
    if(timeUnits=='anos') term = term*12;
    
    tax_factor = getTaxFactor(pFrequencySelect);
    if(pFrequencySelect=='semanal')
        term = (term*30)/7;
    else
        term*=tax_factor;

    term = Math.round(term);
    
    for(var i =0;i<financialEntJson.financial_entities.length;i++){
            var finEntity = financialEntJson.financial_entities[i];
            finEntity.financial=[];
            for(var z=0;z<finEntity.products.length;z++ ) {
                    var product= finEntity.products[z];
                    var calcProduct= {};
                    calcProduct.product=product.id;
                    var totalPayment =  amount + (amount * ((product.tax_rate/100)/tax_factor) * term);
                    var payment =  totalPayment/term;
                    var taxes = (amount * ((product.tax_rate/100)/tax_factor) * term);
                    calcProduct.totalPayment= totalPayment;
                    calcProduct.payment =  payment;
                    calcProduct.taxes = taxes;
                    calcProduct.tax_rate  = product.tax_rate/tax_factor;
                    calcProduct.frequency=pFrequencySelect;
                    calcProduct.paymentEachT= (amount!=0) ? (1000*totalPayment)/amount  : 0;
                    roundNumbers(calcProduct);
                    finEntity.financial.push(calcProduct);
            }
    }

    sortFinalEntities(financialEntJson.financial_entities);
    drawBest(financialEntJson.financial_entities);
    
}

function roundNumbers(fe){
    
    fe.totalPayment= Math.round(fe.totalPayment*100)/100;
    fe.payment =  Math.round(fe.payment*100)/100;
    fe.taxes = Math.round(fe.taxes*100)/100;
    fe.tax_rate  = Math.round(fe.tax_rate*100)/100;
    fe.paymentEachT = Math.round(fe.paymentEachT*100)/100;
}

function calculate(){

    if(validateNotEmptyFields() && $('#amountText').val()!=''){
        onAmountChange();
    }
    else{
        $(document).ready (function showAlert(){
            $('#warning-alert').removeClass('alert-danger').removeClass('alert-success').addClass('alert-warning');
            $('#textAlert').text('¡Carambolas! ');
            $('#textAlertDesc').text('Parece que no has llenado todos los campos.'); 
            $("#warning-alert").alert();
            $("#warning-alert").fadeTo(2000, 500).slideUp(1000, function(){
            });   
         });   
    }
    
}

function getTaxFactor(pFrequencySelect){
 
    if(pFrequencySelect=="semanal") return 4;
    if(pFrequencySelect=="quincenal") return 2; 
    if(pFrequencySelect=="mensual") return 1;
}

function sortFinalEntities(finalEntities){
    
    finalEntities.sort(function (a,b){
        //0-> sort based on first product
        return a.financial[0].totalPayment - b.financial[0].totalPayment;
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
    var years =[1,2,3,4,5,6,7,8,9,10];
    if(timeUnits=='anos'){units=years;}
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
        
        onInit: function() {
          this.$range[0].setAttribute('data-toggle', this.$element[0].getAttribute('data-toggle'));
          this.$range[0].setAttribute('data-placement', this.$element[0].getAttribute('data-placement'));
          this.$range[0].title = this.$element[0].title;
          $('[data-toggle="tooltip"]').tooltip(); 
        },        
        onSlide: function(position, value) {       
            var amount = $('#amountText').val();
            if(value>=0){                  
                if( parseInt(amount)%1000==0)
                 $('#amountText').val(value);
                 
                if(Math.abs(value-amount)>=1000)
                     $('#amountText').val(value);
                if(validateNotEmptyFields())
                 onAmountChange();
            }
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
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105))                e.preventDefault();       

    });
}



