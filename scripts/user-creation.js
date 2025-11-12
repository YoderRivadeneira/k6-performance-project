import http from "k6/http";
import { check } from "k6";
import { parse } from "https://jslib.k6.io/papaparse/5.1.1/index.js";


// Cargar y parsear el archivo CSV
const csvData = open("../data/users.csv");
const users = parse(csvData, { header: true }).data;

export const options = {
    vus: 1,
    iterations: users.length,
};

export default function () {
    // Selecciona usuario para esta iteración
    const user = users[__ITER];
    const url = "https://petstore.swagger.io/v2/user";

    // Construye el payload según la API
    const payload = JSON.stringify({
        id: Number(user.id),
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        phone: user.phone,
        userStatus: 1
    });

    const params = {
        headers: { "Content-Type": "application/json" }
    };

    // Realiza la petición POST
    const res = http.post(url, payload, params);

    // Verifica la respuesta
    check(res, {
        "Registrado usuario correctamente": (r) => r.status === 200 || r.status === 201,
        "Respuesta contiene message": (r) => JSON.parse(r.body).message !== undefined,
    });

    // Imprime resultado en consola
    console.log(`Status: ${res.status} | Usuario: ${user.username} | Mensaje: ${res.body}`);
}