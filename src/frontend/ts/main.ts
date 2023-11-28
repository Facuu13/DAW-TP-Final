var M;
class Main implements EventListenerObject{

    constructor() {
        this.showDevices();
    }

    private showDevices(){
        let xmlRequest = new XMLHttpRequest();
        xmlRequest.onreadystatechange = ()=> {
            if(xmlRequest.readyState == 4){
                if(xmlRequest.status == 200){
                    let respusta = xmlRequest.responseText;
                    let datos: Array<Device> = JSON.parse(respusta);
                    let div = document.getElementById("listaDisp");
                    for (let d of datos){
                        // Asigna 'checked' a isChecked si d.state es verdadero, de lo contrario, asigna una cadena vacía.
                        const isChecked = d.state ? 'checked' : '';
                        // Asigna 'disable' a isChecked si d.state es falso, de lo contrario, asigna una cadena vacía.
                        //esto se hace para habilitar el range
                        const isDisabled = d.state ? '' : 'disabled';
                        // Generamos un ID único para el dispositivo
                        const deviceId = `device_${d.id}`;
                        let type: string;
                        //dependiendo del tipo de dispositivo asignamos un 
                        if(d.type == 1){
                            type = `
                            <div class="switch">
                                <label>
                                    Off
                                    <input type="checkbox" ${isChecked}>
                                    <span class="lever"></span>
                                    On
                                </label>
                            </div>`
                        }else if (d.type == 2){
                            type = `<div class="switch">
                            <label>
                                Off
                                <input type="checkbox" ${isChecked}>
                                <span class="lever"></span>
                                On
                            </label>
                            </div>
                            <form action="#">
                            <p class="range-field">
                                <input type="range" id="test5" min="0" max="100" ${isDisabled}/>
                            </p>
                            </form>`
                        }

                        let deviceDiv = document.createElement("div"); 
                        deviceDiv.className = "col s12 m6 lg3";
                        deviceDiv.id = deviceId;

                        deviceDiv.innerHTML += `
                        <h5>${d.name}</h5>
                        <p>${d.description}</p>
                        ${type}
                        `
                        div.appendChild(deviceDiv);
                        this.crearBotones(deviceDiv,div)
                    }
                }
                    
            }
        
        }
        xmlRequest.open("GET","http://localhost:8000/devices",true); //lo ponemos en true para que se ejecute de forma asincrona
        xmlRequest.send();
    }

    private editarDevice(){
        //Capaz que el boton tiene que ser un modal para asi editar los valores de los devices
        //Tener la posibilidad desde el backend de no solo actualizar el valor del estado, sino de
        //actualizar cualquier valor
        
    }

    private eliminarDevice(id:string){
        // Mostrar un mensaje de confirmación
        const confirmDelete = window.confirm("¿Estás seguro de eliminar este dispositivo?");
        if (confirmDelete) {
            console.log("eliminamos device")
            //llamar al metodo delete
        }
        else{
            //no hacemos nada
        }

    }

    private crearBotones(deviceDiv,div){
        // Creamos el boton para editar
        const buttonEditar = document.createElement("button");
        buttonEditar.className="waves-effect waves-teal btn-flat";
        buttonEditar.textContent = "Editar";

        buttonEditar.onclick = () => { 
            this.editarDevice();
        };

        // Creamos el boton para eliminar
        const buttonEliminar = document.createElement("button");
        buttonEliminar.className="waves-effect waves-teal btn-flat";
        buttonEliminar.textContent = "Eliminar";

        //cuando hacemos clic llama a la funcion
        buttonEliminar.onclick = () => {
        this.eliminarDevice(deviceDiv.id);
        };

        deviceDiv.appendChild(buttonEditar); //agrega el boton Editar al final del div
        deviceDiv.appendChild(buttonEliminar);//agrega el boton Eliminar al final del div

        div.appendChild(deviceDiv);
    }


    private agregarDevice(){

    }

    handleEvent(object: Event): void {
        let elemento = <HTMLElement> object.target;
        console.log(elemento.id)
        if("hola" === elemento.id){ //el triple igual me valida el tipo de dato y el valor. El doble igual solamente el valor
            this.showDevices();
        }
    }


}
window.addEventListener("load",  ()=> {

    var elemsModal = document.querySelectorAll('.modal');
    M.Modal.init(elemsModal, null);

    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems, null);

    let main: Main = new Main();

    let botonHola = document.getElementById("hola")
    botonHola.addEventListener("click",main)




});