/// ── DATOS Y VARIABLES

const usuario = {
    email: "admin@atm.com",
    contraseña: "123456"
}

const productos = [
    {
        id: 1,
        nombre: "Vaso Cafetero Doble Pico",
        precio: 19500,
        precioOriginal: 23000,
        imagen: "vasocafeterodoblepico.png",
        envioGratis: true
    },
    {
        id: 2,
        nombre: "Mate Listo 1Lt",
        precio: 23800,
        precioOriginal: 28000,
        imagen: "matelisto.png",
        envioGratis: true
    },
    {
        id: 3,
        nombre: "Vaso Cafetero 500Ml",
        precio: 19500,
        precioOriginal: 23000,
        imagen: "vasoCafetero.jpeg",
        envioGratis: true
    },
    {
        id: 4,
        nombre: "Termo Stanley 1.2Lt",
        precio: 25000,
        precioOriginal: 30000,
        imagen: "termoStanley.png",
        envioGratis: true
    },
    {
        id: 5,
        nombre: "Mate de Calabaza",
        precio: 15300,
        precioOriginal: 18000,
        imagen: "mateCalabaza.png",
        envioGratis: true
    },
    {
        id: 6,
        nombre: "Termo 1Lt + Mate de Acero",
        precio: 34000,
        precioOriginal: 40000,
        imagen: "termo1ltymate.jpeg",
        envioGratis: true
    },
    {
        id: 7,
        nombre: "Vaso con Temporizador",
        precio: 23800,
        precioOriginal: 28000,
        imagen: "vasoTemporizador.png",
        envioGratis: true
    },
    {
        id: 8,
        nombre: "Mate Imperial",
        precio: 25500,
        precioOriginal: 30000,
        imagen: "mateImperial.png",
        envioGratis: true
    }
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

/// ── SELECTORES DEL DOM

const formulario = document.getElementById("loginForm");
const botonesAgregar = document.querySelectorAll(".btn-agregar");
const buscador = document.getElementById("buscador");

/// ── FUNCIONES

function validarUsuario(email, contraseña) {
    return email === usuario.email && contraseña === usuario.contraseña;
}

function estaLogueado() {
    return localStorage.getItem("logged") === "true";
}

function actualizarBadge() {
    const badge = document.getElementById("cart-badge");
    if (!badge) return;
    const carritoDB = JSON.parse(localStorage.getItem("carrito")) || [];
    const total = carritoDB.reduce((acc, p) => acc + p.cantidad, 0);
    badge.textContent = total;
    badge.style.display = total === 0 ? "none" : "";
}

function agregarAlCarrito(idProducto) {
    const producto = productos.find(p => p.id === idProducto);
    const productoEnCarrito = carrito.find(p => p.id === idProducto);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarBadge();
}

function mostrarCarrito() {
    const contenedorCarrito = document.getElementById("contenedorCarrito");
    const carritoLleno = document.getElementById("carritoLleno");
    const carritoVacio = document.getElementById("carritoVacio");

    carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    if (!contenedorCarrito || !carritoLleno || !carritoVacio) return;

    if (carrito.length === 0) {
        carritoVacio.classList.remove("d-none");
        carritoLleno.classList.add("d-none");
    } else {
        carritoVacio.classList.add("d-none");
        carritoLleno.classList.remove("d-none");
    }

    contenedorCarrito.innerHTML = "";

    carrito.forEach(producto => {
        contenedorCarrito.innerHTML += `
            <div class="col-lg-12">
                <div class="card shadow-sm mb-4">
                    <div class="row g-0 align-items-center">
                        <div class="col-md-3 text-center">
                            <img
                                src="${producto.imagen}"
                                class="img-fluid rounded-start p-3"
                                alt="${producto.nombre}">
                        </div>

                        <div class="col-md-5 p-3 text-center text-md-start">
                            <h5 class="card-title fw-bold mb-3">
                                ${producto.nombre}
                            </h5>

                            <p class="text-brand fw-semibold fs-4">
                                $${producto.precio}
                            </p>

                            <button
                                class="btn text-secondary text-decoration-underline btn-eliminar"
                                data-id="${producto.id}">
                                Eliminar
                            </button>
                        </div>

                        <div class="col-md-3 d-flex flex-column align-items-stretch align-items-md-center gap-2 p-3 p-md-4">

                            <select
                                class="form-select form-select-sm cantidad"
                                data-id="${producto.id}">

                                <option value="1" ${producto.cantidad === 1 ? "selected" : ""}>Cantidad: 1</option>

                                <option value="2" ${producto.cantidad === 2 ? "selected" : ""}>Cantidad: 2</option>

                                <option value="3" ${producto.cantidad === 3 ? "selected" : ""}>Cantidad: 3</option>

                                <option value="4" ${producto.cantidad === 4 ? "selected" : ""}>Cantidad: 4</option>

                                <option value="5" ${producto.cantidad === 5 ? "selected" : ""}>Cantidad: 5</option>

                            </select>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    const subtotalHTML = document.getElementById("cart-subtotal");
    const totalHTML = document.getElementById("cart-total");
    const countLabel = document.getElementById("cart-count-label");

    const subtotal = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    const totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0);
    const subtotalStr = `$${subtotal.toLocaleString("es-AR")}`;

    if (subtotalHTML) subtotalHTML.textContent = subtotalStr;
    if (totalHTML) totalHTML.textContent = subtotalStr;
    if (countLabel) countLabel.textContent = `(${totalItems} ${totalItems === 1 ? "producto" : "productos"})`;
}

/// ── EVENTOS — LOGIN

if (formulario) {
    localStorage.setItem("usuario", JSON.stringify(usuario));

    formulario.addEventListener("submit", function (e) {
        e.preventDefault();

        const emailInput = document.getElementById("loginEmail").value;
        const contraseñaInput = document.getElementById("loginContraseña").value;

        if (validarUsuario(emailInput, contraseñaInput)) {
            localStorage.setItem("logged", "true");
            new bootstrap.Modal(document.getElementById("modalExito")).show();
        } else {
            new bootstrap.Modal(document.getElementById("modalError")).show();
        }
    });
}

/// ── EVENTOS — CARRITO

if (window.location.pathname.includes("carrito.html")) {
    if (!estaLogueado()) {
        window.location.href = "login.html";
    }
}

botonesAgregar.forEach(boton => {
    boton.addEventListener("click", (e) => {
        e.preventDefault();

        if (!estaLogueado()) {
            window.location.href = "login.html";
            return;
        }

        agregarAlCarrito(Number(boton.dataset.id));
    });
});

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-eliminar")) {
        const id = Number(e.target.dataset.id);
        carrito = carrito.filter(p => p.id !== id);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
        actualizarBadge();
    }
});

document.addEventListener("change", (e) => {
    if (e.target.classList.contains("cantidad")) {
        const id = Number(e.target.dataset.id);
        const producto = carrito.find(p => p.id === id);

        if (producto) {
            producto.cantidad = Number(e.target.value);
            localStorage.setItem("carrito", JSON.stringify(carrito));
            mostrarCarrito();
            actualizarBadge();
        }
    }
});

mostrarCarrito();
actualizarBadge();

/// ── EVENTOS — BUSCADOR

if (buscador) {
    const productosDOM = document.querySelectorAll("#productos > div");
    const sinResultados = document.getElementById("sin-resultados");

    buscador.addEventListener("input", () => {
        const texto = buscador.value.toLowerCase().trim();
        let hayResultados = false;

        productosDOM.forEach((producto) => {
            const titulo = producto.querySelector(".card-title").textContent.toLowerCase();
            const visible = titulo.includes(texto);
            producto.style.display = visible ? "" : "none";
            if (visible) hayResultados = true;
        });

        sinResultados.style.display = hayResultados ? "none" : "block";
    });
}
