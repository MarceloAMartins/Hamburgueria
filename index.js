const express = require("express")
const uuid = require("uuid")

const app = express()
const port = "3000"
app.use(express.json())


const orders = []

const returnMetod = (request, response, next) =>{
    console.log(request.url, request.method);
    next()

}

const chekOrderId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(orders => orders.id === id)

    if (index < 0) {
        return response.status(404).json({ error: "order not found" })
    }

    request.OrderIndex = index
    request.OrderId= id

    next()
}


app.get('/orders', returnMetod,(request, response) => {

    return response.json(orders)
})

app.post("/orders", returnMetod,(request, response) => {
    const { order, ClientName, price, status } = request.body

    const orde = { id: uuid.v4(), order, ClientName, price, status }

    orders.push(orde)

    return response.status(201).json(orde)
})



app.put('/orders/:id', chekOrderId, returnMetod, (request, response) => {
    const { order, ClientName, price, status } = request.body
    const index = request.OrderIndex
    const id= request.OrderId

    const updateOrder = { id, order, ClientName, price, status }
    orders[index] = updateOrder

    return response.json(updateOrder)
})

app.delete('/orders/:id', chekOrderId, returnMetod,(request, response) => {
    const index = request.OrderIndex

    orders.splice(index, 1)

    return response.status(204).json()
})

app.listen(port, () => {
    console.log(`🚀server starter on port ${port}`)
})
