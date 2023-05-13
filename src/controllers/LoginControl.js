import express from 'express';
import bodyParser from 'body-parser';
import bcrypt, { hash } from 'bcrypt';
import mysql from 'mysql'; 



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

function auth(req,res){  //verifica la contra y la sesion
  const data = req.body;
  getConnection((err, conn) =>{
    console.log(data.email);
    const email= data.email;
    conn.query('SELECT * FROM registro WHERE email = ?', [data.email], (err,userdata) => {  
      if(userdata.lenght > 0){
          console.log('Hello')
          res.redirect('/reglasGame') 
      }else{
          console.log('El usuario no existe');
          res.render('login.ejs', { error: 'El usuario no existe' });
      }
    });
  });
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




/*function agregarRegistro(req, res, connection) {
  const name = req.body.name;
  const apellido = req.body.apellido;
  const email = req.body.email;
  const password = req.body.password;

  // Consulta SQL para insertar un nuevo registro
  const sql = 'INSERT INTO registro (name, apellido, email, password) VALUES (?, ?, ?, ?)';
  connection.query(sql, [name, apellido, email, password], (err, result) => {
    if (err) {
      throw err;
    }
    console.log('Nuevo registro agregado a la base de datos');
    res.send('Registro agregado exitosamente');
  });
}
/*function resUsuario(req, res){
    const data = req.body;
    console.log(data);
    console.log('funciona');
    res.redirect('/');
}*/


 export default{
        login,
        register, 
        storeUser,
        auth,
        router
    }

