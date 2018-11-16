$(document).ready(function(){
    if($("#ctr-table").length){
        var table = $('#ctr-table').DataTable({
            dom: "lBfrtip",
            buttons: [
                {
                    text: "Import",
                    className: "btn btn-success ml-2",
                    action: function(e, dt, node, config){
                        $("#exampleModalCenter").modal("show")
                    }
                }
            ]
        });
    }
});