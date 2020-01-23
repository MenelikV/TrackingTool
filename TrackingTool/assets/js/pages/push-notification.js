$(document).ready(function () {
  // Avoid self notification (werid publish should take that into account)
  $.edition = false
  $.toast_id = 0;
  $.times = {};
  $.colVisCreated = false
  // Subsribe to the Socket Model
  io.socket.get("/data");
  // On change display a message on the console
  $("a[id^='toast_'").click(function () {
    var raw = $(this).data("id")
    console.log(raw);
  })

  // Timer to refresh the times on toast
  setInterval(function () {
    for (let id of Object.keys($.times)) {
      var res = Math.round((new Date - $.times[id]) / (60 * 1000)) // Minutes from toast
      $(`#subtitle_${id}`).text(`${res} min ago`)
    }
  }, 60000)
  io.socket.on('data', function (msg) {
    let me = window.SAILS_LOCALS["me"]; 
    let current_user_name = me.fullName;

    //Prevent toast from appearing if not logged in or for user originating it
    if(!me || msg.author === current_user_name) return;

    if ($.edition) {
      $.edition = false
      return
    }
    // If there is a verb attribute, display a toast to inform user
    if (msg.verb !== "") {
      $.toast_id += 1
      $.times[$.toast_id] = new Date;
      // Toast Template
      // data-autohide="false" to disable autohide
      var test = `<div class="toast" role="alert" data-autohide="true" aria-live="assertive" aria-atomic="true" data-delay="180000">
        <div class="toast-header">
          <strong class="mr-auto">New ${msg.verb}</strong>
          <small class="text-muted" id="subtitle_${$.toast_id}">just now</small>
          <button type="button" id="close_toast_${$.toast_id}" class="ml-2 mb-1 close close-toast" aria-label="Close">
            &times;
          </button>
        </div>
        <div class="toast-body">
          <span id="toast_${$.toast_id}" class="toast-message" data-id="${msg.data}">${msg.msg}</span>
        </div>
      </div>`
      $("#toaster").prepend(test);

      $(".toast").show();
      $(".close-toast").on("click", function () {
        let toast_cont = $(this).closest(".toast");
        toast_cont.remove();
      })

      if (document.getElementById("toaster").children.length > 5) {
        let all_toasts = document.getElementById("toaster").children;
        all_toasts[all_toasts.length - 1].remove();
      }
    }

  })

})
