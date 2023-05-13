import express from 'express'
import {dirname, join} from 'path'
import {fileURLToPath } from 'url'
import bodyParser from 'body-parser';
import indexRoutes from './routes/index.js'
// Conexion back-base datos
import myconnection from 'express-myconnection';
import mysql from 'mysql'; 
import session from 'express-session';
import LoginControl from './controllers/LoginControl.js';



const app = express()
app.use(express.urlencoded({ extended: true }));
app.set('port',3006);

app.use(bodyParser.json());

const __dirname = dirname(fileURLToPath(import.meta.url)) //obtenemos la ruta absoluta 
app.set('views', join(__dirname,'views'))   //creamos la carpeta de la vistas de forma absoluta 
app.set('view engine','ejs') // permite agregar logica html con js
app.use(indexRoutes)

app.use(express.static(join(__dirname,'public')))

// middleware para procesar los datos del formulario
app.use(express.urlencoded({ extended: true })); //no funciona
app.use(express.json());

//
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  port:3306,
  database: 'nodelogin', 
});

// Se crea la conexion de tipo pool para que se agregen datos a la base de datos 
const pool = mysql.createPool(connection);
// configurar middleware para conexión de base de datos
app.use((req, res, next) => {
  req.getConnection = mysql.createConnection.bind(null, pool.config);
  next();
});


  
  connection.connect((error) => {
    if (error) {
      console.error('Error de conexión a la base de datos: ', error);
      return;
    }
    console.log('Conexión a la base de datos establecida');
  });
app.post('/agregar', (req, res) => {
    const nombre = req.body.name;
    const apellido = req.body.apellido;
    const email = req.body.email;
    const contrasena = req.body.password;
  
    // Consulta SQL para insertar un nuevo registro
    const sql = 'INSERT INTO registro (name, apellido, email, password) VALUES (?, ?, ?, ?)';
    connection.query(sql, [nombre, apellido, email, contrasena], (err, result) => {
      if (err) {
        throw err;
      }
      console.log('Nuevo registro agregado a la base de datos');
      res.send('Registro agregado exitosamente');
    });
  });
  
app.use((req, res, next) => {
    req.socket = connection;
    next();
  });

//SQL
app.use('/',LoginControl.router)

app.use('/',indexRoutes);



app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

app.listen(app.get('port'),()=>{
    console.log('Server is listening on port', app.get('port'));
})

export default app;
