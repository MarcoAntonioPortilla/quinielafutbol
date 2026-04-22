
function comprueba(valor){
    if(valor.value < 0){
        valor.value = 0;
    }
  }


$('#botonGuardar').click(function(){
    $('#formQuiniela').submit();
});  


