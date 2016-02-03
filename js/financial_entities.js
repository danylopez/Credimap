var financialEntities=[];
var allListed = [];
var perfomedSearch = 0;
var  justGotIn = 0;

function saveGlobalInfo(){
    financialEntities = localStorage.getItem('feProcessed');
    financialEntities = JSON.parse(financialEntities);
    getAllListed(financialEntities);
    if(justGotIn==0) {
        $('[data-toggle="tooltip"]').tooltip();
        justGotIn=1;
    }
}

function processTable() {

    saveGlobalInfo();
    var productId= $('#loanKind').find(':selected').val();
    $('#loanKind2').val(productId);
    drawOnTable(productId);
    $('#financieras').modal('toggle');
    $('#loanKind2').change(function() {
        drawOnTable($(this).val());
    });

}


function getAllListed(){

    if(allListed.length>0) return;

    for(var i=0;i<financialEntities.length;i++){
        for(var z=0;z<financialEntities[i].products.length;z++){
            var calcProduct = {id:financialEntities[i].id,
                               info:financialEntities[i].info,
                               financial : financialEntities[i].financial[z],
                               loanKind : getLoanKind(z+1)
            };
            allListed.push(calcProduct);
        }
    }

    allListed.sort(function (a,b){
        return a.financial.totalPayment - b.financial.totalPayment;
    });
}

function closeModal(){
    $('#financieras').modal('hide');
}
//change this later
function cleanTable(){
    $('#feProcessedTable tr').not(function(){if ($(this).has('th').length){return true}}).remove();
}

function getLoanKind(product){
    return (product) ==1 ? 'individual' : 'grupal';
}

function searchFe(){
    $('#comparingSelectModal').change(function (){

        if(perfomedSearch==1){
            $("#feProcessedTable tr").removeClass('info');
            $('#feProcessedTable tr:last').addClass('danger');
            $('#feProcessedTable tr').eq(1).addClass('success');
        }

        var idFe = $(this).find(':selected').val();
        $("#feProcessedTable tr").each(function() {
            var id = $(this).children().eq(0).text();
            if(id==idFe){
                $(this).addClass('info');
                perfomedSearch=1;
                var w = $('#financieras');
                w.scrollTop($(this).offset().top - (w.height()/2) );

                return ;
            }

        });
    });
}
function localize($this){
    $this =  $($this);
    var placeId = $this.parent().parent().children().first().text();
    closeModal();
    window.location.href = "#mapa";
    zoomMarker(placeId);
}

function writeTable(list,product){

    for (var i = 0; i < list.length; i++) {
            var newFeRow = '<tr>';
            var info={id:list[i].id,name:list[i].name,address:list[i].info.address};
            if(product== 1 || product==2){
                info.totalPayment=list[i].financial[product-1].totalPayment;
                info.payment=list[i].financial[product-1].payment;
                info.taxes=list[i].financial[product-1].taxes;
                info.tax_rate=list[i].financial[product-1].tax_rate;
                info.paymentEachT = list[i].financial[product-1].paymentEachT;
                info.loanKind =  getLoanKind(product);
            }
            else if(product==3){
                info.name=list[i].info.name;
                info.totalPayment=list[i].financial.totalPayment;
                info.payment=list[i].financial.payment;
                info.taxes=list[i].financial.taxes;
                info.tax_rate=list[i].financial.tax_rate;
                info.paymentEachT = list[i].financial.paymentEachT;
                info.loanKind =  list[i].loanKind;
            }

        if (i == 0)  newFeRow = '<tr class="success">';
        if (i == list.length - 1) newFeRow = '<tr class="danger">';
        newFeRow = $(newFeRow);
        newFeRow.append('<td style="display: none;">' + info.id + '</td>');
        newFeRow.append('<td >' + info.name + '</td>');
        newFeRow.append('<td >' + info.address + '</td>');
        newFeRow.append('<td >' + info.loanKind + '</td>');
        newFeRow.append('<td >' + info.totalPayment + '</td>');
        newFeRow.append('<td >' + info.payment + '</td>');
        newFeRow.append('<td >' + info.taxes + '</td>');
        newFeRow.append('<td >' + info.tax_rate + '</td>');
        newFeRow.append('<td >' + info.paymentEachT + '</td>');
        newFeRow.append('<td >' + appendActions() + '</td>');
        newFeRow.append('</tr>');
        $('#feProcessedTable tr:last').after(newFeRow);
    }
}


function drawOnTable(product){
    cleanTable();
    if(product==1 || product==2) {

        writeTable(financialEntities,product);
    }
    else if(3){
        writeTable(allListed,product);
    }
}

function showRequirements(){
    $('#requirementsModal').modal('toggle');
}


function contact($this){
    $this =  $($this);
    var name = $this.parent().parent().children().eq(1).text();
    closeModal();
    setEntity(name);
}

function appendActions(){
    var  actionsString;
    actionsString =
    '<button id="localizeBest" type="button" class="btn btn-default " aria-label="Left Align"'+
        'onclick="localize(this);" data-toggle="tooltip" data-placement="bottom" title="Localiza en el mapa la entidad financiera.">'+
        '<i class="fa fa-map-marker"></i>'+
    '</button>'+
    '<button id="reqBank" type="button" class="btn btn-default " aria-label="Left Align"'+
    '    onclick="showRequirements()" data-toggle="tooltip"  data-placement="bottom" title="Conoce los requisitos del préstamo.">'+
    '    <i class="fa fa-list-ul"></i>'+
    '</button>'+
    '<button type="button" class="btn btn-default" aria-label="Left Align"'+
    '    onclick="contact(this);" data-toggle="tooltip"  data-placement="bottom" title="Contacta a la entidad financiera.">'+
    '    <i class="fa fa-envelope"></i>'+
    '</button>';
    return actionsString;
}

function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
}

function downloadExcel(){
     $("#feProcessedTable").table2excel({
    exclude: ".noExl",
    name: "EntidadesFinancieras",
    filename:"EntidadesFinancieras.xls"         
    
  });

}