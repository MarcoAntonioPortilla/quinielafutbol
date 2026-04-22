
limitarCaracteres(document.getElementById("login"), 20);
limitarCaracteres(document.getElementById("loginPassword"), 20);


function limitarCaracteres(input, maxlength){
    input.addEventListener("input", () => {
        if(input.value.length > maxlength){
            input.value = input.value.slice(0, maxlength);
        }
    });
}

