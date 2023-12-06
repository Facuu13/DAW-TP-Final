var M;
class Main implements EventListenerObject{
    //inicializamos la variable global device
    device:Device = new Device();

    constructor() {
        this.showDevices(); //Llamamos la funcion de mostrar dispositivos para 
        //que cuando inicie la pagina, se muestren de manera automatica
    }

    //Funcion que sirve para mostrar los dispositivos y para hacer un refresh
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
                        // Generamos un ID único para el checkbox basado en el ID del dispositivo
                        const checkboxId = `cb_${d.id}`;
                        const rangeId = `rg_${d.id}`;

                        //dependiendo del estado, se va ir alternando el icono de encendido o apagado
                        const icon= d.state ? 'flash_on' : 'flash_off';;

                        type = `
                        <div class="switch">
                            <label class=label-checkbox>
                                Off
                                <input type="checkbox" id="${checkboxId}" ${isChecked}>
                                <span class="lever"></span>
                                On
                            </label>
                        </div>`
                        if(d.type == 1){
                            type += `<form action="#">
                            <p class="range-field">
                                <input type="range" id="${rangeId}" min="0" max="1" step="0.1" value="${d.intensity}" ${isDisabled}/>
                            </p>
                            </form>`
                        }

                        deviceDiv.innerHTML += `<div class=device-container><i class="small material-icons">${icon}</i>
                        <h4>${d.name}</h4>
                        <p>${d.description}</p>
                        ${type}
                        </div>`
                        div.appendChild(deviceDiv);
                        this.crearBotones(deviceDiv,div,d);

                    }

                    for(let d of datos){
                        let checkbox = document.getElementById(`cb_${d.id}`);
                        checkbox.addEventListener("click",this);
                    }
                }
                    
            }
        
        }
        xmlRequest.open("GET","http://localhost:8000/devices",true); //lo ponemos en true para que se ejecute de forma asincrona
        xmlRequest.send();
    }

    //Funcion para editar los valores de un dispositivos
    private editarDevice(device:Device,name_id:string,desc_id:string,state_id:string,type_id:string){
        // Obtener el elemento input por su ID
        const nombre = document.getElementById(`${name_id}`) as HTMLInputElement;
        const description = document.getElementById(`${desc_id}`) as HTMLInputElement;
        // Obtener el elemento select por su ID
        const state = document.getElementById(`${state_id}`) as HTMLSelectElement;
        const type = document.getElementById(`${type_id}`) as HTMLSelectElement;
        //Obtenemos los valores
        const n = nombre.value;
        const d = description.value;
        const s = Number(state.value);
        const t = Number(type.value);
        //actualizamos los valores
        this.device.name = n;
        this.device.description = d;
        this.device.state = s;
        this.device.type =t;

        this.ejecutarPUT(this.device,device.id); //llamamos al metodo put para actualizar los valores
        this.showDevices();//refresh   
    }

    //Funcion para eliminar un dispositivo
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

    //Funcion para crear los botones de los dispositivos
    private crearBotones(deviceDiv,div,d){
        
        //creamos una variable para la id del modal
        let modal_id: string;
        modal_id = `modal${deviceDiv.id}`;

        // Creamos el boton para editar como modal
        const a = document.createElement("a");
        a.className = "waves-effect waves-light btn modal-trigger transparent";
        a.href = `#${modal_id}`;
        a.textContent = "Editar";

        //Id unica para cada boton de editar
        let btn_edit_id : string;
        btn_edit_id = `btnEditar_${deviceDiv.id}`;

        //id unicas para el modal
        let name_id : string;
        name_id = `eNombre${deviceDiv.id}`;

        let desc_id : string;
        desc_id = `eDescription${deviceDiv.id}`;

        let state_id : string;
        state_id = `eState${deviceDiv.id}`;

        let type_id : string;
        type_id = `eType${deviceDiv.id}`;

        // se generala el html del modal de manera dinamica para cada device
        const htmlModal = `
        <div id="${modal_id}" class="modal" style="display: none;">
            <div class="modal-content">
                <h4>Editar dispositivo</h4>
                    <div class="input-field">
                        <label for="${name_id}">Nombre del dispositivo</label>
                        <input id="${name_id}" type="text" placeholder="Lampara 2" value="" />
                    </div>
                    <div class="input-field">
                        <label for="${desc_id}">Descripción del dispositivo</label>
                        <input id="${desc_id}" type="text" placeholder="Luz living" value="" />
                    </div>
                    <div class="input-field">
                        <select id="${state_id}">
                            <option value="" disabled selected>Estado del dispositivo</option>
                            <option value="0">Apagado</option>
                            <option value="1">Encendido</option>
                        </select>
                    </div>
                    <div class="input-field">
                        <select id="${type_id}">
                            <option value="" disabled selected>Manejar intensidad?</option>
                            <option value="0">No</option>
                            <option value="1">Si</option>
                        </select>
                    </div>
            </div>
            <div class="modal-footer">
                <a href="#!" class="modal-close waves-effect waves-green btn-flat">Cancelar</a>
                <button class="modal-close waves-effect waves-green btn-flat" id="${btn_edit_id}">Guardar</button>
            </div>
        </div>
        `;

        // Creamos el boton para eliminar
        const buttonEliminar = document.createElement("button");
        buttonEliminar.className="waves-effect waves-light btn modal-trigger transparent";
        buttonEliminar.textContent = "Eliminar";

        //cuando hacemos clic llama a la funcion
        buttonEliminar.onclick = () => {
        this.eliminarDevice(deviceDiv.id);
        };

        deviceDiv.appendChild(a);  //Agregamos el modal
        deviceDiv.innerHTML += htmlModal;

        // Inicializar el modal dinámico después de agregarlo al DOM
        const modalElement = deviceDiv.querySelector(`#${modal_id}`);
        M.Modal.init(modalElement, null);

        // Inicializar los selects dentro del modal
        const selectElements = deviceDiv.querySelectorAll('select');
        M.FormSelect.init(selectElements, null);
        
        deviceDiv.appendChild(buttonEliminar);//agrega el boton Eliminar al final del div

        div.appendChild(deviceDiv);

        //Asignamos la funcion al boton guardar de editar
        let botonEditar = document.getElementById(btn_edit_id)
        botonEditar.addEventListener("click",()=>{
            this.editarDevice(d,name_id,desc_id,state_id,type_id);
        })
    }

    //Funcion para agregar nuevos dispositivos
    private agregarDevice(){
        // Obtener el elemento input por su ID
        const nombre = document.getElementById("iNombre") as HTMLInputElement;
        const description = document.getElementById("iDescription") as HTMLInputElement;
        // Obtener el elemento select por su ID
        const state = document.getElementById("iState") as HTMLSelectElement;
        const type = document.getElementById("iType") as HTMLSelectElement;

        //Obtenemos los valores del modal
        const n = nombre.value;
        const d = description.value;
        const s = Number(state.value);
        const t = Number(type.value);

        this.device.name = n;
        this.device.description = d;
        this.device.state = s;
        this.device.type =t;

        this.ejecutarPost(this.device); //llamamos al metodo post para agregar el nuevo dispositivo
        this.showDevices();//refresh
    }

    //Funcion para ejecutar el metodo POST para agregar un nuevo dispositivo
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

    //Funcion para ejecutar el metodo POST para actualizar el state de los dispositivo
    private ejecutarPostState(id:number,state:boolean){
        let xmlRequest = new XMLHttpRequest();
        xmlRequest.onreadystatechange = ()=> {
            if(xmlRequest.readyState == 4){
                if(xmlRequest.status == 200){
                    console.log("llego respuesta",xmlRequest.responseText);
                }
            }

        }
        xmlRequest.open("POST","http://localhost:8000/deviceState",true); //lo ponemos en true para que se ejecute de forma asincrona
        xmlRequest.setRequestHeader("Content-Type","application/json"); //se indica el formato en el que se va enviar la informacion
        let s = {id:id,
                state:state};
        xmlRequest.send(JSON.stringify(s));
    }

    //Funcion para ejecutar el metodo POST para actualizar el intensity de los dispositivo
    private ejecutarPostIntensity(id:number,intensity:number){
        let xmlRequest = new XMLHttpRequest();
        xmlRequest.onreadystatechange = ()=> {
            if(xmlRequest.readyState == 4){
                if(xmlRequest.status == 200){
                    console.log("llego respuesta",xmlRequest.responseText);
                }
            }

        }
        xmlRequest.open("POST","http://localhost:8000/deviceIntensity",true); //lo ponemos en true para que se ejecute de forma asincrona
        xmlRequest.setRequestHeader("Content-Type","application/json"); //se indica el formato en el que se va enviar la informacion
        let s = {id:id,
                intensity:intensity};
        xmlRequest.send(JSON.stringify(s));
    }

    //Funcion para ejecutar el metodo DELETE
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

    //Funcion para ejecutar el metodo PUT
    private ejecutarPUT(device:Device,id:number){
        let xmlRequest = new XMLHttpRequest();
        xmlRequest.onreadystatechange = ()=> {
            if(xmlRequest.readyState == 4){
                if(xmlRequest.status == 200){
                    console.log("llego put",xmlRequest.responseText);
                }
            }
        }
        const url = `http://localhost:8000/devices/${id}`; // incorporamos el ID en la URL
        xmlRequest.open("PUT",url,true);
        xmlRequest.setRequestHeader("Content-Type","application/json"); //se indica el formato en el que se va enviar la informacion
        xmlRequest.send(JSON.stringify(device));
    }



    handleEvent(object: Event): void {
        let elemento = <HTMLElement> object.target;
        console.log(elemento.id)
        if("btnAgregar" === elemento.id){
            this.agregarDevice();
        }else if(elemento.id.startsWith("cb_")){ //elemento.checked para saber si esta en true o false
            let checkbox = <HTMLInputElement>elemento; //casteamos
            console.log(checkbox.checked,elemento.id.substring(3,4))
            this.ejecutarPostState(Number(elemento.id.substring(3,elemento.id.length)),checkbox.checked);
            this.showDevices(); //refresh
        }
    }

}
window.addEventListener("load",  ()=> {

    var elemsModal = document.querySelectorAll('.modal');
    M.Modal.init(elemsModal, null);

    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems, null);

    // Creamos una instancia de la clase Main
    let main: Main = new Main();

    let botonAgregar = document.getElementById("btnAgregar")
    botonAgregar.addEventListener("click",main)

});