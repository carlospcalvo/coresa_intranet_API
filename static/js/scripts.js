import { createFilters, createTable } from "./tabla_arribos.js";
import { getInfo, saveData, updateList } from "./controller.js";


window.addEventListener('load', initializeHandlers);

function initializeHandlers() {
    const divTabla = document.getElementById('divTabla');
    const boton_pedido = document.getElementById("btn-pedido");
    const boton_embarcado = document.getElementById("btn-embarcado");
    const boton_aduana = document.getElementById("btn-aduana");
    const boton_nacionalizado = document.getElementById("btn-nacionalizado");
    const boton_disponible = document.getElementById("btn-disponible");
    let arribos = getInfo();
    //updateList(arribos_cuerpo, arribos);

    boton_pedido.addEventListener('submit', e => {

        console.log(e)

        updateList(divTabla, arribos, 'PRODUCCION');




    })
















    /*
    botones_arribo.addEventListener('click', e => {
        

        //let estado = botones_arribo.
        console.log(e.target.parentElement.id)
        //console.log(e.target.innerText == 'Pedido')
        switch (e.target.innerText) {
            case 'Pedido':
                //getFilteredData("PRODUCCION")

                let tabla = document.getElementById("w-tabs-0-data-w-pane-0");
                console.log(tabla);
                updateList(tabla, arribos, 'PRODUCCION');

                /*
                let filteredData = arribos.filter((element) => {
                    return element.Estado == 'PRODUCCION';
                });

                console.log(filteredData)
                */
               /*
                break;
            case 'Embarcado':
                updateList(arribos_cuerpo, arribos, 'EMBARCADO');
                break;
            case 'En Aduana':
                updateList(arribos_cuerpo, arribos, 'DEPOSITO FISCAL');
                break;
            case 'En Dep. Nac.':
                updateList(arribos_cuerpo, arribos, 'DEPOSITO NACIONAL');
                break;
                /*
                case 'En Depósito':

                    break;
                */
               /*
            default:
                alert('oooops');

        }
    })
*/

    //console.log(arribos_cuerpo);
    //console.log(arribos);
}