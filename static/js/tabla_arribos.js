export { createTable, createFilters };

function createTable(list) {
    const table = document.createElement("table");

    table.className = "tabla_arribos";
    table.id = 'tabla_arribos';

    if (list.length > 0) {
        //inserts headers
        table.appendChild(createHeader(list[0]));
        //inserts body
        table.appendChild(createBody(list));
    }
    return table;
}

function createHeader(item) {
    const thead = document.createElement("thead");
    const trow = document.createElement("tr");

    thead.className = "thead-dark"

    for (const key in item) {
        const th = document.createElement("th");
        const text = document.createTextNode(key);
        th.appendChild(text);
        trow.appendChild(th);
    }

    thead.appendChild(trow);

    return thead;
}

function createBody(lista) {
    const tbody = document.createElement("tbody");

    lista.forEach(element => {
        const trow = document.createElement("tr");

        for (const key in element) {
            const tdata = document.createElement("td");

            let text;
            if (key == "Fecha") {
                if (element[key]) {
                    text = document.createTextNode(element[key].substring(0, 10))
                } else {
                    text = document.createTextNode('Arribado!')
                }

            } else {
                text = document.createTextNode(element[key]);
                //console.log('wtf')
            }

            //const text = document.createTextNode(element[key]);
            //console.log("key: ", key)
            tdata.appendChild(text);
            trow.appendChild(tdata);
        }
        setRowAttributes(trow, element);
        //addRowHandler(trow);
        tbody.appendChild(trow);
    });

    return tbody;
}

function createFilters() {

    const mainDiv = document.createElement('div');
    const divListaFiltros = document.createElement('div');
    const divPromedio = document.createElement('div');

    //mainDiv.className = "d-flex flex-wrap";
    divListaFiltros.className = "input-group mb-3";

    createFilterSelect(divListaFiltros);
    createAvgDiv(divPromedio);
    mainDiv.appendChild(divListaFiltros);
    mainDiv.appendChild(divPromedio);

    return mainDiv;
}

function createFilterSelect(div) {
    const divNombre = document.createElement('div');
    const labelNombre = document.createElement('label');
    const select = document.createElement('select');
    const placeholder = document.createElement('option');
    const opcionA = document.createElement('option');
    const opcionB = document.createElement('option');
    const opcionC = document.createElement('option');

    divNombre.className = "input-group-prepend";
    labelNombre.className = "input-group-text";
    labelNombre.setAttribute('for', 'opcionesFiltro');
    labelNombre.innerHTML += 'Filtrar';

    select.className = "custom-select";
    select.id = 'opcionesFiltro';
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.hidden = true;
    placeholder.id = 'optionPlaceholder';
    placeholder.innerHTML += 'N/A'

    opcionA.value = 'Todos';
    opcionA.id = 'option' + opcionA.value;
    opcionA.innerHTML += opcionA.value;
    opcionB.value = 'Venta';
    opcionB.id = 'option' + opcionB.value;
    opcionB.innerHTML += opcionB.value;
    opcionC.value = 'Alquiler';
    opcionC.id = 'option' + opcionC.value;
    opcionC.innerHTML += opcionC.value;

    divNombre.appendChild(labelNombre);
    select.appendChild(placeholder);
    select.appendChild(opcionA);
    select.appendChild(opcionB);
    select.appendChild(opcionC);

    div.appendChild(divNombre);
    div.appendChild(select);
}

function setRowAttributes(tr, item) {
    if (tr) {
        for (const key in item) {
            if (item.hasOwnProperty(key)) {
                tr.setAttribute("data-" + key, item[key]);
            }
        }
    }
}