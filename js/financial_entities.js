var financialEntities=[];

function processTable(){
    debugger;
    financialEntities = localStorage.getItem('feProcessed');
    drawOnTable();
    $('#financieras').modal('toggle');
}

function drawOnTable(){

    financialEntities = JSON.parse(financialEntities) ;
    for(var i=0;i<financialEntities.length;i++){
        var fe=financialEntities[i],newFeRow= '<tr>';    
        if(i==0)  newFeRow= '<tr class="success">';
        if(i==financialEntities.length-1) newFeRow= '<tr class="danger">';
        newFeRow  = $(newFeRow);
        newFeRow.append('<td class="col-md-1">' +fe.name + '</td>' );
        newFeRow.append('<td class="col-md-3">' +fe.info.address + '</td>' );
        newFeRow.append('<td class="col-md-1">' +fe.info.phone + '</td>' );
        newFeRow.append('<td class="col-md-1">' +fe.info.website+ '</td>' );
        newFeRow.append('<td class="col-md-1">' +fe.financial.totalPayment + '</td>' );
        newFeRow.append('<td class="col-md-1">' +fe.financial.payment + '</td>' );
        newFeRow.append('<td class="col-md-1">' +fe.financial.taxes + '</td>' );
        newFeRow.append('<td class="col-md-1">' +fe.financial.tax_rate + '</td>' );
        newFeRow.append('<td class="col-md-2"> <button id="localizeBest" type="button" class="btn btn-default " aria-label="Left Align"   onclick="localizeBest();" data-toggle="tooltip"  data-placement="bottom" title="Localiza en el mapa la entidad financiera según el préstamo consultado"><a id="goFinancial" href="#financial" style="display:hidden"></a>&nbsp;<i class="fa fa-map-marker"></i></button><br> <button id="reqBank" type="button" class="btn btn-default " aria-label="Left Align"   onclick="" data-toggle="tooltip"  data-placement="bottom" title="Muestra los requerimientos del préstamo"><a id="goRrequirements" href="#requerimientos" style="display:hidden"> </a><i class="fa fa-book"></i></button> <br> <button type="button" class="btn btn-default " aria-label="Left Align" onclick="setEntity()" data-toggle="tooltip"  data-placement="bottom" title="Podemos ayudar!"> <i class="fa fa-envelope"></i></button></td> ');
         newFeRow.append('</tr>');
        $('#feProcessedTable tr:last').after(newFeRow);   
    }
}

function downloadExcel(){
     $("#feProcessedTable").table2excel({
    exclude: ".noExl",
    name: "EntidadesFinancieras",
    filename:"EntidadesFinancieras.xls"         
    
  });

}