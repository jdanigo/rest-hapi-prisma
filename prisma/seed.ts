import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const usuariosData: Prisma.UsuariosCreateInput[] = [
  {
    nombre: 'Jose Daniel Garcés',
    correo: 'tatanbmx@gmail.com',
    balance: 0,
    transacciones: {
      create: [
        {
          monto: 450000,
          tipo: "Ingreso",
        }
      ]
    }
  },
  {
    nombre: 'Pedro Nel Gomez',
    correo: 'nel@gmail.com',
    balance: 0,
    transacciones: {
      create: [
        {
          monto: 50000,
          tipo: "Ingreso",
        }
      ]
    }
  },
  {
    nombre: 'Juan Martinez',
    correo: 'martinez@gmail.com',
    balance: 0,
    transacciones: {
      create: [
        {
          monto: 87000,
          tipo: "Ingreso",
        }
      ]
    }
  },
]

const categoriasData: Prisma.CategoriasCreateInput[] = [
  {
    nombre: 'Discos Duros',
    productos: {
      create: [
        {
          nombre: "Disco Solido 120GB",
          precio: 120000,
        },
        {
          nombre: "Disco Solido 240GB",
          precio: 180000,
        },
        {
          nombre: "Disco Duro Mecánico 1TB",
          precio: 200000,
        }
      ]
    }
  },
  {
    nombre: 'Boards',
    productos: {
      create: [
        {
          nombre: "Board Gigabyte 15400",
          precio: 500000
        },
        {
          nombre: "Board Asus 3500",
          precio: 680000
        }
      ]
    }
  },
  {
    nombre: 'Monitores',
    productos: {
      create: [
        {
          nombre: "Monitor 22 Pulgadas Samsung - LED",
          precio: 380000
        },
        {
          nombre: "Monitor 31 Pulgadas Samsung - 4K",
          precio: 5750000
        },
      ]
    }
  },
]

async function main() {
  console.log(`Start seeding ...`)
  // Semilla de usuarios
  for (const u of usuariosData) {
    const result = await prisma.usuarios.create({
      data: u,
    })
    console.log(`Usuario creado con el id ${result.id}`)
  }
  // Semilla de categorias
  for (const u of categoriasData) {
    const result = await prisma.categorias.create({
      data: u,
    })
    console.log(`Usuario creado con el id ${result.id}`)
  }
  console.log(`Información de ejemplo completada.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
