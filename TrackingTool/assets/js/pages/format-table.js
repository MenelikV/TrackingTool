$(document).ready(function(){
    // Launch DataTable to make the table look nicer, if there is a table to display...
  if($('#available-data').length){
    // Modify Modal On Show
    $.isSuperADmin = $("#EditButton").length > 0
    $.selectedRow = undefined
    $('#Editor').on('show.bs.modal', function () {
      var row = $("#available-data tr.selected")
      // TOD Go Trough Data Attributes ?
      var ctr = row.find("td").eq(0).find("i").length > 0
      var tra = row.find("td").eq(17).text()
      var v_status = row.find("td").eq(2).find("i").length > 0
      var r_status = row.find("td").eq(1).text()
      var modal = $(this)
      modal.find('.modal-body #CTRCheck').val(ctr)
      modal.find(".modal-body #TRA-input").val(tra)
      modal.find('.modal-body #validatedCombo').val(r_status)
      modal.find('.modal-body #ValidatedCheck').val(v_status)
    })
    $("#available-data tr").click(function(){
      if($.isSuperADmin){
      $("#EditButton").removeAttr("disabled").removeClass("disabled")
      $(this).addClass('selected').siblings().removeClass('selected'); 
      }
    })
    // TODO
    
  var table = $('#available-data').DataTable({
    "columnDefs":[{
  
      // Special Formatting for Validated Status
      "targets":1,
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
        "targets":1,
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
