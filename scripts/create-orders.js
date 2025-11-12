import http from "k6/http";
import { check } from "k6";
import { parse } from "https://jslib.k6.io/papaparse/5.1.1/index.js";

// Cargar y parsear el archivo CSV de órdenes
const csvData = open("../data/orders.csv");
const orders = parse(csvData, { header: true }).data;

export const options = {
    vus: 1,
    iterations: orders.length,
};

export default function () {
    const order = orders[__ITER];

    const url = "https://petstore.swagger.io/v2/store/order";
    const payload = JSON.stringify({
        id: Number(order.id),
        petId: Number(order.petId),
        quantity: Number(order.quantity),
        status: order.status,
        complete: order.complete === "true"
    });

    const params = {
        headers: { "Content-Type": "application/json" }
    };

    // Realiza el POST para agregar la orden
    const res = http.post(url, payload, params);

    check(res, {
        "Orden creada correctamente": (r) => r.status === 200 || r.status === 201,
        "Respuesta contiene id": (r) => JSON.parse(r.body).id !== undefined,
    });

    console.log(`Status: ${res.status} | ID Orden: ${order.id} | PetID: ${order.petId} | Body: ${res.body}`);
}