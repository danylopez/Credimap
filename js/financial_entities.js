var financialEntities=[];

function processTable() {
    financialEntities = localStorage.getItem('feProcessed');
    drawOnTable();
    $('#financieras').modal('toggle');
}

function closeModal(){
    $('#financieras').modal('hide');
}

function drawOnTable(){

    financialEntities = JSON.parse(financialEntities) ;
    for(var i=0;i<financialEntities.length;i++){
        var fe=financialEntities[i],newFeRow= '<tr>';    
        if(i==0)  newFeRow= '<tr class="success">';
        if(i==financialEntities.length-1) newFeRow= '<tr class="danger">';
        newFeRow  = $(newFeRow);
        newFeRow.append('<td style="display: none;">' +fe.id + '</td>' );
        newFeRow.append('<td class="col-md-1">' +fe.name + '</td>' );
        newFeRow.append('<td class="col-md-3">' +fe.info.address + '</td>' );
        newFeRow.append('<td class="col-md-1">' +fe.info.phone + '</td>' );
        newFeRow.append('<td class="col-md-1" style="max-width: 100px !important; word-wrap: break-word">' +fe.info.website+ '</td>' );
        newFeRow.append('<td class="col-md-1">' +fe.financial.totalPayment + '</td>' );
        newFeRow.append('<td class="col-md-1">' +fe.financial.payment + '</td>' );
        newFeRow.append('<td class="col-md-1">' +fe.financial.taxes + '</td>' );
        newFeRow.append('<td class="col-md-1">' +fe.financial.tax_rate + '</td>' );
        newFeRow.append('<td class="col-md-2">' + appendActions() + '</td>');
        newFeRow.append('</tr>');
        $('#feProcessedTable tr:last').after(newFeRow);   
    }

    $('[data-toggle="tooltip"]').tooltip();
}

function showRequirements(){
    $('#requirementsModal').modal('toggle');
}

function localize($this){
    $this =  $($this);
    var placeId = $this.parent().parent().children().first().text();
    closeModal();
    window.location.href = "#mapa";
    zoomMarker(placeId);
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
        'onclick="localize(this);" data-toggle="tooltip" data-placement="bottom" title="Localiza en el mapa la entidad financiera según el préstamo consultado">'+
        '<i class="fa fa-map-marker"></i>'+
    '</button>'+
    '<button id="reqBank" type="button" class="btn btn-default " aria-label="Left Align"'+
    '    onclick="showRequirements()" data-toggle="tooltip"  data-placement="bottom" title="Conoce los requisitos del préstamo.">'+
    '    <i class="fa fa-list-ul"></i>'+
    '</button>'+
    '<button type="button" class="btn btn-default" aria-label="Left Align"'+
    '    onclick="contact(this);" data-toggle="tooltip"  data-placement="bottom" title="Podemos ayudar!">'+
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