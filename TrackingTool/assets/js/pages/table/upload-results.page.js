$(document).ready(function(){

$('#editModal').on('show.bs.modal', function (e) {
    var bookId = $(e.relatedTarget).data('book-id');

  
    $(e.currentTarget).find('input[name="bookId"]').val(bookId);
    //Set the action of the form with ID passed on to the Modal
    var act = "/account/file/update/" + bookId;
    document.edit.action = act;


});

$('tbody').on('click', '#comments', function (){
      

   // var info = document.getElementById('upload-results').rows[1].cells[18].innerHTML;
   // console.log(info)
     
         
   // var id = row.find("td").eq(0).text();


    });


}); 
