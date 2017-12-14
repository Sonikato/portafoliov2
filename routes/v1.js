const express = require('express');
const router = express.Router();

var Client = require('node-rest-client').Client;
var client = new Client();
const moment = require('moment');
var cloudinary = require('cloudinary');
var multer = require('multer');
var upload = multer({ dest: './uploads' });




//controladores



router.get('/', (req, res) => {
    res.render('indexFinal');
});
router.get('/logout', function (req, res) {
    console.log(req.session.cuenta)
    req.session.destroy();
    res.redirect('/')
});
cloudinary.config({
    cloud_name: 'dbghn52ie',
    api_key: '137884765816622',
    api_secret: 'ko8HaElMJJRjGQRcJj780kmjr9Y'
});

/*#####  CEM #######*/
//login cem
router.get('/cem/login', (req, res) => { res.render('cem/login', { titulo: 'Login CEM' }) });
router.post('/cem/login', (req, res) => {
    var correo = req.body.correo;
    var clave = req.body.clave;
    client.get(`http://104.236.113.43/api/cems?filter[where][correo]=${correo}`, function (data, response) {
        if (data[0] != null) {
            if (data[0].correo == correo && data[0].clave == clave) {
                req.session.cuenta = data[0].correo;
                var sesion  = req.session.cuenta;
                res.render('cem/panel',{sesion});
            } else {
                res.render('cem/login', { mensaje: 'Usuario o contraseña incorrectos'});
            }
        } else {
          res.render('cem/login', { mensaje: 'error'});
            //res.send('error');
        }
    });
});




/*/////////////////////////////////////////////////*/
/*/////////////////////////////////////////////////*/
/*/////////////////////////////////////////////////*/
/*#####  CEL #######*/
//login cel
router.get('/cel/login', (req, res) => { res.render('cel/login', { titulo: 'Login CEL' }) });
router.post('/cel/login', (req, res) => {
    var correo = req.body.correo;
    var clave = req.body.clave;
    client.get(`http://104.236.113.43/api/cels?filter[where][correo]=${correo}`, function (data, response) {
       
        if (data[0] != null) {
            if (data[0].correo == correo && data[0].clave == clave) {
                req.session.cuenta = data[0].correo;
                var sesion  = req.session.cuenta;
                res.render('cel/panel',{sesion});
            } else {
                res.render('cel/login', { mensaje: 'Usuario o contraseña incorrectos'});
            }
        } else {
          res.render('cel/login', { mensaje: 'error'});
            //res.send('error');
        }
    });
});
//cel mis cursos
router.get('/cel/misprogramas', (req, res) => {
    var correo = req.session.cuenta;
    client.get(`http://104.236.113.43/api/programas?filter[where][cel_correo]=${correo}`,  function (data, response) {
        res.render('cel/misprogramas',{data,titulo:"mis programas"})
    });
});





/*/////////////////////////////////////////////////*/
/*/////////////////////////////////////////////////*/
/*/////////////////////////////////////////////////*/
/*#####  ALUMNO #######*/
//alumno registrar
router.get('/alumno/registrar', (req, res) => { res.render('alumno/registrar', { titulo: 'alumno registrar' }) });
router.post('/alumno/registrar', (req, res) => {
    var fecha = moment().format('DD MM YYYY');
    var args = {
        data: {
            "rut": req.body.rut,
            "nombre": req.body.nombre,
            "apellido_pat": req.body.apellido_pat,
            "apellido_mat": req.body.apellido_mat,
            "correo": req.body.correo,
            "clave": req.body.clave,
            "direccion": req.body.direccion,
            "nacionalidad": req.body.nacionalidad,
            "fecha_registro": fecha
        },
        headers: { "Content-Type": "application/json" }
    }

    client.post("http://104.236.113.43/api/Alumnos", args, function (data, response) {
        if (data.nombre != null) {
            res.render('alumno/login', { mensaje: 'Alumno registrado, inicie sesion', titulo: 'alumno login' });
        } else {
          res.render('alumno/registrar',{mensaje:"no registrado"});
          //  res.send('no registrado');
        }
    });
});

//alumno login
router.get('/alumno/login', (req, res) => { res.render('alumno/login', { titulo: 'alumno login' }) });
router.post('/alumno/login', (req, res) => {
    var correo = req.body.correo;
    var clave = req.body.clave;

    client.get(`http://104.236.113.43/api/Alumnos?filter[where][correo]=${correo}`, function (data, response) {
        if (data[0] != null) {
            if (data[0].correo == correo && data[0].clave == clave) {
                req.session.cuenta = data[0].correo;
                var sesion  = req.session.cuenta;
                res.render('alumno/panel',{sesion});
            } else {
                res.render('alumno/login', { mensaje: 'Usuario o contraseña incorrectos'});
            }
        } else {
          res.render('alumno/login', { mensaje: 'error'});
            //res.send('error');
        }
    });
});
//panel alumno
router.get('/alumno/panel', (req, res) => { res.render('alumno/panel') });
//postular a programa
router.get('/alumno/postular', (req, res) => { res.redirect('/programa/postularAlumno') });

//curso de alumno
router.get('/alumno/miprograma', (req, res) => {
    var correo_alumno = req.session.cuenta;
    client.get(`http://104.236.113.43/api/alumnoprogramas?filter[where][correo_alumno]=${correo_alumno}`, function (data, response) {
        if (data[0] != null) {
            var id = data[0].programa_id
            var postulacion = data[0].postulacion;
            client.get(`http://104.236.113.43/api/programas?filter[where][id]=${id}`, function (data, response) {
                res.render('alumno/miprograma', { data, titulo: "Mi programa",postulacion })
            });
        } else {
          res.render('alumno/miprograma',{mensaje:'no estas inscrito en ningun programa'});
            //res.send('no estas inscrito en ningun programa')
        }
    });
});

//seleccionar familia /alumno/asignarfamilia
router.get('/alumno/asignarfamilia', (req, res) => {
    var correo = req.session.cuenta;
    client.get(`http://104.236.113.43/api/Alumnos?filter[where][correo]=${correo}`, function (data, response) {

        if( data[0].familia_id != "null"){
          res.render('alumno/asignarfamilia',{mensaje:'ya tienes asociado una familia'});
          //  res.send('ya tienes asociado una familia');
        }else{
            client.get("http://104.236.113.43/api/Familia?filter[where][alumno_id]=null", function (data, response) {
                // parsed response body as js object
                res.render('alumno/asignarfamilia', { titulo: 'Listar Familia', data })
            });
        }

    });

});
router.get('/alumno/asignarfamilia/:id', (req, res) => {

    var idFamilia = req.params.id;
    var correo_alumno = req.session.cuenta;


    var args = {
        data: {
            "alumno_id": correo_alumno,
            "id": idFamilia,
        },
        headers: { "Content-Type": "application/json" }
    }

    client.patch("http://104.236.113.43/api/Familia", args, function (data, response) {
        // parsed response body as js object
        if (data != null) {
            client.get(`http://104.236.113.43/api/Alumnos?filter[where][correo]=${correo_alumno}`, function (data, response) {
                var id = data[0].id;
                var args = {
                    data: {
                        "familia_id": idFamilia,
                        "id": id,
                    },
                    headers: { "Content-Type": "application/json" }
                }
                client.patch("http://104.236.113.43/api/Alumnos", args, function (data, response) {
                  res.render('alumno/asignarfamilia',{mensaje:'familia asignada'});
                    //res.send('familia asignada');
                });
            });
        } else {
          res.render('alumno/asignarfamilia',{mensaje:'error'});
          //  res.render('error');
        }
    });
});
//mi familia
router.get('/alumno/mifamilia', (req, res) => {
    var correo = req.session.cuenta;
    client.get(`http://104.236.113.43/api/Familia?filter[where][alumno_id]=${correo}`, function (data, response) {
        if(data[0] == null){
          res.render('alumno/mifamilia',{mensaje:'no has seleccionado familia aun'});
          //  res.send('no has seleccionado familia aun');
        }else if( data[0].alumno_id != null){
            res.render('alumno/mifamilia', {data, titulo: "mi familia asignada"})
        }else{
          res.render('alumno/mifamilia',{mensaje:'no has seleccionado familia aun'});
            //res.send('no has seleccionado familia aun');
        }

    });

});

//mis notas
router.get('/alumno/misnotas', (req, res) => {
    var correo = req.session.cuenta;
    client.get(`http://104.236.113.43/api/Alumnos?filter[where][correo]=${correo}`, function (data, response) {
        if (data[0] != null) {
            var rut = data[0].rut;
            client.get(`http://104.236.113.43/api/nota?filter[where][alumno_id]=${rut}`, function (data, response) {
                if (data[0] != null) {
                    var count = data.length;
                    var nota = 0.0;
                    var promedio = 0.0;
                    for (i = 0; i < count; i++) {
                        nota = data[i].nota + nota;
                    }
                    var promedio1 = nota / count;
                    var promedio = Math.round(promedio1 * 10 ) / 10;
                    res.render('alumno/misnotas', { data, titulo: 'Mis Notas', promedio })
                } else {
                  res.render('alumno/misnotas',{mensaje:'error'});
                  //  res.send('error');
                }
            });
        } else {
          res.render('alumno/misnotas',{mensaje:'error'});
          //  res.send('error');
        }
    });

});

router.get('/alumno/verdatos/:correo', (req, res) => {
    var correo =  req.params.correo;
    client.get(`http://104.236.113.43/api/Alumnos?filter[where][correo]=${correo}`, function (data, response) {
        res.render('alumno/verdatos',{data, titulo: "ver datos alumno"})
    });
});

//alumno ver certificado
router.get('/alumno/certificado', (req, res) => {
    var correo = req.session.cuenta;
    client.get(`http://104.236.113.43/api/Alumnos?filter[where][correo]=${correo}`, function (data, response) {
        res.render('alumno/certificado',{data, titulo: "Certificado de aprobacion"})
    });
});




/*/////////////////////////////////////////////////*/
/*/////////////////////////////////////////////////*/
/*/////////////////////////////////////////////////*/
/*#####  FAMILIA #######*/
//familia registrar
router.get('/familia/registrar', (req, res) => { res.render('familia/registrar', { titulo: 'familia registrar' }) });
router.post('/familia/registrar', (req, res) => {
    var fecha = moment().format('DD MM YYYY');
    var args = {
        data: {
            "nombre_familia": req.body.nombre_familia,
            "correo": req.body.correo,
            "clave": req.body.clave,
            "direccion": req.body.direccion,
            "codigo_postal": req.body.codigo_postal,
            "pais": req.body.pais,
            "fecha_registro": fecha
        },
        headers: { "Content-Type": "application/json" }
    }

    client.post("http://104.236.113.43/api/Familia", args, function (data, response) {
        if (data.nombre_familia != null) {
            res.render('familia/login', { mensaje: 'Familia registrada, inicie sesion' });
        } else {
          res.render('familia/login', { mensaje: 'no registrado' });
          //  res.send('no registrado');
        }
    });
});

//familia login
router.get('/familia/login', (req, res) => { res.render('familia/login', { titulo: 'familia login' }) });
router.post('/familia/login', (req, res) => {
    var correo = req.body.correo;
    var clave = req.body.clave;

    client.get(`http://104.236.113.43/api/Familia?filter[where][correo]=${correo}`, function (data, response) {
        if (data[0] != null) {
            if (data[0].correo == correo && data[0].clave == clave) {
                req.session.cuenta = correo;
                res.redirect('/familia/panel');
            } else {
                res.render('familia/login', { mensaje: 'Usuario o contraseña incorrectos' });
            }
        } else {
          res.render('familia/login', { mensaje: 'error' });
          //  res.send('error');
        }
    });
});

//panel familia
router.get('/familia/panel', (req, res) => { res.render('familia/panel') });

//subir certificados
router.get('/familia/subircertificados', (req, res) => { res.render('familia/subir', { titulo: 'subir certificados' }) });
router.post('/familia/subircertificados', upload.any(), (req, res) => {
    var file1 = req.files[0].path;
    var file2 = req.files[1].path;
    var correo = req.session.cuenta;

    client.get(`http://104.236.113.43/api/Familia?filter[where][correo]=${correo}`, function (data, response) {
        var id = data[0].id;
        console.log(file1);
        cloudinary.uploader.upload(file1, function (result) {
            //certificado_laboral_url
            var ruta1 = result.url;
            console.log(result);
            cloudinary.uploader.upload(file2, function (result) {
                //certificado_residencia_url
                var ruta2 = result.url;
                console.log(ruta2);

                var args = {
                    data: {
                        "id": id,
                        "cert_laboral_url": ruta1,
                        "cert_residencia_url": ruta2

                    },
                    headers: { "Content-Type": "application/json" }

                }
                client.patch("http://104.236.113.43/api/Familia", args, function (data, response) {
                            res.render('familia/subir', { mensaje: 'certificados subidos' });
                  //  res.send('certificado subido');
                });
            });
        });
    });

});

/*/////////////////////////////////////////////////*/
/*/////////////////////////////////////////////////*/
/*/////////////////////////////////////////////////*/
/*#####  ADMIN #######*/
//listar encargados cem
router.get('/admin/login', (req,res) => {
    res.render('admin/login');
})

router.post('/admin/login', (req, res) => {
    var usuario = req.body.correo;
    var clave = req.body.clave;
    if(usuario == 'admin' && clave == 'admin'){
        res.render('admin/panel');
    }else{
        res.render('/admin/login');
    }
});

router.get('/admin/listarCem', (req, res) => {
    client.get("http://104.236.113.43/api/cems", function (data, response) {
        // parsed response body as js object

        res.render('admin/listarCem', { titulo: 'Listar CEM', data })
    });

});

//listar encargados cel
router.get('/admin/listarCel', (req, res) => {
    client.get("http://104.236.113.43/api/cels", function (data, response) {
        // parsed response body as js object
        res.render('admin/listarCel', { titulo: 'Listar CEL', data })
    });

});

//listar familia
router.get('/admin/listarFamilia', (req, res) => {
    client.get("http://104.236.113.43/api/Familia", function (data, response) {
        // parsed response body as js object
        res.render('admin/listarFamilia', { titulo: 'Listar Familia', data })
    });

});

//listar alumnos
router.get('/admin/listarAlumnos', (req, res) => {
    client.get("http://104.236.113.43/api/Alumnos", function (data, response) {
        // parsed response body as js object
        res.render('admin/listarAlumnos', { titulo: 'Listar Alumnos', data })
    });

});

//crear cem
router.get('/admin/crearCem', (req, res) => { res.render('admin/crearCem', { titulo: 'crear CEM' }) });
router.post('/admin/crearCem', (req, res) => {

    var args = {
        data: {
            "sede": req.body.sede,
            "correo": req.body.correo,
            "clave": req.body.clave
        },
        headers: { "Content-Type": "application/json" }
    }
    client.post("http://104.236.113.43/api/cems", args, function (data, response) {
          res.render('admin/crearCem', { mensaje: 'Encargado creado correctamente' });
    });
});
//crear cel
router.get('/admin/crearCel', (req, res) => { res.render('admin/crearCel', { titulo: 'crear CEL' }) });
router.post('/admin/crearCel', (req, res) => {

    var args = {
        data: {
            "institucion": req.body.institucion,
            "correo": req.body.correo,
            "pais": req.body.pais,
            "clave": req.body.clave
        },
        headers: { "Content-Type": "application/json" }
    }

    client.post("http://104.236.113.43/api/cels", args, function (data, response) {
          res.render('admin/crearCel', { mensaje: 'Encargado creado correctamente' });
    });
});

//subir certificado alumno
router.get('/admin/subir/alumnocertificado', (req, res) => { res.render('admin/certificadoalumno', { titulo: 'subir certificado alumno' }) });
router.post('/admin/subir/alumnocertificado', upload.any(), (req, res) => {
    var rut = req.body.rut;
    var file1 = req.files[0].path;

    client.get(`http://104.236.113.43/api/Alumnos?filter[where][rut]=${rut}`, function (data, response) {
        var id = data[0].id;
        cloudinary.uploader.upload(file1, function (result) {
            //certificado_laboral_url
            var ruta1 = result.url;
            var args = {
                data: {
                    "id": id,
                    "cert_url": ruta1

                },
                headers: { "Content-Type": "application/json" }

            }
            client.patch("http://104.236.113.43/api/Alumnos", args, function (data, response) {
              res.render('admin/certificadoalumno', { mensaje: 'certificado subido' });
              //  res.send('certificado subido');
            });
        });
    });

});


//consular antecedentes familia
router.get('/admin/buscar/antecedentesFamilia', (req, res) => {
    var titulo = 'Consultar antecedentes familia';
    res.render('admin/consultarFamilia',{titulo});
});
router.post('/admin/buscar/antecedentesFamilia', (req, res) => {
    var titulo = 'Consultar antecedentes familia';
    var correo = req.body.correo;
    client.get(`http://104.236.113.43/api/Familia?filter[where][correo]=${correo}`, function (data, response) {
        if (data.length > 0) {
            res.render('admin/consultarFamilia',{titulo,data});
        } else {
            res.render('admin/consultarFamilia',{mensaje:"Familia no existe"});
        }
    });

});
/*/////////////////////////////////////////////////*/
/*/////////////////////////////////////////////////*/
/*/////////////////////////////////////////////////*/
/*/////////////////////////////////////////////////*/
/*#####  NOTA #######*/
router.get('/nota/registrar', (req, res) => { res.render('nota/registrar', { titulo: 'Registrar nota alumno' }) });
router.post('/nota/registrar', (req, res) => {

    var rut = req.body.rut;
    var nota = req.body.nota;
    var fecha = moment().format('DD MM YYYY');

    client.get(`http://104.236.113.43/api/Alumnos?filter[where][rut]=${rut}`, function (data, response) {
        if (data[0] != null) {
            if (nota <= 7 && nota > 0) {
                var args = {
                    data: {
                        "nota": nota,
                        "fecha_nota": fecha,
                        "alumno_id": rut
                    },
                    headers: { "Content-Type": "application/json" }
                }

                client.post("http://104.236.113.43/api/nota", args, function (data, response) {
                    if (data.nota != null) {
                      res.render('nota/registrar',{mensaje:"nota agregada "});
                        //res.send('nota agregada ');
                    } else {
                      res.render('nota/registrar',{mensaje:"Error al agregar nota "});
                        //res.send('Error al agregar nota');
                    }
                });
            } else {
              res.render('nota/registrar',{mensaje:"nota debe ser mayor que 0 y menor a 7"});
                //res.send('nota debe ser mayor que 0 y menor a 7');
            }
        } else {
          res.render('nota/registrar',{mensaje:"error"});
            //res.send('error');
        }
    });

});


router.get('/nota/listar', (req, res) => { res.render('nota/listar', { titulo: 'Listar notas de Alumno' }) });
router.post('/nota/listar', (req, res) => {
    var rut = req.body.rut;
    client.get(`http://104.236.113.43/api/nota?filter[where][alumno_id]=${rut}`, function (data, response) {
        if (data[0] != null) {
            res.render('nota/listar', { data, titulo: 'Notas del alumno '})
        } else {
          //res.send('error');
            res.render({mensaje:'No hay notas'});
        }
    });
});

router.get('/nota/eliminar/:id/:alumno_id', (req, res) => {
    var id = req.params.id;
    var rut = req.params.alumno_id;
    client.delete(`http://104.236.113.43/api/nota/${id}`, function (data, response) {
        if (data.count == 1) {
            client.get(`http://104.236.113.43/api/nota?filter[where][alumno_id]=${rut}`, function (data, response) {
                if (data[0] != null) {
                    res.render('nota/listar', { data, titulo: 'Listar notas de Alumno' })
                } else {
                  res.render('nota/listar',{mensaje:'Error al eliminar'});
                    //res.send('error');
                }
            });
        }
    });
});




/*/////////////////////////////////////////////////*/
/*/////////////////////////////////////////////////*/
/*/////////////////////////////////////////////////*/
/*#####  PROGRAMA #######*/
router.get('/programa/crear', (req, res) => { res.render('programa/crear', { titulo: 'Crear programa' }) });
router.post('/programa/crear', (req, res) => {
    var args = {
        data: {
            "nombre_programa": req.body.nombre_programa,
            "descripcion": req.body.descripcion,
            "pais_destino": req.body.pais_destino,
            "fecha_inicio": req.body.fecha_inicio,
            "fecha_termino": req.body.fecha_termino,
            "cupos": req.body.cupos,
            "cel_correo": "1"
        },
        headers: { "Content-Type": "application/json" }
    }
    console.log(args.data)

    client.post("http://104.236.113.43/api/programas", args, function (data, response) {
        if (data.nombre_programa != null) {
          res.render('programa/crear',{mensaje:'programa agregado'});
          //  res.send('programa agregado ');
        } else {
          res.render('programa/crear',{mensaje:'Error al agregar programa'});
          //  res.send('Error al agregar programa');
        }
    });
});

//programa postular cel
router.get('/programa/postularcel', (req, res) => {
    client.get("http://104.236.113.43/api/programas?filter[where][cel_correo]=1", function (data, response) {
        res.render('programa/postularcel', { titulo: 'postular programa cel', data })
    });
    //
});
router.get('/programa/postularcel/:id', (req, res) => {
    var args = {
        data: {
            "id": req.params.id,
            "cel_postulacion": 1,
            "cel_correo": req.session.cuenta
        },
        headers: { "Content-Type": "application/json" }
    }
    client.patch("http://104.236.113.43/api/programas", args, function (data, response) {
        if (data.id != null) {
          res.render('programa/postularcel',{mensaje:'postulacion correcta'});
          //  res.send('postulacion correcta ');
        } else {
          res.render('programa/postularcel',{mensaje:'Error al postular a programa'});
          //  res.send('Error al postular a programa');
        }
    });
});

//aprobar postulacion cel
router.get('/programa/aprobarcel', (req, res) => {
    client.get("http://104.236.113.43/api/programas?filter[where][cel_postulacion]=1&filter[where][asignado]=false", function (data, response) {
        res.render('programa/aprobarcel', { titulo: 'aprobar cel', data })
    });
    //
});
router.get('/programa/aprobarcel/:id', (req, res) => {

    var args = {
        data: {
            "id": req.params.id,
            "asignado": true
        },
        headers: { "Content-Type": "application/json" }
    }
    client.patch("http://104.236.113.43/api/programas", args, function (data, response) {
        if (data.id != null) {
          res.render('programa/aprobarcel',{mensaje:'aprobacion correcta'});
          //  res.send('aprobacion correcta ');
        } else {
          res.render('programa/aprobarcel',{mensaje:'Error al postular a programa'});
          //  res.send('Error al postular a programa');
        }
    });
    //
});

//listar programas disponibles
router.get('/programa/disponibles', (req, res) => {
    client.get("http://104.236.113.43/api/programas?filter[where][asignado]=true", function (data, response) {
        res.render('programa/disponibles', { titulo: 'programas disponibles', data })
    });
    //
});

//listar programas para alumno postular
router.get('/programa/postularAlumno', (req, res) => {
    var correo = req.session.cuenta;

    client.get(`http://104.236.113.43/api/alumnoprogramas?filter[where][correo_alumno]=${correo}`, function (data, response) {
        if(data[0] != null){
          res.render('programa/disponibles',{mensaje:'ya se encuentra en un curso'});
          //  res.send('ya se encuentra en un curso')
        }else{
            client.get("http://104.236.113.43/api/programas?filter[where][asignado]=true", function (data, response) {
                res.render('programa/postularalumno', { titulo: 'programas disponibles', data })
            });
        }
    });
});
router.get('/programa/postularAlumno/:id/:cupos/:nombre_programa', (req, res) => {
    var cupos = req.params.cupos;
    var cuposfinal = cupos - 1;
    var correo_alumno = req.session.cuenta;
    var correoExiste = null;
    if (cupos == 0) {
      res.render('programa/postularAlumno',{mensaje:'no hay cupos disponibles'});
      //  res.send('no hay cupos disponibles');
    }
    client.get(`http://104.236.113.43/api/alumnoprogramas?filter[where][correo_alumno]=${correo_alumno}`, function (data, response) {
        if (data[0] != null) {
          res.render('programa/postularAlumno',{mensaje:'Usted ya se encuentra postulando a un curso'});
        //    res.send('Usted ya se encuentra postulando a un curso');
        } else {
            var args = {
                data: {
                    "correo_alumno": correo_alumno,
                    "programa_id": req.params.id,
                    "nombre_programa": req.params.nombre_programa
                },
                headers: { "Content-Type": "application/json" }
            }
            client.post("http://104.236.113.43/api/alumnoprogramas", args, function (data, response) {
                var args = {
                    data: {
                        "cupos": cuposfinal,
                        "id": req.params.id
                    },
                    headers: { "Content-Type": "application/json" }
                }
                client.patch("http://104.236.113.43/api/programas", args, function (data, response) {
                  res.render('programa/postularAlumno',{mensaje:'Postulacion exitosa, debe esperar a aprobacion del curso'});
                  //  res.send('Postulacion exitosa, debe esperar a aprobacion del curso');
                });
            });
        }

    });
});

//aprobar postulacion alumno
router.get('/programa/aprobaralumno', (req, res) => {
    client.get("http://104.236.113.43/api/alumnoprogramas?filter[where][postulacion]=false", function (data, response) {
        res.render('programa/aprobaralumno', { titulo: 'aprobar postulacion alumno', data })
    });
});
router.get('/programa/aprobaralumno/:id', (req, res) => {
    var args = {
        data: {
            "id": req.params.id,
            "postulacion": true
        },
        headers: { "Content-Type": "application/json" }
    }
    client.patch("http://104.236.113.43/api/alumnoprogramas", args, function (data, response) {
      res.render('programa/aprobaralumno',{mensaje:'alumno aprobado'});
      //  res.send('alumno aprobado');
    });
});


/*/////////////////////////////////////////////////*/
/*/////////////////////////////////////////////////*/

module.exports = router;
