document.addEventListener('DOMContentLoaded', function () {
    cargarUsuarios();
  
    // Manejo del envío del formulario de editar usuario
    document.getElementById('formEditarUsuario').addEventListener('submit', function (event) {
      event.preventDefault();
      editarUsuarioSubmit();
    });
  });
  
  function cargarUsuarios() {
    fetch('../../RosarioFiesta-back/public/get-users.php')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          let usuariosHTML = '';
          data.usuarios.forEach(usuario => {
            usuariosHTML += `
                <tr>
                    <td>${usuario.id_usuario}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.dni}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editarUsuario(${usuario.id_usuario})">Editar</button>
                    </td>
                </tr>
            `;
          });
          document.getElementById('usuariosBody').innerHTML = usuariosHTML;
        } else {
          document.getElementById('usuariosBody').innerHTML = '<tr><td colspan="4">No se encontraron usuarios activos</td></tr>';
        }
      })
      .catch(error => {
        console.error('Error al cargar los usuarios:', error);
        alert('Error al cargar los usuarios');
      });
  }
  
  function editarUsuario(idUsuario) {
    fetch(`../../RosarioFiesta-back/public/get-users.php?id_usuario=${idUsuario}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const usuario = data.usuarios.find(u => u.id_usuario == idUsuario);
          if (usuario) {
            document.getElementById('editIdUsuario').value = usuario.id_usuario;
            document.getElementById('editNombre').value = usuario.nombre;
            document.getElementById('editEmail').value = usuario.email;
            document.getElementById('editDni').value = usuario.dni;
  
            $('#modalEditarUsuario').modal('show');
          } else {
            alert('Usuario no encontrado.');
          }
        } else {
          alert('Error al cargar los datos del usuario.');
        }
      })
      .catch(error => console.error('Error al cargar el usuario:', error));
  }
  
  function editarUsuarioSubmit() {
    const idUsuario = document.getElementById('editIdUsuario').value;
    const nombre = document.getElementById('editNombre').value;
    const email = document.getElementById('editEmail').value;
    const dni = document.getElementById('editDni').value;
  
    fetch('../../RosarioFiesta-back/public/edit-users.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        'id_usuario': idUsuario,
        'nombre': nombre,
        'email': email,
        'dni': dni
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Usuario actualizado correctamente.');
          $('#modalEditarUsuario').modal('hide');
          cargarUsuarios(); 
        } else {
          alert('Error al actualizar el usuario.');
        }
      })
      .catch(error => console.error('Error al actualizar el usuario:', error));
  }
  