const deliveryStatus = ["ordered", "packed", "shipped", "delivered"]
const publicRoutes = [
    {
        baseUrl: '/api/v1/product',
        method : 'GET'
    }
]
module.exports = {ADMIN:"admin",
SELLER:"seller",
USER:"user",
PUBLIC : "public",
publicRoutes,
deliveryStatus}
