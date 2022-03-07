var socket = io();
var encenderOn = document.getElementById("encender");
var apagarOff = document.getElementById("apagar");
var lecturaSensor = document.getElementById("lectura_sensor");
socket.on('hello', (data) => {
    console.log(data);
    document.querySelector('#hello').innerHTML = data.message;
});
socket.on('sisepuede', (data) => {
    console.log(data);
    document.querySelector('#prueba').innerHTML = data.user;
});
encenderOn.addEventListener('click', (event) => {
    var on = event.target.value;
    socket.emit('led', {encendido: on} );
        console.log(event.target.value);
    lecturaSensor.innerHTML = `led en estado ${on}`;

})
apagarOff.addEventListener('click', (event) => {
    var off = event.target.value;
    socket.emit('led', {encendido: off} );
        console.log(event.target.value);
    lecturaSensor.innerHTML = `led en estado ${off}`;
})

alert("que mas pues")