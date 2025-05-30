const express = require('express')  //Esta es la librería que necesitamos
const oracledb = require('oracledb')  //Con esto puedo usar la librería para oracle
oracledb.initOracleClient({ libDir: 'C:\\oraclexe\\app\\oracle\\instantclient_23_8' }) // Usa la ruta donde descomprimiste
const app = express()  //Aqui creamos la variable de la API
const port = 3000  //Aqui le asignamos el puerto a la API
const dbConfig = {  //Aqui creamos los datos para la conexión con la BD
    user: 'integracion',   //Nombre usuario BD
    password: 'integracion',   //Clave usuario BD
    connectString: 'localhost/XE'  // aqui va localhost y después va el service_name
}

app.use(express.json())  //Con esto configuramos usos de la API, se pueden poner todos los que quiera

//Con esto levantaré la API
app.listen(port, () =>{  //Aqui puedo escribir el número de puerto directamente o poner "port que lo declaramos más arriba"
    console.log(`API está funcionando en puerto ${port}`)  //El simbolo "$" se usa para que reconozca que es una variable
})

//Ahora haré algunos endpoints:

//GET para listar los productos
app.get('/', (req, res) => {  //req es petición y res es respuesta
    res.status(200).json({  //Con esto le estoy diciendo que en codigo 200 arroje ese mensaje
        "mensaje": "Hola express"
    })
})

//GET para la conexión con BD
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
            error: ex.message
        })
    } finally{
        if (cone) await cone.close()  //Con esto cierro la conexión 
    }
})