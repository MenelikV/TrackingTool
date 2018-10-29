$(document).ready(function(){
    // Launch DataTable to make the table look nicer, if there is a table to display...
  if($('#available-data').length){
    // TODO
  var table = $('#available-data').DataTable({
    "columnDefs":[{
      "targets":9,
      "render": function ( data, type, row, meta ) {
        return "<a href=" + "file:///**".replace("**", data) + " " + 'style="display: block;">' + "Tabulated Results" + "</a>"
      }
    },
    {
      "targets": 8,
      "render": function ( data, type, row, meta ) {
        return "<a href=" + "file:///**".replace("**", data) + " " + 'style="display: block;">' + "Airline" + "</a>"
      }
    },
    {
      "targets": 10,
      "render": function ( data, type, row, meta ) {
        return "<a href=" + "file:///**".replace("**", data) + " " + 'style="display: block;">' + "Parameters Validation" + "</a>"
      }
    },
    {
      "targets":11,
      "render": function ( data, type, row, meta ) {
        return "<a href=" + "file:///**".replace("**", data) + " " + 'style="display: block;">' + "Fleet Follow Up" + "</a>"
      }
    },
    
    {
      // Special Formatting for Validated Status
      "targets":2,
      "render": function(data, type, row, meta){
        switch(data){
          case "Preliminary":
            return '<font color="blue">Preliminary</font>'
          case "Investigation":
            return '<font color="orange">Investigation</font>'
          case "Definitive":
            return '<font color="green">Definitive</font>'
          default:
            return ''
        }
      }
    },
    {
      // Special Formatting for Results Status
      "targets": 1,
      "render": function(data, type, row, meta){
        return data?'<p>&amp;#9786;>/p>':''
      }
    },
  ]
  });
  // Open PDF Link
  $('#available-data tbody').on( 'click', 'td', function () {
    var idx = table.cell( this ).index().column;
    if([8, 9, 10, 11].indexOf(idx) !== -1)
    {
      var test = "file:///**".replace("**", table.cell(this).data())
      //alert(test)
      var win = open(test, "_blank")
      if(win){
        win.focus()
      }
      else{
        alert("Please allow pop-up")
      }
    }
} );
  // Click to see the Results Table
  $("#available-data tbody").on( "click", "td.details-control", function(){
    alert("TESR")
    var tr = $(this).closest('tr');
    var row = table.row( tr );
    alert(row.my_prop)
    if ( row.child.isShown() ) {
      // This row is already open - close it
      row.child.hide();
      tr.removeClass('shown');
  }
  else {
      // Open this row and display the table
      test = '<table class="table table-striped" id="Results">' +
      '<thead><tr><th>Test n°</th><th>Hp (ft)</th><th>W/delta (tons)</th><th>Mach</th><th>D Specific Range (%)</th></tr></thead></table>'
      row.child(table.cell(this).data()).show();
      tr.addClass('shown');
      }});
  }})
