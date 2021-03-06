"use strict";

$(document).ready(function () {
  // Launch DataTable to make the table look nicer, if there is a table to display...
  if ($('#available-data').length) {
    // Formatting Available Data
    $.fn.dataTable.moment('DD/MM/YYYY');
    // Control the Column Visibility Toggles 
    // Prevent the dropdown from auto closing when user click inside
    $("#colVis").on("click.bs.dropdown", function (e) {
      e.stopPropagation();
      e.preventDefault();
    });
    // Detect when user click on a button and hide accordlingly the column
    $("[id^=button_colVis_]").click(function (e) {
      $(this).toggleClass("active");
      var table_header = [];
      table.api().columns().every(function () {
        table_header.push(this.header().innerText.trim());
      });
      var header_to_toggle = e.currentTarget.parentElement.innerText.trim();
      console.log(header_to_toggle);
      var idx = table_header.indexOf(header_to_toggle);
      var visible = $(this).hasClass("active");
      table.api().column(idx).visible(visible);
      // Prevent from trigerring the parent
      e.stopPropagation()
    })
    $("[id^=colVis_]").click(function (e) {
      $(this).find("[id^=button_colVis_]").toggleClass("active");
      var table_header = [];
      table.api().columns().every(function () {
        table_header.push(this.header().innerText.trim());
      });
      var header_to_toggle = e.target.innerText.trim();
      console.log(header_to_toggle);
      var idx = table_header.indexOf(header_to_toggle);
      var visible = $(this).find("[id^=button_colVis_]").hasClass("active");
      table.api().column(idx).visible(visible);
    });
    // On Show, detect which columns are currently visible
    $("#colVisMenuLiContainer").on("show.bs.dropdown", function () {
      table.api().columns().every(function () {
        var header = this.header().innerText.trim().replace(/ /g, '_');
        var visible = this.visible();
        if (visible) {
          $("#button_colVis_" + header).addClass("active");
        } else {
          $("#button_colVis_" + header).removeClass("active");
        }
      });
    });
    var headers = window.SAILS_LOCALS["headers"];
    // Modify Delete Modal On Show
    $("#Deletor").on("show.bs.modal", function () {
      var row = $("#available-data tr.selected");
      $.selectedRow = row.closest('tr').index();
      $.selectedRowDom = row
      var complete_data_table = table.api().row(row).data();
      var modal = $(this);
      modal.find(".modal-body #aircraft").text(complete_data_table["Aircraft"]);
      modal.find(".modal-body #msn").text(complete_data_table["MSN"]);
      modal.find(".modal-body #flight").text(complete_data_table["Flight"]);
      modal.find(".modal-body #row").data("complete", complete_data_table);
    })
    // Modify Editor Modal On Show
    $.isSuperADmin = $("#EditButton").length > 0;
    $.selectedRow = undefined;
    $.selectedRowDom = undefined;
    $.internalIdSelection = undefined;
    // Editor Modal
    $('#Editor').on('show.bs.modal', function () {
      var row = $("#available-data tr.selected");
      $.selectedRow = row.closest('tr').index();
      $.selectedRowDom = row;
      var complete_data_table = table.api().row(row).data();
      var ctr = complete_data_table["CTR"].length > 0 ? true : false;
      var tra = complete_data_table["TRA"];
      var v_status = complete_data_table["Validated_Status"].length > 0 ? true : false;
      var r_status = complete_data_table["Results_Status"];
      if (r_status.indexOf("Preliminary") !== -1) {
        r_status = "Preliminary";
      } else {
        if (r_status.indexOf("Definitive") !== -1) {
          r_status = "Definitive";
        } else {
          r_status = "Investigation";
        }
      }

      let trailing_cone = complete_data_table["Trailing_Cone"];
      var comment = complete_data_table["Commentary"];
      var delivery_date = complete_data_table["Delivery_Date"];
      let dates = delivery_date.split("/");
      let year = parseInt(dates[2]);
      let month = parseInt(dates[1]) - 1;
      let day = parseInt(dates[0]);
      let input_date = moment().year(year).month(month).date(day);

      $.internalIdSelection = complete_data_table["id"];
      var modal = $(this);
      modal.find('.modal-body #CTRCheck').prop('checked', ctr);
      modal.find(".modal-body #TRA-input").val(tra);
      modal.find('.modal-body #validatedCombo').val(r_status);
      modal.find('.modal-body #validatedCheck').prop('checked', v_status);
      modal.find('.modal-body #Delivery-Input').val(input_date.format("YYYY-MM-DD"));
      modal.find('.modal-body #Comment-input').val(comment);
      modal.find('.modal-body #trailingCombo').val(trailing_cone);
    });
    $("#available-data tbody").on("click", "tr", function (ev) {
      const regex = /^ResultsButton_\d+$/gm;
      let tra_regex = /^TRA_comment__\d+$/gm;
      if (ev.target.classList.contains("results-button")) {
        /* Special Way of showing the modal 
        This is because, once the user moved the columns, 
        The click event is not redirected to the button anymore
        */
        $.selectedRowDom = $(this).closest("tr");
        $("#Results").modal("show");
        return true;
      } else if (ev.target.classList.contains("tra-button")) {
        $.selectedRowDom = $(this).closest("tr");
        $("#TRA_comment").modal("show");
        return true;
      }

      // if (tra_regex.exec(ev.target.id) !== null){
      //   ev.stopPropagation();
      //   $.selectedRowDom = $(this).closest("tr");
      //   $("#TRA_comment").modal("show");
      //   return true;
      // }

      if ($.isSuperADmin) {
        ev.stopPropagation();
        $("#EditButton").removeAttr("disabled").removeClass("disabled");
        $("#DeleteButton").removeAttr("disabled").removeClass("disabled");
        $("#GenerateButton").removeAttr("disabled").removeClass("disabled");
        $(this).closest("tr").addClass('selected').siblings().removeClass('selected');
        return true;
      }
    });

    $(document).click(function () {
      if ($.isSuperADmin && $("#available-data tr.selected").length) {
        $("#EditButton").attr("disabled", true).addClass("disabled");
        $("#DeleteButton").attr("disabled", true).addClass("disabled");
        $("#GenerateButton").attr("disabled", true).addClass("disabled");
        $("#available-data tr.selected").removeClass("selected");
      }
    });
    // Remove any validation form on keypress
    $("#dataEdition").keypress(function () {
      $(this)[0].classList.remove("was-validated");
    });
    // Attach a submit handler to the form
    $("#dataEdition").submit(function (event) {
      // Select the form and chech validity of it natively
      if ($(this)[0].checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        $(this)[0].classList.add("was-validated");
        return false;
      }

      // Stop form from submitting normally
      event.preventDefault();

      var table_header = [];
      table.api().columns().every(function () {
        table_header.push(this.header().innerText.trim());
      });

      // Get some values from elements on the page:
      var $form = $(this);
      var url = $form.attr("action");
      var ctr = $form.find("#CTRCheck").is(':checked') === true ? "true" : "";
      var tra = $form.find("#TRA-input").val();
      var r_status = $form.find("#validatedCombo").val();
      var v_status = $form.find("#validatedCheck").is(':checked') === true ? "true" : "";
      var delivery_date = $form.find("#Delivery-Input").val().length > 0 ? moment($form.find("#Delivery-Input").val()).format("DD/MM/YYYY") : "";
      var comment = _.escape($form.find('#Comment-input').val());
      let trailing = $form.find("#trailingCombo").val();
      var row_data = table.api().row($.selectedRowDom).data();
      let prev_result_status = row_data["Results_Status"];
      let prev_validated_status = row_data["Validated_Status"];

      row_data["TRA"] = tra;
      row_data["Delivery_Date"] = delivery_date;
      row_data["Results_Status"] = r_status;
      row_data["Validated_Status"] = v_status;
      row_data["Commentary"] = comment;
      row_data["CTR"] = ctr;
      row_data["Trailing_Cone"] = trailing;
      if ($form.find("#validatedCheck").length && $form.find("#validatedCombo").length) {
        //Super Admin Editing
        var data = {
          "CTR": ctr,
          "TRA": tra,
          "Results_Status": r_status,
          "Validated_Status": v_status,
          "Delivery_Date": delivery_date,
          "Commentary": comment,
          "Trailing_Cone": trailing,
          "id": $.internalIdSelection,
          "prev_result": prev_result_status,
          "prev_validated": prev_validated_status
        };
      } else {
        // Basic User Edition
        var data = {
          "CTR": ctr,
          "TRA": tra,
          "Delivery_Date": delivery_date,
          "Commentary": comment,
          "id": $.internalIdSelection,
          "Trailing_Cone": trailing,
          "prev_result": prev_result_status
        };
      }
      // Send the data using post
      // done has Handler when the posting is done, aka, close the modal and redraw the line
      $.ajax({
        url: url,
        data: data,
        type: "POST",
        success: function success() {
          $("#closeEditorButton").click();
          // Reset global variables
          table.api().row($.selectedRowDom).invalidate();
          $.internalIdSelection = undefined;
          $.selectedRow = undefined;
          $.selectedRowDom = undefined;
          // Reload the page, TODO only redraw part of the table, see with an ajax call
          // location.reload()
        },
        error: function error() {
          alert("Update Failure");
          $("#closeEditorButton").click();
          $.internalIdSelection = undefined;
          $.selectedRow = undefined;
          $.selectedRowDom = undefined;
        }
      });
    });
    $("#dataDelete").submit(function (event) {
      event.preventDefault();
      var form = $(this);
      var url = form.attr("action");
      var test_data = form.find("#row").data("complete");
      var aicraft = form.find("#aircraft").text();
      var flight = form.find("#flight").text();
      var msn = form.find("#msn").text();
      $.ajax({
        url: url,
        method: "POST",
        data: test_data,
        success: function () {
          // Reload the entire page or juste delete the row ?
          table.api().row($.selectedRowDom).remove().draw();
          $("#closeDeletorButton").click();
          $.selectedRow = undefined;
          $.selectedRowDom = undefined;
          $.internalIdSelection = undefined;
        },
        error: function () {
          $("#closeDeletorButton").click();
          alert("Failure during row deletion");
          $.selectedRow = undefined;
          $.selectedRowDom = undefined;
          $.internalIdSelection = undefined;
        }
      })
    })

    //TRA comment update submition
    $("#update_tra_form").submit(function (event) {
      event.preventDefault();
      var form = $(this);
      var url = form.attr("action");
      let new_tra_comment = form.find("#TRA_content").val();
      let flight_data = document.getElementById("TRA_comment").selected_flight;

      let data = {
        tra_comment: new_tra_comment,
        flight_data: flight_data
      };

      $.ajax({
        url: url,
        method: "POST",
        data: data,
        success: function (res) {
          table.api().row($.selectedRowDom).data()["TRA_Comment"] = res;

          $("#close_TRA").click();
          // Reset global variables
          table.api().row($.selectedRowDom).invalidate();
          $.internalIdSelection = undefined;
          $.selectedRow = undefined;
          $.selectedRowDom = undefined;
          // Reload the page, TODO only redraw part of the table, see with an ajax call
          // location.reload()
        },
        error: function () {
          $("#close_TRA").click();
          alert("Failure during TRA comment update");
          $.selectedRow = undefined;
          $.selectedRowDom = undefined;
          $.internalIdSelection = undefined;
        }
      })
    })

    $("#GenerateButton").on("click", function () {
      var row = $("#available-data tr.selected");
      $.selectedRow = row.closest('tr').index();
      $.selectedRowDom = row;
      var row_data = table.api().row(row).data();

      let tmp_div = document.createElement("DIV");
      tmp_div.innerHTML = row_data["Results"];
      let table_rows = tmp_div.querySelector("tbody").rows;
      let headers = table_rows[0].querySelectorAll("th");
      let num_points = table_rows.length - 1;

      let full_table_content = {};
      full_table_content["results_data"] = [];

      for (let i = 1; i < table_rows.length; i++) {
        let key_count = 0;
        let row_results = {};
        for (let th of headers) {
          let value = parseFloat(table_rows[i].cells[key_count].textContent);
          row_results["key_" + key_count] = new Intl.NumberFormat('en-GB').format(value);
          key_count++;
        }
        full_table_content["results_data"].push(row_results);
      }

      let flight_data = {
        flight: row_data["Flight"],
        flight_date: row_data["Flight_Date"],
        fuel_characteristics: row_data["Fuel_Characteristics"].toLowerCase(),
        fuel_flowmeters: row_data["Fuel_Flowmeters"].toLowerCase(),
        num_points: num_points,
        weighing: row_data["Weighing"],
        data_id: row_data["id"],
        results_content: JSON.stringify(full_table_content)
      };

      var link = document.createElement('a');
      let href = "/account/file/generate_doc?flight=" + encodeURI(flight_data.flight) + "&flight_date=" + encodeURI(flight_data.flight_date) + "&fuel_characteristics=" + encodeURI(flight_data.fuel_characteristics) + "&fuel_flowmeters=" + encodeURI(flight_data.fuel_flowmeters) + "&num_points=" + encodeURI(flight_data.num_points) + "&weighing=" + encodeURI(flight_data.weighing) + "&data_id=" + encodeURI(flight_data.data_id) + "&results_content=" + encodeURI(flight_data.results_content);
      link.href = href;
      link.target = '_blank';
      $("#template_form").attr("action", href);
    })

    $("#template_form").submit(function (event) {
      $("#template_modal").modal("hide");
    })

    // JavaScript Source Data Drawing
    var results_status = headers.indexOf("Results_Status");
    var validated_status = headers.indexOf("Validated_Status");
    var ctr_status = headers.indexOf("CTR");
    var results = headers.indexOf("Results");
    var ffu = headers.indexOf("Fleet_Follow_Up");
    var ffu_id = headers.indexOf("Fleet_Follow_Up_id");
    var pv = headers.indexOf("Parameters_Validation");
    var pv_id = headers.indexOf("Parameters_Validation_id");
    var airline = headers.indexOf("Airline");
    var tra = headers.indexOf("TRA");
    var aircraft_ident = headers.indexOf("Aircraft_Identification")
    var aircraft_ident_id = headers.indexOf("Aircraft_Identification_id")
    var airline_id = headers.indexOf("Airline_id");
    var tr = headers.indexOf("Tabulated_Results");
    var tr_id = headers.indexOf("Tabulated_Results_id");
    var id_id = headers.indexOf("id");
    var aircraft_id = headers.indexOf("Aircraft");
    var msn_id = headers.indexOf("MSN");
    var flight_id = headers.indexOf("Flight");
    var comment_id = headers.indexOf("Commentary");
    var dd_id = headers.indexOf("Delivery Date");
    var tra_comment = headers.indexOf("TRA_Comment");
    var flhv_val = headers.indexOf("FLHV");

    var table = $('#available-data').dataTable({
      // ServerSide done in another branch of the repo
      serverSide: false,
      order: [
        [headers.indexOf("Aircraft"), "asc"]
      ],
      columnDefs: [{
        "className": "dt-center",
        "targets": "_all"
      }, {
        "targets": headers.indexOf("createdAt"),
        "data": "createdAt",
        "visible": false,
        "name": "createdAt",
        "orderable": false,
        "searchable": false
      }, {
        "targets": headers.indexOf("updatedAt"),
        "visible": false,
        "name": "updatedAt",
        "orderable": false,
        "searchable": false,
        "data": "updatedAt"
      }, {
        "targets": id_id,
        "visible": false,
        "name": "id",
        "orderable": false,
        "searchable": false,
        "data": "id"
      }, {
        "targets": pv_id,
        "visible": false,
        "orderable": false,
        "searchable": false,
        "data": "Parameters_Validation_id"
      }, {
        "targets": tr_id,
        "visible": false,
        "orderable": false,
        "searchable": false,
        "data": "Tabulated_Results_id"
      }, {
        "targets": airline_id,
        "visible": false,
        "orderable": false,
        "searchable": false,
        "data": "Airline_id"
      }, {
        "targets": ffu_id,
        "visible": false,
        "orderable": false,
        "searchable": false,
        "data": "Fleet_Follow_Up_id"
      }, {
        "targets": aircraft_ident_id,
        "visible": false,
        "orderable": false,
        "searchable": false,
        "data": "Aircraft_Identification_id"
      }, {
        "targets": "Delivery_Date",
        "name": "Delivery Date",
        "width": "5%",
        "data": "Delivery_Date"
      }, {
        "targets": "Commentary",
        "name": "Commentary",
        "width": "5%",
        "data": "Commentary"
      }, {
        "targets": "TRA_Comment",
        "name": "TRA Comment",
        "data": "TRA_Comment",
        "orderable": false,
        "searchable": false,
        "render": function render(data, type, row, meta) {
          if (!data) return "";
          let btn = document.createElement("i");
          btn.id = "TRA_" + row["id"];
          btn.classList.add("fa", "fa-comment", "tra-button");
          //btn.textContent = "View Comment";
          return btn.outerHTML;
        }
      }, {
        "targets": "FLHV",
        "name": "FLHV Value",
        "data": "FLHV",
        "orderable": true,
        "searchable": false,
        "render": function render(data, type, row, meta) {
          if (!data) return "";
          return data;
        }
      }, {
        "targets": "MSN",
        "name": "MSN",
        "data": "MSN",
        "width": "5%"
      }, {
        "targets": "Aircraft",
        "name": "Aircraft",
        "data": "Aircraft",
        "width": "5%"
      }, {
        "targets": "Flight",
        "name": "Flight",
        "data": "Flight",
        "width": "5%"
      }, {
        "targets": "Flight_Owner",
        "name": "Flight Owner",
        "data": "Flight_Owner",
        "title": "Airline",
        "width": "5%"
      }, {
        "targets": "Fuel_Flowmeters",
        "name": "Fuel Flowmeters",
        "data": "Fuel_Flowmeters",
        "width": "5%"
      }, {
        "targets": "Flight_Date",
        "name": "Flight Date",
        "data": "Flight_Date",
        "width": "5%"
      }, {
        "targets": "Fuel_Characteristics",
        "name": "Fuel Characteristics",
        "data": "Fuel_Characteristics",
        "width": "5%"
      }, {
        "targets": "Weighing",
        "name": "Weighing",
        "data": "Weighing",
        "width": "5%"
      }, {
        // Special Formatting for Validated Status
        "targets": "Results_Status",
        "name": "Results Status",
        "data": "Results_Status",
        "width": "5%",
        "render": function render(data, type, row, meta) {
          switch (data) {
            case "Preliminary":
              return '<font color="blue">Preliminary</font>';
            case "Investigation":
              return '<font color="orange">Investigation</font>';
            case "Definitive":
              return '<font color="green">Definitive</font>';
            default:
              return '';
          }
        }
      }, {
        "targets": "Validated_Status",
        "name": "Validated Status",
        "data": "Validated_Status",
        "title": "Data Validated Status",
        "width": "5%",
        "sType": "cbool", // Special type to support custom sorting
        "render": function render(data, type, row, meta) {
          if (data !== "" && data !== undefined) {
            return '<i class="fa fa-check fa-lg" style="color:green"></i>';
          } else {
            return '';
          }
        }
      }, {
        "targets": "CTR",
        "name": "CTR",
        "data": "CTR",
        "width": "5%",
        "type": "cbool", // Special type to support custom sorting
        "render": function render(data, type, row, meta) {
          if (data !== "" && data !== undefined) {
            return '<i class="fa fa-check fa-lg" style="color:green"></i>';
          } else {
            return '';
          }
        }
      }, {
        "targets": "Fleet_Follow_Up",
        "name": "Fleet Follow Up",
        "data": "Fleet_Follow_Up",
        "orderable": false,
        "searchable": false,
        "width": "5%",
        "render": function render(data, type, row, meta) {
          return '<a href="/account/file/download/' + row["Fleet_Follow_Up_id"] + '"' + ' target="_blank"><i class="fa fa-file fa-lg" style="color:rgb(98, 166, 255)"></i></a>';
        }
      }, {
        "targets": "Aircraft_Identification",
        "name": "Aircraft Identification",
        "data": "Aircraft_Identification",
        "orderable": false,
        "searchable": false,
        "width": "5%",
        "render": function render(data, type, row, meta) {
          return '<a href="/account/file/download/' + row["Aircraft_Identification_id"] + '"' + ' target="_blank"><i class="fa fa-file fa-lg" style="color:rgb(98, 166, 255)"></i></a>';
        }
      }, {
        "targets": "Parameters_Validation",
        "data": "Parameters_Validation",
        "name": "Parameters Validation",
        "orderable": false,
        "searchable": false,
        "width": "5%",
        "render": function render(data, type, row, meta) {
          return '<a href="/account/file/download/' + row["Parameters_Validation_id"] + '"' + ' target="_blank"><i class="fa fa-file fa-lg" style="color:rgb(98, 166, 255)"></i></a>';
        }
      }, {
        "targets": "Tabulated_Results",
        "data": "Tabulated_Results",
        "name": "Tabulated Results",
        "orderable": false,
        "searchable": false,
        "width": "5%",
        "render": function render(data, type, row, meta) {
          return '<a href="/account/file/download/' + row["Tabulated_Results_id"] + '"' + ' target="_blank"><i class="fa fa-file fa-lg" style="color:rgb(98, 166, 255)"></i></a>';
        }
      }, {
        "targets": "Airline",
        "data": "Airline",
        "name": "Airline",
        "title": "Airline Tables",
        "orderable": false,
        "searchable": false,
        "width": "5%",
        "render": function render(data, type, row, meta) {
          return '<a href="/account/file/download/' + row["Airline_id"] + '"' + ' target="_blank"><i class="fa fa-file fa-lg" style="color:rgb(98, 166, 255)"></i></a>';
        }
      }, {
        "targets": "Results",
        "data": "Results",
        "name": "Results",
        "orderable": false,
        "searchable": false,
        "width": "5%",
        "render": function render(data, type, row, meta) {
          return '<button type="button" id="ResultsButton_' + row["id"] + '"' + 'class="results-button" data-toggle="modal" data-target="#Results"> <i class="fa fa-table fa-lg" data-toggle="modal" data-target="#Results"></i> </button>';
        }
      }, {
        "targets": "TRA",
        "name": "TRA",
        "data": "TRA",
        "width": "5%",
        "render": function render(data, type, row, meta) {
          if (data === undefined || data === "") {
            return '';
          } else {
            var linkName = "CRUISE PERFORMANCE " + row["Aircraft"] + " MSN " + row["MSN"] + " FLIGHT " + row["Flight"];
            return '<a href=' + data + ' target="_blank">' + linkName + "</a>";
          }
        }
      }, {
        "targets": "Trailing_Cone",
        "name": "Trailing Cone",
        "data": "Trailing_Cone",
        "width": "5%",
        "render": function render(data, type, row, meta) {
          if (!data) return "";
          return data;
        }
      }],
      bDeferRender: true,
      iDisplayLength: 10,
      bProcessing: true,
      colReorder: true,
      responsive: true,
      bStateSave: true,
      paging: true,
      dom: 'Bfrtip',
      //dom: 'lBfrtip',
      fnStateSave: function fnStateSave(settings, data) {
        localStorage.setItem("DataTables_" + window.location.pathname, JSON.stringify(data));
      },
      fnStateLoad: function fnStateLoad(settings) {
        var data = localStorage.getItem("DataTables_" + window.location.pathname);
        return JSON.parse(data);
      },
      buttons: [{
        extend: 'excelHtml5',
        text: "Year Review   ",
        attr: {
          id: 'export_excel'
        },
        customize: function (xlsx) {
          var sheet = xlsx.xl.worksheets['sheet1.xml'];
          console.log("excels ", sheet)
          // Loop over all cells in sheet
          $('row c', sheet).each(function (index, element) {
            if (index !== 0 && $('is t', this).text().indexOf("http") === 0) {
              console.log("!!! ", element)
              //change the type to `str` which is a formula
              $(this).attr('t', 'str');
              //append the concat formula
              $(this).append(('<f>' + 'HYPERLINK("' + $('is t', this).text() + '","' + $('is t', this).text() + '")' + '</f>').replace(/&(?!amp)/gm, '&amp;'));
              //remove the inlineStr
              $('is', this).remove();
              console.log($(this));
              $(this).attr('s', '4');
              console.log($(this));
            }
          });

        },
        exportOptions: {
          format: {
            body: function (data, row, column, node) {
              // If the entry has been already show, then a node is defined otherwise, node is undefined but data is not.
              // Hence we will handle the data, which will always exits
              var jqnode = $(`<div>${data}</div>`);
              var link = jqnode.find("a");
              var status = jqnode.find("i.fa-check");
              if (link.length) {
                var link_ref = link.attr("href");
                return link_ref;
                }
              else if (status.length) return true;
              else {
                return jqnode.text()
              };
            }
          },
          columns: function (idx, data, node) {
            if (node.innerText === "Aircraft" || node.innerText === "MSN" || node.innerText === "Flight" || node.innerText === "Flight Date" || node.innerText === "TRA" || node.innerText === "Data Validated Status" || node.innerText === "Fuel Flowmeters" || node.innerText === "Airline" || node.innerText === "Trailing Cone") return true;
            else return false;
          },
          rows: function (idx, data, node) {
            let flight_date = parseInt(data.Flight_Date.split("/")[2]);
            let selected_date = document.getElementById("year_export_select").value ? parseInt(document.getElementById("year_export_select").value) : moment().year();

            if (flight_date === selected_date) return true;
            else return false;
          }
        },
      }]
    });
    // Get the data
    var liste = window.SAILS_LOCALS["data"];
    // Liste could be undefined after a search for instance
    if (liste !== undefined) {
      var hidden_indexes = [];
      table.fnAddData(liste, false);
      var _arr = ["id", "Airline_id", "Tabulated_Results_id", "Parameters_Validation_id", "Fleet_Follow_Up_id"];
      for (var _i = 0; _i < _arr.length; _i++) {
        var name = _arr[_i];
        hidden_indexes.push(headers.indexOf(name));
        table.fnSetColumnVis(headers.indexOf(name), false);
      }
      // Draw the table
      table.fnDraw();
    }

    let table_wrap = document.createElement("DIV");
    table_wrap.classList.add("table-wrapper");
    let av_table = document.getElementById("available-data");
    table_wrap.appendChild(av_table);

    let datatable_wrap = document.getElementById("available-data_wrapper");
    datatable_wrap.insertBefore(table_wrap, document.getElementById("available-data_info"));

    let select_export = document.getElementById("year_export_select");
    let current_year = moment();
    for (let i = 0; i < 20; i++) {
      let option = document.createElement("OPTION");
      option.value = current_year.year();
      option.textContent = current_year.year();
      select_export.appendChild(option);

      current_year.add(-1, "years");
    }

    let export_button = document.getElementById("export_excel");
    let icon = document.createElement("i");
    icon.classList.add("fa", "fa-download", "fa-lg");
    export_button.appendChild(icon);

    let export_container = export_button.parentElement;
    let new_container = document.getElementById("export_container");
    new_container.appendChild(export_button);
    export_container.remove();

    //TRA comment modal
    $("#TRA_comment").on("show.bs.modal", function (e) {
      var row = $.selectedRowDom;
      if (row.length === 0) {
        alert("Did you click somewhere ?");
      }
      e.stopPropagation();
      $.selectedRow = row.closest('tr').index();
      var full_table_data = table.api().row(row).data();
      var tra_comment_content = full_table_data["TRA_Comment"];

      let row_info = {
        aircraft: full_table_data["Aircraft"],
        msn: full_table_data["MSN"],
        flight: full_table_data["Flight"]
      };

      document.getElementById("TRA_comment").selected_flight = row_info;
      $("#TRA_content").empty();
      $("#TRA_content").val(tra_comment_content);
    });

    $("#TRA_comment").on("hide.bs.modal", function () {
      // Empty the modal on hide
      $("#TRA_content").empty();
      document.getElementById("TRA_comment").selected_flight = null;
    });

    $(".fa-table").on("click", function () {
      console.log("cllic");
      $(this).closest("tr").addClass('selected');
      let row = $(this).closest("tr");
      $.selectedRowDom = row;
      $("#Results").modal("show");
    })

    // Results Modal
    $("#Results").on("show.bs.modal", function () {
      var row = $.selectedRowDom;
      if (row.length === 0) {
        alert("Did you click somewhere ?");
      }

      $.selectedRow = row.closest('tr').index();
      var complete_data_table = table.api().row(row).data();
      console.log(complete_data_table);
      var results_table = complete_data_table["Results"];
      console.log(results_table);
      // insertAfter is not the one to use, maybe append
      $("#TableContainer").append(results_table);
    });
    $("#Results").on("hide.bs.modal", function () {
      // Empty the modal on hide
      $("#TableContainer").empty();
    });
  }
  if ($("#upload-results").length) {
    var headers = window.SAILS_LOCALS["headers"];
    var results_status = headers.indexOf("Results_Status");
    var validated_status = headers.indexOf("Validated_Status");
    var ctr_status = headers.indexOf("CTR");
    var results = headers.indexOf("Results");
    var ffu = headers.indexOf("Fleet_Follow_Up");
    var ffu_id = headers.indexOf("Fleet_Follow_Up_id");
    var pv = headers.indexOf("Parameters_Validation");
    var pv_id = headers.indexOf("Parameters_Validation_id");
    var airline = headers.indexOf("Airline");
    var tra = headers.indexOf("TRA");
    var aircraft_ident = headers.indexOf("Aircraft_Identification")
    var aircraft_ident_id = headers.indexOf("Aircraft_Identification_id")
    var airline_id = headers.indexOf("Airline_id");
    var tr = headers.indexOf("Tabulated_Results");
    var tr_id = headers.indexOf("Tabulated_Results_id");
    var id_id = headers.indexOf("id");
    var aircraft_id = headers.indexOf("Aircraft");
    var msn_id = headers.indexOf("MSN");
    var flight_id = headers.indexOf("Flight");
    var comment_id = headers.indexOf("Commentary");
    var dd_id = headers.indexOf("Delivery Date");

    $("#upload-results").DataTable({
      ordering: false,
      dom: "Bfrtip",
      buttons: [{
        extend: 'excel',
        text: "Year Review",
        attr: {
          id: 'export_excel',
          style: "display:none;"
        }
      }],
      paging: false,
      searching: false,
      columnDefs: [{
        "className": "dt-center",
        "targets": "_all"
      }, {
        "targets": headers.indexOf("createdAt"),
        "data": "createdAt",
        "visible": false,
        "name": "createdAt",
        "orderable": false,
        "searchable": false
      }, {
        "targets": headers.indexOf("updatedAt"),
        "visible": false,
        "name": "updatedAt",
        "orderable": false,
        "searchable": false,
        "data": "updatedAt"
      }, {
        "targets": id_id,
        "visible": false,
        "name": "id",
        "orderable": false,
        "searchable": false,
        "data": "id"
      }, {
        "targets": pv_id,
        "visible": false,
        "orderable": false,
        "searchable": false,
        "data": "Parameters_Validation_id"
      }, {
        "targets": tr_id,
        "visible": false,
        "orderable": false,
        "searchable": false,
        "data": "Tabulated_Results_id"
      }, {
        "targets": airline_id,
        "visible": false,
        "orderable": false,
        "searchable": false,
        "data": "Airline_id"
      }, {
        "targets": ffu_id,
        "visible": false,
        "orderable": false,
        "searchable": false,
        "data": "Fleet_Follow_Up_id"
      }, {
        "targets": aircraft_ident_id,
        "visible": false,
        "orderable": false,
        "searchable": false,
        "data": "Aircraft_Identification_id"
      }, {
        "targets": dd_id,
        "name": "Delivery Date",
        "data": "Delivery_Date"
      }, {
        "targets": comment_id,
        "name": "Commentary",
        "data": "Commentary"
      }, {
        "targets": tra_comment,
        "name": "TRA Comment",
        "data": "TRA_Comment",
        "orderable": false,
        "searchable": false,
        "render": function render(data, type, row, meta) {
          if (!data) return "";
          let btn = document.createElement("i");
          btn.id = "TRA_" + row["id"];
          btn.classList.add("fa", "fa-comment", "tra-button");
          //btn.textContent = "View Comment";
          return btn.outerHTML;
        }
      }, {
        "targets": headers.indexOf("MSN"),
        "name": "MSN",
        "data": "MSN"
      }, {
        "targets": headers.indexOf("Aircraft"),
        "name": "Aircraft",
        "data": "Aircraft"
      }, {
        "targets": headers.indexOf("Flight"),
        "name": "Flight",
        "data": "Flight"
      }, {
        "targets": headers.indexOf("Flight_Owner"),
        "name": "Flight Owner",
        "data": "Flight_Owner"
      }, {
        "targets": headers.indexOf("Fuel_Flowmeters"),
        "name": "Fuel Flowmeters",
        "data": "Fuel_Flowmeters"
      }, {
        "targets": headers.indexOf('Flight_Date'),
        "name": "Flight Date",
        "data": "Flight_Date"
      }, {
        "targets": headers.indexOf("Fuel_Characteristics"),
        "name": "Fuel Characteristics",
        "data": "Fuel_Characteristics"
      }, {
        "targets": headers.indexOf("Weighing"),
        "name": "Weighing",
        "data": "Weighing"
      }, {
        // Special Formatting for Validated Status
        "targets": results_status,
        "name": "Results Status",
        "data": "Results_Status",
        "render": function render(data, type, row, meta) {
          switch (data) {
            case "Preliminary":
              return '<font color="blue">Preliminary</font>';
            case "Investigation":
              return '<font color="orange">Investigation</font>';
            case "Definitive":
              return '<font color="green">Definitive</font>';
            default:
              return '';
          }
        }
      }, {
        "targets": validated_status,
        "name": "Validated Status",
        "data": "Validated_Status",
        "render": function render(data, type, row, meta) {
          if (data !== "" && data !== undefined) {
            return '<i class="fa fa-check fa-lg" style="color:green"></i>';
          } else {
            return '';
          }
        }
      }, {
        "targets": ctr_status,
        "name": "CTR",
        "data": "CTR"
      }, {
        "targets": ffu,
        "name": "Fleet Follow Up",
        "data": "Fleet_Follow_Up"
      }, {
        "targets": pv,
        "data": "Parameters_Validation",
        "name": "Parameters Validation",
        "orderable": false,
        "searchable": false
      }, {
        "targets": tr,
        "data": "Tabulated_Results",
        "name": "Tabulated Results",
        "orderable": false,
        "searchable": false
      }, {
        "targets": airline,
        "data": "Airline",
        "name": "Airline",
        "orderable": false,
        "searchable": false
      }, {
        "targets": aircraft_ident,
        "data": "Aircraft_Identification",
        "name": "Aircraft_identification",
        "orderable": false,
        "searchable": false
      }, {
        "targets": results,
        "data": "Results",
        "name": "Results",
        "orderable": false,
        "searchable": false
      }, {
        "targets": tra,
        "name": "TRA",
        "data": "TRA"
      }, {
        "targets": "Trailing_Cone",
        "name": "Trailing Cone",
        "data": "Trailing_Cone",
        "width": "5%",
        "render": function render(data, type, row, meta) {
          if (!data) return "";
          return data;
        }
      }]
    });
  }
});

// Adding Extension to handle sorting ticks

jQuery.extend(jQuery.fn.dataTableExt.oSort, {
  "cbool-asc": function (x, y) {
    var a = x.length ? x.length : 0
    var b = y.length ? y.length : 0
    return a < b ? -1 : a > b ? 1 : 0;
  },
  "cbool-desc": function (x, y) {
    var a = x.length ? x.length : 0
    var b = y.length ? y.length : 0
    return a < b ? 1 : a > b ? -1 : 0;
  }
})
