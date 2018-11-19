$(document).ready(function () {
  $('#editModal').on('show.bs.modal', function (e) {
    var bookId = $(e.relatedTarget).data('book-id');
    $(e.currentTarget).find('input[name="bookId"]').val(bookId);
    //Set the action of the form with ID passed on to the Modal
    var act = "/account/file/update/" + bookId;
    document.edit.action = act;
  });

  $('#comment').on('click', function (e) {
    var comment = $.trim($("#userComment").val());
    $("#commentaryText").append(comment)
    var newComment = $.trim($("#commentaryText").val());
    $("#userComment").val(newComment)
    $("#commentaryModal").modal('hide');
  });

  $('#confirm').on('click', function (e) {
    var url = '/account/file/validate'
    var delivery = $.trim($("#deliveryDate").val());
    var comment = $.trim($("#userComment").val());
    var data = {
      deliveryDate: delivery,
      userCommentary: comment
    }
    $.ajax({
      url: url,
      data: data,
      type: 'POST',
      success: function () {
        window.location.href = "/table";
      }
    })
  });
});
