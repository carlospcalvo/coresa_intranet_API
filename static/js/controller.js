import { createTable } from "./tabla_arribos.js";
export { getInfo, saveData, updateList };

function getInfo() {
    return JSON.parse(localStorage.getItem("arribos")) || [];
}

function saveData(anuncios) {
    localStorage.setItem("arribos", JSON.stringify(anuncios));
}

function updateList(tableDiv, list, filter) {
    //const spinner = document.getElementById("spinner");
    //spinner.appendChild(createSpinner());
    tableDiv.setAttribute('class','arribosdiv')

    while (tableDiv.firstChild) {
        tableDiv.removeChild(tableDiv.lastChild);
    }

    let filteredData = list.filter((element) => {
        return element.Estado == filter;
    });

    setTimeout(() => {
        /*
        while (spinner.hasChildNodes()) {
            spinner.removeChild(spinner.lastChild);
        }
        */
        tableDiv.appendChild(createTable(filteredData));
    }, 1500);
}

/*
function createSpinner() {
    const img = document.createElement('img');

    img.setAttribute('src', "./images/spinner.gif");
    img.setAttribute('alt', 'Imagen Spinner');

    return img;
}
*/