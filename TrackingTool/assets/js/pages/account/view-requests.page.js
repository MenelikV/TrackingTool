$(document).ready(function () {
  var table = $('#example').DataTable();

  $('tbody').on('click', '#accept', function () {

    $(this).closest("tr").addClass('selected');
    var row = $("#example tr.selected")
    $.selectedRow = row.closest('tr').index()
    var id = row.find("td").eq(0).text();

    var url = '/account/admin/approve/' + id;
    url = url.replace(/\s/g, '')

    $.ajax({
      url: url,
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
    var id = row.find("td").eq(0).text();

    var url = '/account/admin/reject/' + id;
    url = url.replace(/\s/g, '')

    $.ajax({
      url: url,
      type: 'POST',
      success: function () {
        row.remove();
        id = undefined;
        console.log('OK')
      }
    })
  });

  $('#example').on('click', 'tbody tr td:nth-child(4)', function (e) {

    $(this).closest("tr").addClass('selected');
    var row = $("#example tr.selected")
    row.not(this).removeClass('selected')
    var id = row.find("td").eq(0).text();
    var url = '/account/admin/changeRights/' + id;
    url = url.replace(/\s/g, '')

    row.find("td").eq(4).empty();
    row.find("td").eq(3).empty();
    row.find("td").eq(3).append('<span class="dot"></span>');

    var rights = {
      isSuperAdmin: true
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
    var id = row.find("td").eq(0).text();
    var url = '/account/admin/changeRights/' + id;
    url = url.replace(/\s/g, '')

    row.find("td").eq(3).empty();
    row.find("td").eq(4).empty();
    row.find("td").eq(4).append('<span class="dot"></span>');

    var rights = {  
      isBasicUser: true
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
