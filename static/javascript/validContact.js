/////////////// CONTACTO ///////////////
const Contact = document.getElementById('btnEnviar');

// Función para asegurarme que no pase el iniciar sesión sin antes validar 
Contact.addEventListener('click', function(event){
    event.preventDefault(); // Comportamiento predeterminado del formulario

    if (validoContact()){
      const nombre = document.querySelector("#name").value;
      const apellido = document.querySelector("#apellido").value;
      const email = document.querySelector("#email").value;
      const telefono = document.querySelector("#tel").value;
      const fecha = document.querySelector("#birthdate").value;
      const mensaje = document.querySelector("#mensaje").value;

      // Crear objeto con datos del formulario
      const formData = { nombre, apellido, email, telefono, fecha, mensaje };
      console.log(JSON.stringify(formData));
      
      // Enviar datos al archivo PHP mediante fetch
      fetch('../../RosarioFiesta-back/public/save-comments.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              alert("Datos guardados con éxito.");
              window.location.href = '../sections/contact-complete.html';
          } else {
              console.error("Error:", data.message);
          }
      })
      .catch(error => console.error("Error:", error));
  }
});


function validoContact(){

    let name = document.querySelector("#name").value;
    let apellido = document.querySelector("#apellido").value;
    let email = document.querySelector("#email").value;
    let formato = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular
    let tell = document.querySelector("#tel").value;
    let date = document.querySelector("#birthdate").value;
    let mensaje = document.querySelector("#mensaje").value;

    // let nacion = document.querySelector("#country").value;

    if (name.trim() == '' || apellido.trim() == '' || email.trim() == '' || tell.trim() == '' || date.trim() == '' || mensaje.trim() == ''){ // valido campos vacios nacion.trim() == ''
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
  const edad = Math.floor(diferencia / (1000 * 60 * 60 * 24 * 365)); 

  return edad >= 18; // Verifico que sea mayor de edad y devuelvo un booleano
}

// Función para mostrar el mensaje y hacerle un temporizador
function mostrar(selector, mensaje) {
    const elemento = document.querySelector(selector);
    elemento.innerHTML = mensaje; 
    setTimeout(() => {elemento.innerHTML = ''; }, 10000); 
}
