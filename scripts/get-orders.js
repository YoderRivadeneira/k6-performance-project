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
    const url = `https://petstore.swagger.io/v2/store/order/${order.id}`;

    // Consulta la orden por su id
    const res = http.get(url);

check(res, {
    "Consulta exitosa de orden": (r) => r.status === 200 || r.status === 404,
    "Recibe id correcto o 'Order not found'": (r) => {
        if (r.status === 200) {
            try {
                const obj = JSON.parse(r.body);
                return obj.id == order.id;
            } catch (e) { return false; }
        } else if (r.status === 404) {
            return r.body.includes("Order not found");
        }
        return false;
    },
});

    console.log(`Status: ${res.status} | ID Orden: ${order.id} | Body: ${res.body}`);
}