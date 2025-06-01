# API de Productos - FERREMAS (Express.js + Oracle)

Esta API permite gestionar los productos de la empresa FERREMAS, incluyendo operaciones de lectura, creación, actualización, eliminación y modificación parcial, conectándose a una base de datos Oracle mediante Express.js.

---

## 👥 Autores

- Jeison Padilla  
  📧 je.padilla@duocuc.cl

- Victoria Bahamondes  
  📧 vic.bahamondes@duocuc.cl

---

## 🧾 Requisitos para ejecutar esta API

1. Instalar **Node.js y npm**:  
   🔗 https://nodejs.org/

2. Instalar **Oracle Instant Client (Basic)** y agregarlo al `PATH`:  
   🔗 https://www.oracle.com/database/technologies/instant-client/winx64-64-downloads.html

3. Instalar **Visual C++ Redistributable**:  
   🔗 https://aka.ms/vs/17/release/vc_redist.x64.exe

---

## ✅ Configuración de Oracle Instant Client

⚠️ Esto no se instala con `npm install`. Debes:

- Tener descomprimido el Instant Client.
- Usar `oracledb.initOracleClient({ libDir: 'C:\ruta\a\instantclient' })`.
- Asegurarte de que esté agregado a la variable de entorno `PATH`.

---

## 🔧 Pasos para agregar Oracle Instant Client al PATH (Windows 10/11)

1. Verifica que la carpeta Instant Client tenga archivos como:
   - `oci.dll`
   - `oraociei23.dll`
   - `sqlplus.exe` (si descargaste herramientas extra)

   Ejemplo de ruta usada:  
   `C:\oraclexe\app\oracle\instantclient_23_8`

2. Pulsa **Win + S**, busca **"Variables de entorno"** → clic en **"Editar las variables de entorno del sistema"**  
   Luego clic en **"Variables de entorno..."**

3. En "Variables del sistema" busca la variable `Path`, haz clic en **Editar...**, luego **Nuevo**, y pega:  
   `C:\oraclexe\app\oracle\instantclient_23_8`

4. Guarda todo con **Aceptar** y **reinicia** tu equipo o cierra/reabre tu terminal o editor.

5. Verifica con:  
   `echo %PATH%`  
   Deberías ver tu ruta del Instant Client listada.

---

## ⚙️ Crear API por primera vez

```bash
cd ruta_donde_quieres_la_carpeta_De_api
mkdir nombre_carpeta_api
cd nombre_carpeta_api
npm init -y
code .
npm install express
touch index.js
```

---

## 🚀 Levantar la API

```bash
npm run dev
```

Luego abre tu navegador y entra a:  
`http://localhost:3000/productos`

Para detener la API:  
Presiona `CTRL + C` en la terminal.

---

## 🔐 Configurar conexión a Oracle

En tu archivo `index.js`, edita los valores en:

```js
const dbConfig = {
  user: 'tu_usuario',
  password: 'tu_contraseña',
  connectString: 'localhost/ tu service_name'
}

oracledb.initOracleClient({
  libDir: 'C:\oraclexe\app\oracle\instantclient_23_8'
})
```

---

## 📥 Bajar proyecto desde GitHub

En SQL Developer, con el usuario `system`:

```sql
DROP USER nombre_usuario CASCADE;
ALTER SESSION SET "_ORACLE_SCRIPT"=TRUE;
CREATE USER nombre_usuario IDENTIFIED BY clave_usuario;
GRANT CONNECT, RESOURCE, DBA TO nombre_usuario;
```

Luego:

```bash
cd carpeta_donde_guardar_el_proyecto
git clone link_del_repo
cd nombre_carpeta
npm install
code .
```

---

## ⬆️ Subir proyecto a GitHub por primera vez

```bash
git config --global user.name "Nombre"
git config --global user.email "correo@duocuc.cl"
git init
git add .
git commit -m "1 - mensaje del commit"
git branch -m main
git remote add origin link_de_github
git push -u origin main
```

---

## 📤 Subir cambios posteriores a GitHub

```bash
git add .
git commit -m "2 - mensaje del commit"
git push
```

---

## 📌 Encontrar puerto y service_name de Oracle

1. Abre el disco C.
2. Entra en la carpeta `Oracle` (según dónde lo instalaste).
3. Busca un archivo llamado `tnsnames.ora`.
4. Abre el archivo y verás algo como:

```
XE =
  (DESCRIPTION =
    (ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT = 1521))
    (CONNECT_DATA =
      (SERVER = DEDICATED)
      (SERVICE_NAME = XE)
    )
  )
```

---

## 📦 Dependencias instaladas

- `express`
- `oracledb`
- `cors`
- `nodemon`

---

## 📌 Endpoints disponibles

- `GET /productos`: Lista todos los productos
- `POST /productos`: Agrega un producto
- `PUT /productos/:id`: Modifica todos los atributos de un producto
- `DELETE /productos/:id`: Elimina un producto
- `PATCH /productos/:id`: Modifica un solo atributo
- `GET /status`: Verifica si la API está funcionando