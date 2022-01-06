import Hapi from '@hapi/hapi'
import { Prisma } from '@prisma/client'

const ordenesPlugin = {
  name: 'app/ordenes',
  dependencies: ['prisma'],
  register: async function (server: Hapi.Server) {
    server.route([
      {
        method: 'GET',
        path: '/ordenes',
        handler: getFN,
      },
      {
        method: 'POST',
        path: '/ordenes',
        handler: postFN,
      },
    ])
  },
}

export default ordenesPlugin

async function postFN(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { prisma } = request.server.app
  const { total, direccion, usuarioId, items } = request.payload as any
  try {

    const prismaResult =  await prisma.$transaction(async (prisma) => {
      // Disminuir el saldo del usuario
      const resultUsuario = await prisma.usuarios.update({
        data: {
          balance: {
            decrement: total
          }
        },
        where: {
          id: usuarioId
        }
      })
      // Comprobar que el usuario tenga balance suficiente
      if (resultUsuario.balance < 0) {
        throw new Error(`No tiene saldo suficiente para hacer la orden por valor de ${total} su saldo actual es de ${resultUsuario.balance + total}`)
      }
      // Crear el registro de la transaccion fromUsuario
      await prisma.transacciones.create({
        data: {
          tipo: "Egreso",
          usuarioId: usuarioId,
          monto:total
        }
      })
      const result = await prisma.ordenes.create({
        data: {
          total,
          direccion,
          usuarioId,
          items: {
            create: items
          }
        }
      })
      return result;

    });
    return h.response(prismaResult).code(200);
  } catch (error: any) {
    let errorData = {
      statusCode: 400,
      msg: error.message
    }
    return h.response(errorData).code(400);
  }

}

async function getFN(request: Hapi.Request, h: Hapi.ResponseToolkit,) {
  const { prisma } = request.server.app

  try {
    const result = await prisma.ordenes.findMany({
      include: {
        items: {
          include: {
            producto: {
              include: {
                categoria: true
              }
            }
          }
        },
        usuario: true
      },
    })
    return h.response(result).code(200)
  } catch (err) {
    
    let errorData = {
      statusCode: 400,
      msg: err
    }
    console.log(JSON.stringify(err));
    return h.response(errorData).code(400);
  }
}