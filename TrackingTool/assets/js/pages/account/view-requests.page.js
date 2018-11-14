$(document).ready(function() {
    var table = $('#example').DataTable();
 
    $('#example tbody').on( 'click', 'tr', function () {
        $(this).toggleClass('selected');
    } );

 
        var tid = "";
        $('#example tr').click(function(event) {
          tid = $(this).attr('id');
        });
        $("#accept").click(function() {
          console.log(tid);

          if ($('#' + tid).length) {
              
            $('#' + tid).remove();
          }
        });
    


} );
 

 