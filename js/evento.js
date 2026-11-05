document.addEventListener("DOMContentLoaded", () => {
    const eventoGuardado = localStorage.getItem("eventoSeleccionado");
    const btnComprar = document.getElementById("btn-comprar");

    const botonIngresar = document.getElementById("p_ingresar");
    const botonRegistrar = document.getElementById("p_registrar");

    const loginModal = document.getElementById("LoginModal");
    const registrarModal = document.getElementById("RegistrarModal");

    const authAcciones = document.getElementById("authAcciones");
    const perfilUsuario = document.getElementById("perfilUsuario");
    const avatarUsuario = document.getElementById("avatarUsuario");
    const nombreUsuario = document.getElementById("nombreUsuario");

    const usuarioGuardado = localStorage.getItem("usuarioLogueado");
    let evento = null;
    let sectores = [];


    botonIngresar.addEventListener("click", () => {
        bootstrap.Modal.getOrCreateInstance(loginModal).show();
    });

    botonRegistrar.addEventListener("click", () => {
        bootstrap.Modal.getOrCreateInstance(registrarModal).show();
    });

    function InicioSesion(usuarioObj) {
        const colores = ["#5146e5", "#e74c3c", "#168f82", "#d97706", "#7c3aed"];
        const color = colores[Math.floor(Math.random() * colores.length)];

        avatarUsuario.textContent = usuarioObj.nombre.charAt(0).toUpperCase();
        avatarUsuario.style.backgroundColor = color;
        nombreUsuario.textContent = `${usuarioObj.nombre} ${usuarioObj.apellidos || ""}`;

        authAcciones.classList.add("d-none");
        perfilUsuario.classList.remove("d-none");
        perfilUsuario.classList.add("d-flex");
    }

    if (usuarioGuardado) {
        InicioSesion(JSON.parse(usuarioGuardado));
    }

    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", () => {
            localStorage.removeItem("usuarioLogueado");
            perfilUsuario.classList.remove("d-flex");
            perfilUsuario.classList.add("d-none");
            authAcciones.classList.remove("d-none");
            authAcciones.classList.add("d-flex");
        });
    }

    loginForm.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const correo = document.getElementById("lbl_log_correo").value.trim().toLowerCase();
        const contrasena = document.getElementById("lbl_log_contrasena").value;

        const usuario = usuarios.find((item) =>
            item.correo.toLowerCase() === correo &&
            item.contrasena === contrasena
        );

        if (!usuarios) {
            alert("Gmail o contraseña incorrectos.");
            return;
        }

        localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
        InicioSesion(usuario);

        document.activeElement.blur();

        bootstrap.Modal.getOrCreateInstance(loginModal).hide();
    });

    registrarModal.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const lbl_nombre = document.getElementById("lbl_nombre").value;
        const lbl_apellidos = document.getElementById("lbl_apellidos").value;
        const correo = document.getElementById("lbl_correo").value.trim().toLowerCase();
        const lbl_contrasena = document.getElementById("lbl_contrasena").value;
        const lbl_fecha_nacimiento = document.getElementById("lbl_fecha_nacimiento").value;
        const lbl_dni = document.getElementById("lbl_dni").value;

        const nuevoUsuario = {
            id: usuarios.length + 1,
            nombre: lbl_nombre,
            apellidos: lbl_apellidos,
            correo: correo,
            contrasena: lbl_contrasena,
            fechaNacimiento: lbl_fecha_nacimiento,
            dni: lbl_dni
        };

        usuarios.push(nuevoUsuario);

        localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
        InicioSesion(nuevoUsuario);

        document.activeElement.blur();

        bootstrap.Modal.getOrCreateInstance(registrarModal).hide();
    });

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
        const usuarioActivo = JSON.parse(localStorage.getItem("usuarioLogueado"));

        if (!usuarioActivo) {
            alert("Debes iniciar sesión o registrarte para comprar una entrada.");
            bootstrap.Modal.getOrCreateInstance(loginModal).show();
            return;
        }

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
            nombreUsuario: usuarioActivo.nombre,
            apellidosUsuario: usuarioActivo.apellidos,
            correoUsuario: usuarioActivo.correo,
            dniUsuario: usuarioActivo.dni,
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