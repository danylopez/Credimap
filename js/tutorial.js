$(document).ready(function(){
    $("#sitio").click(function(){
        $("#video").attr('src', '');
        $("#intro").hide();
        window.location.href = "#calculadora";
    });
    $('#sitioaux').click(function() {
        $("#video").attr('src', '');
        $("#intro").hide();
        window.location.href = "#calculadora";
    });
    
    /* Get iframe src attribute value i.e. YouTube video url
    and store it in a variable */
    var url = $("#videoaux").attr('src');
    
    /* Assign empty url value to the iframe src attribute when
    modal hide, which stop the video playing */
    $("#tutorial").on('hide.bs.modal', function(){
        $("#videoaux").attr('src', '');
    });

    /* Assign the initially stored url back to the iframe src
    attribute when modal is displayed again */
    $("#tutorial").on('show.bs.modal', function(){
        $("#videoaux").attr('src', url);
    });

});