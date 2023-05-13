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

//Obtenemos datos base datos

router.get('/login',LoginControl.login);
router.get('/usuarioNR',LoginControl.register);
router.post('/login',LoginControl.auth);
router.post('/usuarioNR',LoginControl.storeUser);

//router.post('/usuarioNR',LoginControl.agregarRegistro);

export default router