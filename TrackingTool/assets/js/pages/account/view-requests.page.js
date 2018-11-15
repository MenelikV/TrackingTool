$(document).ready(function() {

    var table = $('#example').DataTable();

    $('tbody').on('click', '#accept', function (){
      
      $(this).closest("tr").addClass('selected');

      var row = $("#example tr.selected")
       
      $.selectedRow = row.closest('tr').index()      
      var id = row.find("td").eq(0).text();

      var url = '/account/admin/approve/'+id;
      url = url.replace(/\s/g,'')

      console.log(url)

      $.ajax({
        url: url,
        type: 'POST',
        success: function() {

          row.remove();
          id = undefined;
          console.log('OK')

        }

      })

    }); 

    $('tbody').on('click', '#reject', function (){
      
      $(this).closest("tr").addClass('selected');

      var row = $("#example tr.selected")
       
      $.selectedRow = row.closest('tr').index()      
      var id = row.find("td").eq(0).text();

      var url = '/account/admin/reject/'+id;
      url = url.replace(/\s/g,'')

      console.log(url)

      $.ajax({
        url: url,
        type: 'POST',
        success: function() {

          row.remove();
          id = undefined;
          console.log('OK')

        }

      })

    });


} );
 

 