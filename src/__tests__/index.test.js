import { app } from '../app.js'
import supertest from "supertest"
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const request = supertest(app)

// Describing the test suite purposes: which behaviors of our applications are tested.
describe("Just trying out Jest and making sure it's all good", () => {

    // We are individually describing the purpose of this single test
    it("should test that true is true", () => {
        expect(true).toBe(true);
    })

    test("that false is not true", () => {
        expect(false).not.toBe(true);
    })
})

describe("Testing the endpoints for our express app", () => {

    beforeAll((done) => {
        mongoose.connect(process.env.MONGO_URL + '/test', { useNewUrlParser: true }, () => {
            console.log("Connected to Mongo")
            done()
        })
    })

    it("should test that the /test endpoint returns a success message", async() => {
        const response = await request.get("/test")

        expect(response.body.message).toBe("Test success!")
    })

    const validProduct = {
        name: "Test Product",
        price: 100
    }

    const invalidProduct = {
        name: "Invalid Product",
    }

    it("should test that the POST /products doesn't work with wrong product data", async() => {
        const response = await request.post("/products").send(invalidProduct)

        expect(response.status).toBe(400)
    })

    let createdProductId
    it("should test that the POST /products actually creates a product", async() => {
        const response = await request.post("/products").send(validProduct)

        expect(response.body._id).toBeDefined()

        createdProductId = response.body._id
    })

    it("should test that the GET /products/:id actually returns our product", async() => {
        const response = await request.get(`/products/${createdProductId}`)

        expect(response.body.name).toBe(validProduct.name)
    })

    it("should test that the GET /products/:id returns 404 on a non-existent product", async() => {
        const response = await request.get("/products/123456123456123456123456")

        expect(response.status).toBe(404)
    })

    // DELETE test

    it("should test that the DELETE /products/:id returns 404 on a non-existent product", async() => {
        const randomId = Math.floor(Math.random() * (20000000000 - 10000000201)) + 10000000201;
        const response = await request.delete(`/products/${randomId}`)

        expect(response.status).toBe(404)
    })

    it("should test that the DELETE /products/:id actually returns our product", async() => {
        const response = await request.delete(`/products/${createdProductId}`)

        expect(response.status).toBe(204)
    })

    //  PUT TEST

    it("should test that the PUT /products/:id returns 404 on a non-existent product", async() => {
        const randomId = Math.floor(Math.random() * (20000000000 - 10000000201)) + 10000000201;
        const response = await request.put(`/products/${randomId}`)

        expect(response.status).toBe(404)
    })

    it("should test that the PUT /products/:id actually returns our product", async() => {
        const response = await request.put(`/products/${createdProductId}`)

        expect(response.status).toBe(204)
    })



    afterAll(done => {
        mongoose.connection.dropDatabase()
            .then(() => {
                return mongoose.connection.close()
            })
            .then(() => {
                done()
            })
    })

})


// When retrieving the /products/:id endpoint:
//  expect requests to be 404 with a non-existing id   OK
//  expect requests to return the correct product with a valid id  OK
// When deleting the /products/:id endpoint:
//  expect successful 204 response code  OK
//  expect 404 with a non-existing id   OK
// When updating a /product/:id endpoint with new data:
//  expect requests to be accepted.  
//  expect 404 with a non-existing id
// Expect the response.body.name to be changed
// Expect the typeof name in response.body to be “string”