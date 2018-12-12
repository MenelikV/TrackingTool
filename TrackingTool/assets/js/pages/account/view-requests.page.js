$(document).ready(function () {
  var table = $('#example').DataTable();

  $('tbody').on('click', '#accept', function () {

    $(this).closest("tr").addClass('selected');
    var row = $("#example tr.selected")
    $.selectedRow = row.closest('tr').index()
    var email = row.find("td").eq(1).text();
    email = email.replace(/\s/g, '')
    var url = '/account/admin/approve';
    var info = { 
      emailAddress: email
    }
    $.ajax({
      url: url,
      data: info,
      type: 'POST',
      success: function () {
        row.remove();
        id = undefined;
        console.log('OK')
      }
    })
  });

  $('tbody').on('click', '#reject', function () {

    $(this).closest("tr").addClass('selected');
    var row = $("#example tr.selected")
    $.selectedRow = row.closest('tr').index()
    var email = row.find("td").eq(1).text();
    email = email.replace(/\s/g, '')
    var url = '/account/admin/reject';
    var info = {
      emailAddress: email
    }

    $.ajax({
      url: url,
      data: info,
      type: 'POST',
      success: function () {
        row.remove();
        id = undefined;
        console.log('OK')
      }
    })
  });


  $('#example').on('click', 'tbody tr td:nth-child(3)', function (e) {

    $(this).closest("tr").addClass('selected');
    var row = $("#example tr.selected")
    row.not(this).removeClass('selected')
    var email = row.find("td").eq(1).text();
    email = email.replace(/\s/g, '')
    var url = '/account/admin/changeRights';
    var isSuperAdmin = "true";
    var isBasicUser = "";

    row.find("td").eq(3).empty();
    row.find("td").eq(4).empty();
    row.find("td").eq(2).empty();
    row.find("td").eq(2).append('<span class="dot"></span>');

    var rights = {
      isSuperAdmin,
      isBasicUser,
      emailAddress: email
    };

    $.ajax({
      url: url,
      data: rights,
      type: 'POST',
      success: function () {
        console.log('changed rights')
      }
    })
  });

  $('#example').on('click', 'tbody tr td:nth-child(4)', function (e) {

    $(this).closest("tr").addClass('selected');
    var row = $("#example tr.selected")
    row.not(this).removeClass('selected')
    var email = row.find("td").eq(1).text();
    email = email.replace(/\s/g, '')
    var url = '/account/admin/changeRights';
    var isBasicUser = "true";
    var isSuperAdmin = "";

    row.find("td").eq(2).empty();
    row.find("td").eq(3).empty();
    row.find("td").eq(4).empty();
    row.find("td").eq(3).append('<span class="dot"></span>');

    var rights = {  
      isBasicUser,
      isSuperAdmin,
      emailAddress: email
    };

    $.ajax({
      url: url,
      data: rights,
      type: 'POST',
      success: function () {
        console.log('changed rights')
      }
    })

  });


  $('#example').on('click', 'tbody tr td:nth-child(5)', function (e) {

    $(this).closest("tr").addClass('selected');
    var row = $("#example tr.selected")
    row.not(this).removeClass('selected')
    var email = row.find("td").eq(1).text();
    email = email.replace(/\s/g, '')
    var url = '/account/admin/changeRights';
    var isBasicUser = "";
    var isSuperAdmin = "";

    row.find("td").eq(2).empty();
    row.find("td").eq(3).empty();
    row.find("td").eq(4).empty();
    row.find("td").eq(4).append('<span class="dot"></span>');

    var rights = {   
      isBasicUser,
      isSuperAdmin,
      emailAddress: email
    };

    $.ajax({
      url: url, 
      data: rights,
      type: 'POST',
      success: function () {
        console.log('changed rights')
      }
    })

  });


});
