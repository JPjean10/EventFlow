const selector = document.getElementById("jpl_categoria");
const lista = document.getElementById("jpl_eventos");
const plantilla = document.getElementById("plantilla-evento");
const loginForm = document.getElementById("loginForm");

const botonIngresar = document.getElementById("p_ingresar");
const botonRegistrar = document.getElementById("p_registrar");

const loginModal = document.getElementById("LoginModal");
const registrarModal = document.getElementById("RegistrarModal");

const loginError = document.getElementById("loginError");
const authAcciones = document.getElementById("authAcciones");
const perfilUsuario = document.getElementById("perfilUsuario");
const avatarUsuario = document.getElementById("avatarUsuario");
const nombreUsuario = document.getElementById("nombreUsuario");

let eventos = [];

botonIngresar.addEventListener("click", () => {
  bootstrap.Modal.getOrCreateInstance(loginModal).show();
});

botonRegistrar.addEventListener("click", () => {
  bootstrap.Modal.getOrCreateInstance(registrarModal).show();
});

function InicioSesion(usuarios) {
  loginError.hidden = true;

  const colores = ["#5146e5", "#e74c3c", "#168f82", "#d97706", "#7c3aed"];
  const color = colores[Math.floor(Math.random() * colores.length)];

  avatarUsuario.textContent = usuarios.nombre.charAt(0).toUpperCase();
  avatarUsuario.style.backgroundColor = color;
  nombreUsuario.textContent = `${usuarios.nombre} ${usuarios.apellidos}`;

  authAcciones.classList.add("d-none");
  perfilUsuario.classList.remove("d-none");
  perfilUsuario.classList.add("d-flex");
}

loginForm.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const correo = document.getElementById("lbl_log_correo").value.trim().toLowerCase();
  const contrasena = document.getElementById("lbl_log_contrasena").value;

  const usuario = usuarios.find((item) =>
    item.correo.toLowerCase() === correo &&
    item.contrasena === contrasena
  );

    if (!usuarios){
    loginError.textContent = "Gmail o contraseña incorrectos.";
    loginError.hidden = false;
    return;
  }

  InicioSesion(usuario);

  document.activeElement.blur();

  bootstrap.Modal.getOrCreateInstance(loginModal).hide();
  loginForm.reset();
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

  InicioSesion(nuevoUsuario);

  document.activeElement.blur();

  bootstrap.Modal.getOrCreateInstance(registrarModal).hide();

  registroForm.reset();
});



async function cargar() {
  const respuesta = await fetch("./eventos.xlsx");
  const libro = XLSX.read(await respuesta.arrayBuffer(), { type: "array" });

  selector.replaceChildren(new Option("Todas las categorías", ""));

  libro.SheetNames.forEach((hoja) => {
    selector.add(new Option(hoja, hoja));

    const filas = XLSX.utils.sheet_to_json(libro.Sheets[hoja], {
      header: 1,
      defval: "",
      raw: false
    });

    filas.slice(1).forEach((fila) => {
      if (fila[1]) {
        eventos.push({
          hoja: hoja,
          nombre: fila[1],
          fecha: fila[2],
          Hora: fila[3],
          lugar: fila[4],
          categoria: fila[5],
          imagen: fila[6],
          precioGolden: fila[7],
          precioVip: fila[8],
          precioPreferencial: fila[9],
          precioGeneral: fila[10]
        });
      }
    });
  });

  mostrar();
}

function mostrar() {
  const fila = document.createElement("div");
  fila.className = "row g-3";

  lista.replaceChildren();

  eventos
    .filter((evento) => !selector.value || evento.hoja === selector.value)
    .forEach((evento) => {
      const tarjeta = plantilla.content.cloneNode(true);

      // Asignar datos
      tarjeta.querySelector("[data-imagen]").src = evento.imagen;
      tarjeta.querySelector("[data-lugar]").textContent = evento.lugar;
      tarjeta.querySelector("[data-categoria]").textContent = ` / ${evento.categoria}`;
      tarjeta.querySelector("[data-nombre]").textContent = evento.nombre;
      tarjeta.querySelector("[data-fecha]").textContent = evento.fecha;

      // CORRECTO: El evento de clic va aquí dentro
      tarjeta.querySelector(".card").addEventListener("click", () => {
        localStorage.setItem("eventoSeleccionado", JSON.stringify(evento));
        window.location.href = "evento.html";
      });

      fila.append(tarjeta);
    });

  lista.append(fila);
}

selector.addEventListener("change", mostrar);


cargar().catch((error) => {
  console.error("No se pudieron cargar los eventos:", error);
  lista.textContent = "No se pudieron cargar los eventos.";
});