import express from 'express';
import { ProductModel } from './model.js';


const productsRouter = express.Router();

productsRouter
    .post('/', async(req, res) => {

        try {

            if (!req.body.name || !req.body.price) {
                return res.status(400).send()
            }

            const newProduct = new ProductModel(req.body)
            await newProduct.save()

            res.send(newProduct)
        } catch (error) {
            console.log(error)
            res.status(500).send()
        }
    })

.get("/:id", async(req, res) => {
    const product = await ProductModel.findById(req.params.id)

    if (!product) {
        res.status(404).send()
    } else res.send(product)
})

.delete("/:id", async(req, res) => {
    const product = await ProductModel.findOneAndDelete(req.params.id)
    if (!product) {
        res.status(404).send()
    } else res.status(204).send()

})


.put("/:id", async(req, res) => {
    const product = await ProductModel.findOneAndUpdate(req.params.id, req.body)
    if (!product) {
        res.status(404).send()
    } else res.status(201).send(product)
})

export default productsRouter