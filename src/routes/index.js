import { Router } from 'express'
import express from 'express'
import mysql from 'mysql';
import LoginControl from '../controllers/LoginControl.js';
import app from '../index.js';
import session from 'express-session';

const router = express.Router()  //Enrutador para las rutas



//Conexion
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodelogin'
  });
  
  
  
  

router.get('/', (req, res) => res.render('index.ejs',{ title: 'MathPrimaryInteractiveWebsite'}))

router.get('/usuarioNR', (req, res) => res.render('usuarioNR.ejs',{title: 'UsuarioNoRegistrado'}))

router.get('/login', (req, res) => res.render('login.ejs',{title: 'Ingreso'}))

router.get('/usuarioR', (req, res) => res.render('usuarioR.ejs',{title: 'UsuarioRegistrado'}))

router.get('/reglas', (req, res) => res.render('reglas.ejs',{title: 'Reglas'}))

router.get('/contacto', (req, res) => res.render('contacto.ejs',{title: 'Contacto'}))

router.get('/reglasGame', (req, res) => res.render('reglasGame.ejs',{title: 'ReglasJuego'}))

router.get('/administrador', (req, res) => {
  const query = 'SELECT * FROM registro';

  connection.query(query, (error, results) => {
    if (error) {
      console.error(`Error al obtener los datos de la base de datos: ${error}`);
      res.status(500).json({ error: 'Error en el servidor.' });
    } else {
      const totalRegistros = results.length;      //Cantidad de datos


      res.render('administrador', { datos: results, totalRegistros});
    }
  });
});



/*let totalIngresos = 0;                // Ingresos a la pagina Web
      for (const registro of results) {       //NO IMPLEMENTADA
        totalIngresos += registro.num_ingresos;
      }*/
//Obtenemos datos base datos

router.get('/login',LoginControl.login);
router.get('/usuarioNR',LoginControl.register);
//router.get('/administrador',LoginControl.graficaFrecuenciaCorreos);
router.post('/login',LoginControl.auth);
router.post('/usuarioNR',LoginControl.storeUser);

//router.post('/usuarioNR',LoginControl.agregarRegistro);

//Funciones Moda


export default router 