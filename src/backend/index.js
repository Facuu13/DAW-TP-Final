//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');
var app     = express();
var utils   = require('./mysql-connector');

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================

//metodo para actualizar los datos de un dispositivo.
app.put('/devices/:id',(req,res,next)=>{
    const deviceId = req.params.id; // Obtener el ID del dispositivo desde la URL
    console.log("Recibida solicitud PUT" , deviceId);
    utils.query("select id from Devices where id =" + req.params.id,(err,rsp,fields)=>{
        if(err==null){
            const { name, description, state, type } = req.body; // Obtener los datos actualizados desde el cuerpo de la solicitud
            // Construimos la consulta SQL 
            const sqlQuery = `UPDATE Devices SET name='${name}', description='${description}', state='${state}', type='${type}' WHERE id=${deviceId}`;
            utils.query(sqlQuery);
            res.status(200).send("Se actualizo el device correctamente");
        }else{
            console.log("El dispositivo no existe.")
            res.status(404).send("El dispositivo no existe.");
        }
    
    });
});

// app_post para agregar un nuevo dispositivo
app.post('/device',(req,res,next)=>{
    console.log("Recibida solicitud POST para agregar un nuevo device");
    utils.query("INSERT INTO Devices VALUES ('" + 0 + "','" + req.body.name + "', '" + req.body.description + "','" + req.body.state + "','" + req.body.type + "','" + req.body.intensity + "' )",(err,rsp,fields)=>{
        if(err==null){
            res.status(200).send("Se agrego el device correctamente");
        }else{
            console.log("Error al insertar el dispositivo.")
            res.status(404).send("Error al insertar el dispositivo.");
        }
    })
});
// app_post para actualizar el state de un dispositivo
app.post('/deviceState',(req,res,next)=>{
    console.log("Recibida solicitud POST actualizar el estado del device");
    utils.query("UPDATE Devices SET state = "+req.body.state+" WHERE id = "+req.body.id);
    if(req.body.name == ""){
        res.status(409).send("no tengo nada que hacer")
    }else{
        res.status(200).send("Se actualizo el estado del dispositivo")
    }
});

// app_post para actualizar el intensity de un dispositivo
app.post('/deviceIntensity',(req,res,next)=>{
    console.log("Recibida solicitud POST actualizar la intensidad del device");
    utils.query("UPDATE Devices SET intensity = "+req.body.intensity+" WHERE id = "+req.body.id);
    if(req.body.name == ""){
        res.status(409).send("no tengo nada que hacer")
    }else{
        res.status(200).send("Se actualizo ela intensidad del dispositivo")
    }
});

// metodo para eliminar un dispositivo
app.delete('/devices/:id',(req,res,next)=>{
    console.log("Recibida solicitud DELETE: ",req.params.id);
    utils.query("select id from Devices where id =" + req.params.id,(err,rsp,fields)=>{
        if(err==null){ //devuelve null cuando la query es correcta
            //Si existe el ID en la tabla, eliminamos el device
            utils.query("delete from Devices where id ="+req.params.id);
            console.log("Se elimino el device: '" + req.params.id + "'")
            res.status(200).send("Se elimino el device correctamente");
        }else{
            console.log("El dispositivo no existe.")
            res.status(404).send("El dispositivo no existe.");
        }
    });
});

// metodo para obtener los dispositivos
app.get('/devices/',(req,res,next)=>{
    console.log("Recibida solicitud GET");
    utils.query("select * from Devices",(err,rsp,fields)=>{
        if(err==null){ //devuelve null cuando la query es correcta
            console.log("rps",rsp);
            res.status(200).send(JSON.stringify(rsp));
        }else{
            console.log("err",err.Error);
            res.status(409).send(err.Error);
        }
        
    });
});

// metodo para obtener un dispositivo especifico
app.get('/devices/:id',(req,res,next)=>{
    console.log("id",req.params.id);
    utils.query("select * from Devices where id="+req.params.id,(err,rsp,fields)=>{
        if(err==null){ //devuelve null cuando la query es correcta
            console.log("rps",rsp);
            res.status(200).send(JSON.stringify(rsp));
        }else{
            console.log("err",err.Error);
            res.status(409).send(err.Error);
        }
        
    });
});

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
