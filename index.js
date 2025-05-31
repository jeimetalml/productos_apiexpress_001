const express = require('express')  //Esta es la librería que necesitamos
const oracledb = require('oracledb')  //Con esto puedo usar la librería para oracle
const cors = require('cors')  //IMportamos cors

oracledb.initOracleClient({ libDir: 'C:\\oraclexe\\app\\oracle\\instantclient_23_8' }) // Usa la ruta donde descomprimiste el instant cliente

const app = express()  //Aqui creamos la variable de la API
const port = 3000  //Aqui le asignamos el puerto a la API

app.use(cors())  //Con esto activamos cors
app.use(express.json())  //Con esto configuramos usos de la API, se pueden poner todos los que quiera

const dbConfig = {  //Aqui creamos los datos para la conexión con la BD
    user: 'integracion',   //Nombre usuario BD
    password: 'integracion',   //Clave usuario BD
    connectString: 'localhost/XE'  // aqui va localhost y después va el service_name
}



//Con esto levantaré la API
app.listen(port, () =>{  //Aqui puedo escribir el número de puerto directamente o poner "port que lo declaramos más arriba"
    console.log(`API está funcionando en puerto ${port}`)  //El simbolo "$" se usa para que reconozca que es una variable
})

//Ahora haré algunos endpoints:

//GET para listar los productos conectado a BD
app.get('/productos', async (req, res) => { 
    let cone  //Creo una variable
    try{  //Esto es para controlar posibles errores
        cone = await oracledb.getConnection(dbConfig)  //aqui le digo que haga una conexión con oracle utilizando los datos de config que le di mas arriba
        const result = await cone.execute("SELECT * FROM productos")  //Esto es lo que devuelve después de hacer la conexión y aqui le doy el select que necesito de la BD
        res.json(result.rows.map(row =>({  //Acá le doy los atributos de productos
            id_producto: row[0], 
            ruta_imagen_producto: row[1], 
            nombre_producto: row[2], 
            descripcion_producto: row[3], 
            precio_producto: row[4]
        })))  //Aqui le digo que la respueten json vendra del resultado pero en listas y con map mapeo el resultado
    } catch (ex) {
        res.status(500).json({  //Con esto le digo que mande un error 500 de haber error
            error: "Error de servidor", detalle: ex.message
        })
    } finally{
        if (cone) await cone.close()  //Con esto cierro la conexión 
    }
})

//GET de prueba, para confirmar si la conexión está activa
app.get('/ping', async (req, res) => {
    let cone  //Creo una variable
    try {  //Esto es para controlar posibles errores
        cone = await oracledb.getConnection(dbConfig)  //aqui le digo que haga una conexión con oracle utilizando los datos de config que le di mas arriba
        const result = await cone.execute('SELECT 1 FROM dual')  //Esto es lo que devuelve después de hacer la conexión y aqui le doy el select que necesito de la BD
        res.status(200).json({  //Aca le digo que si funciona de un mensaje en respuesta a codigo 200
            mensaje: "Conexión a Oracle exitosa"
        })
    } catch (ex) {
        res.status(500).json({  //Con esto le digo que mande un error 500 de haber error
            error: "Error en conexión con Oracle", detalle: ex.message
        })
    } finally{
        if (cone) await cone.close()  //Con esto cierro la conexión
    }
})

//POST para agregar productos
app.post('/productos', async (req, res) => {
    const { id_producto, ruta_imagen_producto, nombre_producto, descripcion_producto, precio_producto } = req.body
    let cone  //CReo una variable
    try {  //Esto es para controlar posibles errores
        cone = await oracledb.getConnection(dbConfig)  //aqui le digo que haga una conexión con oracle utilizando los datos de config que le di mas arriba
        const result = await cone.execute(  //Esto es lo que devuelve después de hacer la conexión y aqui le doy el select que necesito de la BD y donde insertar los valores del nuevo producto
            `INSERT INTO productos (id_producto, ruta_imagen_producto, nombre_producto, descripcion_producto, precio_producto)
             VALUES (:id, :ruta, :nombre, :descripcion, :precio)`,
            {
                id: id_producto,
                ruta: ruta_imagen_producto,
                nombre: nombre_producto,
                descripcion: descripcion_producto,
                precio: precio_producto
            },
            { autoCommit: true }
        )
        res.status(201).json({
            mensaje: "Producto agregado correctamente"
        })  //Aca le digo que si funciona de un mensaje en respuesta a codigo 201
    } catch (ex) {
        res.status(500).json({
            error: "Error al agregar producto: ", detalle: ex.message
        })  //Con esto le digo que mande un error 500 de haber error
    } finally {
        if (cone) await cone.close()  //Con esto cierro la conexión
    }
})

//PUT para modificar todo el prducto
app.put('/productos/:id', async (req, res) => {
    const { id } = req.params
    const { ruta_imagen_producto, nombre_producto, descripcion_producto, precio_producto } = req.body
    let cone  //Creo una variable
    try {  //Esto es para controlar posibles errores
        cone = await oracledb.getConnection(dbConfig)  //aqui le digo que haga una conexión con oracle utilizando los datos de config que le di mas arriba
        const result = await cone.execute( //Esto es lo que devuelve después de hacer la conexión y aqui le doy los datos que necesito actualizar de la BD y donde insertar los valores de la modificación
            `UPDATE productos
             SET ruta_imagen_producto = :ruta,
                 nombre_producto = :nombre,
                 descripcion_producto = :descripcion,
                 precio_producto = :precio
             WHERE id_producto = :id`,
            {
                id,
                ruta: ruta_imagen_producto,
                nombre: nombre_producto,
                descripcion: descripcion_producto,
                precio: precio_producto
            },
            { autoCommit: true }
        )
        res.status(200).json({
            mensaje: "Producto modificado correctamente"
        })  //Aca le digo que si funciona de un mensaje en respuesta a codigo 200
    } catch (ex) {
        res.status(500).json({
            error: "Error al modificar producto: ", detalle: ex.message
        })  //Con esto le digo que mande un error 500 de haber error
    } finally {
        if (cone) await cone.close()  //Con esto cierro la conexión
    }
})

//DELETE para eliminar un producto
app.delete('/productos/:id', async (req, res) => {
    const { id } = req.params
    let cone  //Creo una variable
    try {  //Esto es para controlar posibles errores
        cone = await oracledb.getConnection(dbConfig)  //aqui le digo que haga una conexión con oracle utilizando los datos de config que le di mas arriba
        const result = await cone.execute(
            `DELETE FROM productos WHERE id_producto = :id`,  //Esto es lo que devuelve después de hacer la conexión y aqui le digo que eliminar
            [id],
            { autoCommit: true }
        )
        res.status(200).json({
            mensaje: "Producto eliminado correctamente"
        })  //Aca le digo que si funciona de un mensaje en respuesta a codigo 200
    } catch (ex) {
        res.status(500).json({
            error: "Error al eliminar producto: ", detalle: ex.message
        })  //Con esto le digo que mande un error 500 de haber error
    } finally {
        if (cone) await cone.close()  //Con esto cierro la conexión
    }
})

