document.addEventListener("DOMContentLoaded", () => {
    const eventoGuardado = localStorage.getItem("eventoSeleccionado");
    const btnComprar = document.getElementById("btn-comprar");

    let evento = null;
    let sectores = [];

    if (eventoGuardado) {
        evento = JSON.parse(eventoGuardado);

        document.getElementById("evento-imagen").src = evento.imagen;
        document.getElementById("evento-titulo").textContent = evento.nombre;
        document.getElementById("breadcrumb-evento").textContent = evento.nombre;
        document.getElementById("evento-fecha").textContent = evento.fecha;
        document.getElementById("evento-hora").textContent = evento.Hora;
        document.getElementById("evento-lugar").textContent = evento.lugar;

        const sectores = [
            { nombre: "GOLDEN", precio: evento.precioGolden },
            { nombre: "VIP", precio: evento.precioVip },
            { nombre: "PREFERENCIAL", precio: evento.precioPreferencial },
            { nombre: "GENERAL", precio: evento.precioGeneral }
        ];

        const contenedor = document.getElementById("sectores-container");
        contenedor.replaceChildren();

        sectores.forEach((sector, indice) => {
            const fila = document.createElement("label");
            fila.className = "d-flex justify-content-between align-items-center mb-3";

            const opcion = document.createElement("span");
            opcion.className = "d-flex align-items-center gap-2";

            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "sector";
            radio.value = sector.nombre;
            radio.checked = indice === 0;
            radio.className = "form-check-input m-0";

            const nombre = document.createElement("span");
            nombre.textContent = sector.nombre;

            const precio = document.createElement("strong");
            precio.className = "jpl_precio_sector";
            precio.textContent = sector.precio;

            opcion.append(radio, nombre);
            fila.append(opcion, precio);
            contenedor.append(fila);
        });
    }

        btnComprar.addEventListener("click", () => {
                const radioSeleccionado = document.querySelector('input[name="sector"]:checked');
                
                let sectorElegido = "GENERAL";
                let precioElegido = evento.precioGeneral;

                if (radioSeleccionado) {
                    sectorElegido = radioSeleccionado.value;
                    
                    const sectorEncontrado = sectores.find(s => s.nombre === sectorElegido);
                    if (sectorEncontrado) {
                        precioElegido = sectorEncontrado.precio;
                    }
                }

                const entradaComprada = {
                    nombre: evento.nombre,
                    imagen: evento.imagen,
                    fecha: evento.fecha,
                    Hora: evento.Hora,
                    lugar: evento.lugar,
                    sectorSeleccionado: sectorElegido,
                    precioSeleccionado: precioElegido,
                    fechaCompra: new Date().toLocaleDateString()
                };

        let misEventosGuardados = JSON.parse(localStorage.getItem("misEventos")) || [];
            misEventosGuardados.push(entradaComprada);
            localStorage.setItem("misEventos", JSON.stringify(misEventosGuardados));

            console.log("Objeto completo de compra:", entradaComprada);

            alert(`¡Entrada para el sector ${sectorElegido} comprada con éxito!`);
            window.location.href = "mis_eventos.html";
    });

});