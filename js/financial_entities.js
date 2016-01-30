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
        newFeRow.append('<td>' +fe.name + '</td>' );
        newFeRow.append('<td>' +fe.info.address + '</td>' );
        newFeRow.append('<td>' +fe.info.phone + '</td>' );
        newFeRow.append('<td>' +fe.info.website+ '</td>' );
        newFeRow.append('<td>' +fe.financial.totalPayment + '</td>' );
        newFeRow.append('<td>' +fe.financial.payment + '</td>' );
        newFeRow.append('<td>' +fe.financial.taxes + '</td>' );
        newFeRow.append('<td>' +fe.financial.tax_rate + '</td>' );
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