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

//GET para obtener un producto por su ID
app.get('/productos/:id', async (req, res) => {
    const { id } = req.params  //Con esto capturo el ID desde la URL
    let cone  //Aqui creo una variable
    try {
        cone = await oracledb.getConnection(dbConfig)  //aqui le digo que haga una conexión con oracle utilizando los datos de config que le di mas arriba
        const result = await cone.execute("SELECT * FROM productos WHERE id_producto = :id", [id])  //Esto es lo que devuelve después de hacer la conexión y aqui le doy el select que necesito de la BD

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Producto no encontrado"
            })  //Con esto le digo que mande un error 400 de haber error
        }

        const row = result.rows[0]  //COn esto le digo que tome la primera fila
        res.json({
            id_producto: row[0],
            ruta_imagen_producto: row[1],
            nombre_producto: row[2],
            descripcion_producto: row[3],
            precio_producto: row[4]
        })  //Respuesta JSON con el producto encontrado
    } catch (ex) {
        res.status(500).json({ error: "Error al obtener producto", detalle: ex.message })  //Con esto le digo que mande un error 500 de haber error
    } finally {
        if (cone) await cone.close()  //COn esto cierro la conexión
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

//GET para verificar el estado de la API
app.get('/status', (req, res) => {
    res.status(200).json({  //Aca le digo que si funciona de un mensaje en respuesta a codigo 200
        status: "API de productos funcionando correctamente"  //Este es el mensaje que confirma que está activa
    })
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
    const { id } = req.params  //Con esto capturo el id que viene de la URL
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
    const { id } = req.params  //Con esto capturo el id que viene de la URL
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

//PATCH para modificar un solo atributo de productos
app.patch('/productos/:id', async (req, res) => {
    const { id } = req.params  //Con esto capturo el id que viene de la URL
    const campos = req.body  //Con esto capturo los datos que vienen en el body
    let cone  //Aqui creo una variable
    try {
        cone = await oracledb.getConnection(dbConfig)  //aqui le digo que haga una conexión con oracle utilizando los datos de config que le di mas arriba

        const camposKeys = Object.keys(campos)  //Con esto obtengo un arreglo con los nombres de los campos que vienen en el body
        if (camposKeys.length === 0) {
            return res.status(400).json({
                error: "No se envió ningún campo para actualizar"
            })
        }   //Con esto le digo que mande un error 500 de haber error

        const sets = camposKeys.map((key, index) => `${key} = :val${index}`).join(', ')  //con esto armo la parte de la BD que indica qué campos actualizar
        const values = camposKeys.map((key) => campos[key])  //COn esto obtengo los valores los campos
        values.push(id)  //Con esto agrego el id para usarlo en el where al final del arreglo

        const sql = `UPDATE productos SET ${sets} WHERE id_producto = :val${camposKeys.length}`  //Esto es lo que devuelve después de hacer la conexión y aqui le doy el dato que q quiero actualizar de la BD y donde insertar el valor de la modificación

        const result = await cone.execute(sql, values, { autoCommit: true })   //Con esto ejecuto la BD y confirmo los cambios automáticamente

        res.status(200).json({
            mensaje: "Producto modificado correctamente"
        })   //Aca le digo que si funciona de un mensaje en respuesta a codigo 200
    } catch (ex) {
        res.status(500).json({
            error: "Error al modificar producto: ", detalle: ex.message
        })   //Con esto le digo que mande un error 500 de haber error
    } finally {
        if (cone) await cone.close()  //Con esto cierro la conexión
    }
})

