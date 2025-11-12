import http from "k6/http";
import { check } from "k6";
import { parse } from "https://jslib.k6.io/papaparse/5.1.1/index.js";

// Cargar usuarios
const csvData = open("../data/users.csv");
const users = parse(csvData, { header: true }).data;

export const options = {
    vus: 1,
    iterations: users.length,
};

export default function () {
    const user = users[__ITER];

    const url = `https://petstore.swagger.io/v2/user/login?username=${user.username}&password=${user.password}`;

    // Ejecutar login
    const res = http.get(url);

    check(res, {
        "Login exitoso": (r) => r.status === 200,
        "SessionId recibido": (r) => r.body.includes("message"),
    });

    console.log(`Status: ${res.status} | Usuario: ${user.username} | Body: ${res.body}`);
}