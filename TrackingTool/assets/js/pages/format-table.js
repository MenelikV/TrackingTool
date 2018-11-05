$(document).ready(function(){
    // Launch DataTable to make the table look nicer, if there is a table to display...
  if($('#available-data').length){
    // Modify Modal On Show
    $.isSuperADmin = $("#EditButton").length > 0
    $.selectedRow = undefined
    $.selectedRowDom = undefined
    $.internalIdSelection = undefined
    $('#Editor').on('show.bs.modal', function () {
      var row = $("#available-data tr.selected")
      $.selectedRow = row.closest('tr').index()
      $.selectedRowDom = row
      // TOD Go Trough Data Attributes ?
      var ctr = row.find("td").eq(0).find("i").length > 0
      var tra = row.find("td").eq(15).html()
      var v_status = row.find("td").eq(2).find("i").length > 0
      var r_status = row.find("td").eq(1).text().length ? row.find("td").eq(1).text() : "Preliminary"
      $.internalIdSelection = row.find("td").eq(2).find("div").data("id")
      var modal = $(this)
      modal.find('.modal-body #CTRCheck').prop('checked', ctr)
      modal.find(".modal-body #TRA-input").val(tra)
      modal.find('.modal-body #validatedCombo').val(r_status)
      modal.find('.modal-body #validatedCheck').prop('checked', v_status)
    })
    $("#available-data tr").click(function(){
      if($.isSuperADmin){
      $("#EditButton").removeAttr("disabled").removeClass("disabled")
      $(this).addClass('selected').siblings().removeClass('selected'); 
      }
    })
    /* Too Heavy
    $(document).click(function(){
      if($.isSuperADmin){
        table.rows().deselect();
    }})*/
    // Attach a submit handler to the form
    $( "#dataEdition" ).submit(function( event ) {
    
      // Stop form from submitting normally
      event.preventDefault();
    
      // Get some values from elements on the page:
      var $form = $( this ),
      url = $form.attr("action")
       ctr = $form.find( "#CTRCheck" ).is(':checked'),
       tra = $form.find( "#TRA-input" ).val(),
        r_status = $form.find("#validatedCombo").val(),
        v_status = $form.find("#validatedCheck").is(':checked'),
        data = {
          "CTR": ctr,
          "TRA": tra,
          "Results_Status": r_status,
          "Validated_Status": v_status,
          "id":$.internalIdSelection,
        };
        
      // Send the data using post
      // done has Handler when the posting is done, akka, close the modal and redraw the line
      $.ajax({
        url: url,
        data: data,
        type: "POST",
        success: function(){
        $("#closeEditorButton").click()
        // Reset global variables
        $.internalIdSelection = undefined
        $.selectedRow = undefined
        $.selectedRowDom = undefined
        // Reload the page
        location.reload()
        },
        error: function(){
          alert("Update Failure")
          $("#closeEditorButton").click()
          $.internalIdSelection = undefined
          $.selectedRow = undefined
          $.selectedRowDom = undefined 
        }
      })
    })
    
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
