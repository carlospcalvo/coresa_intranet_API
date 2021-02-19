import { createTable } from "./tabla_arribos.js";
export { getInfo, updateList };

function getInfo(tableDiv, filter) {
    //return JSON.parse(localStorage.getItem("arribos")) || [];
    let fechas = new Set()

    fetch('https://127.0.0.1:5000/api/arribos')
        .then(res => {
            if (!res.ok) return Promise.reject(res);
            return res.json();
        })
        .then(data => {
            localStorage.setItem("arribos", JSON.stringify(data));

            console.log(data)

            data.forEach(element => {
                if(!element['Fecha']){
                    fechas.add('Arribado')
                } else {
                    fechas.add(element['Fecha'].substring(0, 10))
                }
            });
            
            fechas.forEach((fecha) => {
                updateList(tableDiv, data, fecha, filter);
            });
        })
        .catch(err => {
            let mensaje = err.statusText || 'Se produjo un error.';
            console.error('Error: ' + err.status + '-' + mensaje);
        });
    
}


function updateList(tableDiv, list, fecha, filter) {
    const newDiv = document.createElement('div')
    const titulo = document.createElement('h3');
    let newList = Object.create(list)
    
    if(fecha != 'Arribado'){
        let fecha_format = new Date(fecha)
        const options = { year: 'numeric', month: 'long', day: 'numeric' };

        fecha_format = fecha_format.toLocaleDateString('es-AR', options).toString()
        titulo.textContent = fecha_format.replaceAll('de ', '')
    } else {
        titulo.textContent = 'Arribado'
    }    


    let filteredData = newList.filter((element) => {
        return element['Estado'] == filter;
    });

    filteredData = filteredData.filter((element) => {
        if(element['Fecha']){
            return element['Fecha'].substring(0, 10) == fecha
        } else {
            return 'Arribado' == fecha
        }
    });
    
    /*
    filteredData.forEach(element => {
        if (element.hasOwnProperty('Estado')) {
            delete element['Estado'];
        }
    });
    */

    if(filteredData.length > 0){
        newDiv.id = fecha
        newDiv.appendChild(titulo)
        newDiv.appendChild(createTable(filteredData));
        tableDiv.appendChild(newDiv)
    }
}

/*
function createSpinner() {
    const img = document.createElement('img');

    img.setAttribute('src', "./images/spinner.gif");
    img.setAttribute('alt', 'Imagen Spinner');

    return img;
}
*/