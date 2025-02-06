// Función para cargar el horario
function cargarHorario() {
    fetch('monitor-horario.php')
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
        
          const urlHorario = data.horarios[0];
          const imgElement = document.getElementById('horario-img');
          imgElement.src = urlHorario;
          imgElement.alt = 'Horario';
        } else {
          console.error('Error:', data.message);
        }
      })
      .catch(error => console.error('Error al cargar el horario:', error));
  }
  

  window.onload = cargarHorario;