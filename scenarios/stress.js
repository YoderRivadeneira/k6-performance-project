import http from "k6/http";
import { check } from "k6";

export const options = {
    stages: [
        { duration: '30s', target: 5 }, // sube a 5 VUs
        { duration: '1m', target: 20 }, // sube a 20 VUs
        { duration: '30s', target: 0 }, // baja a 0 VUs
    ],
};

export default function () {
    const res = http.get("https://petstore.swagger.io/v2/pet/findByStatus?status=available");
    check(res, { "Consulta mascotas": (r) => r.status === 200 });
}