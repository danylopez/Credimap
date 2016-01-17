var financialEntities=[];

$(document).ready(function (){
    debugger;
    financialEntities = localStorage.getItem('feProcessed');
    drawOnTable();
});


function drawOnTable(){
    financialEntities = JSON.parse(financialEntities) ;
    for(var i=0;i<financialEntities.length;i++){
        var fe=financialEntities[i],newFeRow= '<tr>';    
        if(i==0)  newFeRow= '<tr class="success">';
        if(i==financialEntities.length-1) newFeRow= '<tr class="danger">';     
        
        if(fe.address==="undefined"){
            fe.address= '';
        } 
        
        if(fe.website==="undefined"){
            fe.website= '';
        } 
        
        newFeRow  = $(newFeRow);
        newFeRow.append('<td>' +fe.name + '</td>' );
        newFeRow.append('<td>' +fe.address + '</td>' );
        newFeRow.append('<td>' +fe.phone + '</td>' );
        newFeRow.append('<td>' +fe.website + '</td>' );
        newFeRow.append('<td>' +fe.totalPayment + '</td>' );
        newFeRow.append('<td>' +fe.payment + '</td>' );
        newFeRow.append('<td>' +fe.taxes + '</td>' );
        newFeRow.append('<td>' +fe.tax_rate + '</td>' );
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