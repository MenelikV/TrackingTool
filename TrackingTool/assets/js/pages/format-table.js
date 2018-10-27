$(document).ready(function(){
    // Launch DataTable to make the table look nicer, if there is a table to display...
  if($('#available-data').length){
  var table = $('#available-data').DataTable();
  //var linkFields = Data.pdfFields();
  $('#available-data tbody').on( 'click', 'tr', function () {
    $(this).toggleClass('selected');
} );
  }})
