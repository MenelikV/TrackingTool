$(document).ready(function () {

  $('#editModal').on('show.bs.modal', function (e) {
    var bookId = $(e.relatedTarget).data('book-id');
    $(e.currentTarget).find('input[name="bookId"]').val(bookId);
    //Set the action of the form with ID passed on to the Modal
    var act = "/account/file/update/" + bookId;
    document.edit.action = act;
  });

  $('#comment').on('click', function (e) {

    var url = '/account/file/comment'
    var comment = $.trim($("#commentaryText").val());

    var data = {
      Commentary: comment
    }

    $.ajax({
      url: url,
      data: data,
      type: 'POST',
      success: function () {
        $("#closeComment").click();
        $("#userComment").append(comment);
      }
    })
  });
});
