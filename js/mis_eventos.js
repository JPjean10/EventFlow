document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("lista-mis-eventos");

    const botonIngresar = document.getElementById("p_ingresar");
    const botonRegistrar = document.getElementById("p_registrar");

    const loginModal = document.getElementById("LoginModal");
    const registrarModal = document.getElementById("RegistrarModal");

    const loginForm = document.getElementById("loginForm");
    const registroForm = document.getElementById("registroForm");
    const loginError = document.getElementById("loginError");
    const authAcciones = document.getElementById("authAcciones");
    const perfilUsuario = document.getElementById("perfilUsuario");
    const avatarUsuario = document.getElementById("avatarUsuario");
    const nombreUsuario = document.getElementById("nombreUsuario");
    const btnCerrarSesion = document.getElementById("btnCerrarSesion");

    const usuarioGuardado = localStorage.getItem("usuarioLogueado");
    const todosLosEventos = JSON.parse(localStorage.getItem("misEventos")) || [];

    botonIngresar.addEventListener("click", () => {
        bootstrap.Modal.getOrCreateInstance(loginModal).show();
    });

    botonRegistrar.addEventListener("click", () => {
        bootstrap.Modal.getOrCreateInstance(registrarModal).show();
    });

    function InicioSesion(usuarioObj) {
        loginError.hidden = true;
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
    } else {
        contenedor.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="text-muted fs-5">Debes iniciar sesión para ver tus eventos guardados.</p>
            </div>
        `;
        return;
    }

    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", () => {
            localStorage.removeItem("usuarioLogueado");
            location.reload();
        });
    }

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const correo = document.getElementById("lbl_log_correo").value.trim().toLowerCase();
        const contrasena = document.getElementById("lbl_log_contrasena").value;

        let listaUsuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || usuarios;
        const usuario = listaUsuarios.find((item) =>
            item.correo.toLowerCase() === correo &&
            item.contrasena === contrasena
        );

        if (!usuario) {
            loginError.textContent = "Gmail o contraseña incorrectos.";
            loginError.hidden = false;
            return;
        }

        localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
        location.reload();
    });

    registroForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const lbl_nombre = document.getElementById("lbl_nombre").value;
        const lbl_apellidos = document.getElementById("lbl_apellidos").value;
        const correo = document.getElementById("lbl_correo").value.trim().toLowerCase();
        const lbl_contrasena = document.getElementById("lbl_contrasena").value;
        const lbl_fecha_nacimiento = document.getElementById("lbl_fecha_nacimiento").value;
        const lbl_dni = document.getElementById("lbl_dni").value;

        let listaUsuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || usuarios;

        const nuevoUsuario = {
            id: listaUsuarios.length + 1,
            nombre: lbl_nombre,
            apellidos: lbl_apellidos,
            correo: correo,
            contrasena: lbl_contrasena,
            fechaNacimiento: lbl_fecha_nacimiento,
            dni: lbl_dni
        };

        listaUsuarios.push(nuevoUsuario);
        localStorage.setItem("usuariosRegistrados", JSON.stringify(listaUsuarios));
        localStorage.setItem("usuarioLogueado", JSON.stringify(nuevoUsuario));
        location.reload();
    });

    const usuarioActivo = JSON.parse(usuarioGuardado);
    const misEventos = todosLosEventos.filter(ev => ev.correoUsuario === usuarioActivo.correo);

    if (misEventos.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="text-muted fs-5">Aún no tienes eventos guardados en tu lista.</p>
                <a href="index.html" class="btn btn-primary mt-2">Explorar eventos</a>
            </div>
        `;
        return;
    }

    contenedor.innerHTML = "";

    misEventos.forEach((evento) => {
        const card = document.createElement("div");
        card.className = "col-12";

        card.innerHTML = `
            <div class="card border rounded-4 shadow-sm p-3 mb-3">
                <div class="row g-0 align-items-center">
                    <div class="col-md-3">
                        <img src="${evento.imagen}" alt="${evento.nombre}" class="img-fluid rounded-3 object-fit-cover" style="height: 160px; width: 100%;">
                    </div>
                    <div class="col-md-9 ps-md-4">
                        <div class="card-body p-0">
                            <span class="badge bg-light text-primary fw-semibold mb-2">ENTRADA CONFIRMADA - ${evento.sectorSeleccionado || 'GENERAL'}</span>
                            <h4 class="card-title fw-bold mb-1">${evento.nombre}</h4>
                            <p class="text-muted small mb-1">Precio pagado: S/ ${evento.precioSeleccionado || '0.00'}</p>
                            
                            <div class="bg-light p-2 rounded small mb-3 text-secondary">
                                <div><strong>Gmail:</strong> ${evento.correoUsuario}</div>
                                <div><strong>Fecha de nacimiento:</strong> ${evento.fechaNacimientoUsuario}</div>
                                <div><strong>DNI:</strong> ${evento.dniUsuario}</div>
                            </div>
                            
                            <div class="d-flex flex-wrap gap-4 text-secondary small mb-3">
                                <div>📅 ${evento.fecha}</div>
                                <div>🕒 ${evento.Hora || 'Por confirmar'}</div>
                                <div>📍 ${evento.lugar}</div>
                            </div>

                            <div class="d-flex align-items-center gap-3">
                                <button class="btn btn-primary btn-sm px-4 py-2 rounded-pill">Ver entrada</button>
                                <button class="btn btn-outline-secondary btn-sm px-4 py-2 rounded-pill">Descargar</button>
                                <button class="btn btn-outline-danger btn-sm px-4 py-2 rounded-pill cancelar-evento" data-correo="${evento.correoUsuario}" data-nombre="${evento.nombre}">Cancelar suscripción</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });

    document.querySelectorAll(".cancelar-evento").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const nombreEv = e.target.getAttribute("data-nombre");
            const correoEv = e.target.getAttribute("data-correo");

            if (confirm("¿Estás seguro de que deseas cancelar la suscripción a este evento?")) {
                const indexGlobal = todosLosEventos.findIndex(ev => ev.nombre === nombreEv && ev.correoUsuario === correoEv);
                if (indexGlobal !== -1) {
                    todosLosEventos.splice(indexGlobal, 1);
                    localStorage.setItem("misEventos", JSON.stringify(todosLosEventos));
                    location.reload();
                }
            }
        });
    });
});