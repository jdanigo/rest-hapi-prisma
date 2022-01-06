import Hapi from '@hapi/hapi'
import { Prisma } from '@prisma/client'

const categoriasPlugin = {
  name: 'app/categorias',
  dependencies: ['prisma'],
  register: async function (server: Hapi.Server) {
      server.route([
        {
          method: 'GET',
          path: '/categorias',
          handler: getFN,
        },
        {
          method: 'POST',
          path: '/categorias',
          handler: postFN,
        },
      ])
  },
}

export default categoriasPlugin;

async function postFN(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { prisma } = request.server.app
  const { nombre } = request.payload as any

  try {
    const result = await prisma.categorias.create({
      data:{
        nombre
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
    const result = await prisma.categorias.findMany({
      include: {
        productos: true,
      }
    })
    return h.response(result).code(200)
  } catch (err) {
    console.log(err)
  }
}