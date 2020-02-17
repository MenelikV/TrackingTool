"use strict";

$(document).ready(function () {
  let sub_container = document.getElementById("sub_container");
  if (!sub_container) return;

  //let full_owners = window.SAILS_LOCALS["full_owners"];


  ////////////////// ON LOAD INITIALIZATION /////////////////////
  fillNotifications();
  fillAircraftsSubs();
  fillOwnerSubs();
  ///////////////////////////////////////////////////////////////

  ////////////////////// FUNCTIONS //////////////////////////////
  function fillNotifications() {
    let aircraft_sub_data = window.SAILS_LOCALS["aircraft_sub"];
    console.log(aircraft_sub_data);
    let aircraft_cont = document.getElementById("aircraft_container");
    if (aircraft_sub_data.length) fillGeneralSubsContainer(aircraft_cont, aircraft_sub_data, "aircraft");

    let owner_sub_data = window.SAILS_LOCALS["owner_sub"];
    console.log(owner_sub_data);
    let owner_cont = document.getElementById("owner_container");
    if (owner_sub_data.length) fillGeneralSubsContainer(owner_cont, owner_sub_data, "flight_owner");
  }

  function fillGeneralSubsContainer(container, data, data_name) {
    let name_mapping;
    if (data_name === "flight_owner") name_mapping = "airline"
    else name_mapping = "aircraft"

    for (let notification of data) {
      let notif_container = document.createElement("DIV");
      notif_container.classList.add("notification-row");
      notif_container.full_data = notification;

      let notif_div = document.createElement("DIV");
      notif_div.textContent = notification.user_name;
      if (!notification.modification) notif_div.textContent = notif_div.textContent + " has added a new entry for " + name_mapping + " " + notification[data_name];

      else {
        let value_span = document.createElement("SPAN");
        value_span.classList.add(notification.modification_value.replace(/ /g, "-"), "sub-value-span");
        value_span.textContent = notification.modification_value;

        notif_div.textContent = notif_div.textContent + " has modified the " + notification.modification.replace(/_/g, " ") + " for an " + name_mapping + " " + notification[data_name] + " entry to ";
        notif_div.appendChild(value_span);
      }

      let date_span = document.createElement("SPAN");
      date_span.classList.add("sub-date-span")
      date_span.textContent = moment(notification.createdAt).format("DD/MM/YYYY HH:mm:ss");

      notif_container.appendChild(notif_div);
      notif_container.appendChild(date_span);

      container.appendChild(notif_container);
    }
  }

  function fillAircraftsSubs() {
    let modal_container = document.getElementById("aircraft_subs_cont");
    let full_aircrafts = window.SAILS_LOCALS["full_aircrafts"];
    let user_aicrafts = window.SAILS_LOCALS["aircraft_user_sub"];
    //Fill subs modal with all aircrafts
    fillSubSelectLList(modal_container, full_aircrafts, user_aicrafts);
  }

  function fillOwnerSubs() {
    let modal_container = document.getElementById("owner_subs_cont");
    let full_owners = window.SAILS_LOCALS["full_owners"];
    let user_owners = window.SAILS_LOCALS["owner_user_sub"];
    fillSubSelectLList(modal_container, full_owners, user_owners);
  }

  function fillSubSelectLList(container, full_data, user_subs) {
    for (let item of full_data) {
      let item_label = document.createElement("LABEL");
      item_label.classList.add("sub-select");

      let check_box = document.createElement("INPUT");
      check_box.type = "checkbox";
      check_box.value = item;
      if (user_subs.indexOf(item) !== -1) check_box.checked = true;

      let text_span = document.createElement("SPAN");
      text_span.textContent = item;

      item_label.appendChild(check_box);
      item_label.appendChild(text_span);

      container.appendChild(item_label);
    }
  }

  function getAircraftSubData() {
    let user_id = window.SAILS_LOCALS["me"]["id"];
    let full_subs = [];
    let container = document.getElementById("aircraft_subs_cont");
    let selected = container.querySelectorAll("input:checked");

    for (let item of selected) {
      let value = item.value;
      let data = {
        id: user_id + "_" + "aircraft" + "_" + value,
        user_id: user_id,
        field_name: "aircraft",
        field_value: value
      }

      full_subs.push(data);
    }
    return full_subs;
  }

  function getOwnerSubData() {
    let user_id = window.SAILS_LOCALS["me"]["id"];
    let full_subs = [];
    let container = document.getElementById("owner_subs_cont");
    let selected = container.querySelectorAll("input:checked");

    for (let item of selected) {
      let value = item.value;
      let data = {
        id: user_id + "_" + "flight_owner" + "_" + value,
        user_id: user_id,
        field_name: "flight_owner",
        field_value: value
      }

      full_subs.push(data);
    }
    return full_subs;
  }
  ///////////////////////////////////////////////////////////////


  /////////////////////////// JQUERY ///////////////////////////

  //Modal tab selection functionality
  $("#subs_tabs label").on("click", function () {
    $("#subs_tabs .active").removeClass("active");
    $(".subs-container.active").removeClass("active");

    $(this).addClass("active");
    let container_id = $(this).data("container");
    $("#" + container_id).addClass("active");
  })

  //RSS tab selection
  $("#rss_tabs label").on("click", function () {
    $("#rss_tabs .active").removeClass("active");
    $(".sub-data-container.active").removeClass("active");

    $(this).addClass("active");
    let container_id = $(this).data("container");
    $("#" + container_id).addClass("active");
  })

  $("#edit_subs_form").submit(function (event) {
    event.preventDefault();
    var form = $(this);
    var url = form.attr("action");
    let aircraft_subs = getAircraftSubData();
    let owner_subs = getOwnerSubData();

    let full_subs = aircraft_subs.concat(owner_subs);
    let data = {
      subs: full_subs
    };

    $("#loader_cont").addClass("active");
    $('#loader').show();

    $.ajax({
      url: url,
      method: "POST",
      data: data,
      success: function () {
        location.reload();
      },
      error: function () {}
    })

  })

  ///////////////////////////////////////////////////////////////
});
