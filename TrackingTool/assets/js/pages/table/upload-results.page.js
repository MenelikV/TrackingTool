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
    // TODO Add Minimal Set To Determine Which Aircraft is being modified
    var delivery = $.trim($("#deliveryDate").val());
    var comment = $.trim($("#userComment").val());
    var flight = $.trim($('[data-header="Flight"]').text())
    var msn = $.trim($('[data-header="MSN"]').text())
    var flightDate = $.trim($('[data-header="Flight_Date"]').text())
    var Aircraft = $.trim($('[data-header="Aircraft"]').text())
    var data = {
      deliveryDate: delivery,
      userCommentary: comment,
      aircraft:{
        Aircraft: Aircraft,
        Flight_Date: flightDate,
        MSN: msn,
        Flight: flight
      }
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
