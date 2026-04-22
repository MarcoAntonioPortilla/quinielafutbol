
limitarCaracteres(document.getElementById("nombre"), 20);
limitarCaracteres(document.getElementById("password"), 20);

limitarCaracteresMin(document.getElementById("nombre"), 8);
limitarCaracteresMin(document.getElementById("password"), 8);




function limitarCaracteres(input, maxlength){
    input.addEventListener("input", () => {
        if(input.value.length > maxlength){
            input.value = input.value.slice(0, maxlength);
        }
    });
}




function limitarCaracteresMin(input, minlength){
    input.addEventListener("input", () => {
    let inputNombre = document.getElementById("nombre");
    let inputPassword = document.getElementById("password");

        if(inputNombre.value.length >= minlength && inputPassword.value.length >= minlength){
            document.getElementById("btnActualizar").disabled = false;
        }else if(inputNombre.value.length < minlength || inputPassword.value.length < minlength){
            document.getElementById("btnActualizar").disabled = true;
        }
    });
}