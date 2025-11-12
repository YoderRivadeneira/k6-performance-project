import http from "k6/http";
import { check } from "k6";

// Puedes parametrizar el estado aquí
const status = "available";

export const options = {
    vus: 1,
    iterations: 1,
};

export default function () {
    const url = `https://petstore.swagger.io/v2/pet/findByStatus?status=${status}`;
    
    // Realiza la consulta
    const res = http.get(url);

    check(res, {
        "Consulta exitosa": (r) => r.status === 200,
        "Recibe lista de mascotas": (r) => Array.isArray(JSON.parse(r.body)),
    });

    const pets = JSON.parse(res.body);

    // Muestra las primeras mascotas de la respuesta
    for (let i = 0; i < Math.min(3, pets.length); i++) {
        console.log(`ID: ${pets[i].id} | Nombre: ${pets[i].name} | Estado: ${pets[i].status}`);
    }

    console.log(`Total mascotas recibidas (estado=${status}): ${pets.length}`);
}