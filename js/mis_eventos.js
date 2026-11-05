        document.addEventListener("DOMContentLoaded", () => {
            const contenedor = document.getElementById("lista-mis-eventos");
            const misEventos = JSON.parse(localStorage.getItem("misEventos")) || [];

            // Si no hay eventos comprados, mostramos un mensaje vacío
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

            // Recorremos la lista completa del localStorage para pintarlos todos
            misEventos.forEach((evento, index) => {
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
                                    <span class="badge bg-light text-primary fw-semibold mb-2">ENTRADA CONFIRMADA - ${evento.sectorSeleccionado || evento.sector || ' GENERAL'}</span>
                                    <h4 class="card-title fw-bold mb-1">${evento.nombre}</h4>
                                    <p class="text-muted small mb-3">Precio pagado: S/ ${evento.precioSeleccionado || evento.precio || '0.00'}</p>
                                    
                                    <div class="d-flex flex-wrap gap-4 text-secondary small mb-3">
                                        <div>📅 ${evento.fecha}</div>
                                        <div>🕒 ${evento.Hora || evento.hora || 'Por confirmar'}</div>
                                        <div>📍 ${evento.lugar}</div>
                                    </div>

                                    <div class="d-flex align-items-center gap-3">
                                        <button class="btn btn-primary btn-sm px-4 py-2 rounded-pill">Ver entrada</button>
                                        <button class="btn btn-outline-secondary btn-sm px-4 py-2 rounded-pill">Descargar</button>
                                        <button class="btn btn-outline-danger btn-sm px-4 py-2 rounded-pill cancelar-evento" data-index="${index}">Cancelar suscripción</button>
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
                    const indice = e.target.getAttribute("data-index");
                    if (confirm("¿Estás seguro de que deseas cancelar la suscripción a este evento?")) {
                        misEventos.splice(indice, 1); // Lo borramos del arreglo
                        localStorage.setItem("misEventos", JSON.stringify(misEventos)); // Actualizamos el localStorage
                        location.reload(); // Recargamos la página para actualizar la vista
                    }
                });
            });
        });