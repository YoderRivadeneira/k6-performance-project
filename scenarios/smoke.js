import exec from 'k6/execution';
import http from 'k6/http';
import { check } from 'k6';

export const options = {
    vus: 1,
    iterations: 1,
};

export default function () {
    // 1. Alta usuario
    const user = {
        id: Math.floor(Math.random() * 100000),
        username: `smokeUser${exec.vu.idInTest}`,
        firstName: 'Smoke',
        lastName: 'Test',
        email: `smoke${exec.vu.idInTest}@mail.com`,
        password: 'smokePwd',
        phone: '555-5555',
        userStatus: 1
    };
    let res = http.post('https://petstore.swagger.io/v2/user', JSON.stringify(user), {
        headers: { "Content-Type": "application/json" }
    });
    check(res, { "User creado": r => r.status === 200 });

    // 2. Login usuario
    res = http.get(`https://petstore.swagger.io/v2/user/login?username=${user.username}&password=${user.password}`);
    check(res, { "Login OK": r => r.status === 200 });

    // 3. Consulta mascotas disponibles
    res = http.get(`https://petstore.swagger.io/v2/pet/findByStatus?status=available`);
    check(res, { "Consulta mascotas": r => r.status === 200 });

    // 4. Crea una mascota
    const pet = {
        id: Math.floor(Math.random() * 1000000),
        name: "TestMascota",
        status: "available"
    };
    res = http.post('https://petstore.swagger.io/v2/pet', JSON.stringify(pet), {
        headers: { "Content-Type": "application/json" }
    });
    check(res, { "Mascota creada": r => r.status === 200 });

    // 5. Realiza una orden
    const order = {
        id: Math.floor(Math.random() * 1000000),
        petId: pet.id,
        quantity: 1,
        status: "placed",
        complete: true
    };
    res = http.post('https://petstore.swagger.io/v2/store/order', JSON.stringify(order), {
        headers: { "Content-Type": "application/json" }
    });
    check(res, { "Orden creada": r => r.status === 200 });

    // 6. Consulta orden creada
    res = http.get(`https://petstore.swagger.io/v2/store/order/${order.id}`);
    check(res, { "Consulta orden": r => r.status === 200 });
}