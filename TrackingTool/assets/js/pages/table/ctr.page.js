$(document).ready(function(){
    if($("#ctr-table").length){
        var table = $('#ctr-table').DataTable({
            dom: "lBfrtip",
            buttons: [
                {
                    text: "Import",
                    className: "btn btn-primary ml-2",
                    action: function(e, dt, node, config){
                        $("#uploadModal").modal("show")
                    }
                }
            ]
        });
        $("#files").submit(function(e){
            // Prevent default handling of the event
            $form = $(this)
            e.preventDefault()
            url = "/ctr/import"
            var file = $form.find("#files").val()
            var req = {
                data: file
            }
            $.ajax({
                url: url,
                data: req,
                method: "POST",
                error: function(e){
                    alert("Database could not be updated")
                },
                success: function(e){
                    // Close the modal and reload
                    $("#closeButton").click()
                    window.location.reload()
                }
            })
        })
    }
});