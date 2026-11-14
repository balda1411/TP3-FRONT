let series = [];

async function obtenerSerie() {
  try {
    const respuesta = await fetch("https://api.tvmaze.com/shows");
    series = await respuesta.json();
    console.log(series);
    mostrarSeries();
    actualizarFiltros();
  } catch (error) {
    console.log("ERROR CON API", error);
  }
}
obtenerSerie();

const container = document.getElementById("series-Container");

function mostrarSeries(listaSeries = series) {
  container.innerHTML = "";
  let tarjetasHTML = "";

  for (let i = 0; i < listaSeries.length; i++) {
    const seriePuntual = listaSeries[i];
    tarjetasHTML += `<article class="card">
      <h2 class="serie">${seriePuntual.name}</h2>
      <p>${seriePuntual.type}</p>
      <p>${seriePuntual.language || "Sin idioma"}</p>
      <p>${seriePuntual.genres?.join(", ") || "Sin género"}</p>
      <img src="${seriePuntual.image?.medium || "https://placehold.co"}">
    </article>`;
  }

  container.innerHTML = tarjetasHTML;
}

const agregarPelisBoton = document.getElementById("agregarPelis");
agregarPelisBoton.addEventListener("submit", (event) => {
  event.preventDefault();
  let peliNueva = {
    name: event.target.name.value,
    type: event.target.type.value,
    language: event.target.language.value,
    genres: [],
  };
  series.push(peliNueva);
  mostrarSeries(series);
  actualizarFiltros();
  event.target.reset();
});

const buscar = document.getElementById("Buscar");
const filtroLenguaje = document.getElementById("filtroLenguaje");
const filtrotipo = document.getElementById("filtrotipo");
const filtrogenero = document.getElementById("filtrogenero");

function filtrar() {
  const pelisFiltradas = series.filter((serie) => {
    const coincideLenguaje =
      !filtroLenguaje.value || serie.language === filtroLenguaje.value;
    const coincideTipo = !filtrotipo.value || serie.type === filtrotipo.value;
    const coincideGenero =
      !filtrogenero.value || serie.genres?.includes(filtrogenero.value);
    return coincideLenguaje && coincideTipo && coincideGenero;
  });

  mostrarSeries(pelisFiltradas);
}

function buscamelo() {
  const texto = buscar.value.toLowerCase();
  const pelisFiltradas = series.filter((serie) => {
    return (
      serie.name.toLowerCase().includes(texto) ||
      (serie.language && serie.language.toLowerCase().includes(texto)) ||
      (serie.type && serie.type.toLowerCase().includes(texto))
    );
  });
  mostrarSeries(pelisFiltradas);
}

filtroLenguaje.addEventListener("change", filtrar);
filtrotipo.addEventListener("change", filtrar);
filtrogenero.addEventListener("change", filtrar);
buscar.addEventListener("input", buscamelo);

function actualizarFiltros() {
  filtroLenguaje.innerHTML = `<option value="">Todos los Lenguajes</option>`;
  filtrotipo.innerHTML = `<option value="">Todos los Tipos</option>`;
  filtrogenero.innerHTML = `<option value="">Todos los Géneros</option>`;

  let lenguajes = [];
  let tipos = [];
  let generos = [];

  series.forEach((serie) => {
    if (serie.language && !lenguajes.includes(serie.language)) {
      lenguajes.push(serie.language);
    }
    if (serie.type && !tipos.includes(serie.type)) {
      tipos.push(serie.type);
    }
    serie.genres?.forEach((genero) => {
      if (!generos.includes(genero)) {
        generos.push(genero);
      }
    });
  });

  lenguajes.forEach((language) => {
    filtroLenguaje.innerHTML += `<option value="${language}">${language}</option>`;
  });
  tipos.forEach((type) => {
    filtrotipo.innerHTML += `<option value="${type}">${type}</option>`;
  });
  generos.forEach((genero) => {
    filtrogenero.innerHTML += `<option value="${genero}">${genero}</option>`;
  });
}
