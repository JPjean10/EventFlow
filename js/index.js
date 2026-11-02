const selector = document.getElementById("jpl_categoria");
const lista = document.getElementById("jpl_eventos");
const plantilla = document.getElementById("plantilla-evento");

let eventos = [];

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
          imagen: fila[6]
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
      tarjeta.querySelector("[data-imagen]").alt = evento.nombre;
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