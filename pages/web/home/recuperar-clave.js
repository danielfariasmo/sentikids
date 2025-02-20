$(document).ready(function() {
    $('#recuperarForm').submit(function(event) {
        event.preventDefault();

        let email = $('#email').val();
        let tipo = $('#tipo').val();

        let formData = new FormData();
        formData.append('email', email);
        formData.append('tipo', tipo);

        $.ajax({
            url: 'comprobar-correo.php',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                $('#respuesta').html(response);
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });
    });
});







