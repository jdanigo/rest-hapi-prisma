import Hapi from '@hapi/hapi'
import { Prisma } from '@prisma/client'

const productosPlugin = {
  name: 'app/productos',
  dependencies: ['prisma'],
  register: async function (server: Hapi.Server) {
      server.route([
        {
          method: 'GET',
          path: '/productos',
          handler: getFN,
        },
        {
          method: 'POST',
          path: '/productos',
          handler: postFN,
        },
      ])
  },
}

export default productosPlugin

async function postFN(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { prisma } = request.server.app
  const { nombre, precio, categoriaId } = request.payload as any

  try {
    const result = await prisma.productos.create({
      data:{
        nombre,
        precio,
        categoriaId
      }
    })
    return h.response(result).code(200);
  } catch (error) {
    console.log(error);
  }

}

async function getFN(request: Hapi.Request,h: Hapi.ResponseToolkit,) {
  const { prisma } = request.server.app

  try {
    const result = await prisma.productos.findMany({
      include: {
        categoria: true
      }
    })
    return h.response(result).code(200)
  } catch (err) {
    console.log(err)
  }
}