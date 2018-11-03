

$('#exampleModalCenter').on('show.bs.modal', function (e) {
    var bookId = $(e.relatedTarget).data('book-id');
    $(e.currentTarget).find('input[name="bookId"]').val(bookId);
    //Set the action of the form with ID passed on to the Modal
    var act = "/account/file/update/" + bookId;
    document.files.action = act;
}); 
