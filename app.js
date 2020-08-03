// Importar a aplicação DENO
import { Application, Router } from 'https://deno.land/x/oak/mod.ts';

// Declarar as constantes
const env = Deno.env.toObject();
const PORT = env.PORT || 4000;
const HOST = env.HOST || '127.168.0.1';

// declarar a variavel da API
let dragons = [
    {
        name: 'Dracarys',
        age: 4,
    },
    {
        name: 'Rheagal',
        age: 4,
    },
];

// criação dos methodos de get/post/put/update/delete
export const getDragons = ({ response }) => {
    console.log('getDragons', dragons)
    response.body = dragons;
}

export const getDragon = ({ params, response }) => {
    const dragon = dragons.filter(dragon => dragon.name === params.name);
    if (dragon.length) {
        console.log('getDragon', dragon[0])
        response.status = 200;
        response.body = dragon[0];
        return
    }
    console.log('getDragon:Erro', params.name)
    response.status = 400
    response.body = { msg: `Não foi encontrado nemhum dragão com o nome de ${params.name}` }
}

export const addDragon = async ({ request, response }) => {
    const body = await request.body();
    const dragon = body.value;
    console.log('addDragon', dragon)
    dragons.push(dragon);

    response.body = { msg: `ok`, dragon };
    response.status = 200
}

export const updateDragon = async ({ params, request, response }) => {
    const temp = dragons.filter(dragon => dragon.name === params.name);

    const body = await request.body();
    const { age } = body.value;

    if (temp.length) {
        console.log('updateDragon', age)
        temp[0].age = age;
        response.satus = 200;
        response.body = { msg: "ok" }
        return
    }

    console.log('updateDragon:Error', age)
    response.body = { msg: `Dragão não encontrado` };
    response.status = 400
}

export const removeDragon = ({ params, response }) => {
    const lengthBefore = dragons.length;
    dragons = dragons.filter(dragon => dragon.name !== params.name);

    if (dragons.length === lengthBefore) {
        response.status = 400
        response.body = { msg: 'não foi encontrado o dragão para apagar!' }
        return
    }
    response.status = 200
    response.body = { msg: 'ok' }
}

// declara as rotas para cada methodo
const router = new Router();
router
    .get('/dragons', getDragons)
    .get('/dragons/:name', getDragon)
    .post('/dragons', addDragon)
    .put('/dragons/:name', updateDragon)
    .delete('/dragons/:name', removeDragon)

// Inicia a aplicação
const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Escutando ${HOST}:${PORT}`);

await app.listen(`${HOST}:${PORT}`)