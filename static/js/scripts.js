import { createFilters, createTable } from "./tabla_arribos.js";
import { getInfo, updateList } from "./controller.js";


window.addEventListener('load', initializeHandlers);

function initializeHandlers() {
    const divTabla = document.getElementById('divTabla');
    const boton_pedido = document.getElementById("btn-pedido");
    const boton_embarcado = document.getElementById("btn-embarcado");
    const boton_aduana = document.getElementById("btn-aduana");
    const boton_nacionalizado = document.getElementById("btn-nacionalizado");
    const boton_disponible = document.getElementById("btn-disponible");

    boton_pedido.addEventListener('click', e =>{
        emptyTable(divTabla)
        getInfo(divTabla, 'PRODUCCION');
    })

    boton_embarcado.addEventListener('click', e =>{
        emptyTable(divTabla)
        getInfo(divTabla, 'EMBARCADO');
    })

    boton_aduana.addEventListener('click', e =>{
        emptyTable(divTabla)
        getInfo(divTabla,'ADUANA');
    })

    boton_nacionalizado.addEventListener('click', e =>{
        emptyTable(divTabla)
        getInfo(divTabla, 'NACIONALIZADO');
    })

    boton_disponible.addEventListener('click', e =>{
        emptyTable(divTabla)
        getInfo(divTabla, 'INGRESADO');
    })

}

function emptyTable(tableDiv){
    while (tableDiv.firstChild) {
        tableDiv.removeChild(tableDiv.lastChild);
    }
}