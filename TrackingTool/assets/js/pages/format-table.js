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
  }
  if($("#upload-results").length){
    $("#upload-results").DataTable({
      "ordering": false,
      "paging": false,
      "searching": false,
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
    })
    if($("#Results").length){
      $("Results").DataTable({
        "ordering": false,
        "paging": false,
        "searching": false,
      })
    }
  }
})
