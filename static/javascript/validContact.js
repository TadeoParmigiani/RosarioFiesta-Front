/////////////// CONTACTO ///////////////
const Contact = document.getElementById('btnEnviar');


// Funcion para asegurarme que no pase el iniciar sesion sin antes validar 
Contact.addEventListener('click', function(event){
    event.preventDefault(); // Comportamiento predeterminado del formulario
    if (validoContact()){
        console.log("Contacto con exito");
        window.location.href = '../sections/contact-complete.html'; 
    }
});

// Recuperar
function validoContact(){

    // crear cuenta tiene: nombre, apellido, email, tel, nacimiento, nacionalidad
    let name = document.querySelector("#name").value;
    let apellido = document.querySelector("#apellido").value;
    let email = document.querySelector("#email").value;
    let formato = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular
    let tell = document.querySelector("#tel").value;
    let date = document.querySelector("#birthdate").value;
    let nacion = document.querySelector("#country").value;

    if (name.trim() == '' || apellido.trim() == '' || email.trim() == '' || tell.trim() == '' || date.trim() == '' || nacion.trim() == ''){ // valido campos vacios
        mostrar('#error-campos', 'Debes completar todos los campos para continuar');
        return false;
    } else {
      if (/\d/.test(name)) { // valido que el nombre no tenga numeros
        mostrar('#error-name', 'El nombre no puede contener numeros');
        return false;
      }
      if (name.length <= 3) {
        mostrar('#error-name', 'El nombre debe tener mas de 3 caracteres');
        return false;
      }
      if (/\d/.test(apellido)) { // valido que el apellido no tenga numeros
        mostrar('#error-apellido', 'El apellido no puede contener numeros');
        return false;
      }
      if (apellido.length <= 3) {
        mostrar('#error-apellido', 'El apellido debe tener mas de 3 caracteres');
        return false;
      }
      if (!/^\d+$/.test(tell)) { // valido que el telefono tenga solo numeros
        mostrar('#error-tel', 'El telefono solo puede contener numeros');
        return false;
      }
      if (tell.length < 10 || tell.length > 15) { // valido caracteres de telefono
          mostrar('#error-tel', 'El telefono debe tener entre 10 y 15 caracteres');
          return false;
      }
      if (!formato.test(email)){ // valido formato email
          mostrar('#error-email', 'El email no tiene el formato valido');
          return false;
      }
      if (!verificarEdad(date)) {  // valido caracteres de la contraseña
          mostrar('#error-date', 'Debes ser mayor de 18 años para contactarnos');
          return false;
      }
    }
    return true;
};

// Funcion para la edad
function verificarEdad(fechaNacimiento) {
  const fechaActual = new Date();
  
  const fechaNac = new Date(fechaNacimiento); // Convierto a tipo date
  const diferencia = fechaActual - fechaNac; // Calculo la diferencia 
  const edad = Math.floor(diferencia / (1000 * 60 * 60 * 24 * 365)); // Convierto la diferencia en años

  return edad >= 18; // Verifico que sea mayor de edad y devuelvo un booleano
}

// Función para mostrar el mensaje y hacerle un temporizador
function mostrar(selector, mensaje) {
    const elemento = document.querySelector(selector);
    elemento.innerHTML = mensaje; 
    setTimeout(() => {elemento.innerHTML = ''; }, 10000); 
}

// Funcion para borrar los div de error cuando se escribe en los inputs
document.querySelector("#fullName").addEventListener('input', function() { 
    document.querySelector('#F-NameCrear').innerHTML = '';
    document.querySelector('#F-crear-campos').innerHTML = '';
});
document.querySelector("#dni").addEventListener('input', function() { 
  document.querySelector('#F-dniCrear').innerHTML = '';
  document.querySelector('#F-crear-campos').innerHTML = '';
});
document.querySelector("#email").addEventListener('input', function() { 
  document.querySelector('#F-emailCrear').innerHTML = '';
  document.querySelector('#F-crear-campos').innerHTML = '';
});
document.querySelector("#password").addEventListener('input', function() { 
  document.querySelector('#F-passCrear').innerHTML = '';
  document.querySelector('#F-crear-campos').innerHTML = '';
});
document.querySelector("#terminos").addEventListener('input', function() { 
  document.querySelector('#F-Check').innerHTML = '';
  document.querySelector('#F-crear-campos').innerHTML = '';
});