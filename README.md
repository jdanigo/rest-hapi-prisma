# API REST CON HAPI Y PRISMA.IO
  

## Pasos para ejecutar el proyecto

  

### 1. Clonar el repositorio

  

Abra una terminal y ejecute el siguiente comando
```
git clone https://github.com/jdanigo/rest-hapi-prisma
```

  

Instalar las dependencias

```
cd rest-hapi-prisma
npm install
```
  

### 2. Iniciar la migración de la base de datos

  

Ejecute el siguiente comando para crear la base de datos e importar algunos datos de ejemplo  

```
npx prisma migrate dev --name migracionInicial
npx prisma db seed
```

### 3. Iniciar el servidor

  

```
npm run dev
```

  

El servidor ahora se encuentra ejecutándose en la dirección `http://localhost:3000`.

  

## Usando el API REST

  

Ahora tiene acceso a la API REST con los siguientes endpoints:

### Usuarios  

### `GET`
 

-  `/usuarios/`: Devuelve todos los usuarios 
-  `/usuarios/{usuarioId}`: Devuelve un solo registro que esté relacionado con el parámetro `{usuarioId}`

### `POST`
 

-  `/usuarios`: Crea un nuevo usuario en la base de datos

- Body:

-  `nombre: String` (obligatorio)

-  `correo: String`(obligatorio) 

-  `balance: Int` (obligatorio)

### Categorias  

### `GET`
 

-  `/categorias/`: Devuelve todas las categorias 

### `POST`
 

-  `/categorias`: Crea una nueva categoria en la base de datos

- Body:

-  `nombre: String` (obligatorio)

### Productos  

### `GET`
 

-  `/productos/`: Devuelve todos los productos 

### `POST`
 

-  `/productos`: Crea un nuevo producto en la base de datos

- Body:

-  `nombre: String` (obligatorio)
-  `precio: Int` (obligatorio)
-  `categoriaId: Id` (obligatorio)

### Ordenes  

### `GET`
 

-  `/ordenes`: Devuelve todas las ordenes 

### `POST`
 

-  `/ordenes`: Crea una nueva orden de pedido, descontando el total del balance del usuario.

- Body:

-  `total: Int` (obligatorio)
-  `usuarioId: Int` (obligatorio)
-  `direccion: String` (obligatorio)
-  `items: Array` (obligatorio)
- - `productoId: Int` (obligatorio)

### Transacciones  

### `GET`
 

-  `/transacciones/`: Devuelve todas las transacciones 

### `POST`
 

-  `/transacciones/recargar`: Recarga saldo a la cuenta del usuario

- Body:

-  `monto: Int` (obligatorio)
-  `usuarioId: Int` (obligatorio)



-  `/transacciones/transferir`: Transfiere saldos entre usuarios.

- Body:

-  `monto: Int` (obligatorio)
-  `fromUsuario: Int` (obligatorio)
-  `toUsuario: Int` (obligatorio)