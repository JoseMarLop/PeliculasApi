//Variables de las url de la api necesarias para el proyecto
const api_key = '0a4152f4c6c97f8b7bf8addbb6f0fdbf';
const api_url_discover = 'https://api.themoviedb.org/3/discover/movie?language=es&api_key=' + api_key;
const api_url_toprated = 'https://api.themoviedb.org/3/movie/top_rated?language=es&api_key=' + api_key;
const api_url_popular = 'https://api.themoviedb.org/3/movie/popular?language=es&api_key=' + api_key;
const api_url_upcoming = 'https://api.themoviedb.org/3/movie/upcoming?language=es&api_key=' + api_key;
const api_url_nowplaying = 'https://api.themoviedb.org/3/movie/now_playing?language=es&api_key=' + api_key;
const api_login = 'https://fakestoreapi.com/auth/login';
const api_search = 'https://api.themoviedb.org/3/search/movie?language=es&api_key=' + api_key + '&query=';

//Variables de almacenamiento de peliculas
let jsonpeliculas;
let arrayCarrito = [];

//Primer valor de la paginacion
let paginaActual = 1;

//Elementos del HTML
const section = document.getElementById('products-container');
const detailsection = document.getElementById('product-details');
const loginsection = document.getElementById('loginmodal');
const userInput = document.getElementById('username');
const passInput = document.getElementById('password');
//Inicializacion del servicio de correo;
emailjs.init("Y-VvEUGl418FwIHkA");

// Variable global para indicar si se está cargando una nueva página
let cargando = false;
//Variable de la api actual que estemos usando. De primeras sera la de discover
let apiactual = api_url_discover;

/*#################################################################################################################################
#################################################################################################################################
#################################################################################################################################
#################################################################################################################################
#################################################################################################################################
#################################################################################################################################
#################################################################################################################################
#################################################################################################################################
#################################################################################################################################*/


//mor_2314 83r5^_
cargarEventos();
main(apiactual);
  