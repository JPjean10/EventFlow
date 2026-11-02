document.addEventListener("DOMContentLoaded", () => {
    const eventoGuardado = localStorage.getItem("eventoSeleccionado");
    
    if (eventoGuardado) {
        const evento = JSON.parse(eventoGuardado);
        
        document.getElementById("evento-imagen").src = evento.imagen;
        document.getElementById("evento-titulo").textContent = evento.nombre;
        document.getElementById("breadcrumb-evento").textContent = evento.nombre;
        
        document.getElementById("evento-fecha").textContent = evento.fecha;
        document.getElementById("evento-hora").textContent = evento.Hora;
        document.getElementById("evento-lugar").textContent = evento.lugar;
    }
});