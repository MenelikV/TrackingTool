$(document).ready(function(){
    // Launch DataTable to make the table look nicer, if there is a table to display...
  if($('#available-data').length){

    // Control the Column Visibility Toggles 
    // Prevent the dropdown from auto closing when user click inside
    $("#colVis").on("click.bs.dropdown", function(e){
      e.stopPropagation()
      e.preventDefault()
    })
    // Detect when user click on a button and hide accordlingly the column
    $("[id^=colVis_]").click(function(e){
      $(this).toggleClass("active")
      var table_header = []
      table.api().columns().every(function(){
        table_header.push(this.header().textContent)
      })
      var header_to_toggle = e.target.textContent
      var idx = table_header.indexOf(header_to_toggle)
      var visible = $(this).hasClass("active")
      table.api().column(idx).visible(visible)
    })
    // On Show, detect which columns are currently visible
    $("#colVisMenuLiContainer").on("show.bs.dropdown", function(){
      table.api().columns().every(function(){
        var header = this.header().textContent.replace(/ /g, '_')
        var visible = this.visible
        if(visible){
          $("#colVis_"+header).addClass("active")
        }
        else{
          $("#colVis_"+header).removeClass("active")
        }
      })
    })
    var headers = window.SAILS_LOCALS["headers"]
    // Modify Modal On Show
    $.isSuperADmin = $("#EditButton").length > 0
    $.selectedRow = undefined
    $.selectedRowDom = undefined
    $.internalIdSelection = undefined
    // Editor Modal
    $('#Editor').on('show.bs.modal', function () {
      var calendar_button = $("#Calendar-button")
      $('[data-toggle="datepicker"]').datepicker({
        trigger: calendar_button,
        format: "dd/mm/yyyy",
        zIndex: 2048,
      }); 
      var row = $("#available-data tr.selected")
      $.selectedRow = row.closest('tr').index()
      $.selectedRowDom = row
      var table_header = []
      table.api().columns().every(function(){
        table_header.push(this.header().textContent)
      })
      var complete_data_table = _.zipObject(table_header, table.api().row(row).data())
      console.log(complete_data_table)
      var ctr = complete_data_table["CTR"].length > 0 ? true: false
      var tra = complete_data_table["TRA"]
      var v_status = complete_data_table["Validated Status"].length > 0 ? true: false
      var r_status = complete_data_table["Results Status"]
      if(r_status.indexOf("Preliminary")!==-1)
      {
        r_status = "Preliminary"
      }
      else{
        if(r_status.indexOf("Validated") !== -1){
          r_status = "Validated"
        }
        else{
          r_status = "Investigation"
        }
      }
      var comment = complete_data_table["Commentary"]
      var delivery_date = complete_data_table["Delivery Date"]
      $.internalIdSelection = complete_data_table["id"]
      var modal = $(this)
      modal.find('.modal-body #CTRCheck').prop('checked', ctr)
      modal.find(".modal-body #TRA-input").val(tra)
      modal.find('.modal-body #validatedCombo').val(r_status)
      modal.find('.modal-body #validatedCheck').prop('checked', v_status)
      console.log(delivery_date)
      console.log(moment(delivery_date).format("YYYY-MM-DD"))
      modal.find('.modal-body #Delivery-Input').val(moment(delivery_date).format("YYYY-MM-DD"))
      modal.find('.modal-body #Comment-input').val(comment)
    })
    $("#available-data tbody").on("click", "tr", function(ev){
      if($.isSuperADmin){
        ev.stopPropagation()
      $("#EditButton").removeAttr("disabled").removeClass("disabled")
      $(this).closest("tr").addClass('selected').siblings().removeClass('selected'); 
      return true
      }
    }) 

    $(document).click(function(){
      if($.isSuperADmin && $("#available-data tr.selected").length){
        $("#EditButton").attr("disabled", true).addClass("disabled")
        $("#available-data tr.selected").removeClass("selected")
    }})
    // Remove any validation form on keypress
    $("#dataEdition").keypress(function(){
      $(this)[0].classList.remove("was-validated")
    })
    // Attach a submit handler to the form
    $( "#dataEdition" ).submit(function( event ) {
      // Select the form and chech validity of it natively
      if($(this)[0].checkValidity() === false){
        event.preventDefault()
        event.stopPropagation()
        $(this)[0].classList.add("was-validated")
        return false
      }
    
      // Stop form from submitting normally
      event.preventDefault();

      var table_header = []
      table.api().columns().every(function(){
        table_header.push(this.header().textContent)
      })

      // Get some values from elements on the page:
      var moment = require("moment")
      var $form = $( this ),
      url = $form.attr("action")
       ctr = $form.find( "#CTRCheck" ).is(':checked') === true ? "true": "",
       tra = $form.find( "#TRA-input" ).val(),
        r_status = $form.find("#validatedCombo").val(),
        v_status = $form.find("#validatedCheck").is(':checked') === true ? "true": "",
        delivery_date = $form.find("#Delivery-Input").val().length > 0 ? moment.parse($form.find("#Delivery-Input").val()).format("DD/MM/YYYY"): "",
        comment = _.escape($form.find('#Comment-input').val())
        row_data = table.api().row($.selectedRowDom).data()
        tra_idx = table_header.indexOf("TRA")
        comment_idx = table_header.indexOf("Commentary")
        dd_idx = table_header.indexOf('Delivery Date')
        rs_idx = table_header.indexOf("Results Status")
        v_idx = table_header.indexOf("Validated")
        ctr_idx = table_header.indexOf("CTR")
      row_data[tra_idx] = tra
      row_data[dd_idx] = delivery_date
      row_data[rs_idx] = r_status
      row_data[v_idx] = v_status
      row_data[comment_idx] = comment
      row_data[ctr_idx] =  ctr
      if($form.find("#validatedCheck").length && $form.find("#validatedCombo").length)
        {
          //Super Admin Editing
        var data = {
          "CTR": ctr,
          "TRA": tra,
          "Results_Status": r_status,
          "Validated_Status": v_status,
          "Delivery_Date": delivery_date,
          "Commentary": comment,
          "id":$.internalIdSelection,
        };
      }
      else{
        // Basic User Edition
        var data = {
          "CTR": ctr,
          "TRA": tra,
          "Delivery_Date": delivery_date,
          "Commentary": comment,
          "id": $.internalIdSelection
        }
      }
      // Send the data using post
      // done has Handler when the posting is done, aka, close the modal and redraw the line
      $.ajax({
        url: url,
        data: data,
        type: "POST",
        success: function(){
        $("#closeEditorButton").click()
        // Reset global variables
        table.api().row($.selectedRowDom).invalidate()
        $.internalIdSelection = undefined
        $.selectedRow = undefined
        $.selectedRowDom = undefined
        // Reload the page, TODO only redraw part of the table, see with an ajax call
        // location.reload()
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
  // JavaScript Source Data Drawing
  var results_status = headers.indexOf("Results_Status")
  var validated_status = headers.indexOf("Validated_Status")
  var ctr_status = headers.indexOf("CTR")
  var results = headers.indexOf("Results")
  var ffu = headers.indexOf("Fleet_Follow_Up")
  var ffu_id = headers.indexOf("Fleet_Follow_Up_id")
  var pv = headers.indexOf("Parameters_Validation")
  var pv_id = headers.indexOf("Parameters_Validation_id")
  var airline = headers.indexOf("Airline")
  var tra = headers.indexOf("TRA")
  var airline_id = headers.indexOf("Airline_id")
  var tr = headers.indexOf("Tabulated_Results")
  var tr_id = headers.indexOf("Tabulated_Results_id")
  var id_id = headers.indexOf("id")
  var aircraft_id = headers.indexOf("Aircraft")
  var msn_id = headers.indexOf("MSN")
  var flight_id = headers.indexOf("Flight")
  var table = $('#available-data').dataTable({
    columnDefs:[
      {"className": "dt-center", "targets":"_all"},
      {
        // Special Formatting for Validated Status
        "targets": results_status,
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
        "targets": validated_status,
        "render": function(data, type, row, meta){
          if(data !== "" && data !== undefined){
            return '<i class="fa fa-check fa-lg" style="color:green"></i>'
          }
          else{
            return ''
          }
        }
      },
      {
        "targets": ctr_status,
        "render": function(data, type, row, meta){
          if(data !== "" && data !== undefined){
            return '<i class="fa fa-check fa-lg" style="color:green"></i>'
          }
          else{
            return ''
          }
        }
      },
      {
        "targets": ffu,
        "render": function(data, type, row, meta){
          return '<a href="/account/file/download/'+row[ffu_id]+'"'+' target="_blank"><i class="fa fa-file fa-lg" style="color:rgb(98, 166, 255)"></i></a>'
        }
      },
      {
        "targets": pv,
        "render": function(data, type, row, meta){
          return '<a href="/account/file/download/'+row[pv_id]+'"'+' target="_blank"><i class="fa fa-file fa-lg" style="color:rgb(98, 166, 255)"></i></a>'
        }
      },
      {
        "targets": tr,
        "render": function(data, type, row, meta){
          return '<a href="/account/file/download/'+row[tr_id]+'"'+' target="_blank"><i class="fa fa-file fa-lg" style="color:rgb(98, 166, 255)"></i></a>'
        }
      },
      {
        "targets": airline,
        "render": function(data, type, row, meta){
          return '<a href="/account/file/download/'+row[airline_id]+'"'+' target="_blank"><i class="fa fa-file fa-lg" style="color:rgb(98, 166, 255)"></i></a>'
        }
      },
      {
        "targets": results,
        "render": function(data, type, row, meta){
          return '<button type="button" id="ResultsButton_'+row[id_id]+'"'+'class="btn btn-primary" style="text-transform:capitalize" data-toggle="modal" data-target="#Results">View Table </button>'
        }
      },
      {
        "targets": tra,
        "render": function(data, type, row, meta){
          if(data === undefined || data === ""){
            return ''
          }
          else{
            var linkName = "CRUISE PERFORMANCE "+row[aircraft_id]+" MSN "+row[msn_id]+" FLIGHT "+row[flight_id]
            return '<a href='+data+' target="_blank">'+linkName+"</a>"
          }
        }
      }
    ],
    bDeferRender: true,
    iDisplayLength: 10,
    bProcessing: true,
    colReorder: true,
    responsive: true,
    bStateSave:true,
    paging: true,
    dom: 'lBfrtip',
    fnStateSave: function(settings, data){
      localStorage.setItem("DataTables_"+window.location.pathname, JSON.stringify(data))
    },
    fnStateLoad: function(settings){
      var data = localStorage.getItem("DataTables_"+window.location.pathname)
      return JSON.parse(data)
    },
    buttons: []
    });
  // Get the data
  var liste = window.SAILS_LOCALS["data"]
  // Liste could be undefined after a search for instance
  if(liste !== undefined){
  var hidden_indexes = []
  table.fnAddData(liste, false)
  for(let name of ["id", "Airline_id", "Tabulated_Results_id", "Parameters_Validation_id", "Fleet_Follow_Up_id"]){
    hidden_indexes.push(headers.indexOf(name))
    table.fnSetColumnVis(headers.indexOf(name), false)}
  // Draw the table
  table.fnDraw();
  }
  // Trigger the Results Modal when the user clicks on the "View Table" Button
$("[id^=ResultsButton_]").click(function(){
    $.selectedRowDom = $(this).closest("tr")
    $("#Results").modal("show")
  })
  // Results Modal
  $("#Results").on("show.bs.modal", function(){
    var row = $.selectedRowDom
    if(row.length === 0){alert("Did you click somewhere ?")}
    
    $.selectedRow = row.closest('tr').index()
    var table_header = []
    table.api().columns().every(function(){
      table_header.push(this.header().textContent)
    })
    var complete_data_table = _.zipObject(table_header, table.api().row(row).data())
    var results_table = complete_data_table["Results"]
    // insertAfter is not the one to use, maybe append
    $("#TableContainer").append(results_table)
  })
  $("#Results").on("hide.bs.modal", function(){
    // Empty the modal on hide
    $("#TableContainer").empty()
  })
  }
  if($("#upload-results").length){
    $("#upload-results").DataTable({
      "ordering": false,
      "paging": false,
      "searching": false,
      "columnDefs":[
      {"className": "dt-center", "targets":"_all"},
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
