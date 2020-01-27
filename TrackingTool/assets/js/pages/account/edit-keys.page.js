"use strict";

$(document).ready(function () {
  let keys_container = document.getElementById('keys_container');
  if (keys_container) {
    fillInputKeys();

    $("#apply_keys_changes").on("click", function () {
      let url = "account/admin/update_keys";
      let inputs = $("input.key-input");
      let key_array = [];

      for (let input of inputs) {
        let value = input.value;
        let key_name = input.getAttribute("name");

        let update = {
          Alias: value,
          Name: key_name
        };
        if (value) key_array.push(update);
      }

      let data = {
        key_array: key_array
      };

      $.ajax({
        url: url,
        method: "POST",
        data: data,
        success: function () {
          location.reload();
        },
        error: function () {
          console.log("error! ")
        }
      })

    })

    function fillInputKeys() {
      let keys_data = window.SAILS_LOCALS["full_keys"];
      let inputs = $("input.key-input");

      for (let input of inputs) {
        let key_name = input.getAttribute("name");
        let key_value = (keys_data[key_name]) ? keys_data[key_name] : "";
        input.value = key_value;
      }
    }
  }

});
