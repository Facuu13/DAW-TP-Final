var M;
class Main implements EventListenerObject{
    //inicializamos la variable global device
    device:Device = new Device();

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
                    div.innerHTML = '';
                    for (let d of datos){
                        // Asigna 'checked' a isChecked si d.state es verdadero, de lo contrario, asigna una cadena vacía.
                        const isChecked = d.state ? 'checked' : '';
                        // Asigna 'disable' a isChecked si d.state es falso, de lo contrario, asigna una cadena vacía.
                        //esto se hace para habilitar el range
                        const isDisabled = d.state ? '' : 'disabled';
                        // Generamos un ID único para el dispositivo
                        const deviceId = `${d.id}`;
                        let type: string;
                        
                        let deviceDiv = document.createElement("div"); 
                        deviceDiv.className = "col s12 m6 lg3";
                        deviceDiv.id = deviceId;

                        type = `
                        <div class="switch">
                            <label>
                                Off
                                <input type="checkbox" ${isChecked}>
                                <span class="lever"></span>
                                On
                            </label>
                        </div>`
                        if(d.type == 1){
                            type += `<form action="#">
                            <p class="range-field">
                                <input type="range" id="test5" min="0" max="100" ${isDisabled}/>
                            </p>
                            </form>`
                        }

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
            const miDiv= document.getElementById(id);
            if(miDiv){
                console.log("eliminamos device",id)
                this.ejecutarDelete(id);
                this.showDevices(); //refresh

            }
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
        
        
        //hacer un objeto devices y buscar todos los valores
        // Obtener el elemento input por su ID
        const nombre = document.getElementById("iNombre") as HTMLInputElement;
        const description = document.getElementById("iDescription") as HTMLInputElement;

        // Obtener el elemento select por su ID
        const state = document.getElementById("iState") as HTMLSelectElement;
        const type = document.getElementById("iType") as HTMLSelectElement;

        const n = nombre.value;
        const d = description.value;
        const s = Number(state.value);
        const t = Number(type.value);

        this.device.name = n;
        this.device.description = d;
        this.device.state = s;
        this.device.type =t;


        console.log("nombre",n);
        console.log("descripcion",d);
        console.log("estado",s);
        console.log("type",t);

        this.ejecutarPost(this.device); //llamamos al metodo post
        this.showDevices();//refresh
        

    }

    private ejecutarPost(device:Device){
        let xmlRequest = new XMLHttpRequest();
        xmlRequest.onreadystatechange = ()=> {
            if(xmlRequest.readyState == 4){
                if(xmlRequest.status == 200){
                    console.log("llego respuesta",xmlRequest.responseText);
                }
            }

        }
        xmlRequest.open("POST","http://localhost:8000/device",true); //lo ponemos en true para que se ejecute de forma asincrona
        xmlRequest.setRequestHeader("Content-Type","application/json"); //se indica el formato en el que se va enviar la informacion
        xmlRequest.send(JSON.stringify(device));
    }

    //Funcion para ejecutar el metodo delete
    private ejecutarDelete(id:string){
        let xmlRequest = new XMLHttpRequest();
        xmlRequest.onreadystatechange = ()=> {
            if(xmlRequest.readyState == 4){
                if(xmlRequest.status == 200){
                }
            }
        }
        const url = `http://localhost:8000/devices/${id}`; // incorporamos el ID en la URL
        xmlRequest.open("DELETE",url,true);
        xmlRequest.send(null);
    }

    handleEvent(object: Event): void {
        let elemento = <HTMLElement> object.target;
        console.log(elemento.id)
        if("btnRefresh" === elemento.id){ //el triple igual me valida el tipo de dato y el valor. El doble igual solamente el valor
            this.showDevices();
        }else if("btnAgregar" === elemento.id){
            this.agregarDevice();
        }
    }


}
window.addEventListener("load",  ()=> {

    var elemsModal = document.querySelectorAll('.modal');
    M.Modal.init(elemsModal, null);

    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems, null);

    let main: Main = new Main();

    let botonHola = document.getElementById("btnRefresh")
    botonHola.addEventListener("click",main)

    let botonPrueba = document.getElementById("btnAgregar")
    botonPrueba.addEventListener("click",main)


});