const formulario = document.getElementById('formulario');
const seleccionados = document.getElementById("seleccionados")
const delegado = document.getElementById("delegado")
const subdelegado = document.getElementById("subDelegado")
const numVotos = document.getElementById("numVotos")
const borrar = document.getElementById("boton_borrar")
const grabar = document.getElementById("boton_grabar")

const control = {
    listaVotados: [],
    votosEmitidos: 0,

    aumentaVoto(id) {
        this.listaVotados[id].votos++;
        this.votosEmitidos++;
        numVotos.textContent = this.votosEmitidos;

    },
    insertaVotado(nombre, votos = 0) {
        this.listaVotados.push({
            nombre: nombre,
            votos: votos,
        });
        const id = this.listaVotados.length - 1;

        const elementoListaSeleccionados = document.createElement('div');
        elementoListaSeleccionados.innerHTML = `
            <p>${nombre}</p>
            <input type="button" class="boton-modificado" value="${votos}" id="C${id}" data-counter>
        `;

        //añadimos el elemento a la lista de elementos dom       
        elementoListaSeleccionados.id = nombre;

        seleccionados.appendChild(elementoListaSeleccionados);

        //Asignamos los eventos a los botones
        document.getElementById(`C${id}`).addEventListener("click", (event) => {
            if (event.target.dataset.counter !== undefined) {
                this.aumentaVoto(id);
                event.target.value = this.listaVotados[id].votos;
                this.dameDelegado();
                formulario["nombre"].focus();
            }
        });
    },
    reseteaFormulario() {
        formulario['nombre'].value = '';
        formulario['nombre'].focus();
    },
    dameDelegado() {
        const nombreDelegado = [...this.listaVotados].sort((ele1, ele2) =>
            ele2.votos - ele1.votos
        );
        delegado.textContent = `Delegado: ${nombreDelegado[0].nombre}`;
        const divDelegado = document.getElementById(`${nombreDelegado[0].nombre}`);
        seleccionados.insertAdjacentElement('afterbegin', divDelegado);
        if (nombreDelegado.length > 1) {
            subdelegado.textContent = `SubDelegado: ${nombreDelegado[1].nombre}`;
            const divSubDelegado = document.getElementById(`${nombreDelegado[1].nombre}`);
            divDelegado.insertAdjacentElement('afterend', divSubDelegado);
        }
    },
};

//El submit
formulario.addEventListener("submit", (event) => {
    event.preventDefault();
    if (formulario['nombre'].value !== "") {
        control.insertaVotado(formulario['nombre'].value);
        control.reseteaFormulario();
    }
});

// Si hay algo en localStorage
if (localStorage.getItem("listaVotados") !== null) {
    const recuperoArray = localStorage.getItem("listaVotados");
    const arrayListaVotados = JSON.parse(recuperoArray);
    let votosTotales = 0;
    
    arrayListaVotados.forEach((el) => {
        control.insertaVotado(el.nombre, el.votos)
        control.dameDelegado();
        votosTotales += el.votos;
    });

    console.log(votosTotales);
    numVotos.textContent = votosTotales;
    control.votosEmitidos = votosTotales;
}

// Array a JSON
grabar.addEventListener("click", () => {
    const arrayJSON = JSON.stringify(control.listaVotados);
    localStorage.setItem("listaVotados", arrayJSON);
});

// Borrar y reiniciar variables
borrar.addEventListener("click", () => {
    localStorage.removeItem("listaVotados");
    control.listaVotados = [];
    seleccionados.textContent = "";
    delegado.textContent = "";
    subdelegado.textContent = "";
    numVotos.textContent = 0;
    control.votosEmitidos = 0;
});
