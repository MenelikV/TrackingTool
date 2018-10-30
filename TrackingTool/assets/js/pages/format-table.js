$(document).ready(function(){
    // Launch DataTable to make the table look nicer, if there is a table to display...
  if($('#available-data').length){
    // TODO
  var table = $('#available-data').DataTable({
    "columnDefs":[{
  
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
  }
  if($("#upload-results").length){
    $("#upload-results").DataTable({
      "ordering": false,
      "paging": false,
      "searching": false,
      "columnDefs":[
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
