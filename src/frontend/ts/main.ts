var M;
class Main implements EventListenerObject{

    constructor() {
        this.showDevices();
    }

    private showDevices(){
        console.log("hola")
        let xmlRequest = new XMLHttpRequest();
        xmlRequest.onreadystatechange = ()=> {
            if(xmlRequest.readyState == 4){
                if(xmlRequest.status == 200){
                    console.log(xmlRequest.responseText, xmlRequest.readyState);
                    let respusta = xmlRequest.responseText;
                    let datos: Array<Device> = JSON.parse(respusta);
                    let div = document.getElementById("listaDisp");
                    for (let d of datos){
                        // Asigna 'checked' a isChecked si d.state es verdadero, de lo contrario, asigna una cadena vacía.
                        const isChecked = d.state ? 'checked' : '';
                        // Generamos un ID único para el dispositivo
                        const deviceId = `device_${d.id}`;
                        let type: string;
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
                            type = `  <form action="#">
                            <p class="range-field">
                                <input type="range" id="test5" min="0" max="100" />
                            </p>
                            </form>`
                        }

                        let deviceDiv = document.createElement("div"); 
                        deviceDiv.className = "col s12 m6 l4";
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
        
    }

    private eliminarDevice(){

    }

    private crearBotones(deviceDiv,div){
        // Creamos el boton para editar
        const buttonEditar = document.createElement("button"); 
        buttonEditar.textContent = "Editar";

        buttonEditar.onclick = () => { 
            this.editarDevice();
        };

        // Creamos el boton para eliminar
        const buttonEliminar = document.createElement("button");
        buttonEliminar.textContent = "Eliminar";

        //cuando hacemos clic llama a la funcion
        buttonEliminar.onclick = () => {
        this.eliminarDevice();
        };

        deviceDiv.appendChild(buttonEditar); //agrega el boton Editar al final del div
        deviceDiv.appendChild(buttonEliminar);//agrega el boton Eliminar al final del div

        div.appendChild(deviceDiv);
    }

    handleEvent(object: Event): void {
        let elemento = <HTMLElement> object.target;
        
    }


}
window.addEventListener("load",  ()=> {

    var elemsModal = document.querySelectorAll('.modal');
    M.Modal.init(elemsModal, null);

    let main: Main = new Main();


});