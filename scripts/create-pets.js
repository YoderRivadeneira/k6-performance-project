import http from "k6/http";
import { check } from "k6";
import { parse } from "https://jslib.k6.io/papaparse/5.1.1/index.js";

// Carga el archivo CSV con mascotas
const csvData = open("../data/pets.csv");
const pets = parse(csvData, { header: true }).data;

export const options = {
    vus: 1,
    iterations: pets.length,
};

export default function () {
    const pet = pets[__ITER];

    const url = "https://petstore.swagger.io/v2/pet";
    const payload = JSON.stringify({
        id: Number(pet.id),
        name: pet.name,
        status: pet.status,
        // Puedes agregar category, photoUrls o tags si quieres expandir el test
    });

    const params = {
        headers: { "Content-Type": "application/json" }
    };

    // Realiza el POST para crear la mascota
    const res = http.post(url, payload, params);

    check(res, {
        "Mascota creada exitósamente": (r) => r.status === 200 || r.status === 201,
        "Respuesta contiene id": (r) => JSON.parse(r.body).id !== undefined,
    });

    console.log(`Status: ${res.status} | Mascota: ${pet.name} | ID: ${pet.id} | Body: ${res.body}`);
}