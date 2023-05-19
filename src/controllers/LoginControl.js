import express from 'express';
import bodyParser from 'body-parser';
import bcrypt, { hash, compare } from 'bcrypt';
import mysql from 'mysql'; 
import {Chart} from 'chart.js';



const router = express.Router();
const jsonParser = bodyParser.json();
//const pool= require('nodelogin');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  port:3306,
  database: 'nodelogin', 
});

function login(req,res){
    res.render('views/login');
    console.log('Si entro al metodo login')
}

async function comparePasswords(password, hashedPassword) {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    throw new Error('Error al comparar las contraseñas.');
  }
}

async function auth(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  
  const emailQuery = 'SELECT COUNT(*) AS count FROM registro WHERE email = ?';
  const passwordQuery = 'SELECT password FROM registro WHERE email = ?';

  try {
    const emailResults = await new Promise((resolve, reject) => {
      connection.query(emailQuery, [email], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    const count = emailResults[0].count;
    const emailExists = count > 0;

    if (emailExists) {
      const passwordResults = await new Promise((resolve, reject) => {
        connection.query(passwordQuery, [email], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });

      const hashedPassword = passwordResults[0].password;
      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (passwordMatch) {
        console.log('El correo y la contraseña coinciden.');

        if (email === 'NicolasAdmin@hotmail.com' && password === '1234') {
          // Si el correo y la contraseña coinciden con el administrador
          res.redirect('/administrador');
        } else {
          // Si el correo y la contraseña coinciden, pero no son del administrador
          res.redirect('/reglasGame');
        }
      } else {
        console.log('La contraseña no coincide.');
        const mensaje = 'La contraseña no coincide, ingrésala nuevamente.';
        res.render('login', { error: mensaje });
      }
    } else {
      console.log('El correo no existe en la base de datos.');
      const mensaje = 'El correo no corresponde, por favor ingrésalo nuevamente.';
      res.render('login', { error: mensaje });
    }
  } catch (error) {
    console.error(`Error al ejecutar la consulta: ${error}`);
    res.status(500).json({ error: 'Error en el servidor.' });
  }
}





function register(req,res){
    res.render('views/usuarioNR');
}


// Esta función toma una función de callback como parámetro
const getConnection = (callback) => {
  connection.connect((err) => {
    if (err) {
      return callback(err);
    }
    callback(null, connection);
  });
};

function storeUser(req,res){
  const data=req.body;
  bcrypt.hash(data.password,12).then(hash =>{
      data.password = hash;
      console.log(data);
      const name= data.name;
      const apellido= data.apellido;
      const email= data.email;
      const password= data.password;
      const sql = "INSERT INTO registro (name,apellido,email,password) VALUES (?, ?, ?, ?)";
      getConnection((err, connection) => {
        if (err) throw err;
        connection.query(sql, [name, apellido, email, password], (err, result) => {
          if (err) {
            throw err;
          }
          console.log("Nuevo registro agregado a la base de datos");
          res.redirect('/reglasGame');
        });
      });
    });
  }


// Agregar el middleware de análisis del cuerpo (body-parser)
router.use(jsonParser);
//Nos muestra los datos escritos en el registro




 export default{
        login,
        register, 
        storeUser,
        auth,
        router
    }

