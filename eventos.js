
//Funcion que carga elementos HTML y le da su evento
function cargarEventos(){
    //Elementos y eventos del menu desplegable. Cada elemento del menu cargara la vista de la categoria seleccionada.
    const mejornotaElem = document.getElementById('mejornota');  
    mejornotaElem.addEventListener('click',function(){
        paginaActual = 1;
        apiactual = api_url_toprated;
        main(apiactual);

    })
    const popularElem = document.getElementById('popular');
    popularElem.addEventListener('click',function(){
        paginaActual = 1;
        apiactual = api_url_popular;
        main(apiactual);
    })
    const estrenosElem = document.getElementById('estrenos');
    estrenosElem.addEventListener('click',function(){
        paginaActual = 1;
        apiactual = api_url_nowplaying;
        main(apiactual);
    })
    const proximamenteElem = document.getElementById('proximamente');
    proximamenteElem.addEventListener('click',function(){
        paginaActual = 1;
        apiactual = api_url_upcoming;
        main(apiactual);

    })

    const discoverElem = document.getElementById('descubre');
    discoverElem.addEventListener('click',function(){
        paginaActual = 1;
        apiactual = api_url_discover;
        main(apiactual);
    })

    //Evento del scroll de la ventana que llama a la funcion que carga mas peliculas.
    window.addEventListener('scroll', async () => {
        await cargarMasPeliculas(apiactual);
    });
    
    //Evento de la carga en la que se comprueba si hay sesion de usuario y de carrito
    window.addEventListener('load',function(){
        var token = localStorage.getItem('token');
        if (token) {
            console.log('Ya hay un usuario');
        } else {
            showLogin();
        }

        var carro = localStorage.getItem('carrito');
        if(carro){
            arrayCarrito = JSON.parse(carro);
        }
    });
    
    //Boton para logearse. Llama a la funcion login.
    const loginbt = document.getElementById('loginbutton');
    loginbt.addEventListener('click' ,function(){
        let username = userInput.value;
        let passwd = passInput.value;
        login(username,passwd);
    })
    
    //Boton para deslogearse. Llama a la funcion logout.
    const logoutbt = document.getElementById('logoutbutton');
    logoutbt.addEventListener('click',logout);
    
    //Evento al pulsar el carrito. Carga la vista de la tabla con las peliculas en arrayCarrito
    const carrito = document.getElementById('carrito');
    const carritomodal = document.getElementById('carritomodal');
    carrito.addEventListener('click',function(){
        limpiarTabla();
        let tabla = document.getElementById('tabla');
        for (let i = 0; i < arrayCarrito.length;i++){
            let fila = document.createElement('tr');
            let casillaNombre = document.createElement('td');
            let casillaCantidad = document.createElement('td');
            let casillaPrecio = document.createElement('td');
            let casillaBotones = document.createElement('td');
            let buttonadd = document.createElement('button');
            let buttonremove = document.createElement('button');
            
            casillaBotones.appendChild(buttonadd);
            casillaBotones.appendChild(buttonremove);
            fila.appendChild(casillaNombre);
            fila.appendChild(casillaCantidad);
            fila.appendChild(casillaPrecio);
            fila.appendChild(casillaBotones);

            casillaNombre.textContent = arrayCarrito[i].title;
            casillaCantidad.textContent = arrayCarrito[i].cantidad;
            casillaPrecio.textContent = arrayCarrito[i].cantidad * arrayCarrito[i].precio + '€';
            buttonadd.textContent = '+';
            buttonremove.textContent = '-';
            
            //Eventos de los botones de la tabla, que añaden o quitan cantidad de peliculas
            buttonadd.addEventListener('click',function(){
                arrayCarrito[i].cantidad++;
                casillaCantidad.textContent = arrayCarrito[i].cantidad;
                casillaPrecio.textContent = arrayCarrito[i].cantidad * 5 + '€';
            });
            buttonremove.addEventListener('click',function(){
                arrayCarrito[i].cantidad--;
                if(arrayCarrito[i].cantidad == 0){
                    tabla.removeChild(fila);
                    quitarPeliculaCarrito(arrayCarrito[i].id);
                }
                casillaCantidad.textContent = arrayCarrito[i].cantidad;
                casillaPrecio.textContent = arrayCarrito[i].cantidad * 5 + '€';
            });

            tabla.appendChild(fila);
        }
        
        carritomodal.style.display ='flex';
    });

    //Evento para salir del carrito.
    const carritoclose = document.getElementById('carritomodalClose');
    carritoclose.addEventListener('click',function(){
        carritomodal.style.display = 'none';
    })

    //Evento del boton que manda la factura al email. LLama a la funcion enviarCorreo
    const sendemail = document.getElementById('sendemail');
    sendemail.addEventListener('click',function(){
        if(arrayCarrito.length != 0){
            let email = prompt('Introduzca el email al que se enviara la factura');
            enviarCorreo(email,arrayCarrito);
        }else{
            alert('No hay peliculas en el carrito');
        }
        
    })

    //Evento del input de buscar que actualiza la api en el onchange.
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input',function(){
        paginaActual = 1;
        if(searchInput.value == ''){
            apiactual = api_url_discover;
            main(apiactual);
        }else{
            let query = searchInput.value;
            apiactual = api_search + query;
            main(apiactual);
        }
        
        
    });
}