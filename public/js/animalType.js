function deleteEntry(element){
    var id = {
        'Animal Type ID': element.id
    };
    var confirmationPopup = confirm("Are you sure you want to delete this Animal Type?");
    //if user clicks "OK" when asked if they want to delete employee
    if (confirmationPopup)
    {
        $.ajax({
            url: "/deleteAnimalType",
            type: "POST",
            contentType: "application/json",
            processData: false,
            data: JSON.stringify(id),
            complete: function (animals) {
                $('#output').html(animals.responseText);
                reloadAnimalTypeTable();
            }
        });
    }

}



function reloadAnimalTypeTable(){
    $.ajax({
        url: "/getAllAnimalTypes",
        type: "POST",
        contentType: "application/json",
        processData: false,
        complete: function (animals) {
            CreateAnimalTypeJSONTable(JSON.parse(animals.responseText));
        }
    });
}

function CreateAnimalTypeJSONTable(oneData) {
    // EXTRACT VALUE FOR HTML HEADER.
    var col = [];
    for (var i = 0; i < oneData.length; i++) {
        for (var key in oneData[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }
    col.push("Actions")

    // CREATE DYNAMIC TABLE.
    var table = document.createElement("table");
    table.setAttribute("class", "table table-striped tablesorter");
    table.setAttribute('id', 'animalsTable');

    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
    var thead = document.createElement("thead");
    table.appendChild(thead);

    var trheader = thead.insertRow(-1);

    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");      // TABLE HEADER.

        th.innerHTML = col[i];
        th.setAttribute('data-dynatable-column', col[i])
        trheader.appendChild(th);

    }
    var tbody = table.appendChild(document.createElement("tbody"));
    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (var i = 0; i < oneData.length; i++) {

        //var tr = table.insertRow(-1);
        var tr = tbody.appendChild(document.createElement("tr"))

        for (var j = 0; j < col.length-1; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = oneData[i][col[j]];
        }
        var rowID = oneData[i][col[0]];
        var tabcelldelete = tr.insertCell(-1);
        var tabcelledit = tr.insertCell(-1);
        //tabcelldelete.innerHTML = "<button type='button' id='" + rowID + "' onclick='deleteEntry(this)' style='color: red'> X </button><br>";
        tabcelldelete.innerHTML = "<span id='" + rowID +"' onclick='deleteEntry(this)' class='table-remove glyphicon glyphicon-remove'></span>"
    }


    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById("showAnimalType");
    divContainer.appendChild(table);

    $('#animalsTable').dynatable({
        dataset: {
            records: oneData
        }
    });

    $("#animalsTable").tablesorter();
}



$(document).ready(function(){




    reloadAnimalTypeTable();

    $('#animals-name').keyup(function() {
        var $rows = $('#animalsTable tbody  tr');

        var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();

        $rows.show().filter(function() {
            var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
            return !~text.indexOf(val);
        }).hide();
    });

    $('#getAllAnimalTypes').click(function () {
        reloadAnimalTypeTable();
    });
    $("#animalsTable").tablesorter();
});