const express = require("express"),
      pug = require("pug"),
      publicDir = express.static(`${__dirname}/public`),
      codFront = express.static(`${__dirname}/controller`),
      viewDir = `${__dirname}/views`,
      port = (process.env.port || 3000);

const jf = require("johnny-five"),
      circuito = new jf.Board();
var led, led2, potentiometer;
var conections = 0;
circuito.on("ready",startArdu);//funcion que inicializa variables y siempre se ejecuta
function startArdu() {
    //led = new jf.Led(10).blink(500);//va a parpadear un led
    led2 = new jf.Led(8).on();//.on()-> lo apaga
    var config = {
        pin: "A4",
        freq: 500
    }
    potentiometer = new jf.Sensor(config);
    potentiometer.on("change", () => {
            var {value, raw} = potentiometer;
            console.log("sensor:");
            console.log("value:", raw);
            console.log("------------");
    
    });
}
function onOffLed(data) {
    if (data.encendido == 'on') {
        led2.off();//instruccion que enciende el led esta invertido
        console.log(data.encendido);
    }else {//si es off
        led2.on();
        console.log(data.encendido);
    }
    
}
const app = express();
const http = require('http').createServer(app),
      io = require('socket.io')(http);
//configuracion
app.set('views', viewDir)
    .set('view engine', 'pug')
    .set('port', port);
//uso de middleware
app.use(express.json())//me permite manipular el envio de informacion de la app en json
    .use(express.urlencoded({extended: false}))//nos permite que los form puedan estar enviando variables
    .use(publicDir)
    .use(codFront);

http.listen(app.get('port'), () => console.log(`iniciando app ${app.get('port')}`));

//rutas
app.get('/', (req, res, next) => {
    res.render('index', {
        title: "aplicacion node y arduino y johnny five",
        header: "fulano"
    })
});
app.use((req, res, next) => {
    let err = new Error();
    err.status = 404;
    err.statusText = 'NOT FOUND';
    res.render('error', {error: err});
});
io.on('connection', (socket) => {
    conections++;
    console.log(`conexiones activas ${conections}`);
    socket.emit('hello', {message: 'hola emit desde server'});
    socket.on('led', (data) => {
        // console.log(data);
        onOffLed(data);
    });
    socket.on('disconnect', ()=> {
        conections--;
        console.log(`conexiones activas ${conections}`);
    });
});
io.emit('sisepuede', {user: "epa"});
