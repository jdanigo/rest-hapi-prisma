import Hapi from '@hapi/hapi'
import { Prisma } from '@prisma/client'

const usersPlugin = {
  name: 'app/usuarios',
  dependencies: ['prisma'],
  register: async function (server: Hapi.Server) {
      server.route([
        {
          method: 'POST',
          path: '/usuarios',
          handler: postUsuarios,
        },
      ]),
      server.route([
        {
          method: 'GET',
          path: '/usuarios',
          handler: getUsuarios,
        },
        {
          method: 'GET',
          path: '/usuarios/{usuarioId}',
          handler: getUsuariosById,
        },
      ])
  },
}

export default usersPlugin

async function postUsuarios(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { prisma } = request.server.app
  const { nombre, correo, balance } = request.payload as any

  try {
    const result = await prisma.usuarios.create({
      data:{
        nombre,
        correo,
        balance
      }
    })
    return h.response(result).code(200);
  } catch (error) {
    console.log(error);
  }

}

async function getUsuarios(request: Hapi.Request,h: Hapi.ResponseToolkit,) {
  const { prisma } = request.server.app

  try {
    const usuarios = await prisma.usuarios.findMany({
      include: {
        ordenes: true,
        transacciones: true,
      }
    })
    return h.response(usuarios).code(200)
  } catch (err) {
    console.log(err)
  }
}

async function getUsuariosById(request: Hapi.Request,h: Hapi.ResponseToolkit,) {
  const { prisma } = request.server.app
  const usuarioId = Number(request.params.usuarioId)
  const result = await prisma.usuarios
  .findMany({
    where: {
      id: usuarioId,
    },
    include: {
      ordenes: true,
      transacciones: true,
    }
  })
  return h.response(result).code(200);
}