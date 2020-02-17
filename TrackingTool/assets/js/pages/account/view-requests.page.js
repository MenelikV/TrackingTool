'use strict';

$(document).ready(function () {
  var table = $('#example').DataTable();

  $("#rss_tabs label").on("click", function () {
    $("#rss_tabs .active").removeClass("active");
    $(".sub-data-container.active").removeClass("active");

    $(this).addClass("active");
    let container_id = $(this).data("container");
    $("#" + container_id).addClass("active");
  })

  $("#add_user_submit").on("click", function (event) {
    var url = "/account/admin/add";

    let fullName = $("#add_fullname").val();
    let email = $("#add_email").val();
    let password = $("#add_password").val();

    let isAdmin = false;
    let isBasic = false;

    let privilege = $("#add_privilege input:checked").val();
    if (privilege === "isAdmin") isAdmin = true;
    else if (privilege === "isBasic") isBasic = true;

    $("#loader_cont").addClass("active");
    $('#loader').show();

    let data = {
      fullName: fullName,
      emailAddress: email,
      password: password,
      emailStatus: 'confirmed',
      isSuperAdmin: isAdmin,
      isBasicUser: isBasic,
      isApproved: true,
    }

    $.ajax({
      url: url,
      method: "POST",
      data: data,
      success: function () {
        location.reload();
      },
      error: function () {}
    })
  })

  $('tbody').on('click', '#accept', function () {
    $(this).closest("tr").addClass('selected');
    var row = $("#example tr.selected");
    $.selectedRow = row.closest('tr').index();
    var email = row.find("td").eq(1).text();
    email = email.replace(/\s/g, '');
    var url = '/account/admin/approve';
    var info = {
      emailAddress: email
    };
    $.ajax({
      url: url,
      data: info,
      type: 'POST',
      success: function success() {
        row.remove();
        id = undefined;
        console.log('OK');
      }
    });
  });

  $('#example').on('click', 'tbody tr button', function () {
    $(this).closest("tr").addClass('selected');
  })

  $("#reject_user_modal").on('hide.bs.modal', function () {
    var row = $("#example tr.selected");
    row.removeClass("selected");
  })

  $("#reject_user_submit").on('click', function () {
    var row = $("#example tr.selected");
    $.selectedRow = row.closest('tr').index();
    var email = row.find("td").eq(1).text();
    email = email.replace(/\s/g, '');
    let id = row.closest('tr').attr('id');
    var url = '/account/admin/reject';
    var info = {
      emailAddress: email,
      id: id
    };

    $.ajax({
      url: url,
      data: info,
      type: 'POST',
      success: function success() {
        row.remove();
        row.removeClass("selected");
        $("#close_rejection").click();
        $.internalIdSelection = undefined;
        $.selectedRow = undefined;
        $.selectedRowDom = undefined;
      }
    });
  });

  $('#example').on('click', 'tbody tr td:nth-child(3)', function (e) {

    $(this).closest("tr").addClass('selected');
    var row = $("#example tr.selected");
    row.not(this).removeClass('selected');
    var email = row.find("td").eq(1).text();
    email = email.replace(/\s/g, '');
    var url = '/account/admin/changeRights';
    var isSuperAdmin = "true";
    var isBasicUser = "";

    row.find("td").eq(3).empty();
    row.find("td").eq(4).empty();
    row.find("td").eq(2).empty();

    var rights = {
      isSuperAdmin: isSuperAdmin,
      isBasicUser: isBasicUser,
      emailAddress: email
    };

    $.ajax({
      url: url,
      data: rights,
      type: 'POST',
      success: function success() {
        let check = document.createElement("i");
        check.classList.add("fa", "fa-check", "fa-lg", "green");
        row.find("td").eq(2).append(check);
        console.log('changed rights');
      }
    });
  });

  $('#example').on('click', 'tbody tr td:nth-child(4)', function (e) {

    $(this).closest("tr").addClass('selected');
    var row = $("#example tr.selected");
    row.not(this).removeClass('selected');
    var email = row.find("td").eq(1).text();
    email = email.replace(/\s/g, '');
    var url = '/account/admin/changeRights';
    var isBasicUser = "true";
    var isSuperAdmin = "";

    row.find("td").eq(2).empty();
    row.find("td").eq(3).empty();
    row.find("td").eq(4).empty();

    var rights = {
      isBasicUser: isBasicUser,
      isSuperAdmin: isSuperAdmin,
      emailAddress: email
    };

    $.ajax({
      url: url,
      data: rights,
      type: 'POST',
      success: function success() {
        let check = document.createElement("i");
        check.classList.add("fa", "fa-check", "fa-lg", "green");
        row.find("td").eq(3).append(check);
        console.log('changed rights');
      }
    });
  });

  $('#example').on('click', 'tbody tr td:nth-child(5)', function (e) {

    $(this).closest("tr").addClass('selected');
    var row = $("#example tr.selected");
    row.not(this).removeClass('selected');
    var email = row.find("td").eq(1).text();
    email = email.replace(/\s/g, '');
    var url = '/account/admin/changeRights';
    var isBasicUser = "";
    var isSuperAdmin = "";

    row.find("td").eq(2).empty();
    row.find("td").eq(3).empty();
    row.find("td").eq(4).empty();

    var rights = {
      isBasicUser: isBasicUser,
      isSuperAdmin: isSuperAdmin,
      emailAddress: email
    };

    $.ajax({
      url: url,
      data: rights,
      type: 'POST',
      success: function success() {
        let check = document.createElement("i");
        check.classList.add("fa", "fa-check", "fa-lg", "green");
        row.find("td").eq(4).append(check);
        console.log('changed rights');
      }
    });
  });
});
