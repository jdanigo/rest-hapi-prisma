import Hapi from '@hapi/hapi'
import { Prisma } from '@prisma/client'

const transaccionesPlugin = {
  name: 'app/transacciones',
  dependencies: ['prisma'],
  register: async function (server: Hapi.Server) {
    server.route([
      {
        method: 'GET',
        path: '/transacciones',
        handler: getFN,
      },
      {
        method: 'POST',
        path: '/transacciones/recargar',
        handler: postRecargarFN,
      },
      {
        method: 'POST',
        path: '/transacciones/transferir',
        handler: postTransferirFN,
      },
    ])
  },
}

export default transaccionesPlugin

async function postRecargarFN(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { prisma } = request.server.app
  const { monto, usuarioId } = request.payload as any;

  try {
    const prismaResult = await prisma.$transaction(async (prisma) => {
      // Aumentar el saldo al usuario
      const usuarioResult = await prisma.usuarios.update({
        data: {
          balance: {
            increment: monto
          }
        },
        where: {
          id: usuarioId
        }
      })
      // Crear el registro de la transaccion al usuario
      const transaccionesResult = await prisma.transacciones.create({
        data: {
          tipo: "Ingreso",
          usuarioId,
          monto
        },
        include: {
          usuario: true
        }
      })
      return transaccionesResult;
    })
    return h.response(prismaResult).code(200);

  } catch (error) {
    console.log("se ha presentado un error", error);
  }


}

async function postTransferirFN(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { prisma } = request.server.app
  const { monto, fromUsuario, toUsuario } = request.payload as any

  try {
    const prismaResult=  await prisma.$transaction(async (prisma) => {
      // Disminuir el saldo fromUsuario
      const resultFromUsuario = await prisma.usuarios.update({
        data: {
          balance: {
            decrement: monto
          }
        },
        where: {
          id: fromUsuario
        }
      })
      // Comprobar que fromUsuario tenga balance suficiente
      if (resultFromUsuario.balance < 0) {
        throw new Error(`${resultFromUsuario.nombre} No tiene saldo suficiente para enviar  ${monto}`)
      }
      // Crear el registro de la transaccion fromUsuario
      await prisma.transacciones.create({
        data: {
          tipo: "Egreso",
          usuarioId: fromUsuario,
          monto
        }
      })

      // Aumentar el saldo toUsuario
      const resultToUsuario = await prisma.usuarios.update({
        data: {
          balance: {
            increment: monto
          }
        },
        where: {
          id: toUsuario
        }
      })

      // Crear el registro de la transaccion toUsuariov
      await prisma.transacciones.create({
        data: {
          tipo: "Ingreso",
          usuarioId: toUsuario,
          monto
        }
      })
      return resultToUsuario;
    })
    return h.response(prismaResult).code(200);

  } catch (error) {
    console.log("se ha presentado un error", error);
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
    console.log(err)
  }
}