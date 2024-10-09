async function buscarImagen(nombreBusqueda) {
    const url = `https://images-api.nasa.gov/search?q=${nombreBusqueda}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
        const data = await response.json(); 
        return data.collection.items; 
    } catch (error) {
        console.error("Error al buscar la imagen:", error); 
        throw error;
    }
}

function obtenerDatos(items) {
    return items.map(item => { //Recorre cada elemento de items y crea un nuevo objeto 
        const { title, description, date_created } = item.data[0];
        const imagen = item.links ? item.links[0].href : null; 
        return {
            title,
            description,
            date_created,
            imagen
        };
    });
}

function mostrarDatos(datos) {
    const resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = ""; // Limpiar los resultados previos
    if(datos.length === 0){
        resultadosDiv.innerHTML = "<p class='text-center'>No se encontraron resultados.</p>";
    }
    
    datos.forEach(({ title, description, date_created, imagen }) => {
        if (imagen) { 
            const tarjeta = `
            <div class="col-md-4"> 
                <div class="card mb-4">
                    <img src="${imagen}" class="card-img-top" alt="${title}">
                    <div class="card-body">
                        <h5 class="card-title">${title}</h5>
                        <p class="card-text">${description}</p>
                        <p class="card-text"><small class="text-muted">${new Date(date_created).toLocaleDateString()}</small></p>
                    </div>
                </div>
            </div>`; //recibe los datos procesados y los inserta en el HTML
            resultadosDiv.innerHTML += tarjeta;
        }
    });
}

// Evento clic de búsqueda
document.getElementById("btnBuscar").addEventListener("click", async () => { 
    const finBusqueda = document.getElementById("inputBuscar").value.trim(); 
    if (finBusqueda) {
        const items = await buscarImagen(finBusqueda);
        const datos = obtenerDatos(items); 
        mostrarDatos(datos); 
    } else {
        alert("Por favor, ingresa un término de búsqueda.");
    }
});

document.addEventListener("DOMContentLoaded", inicializarBuscador);
