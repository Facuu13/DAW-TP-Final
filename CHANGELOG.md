# DAW Base App - Changes Log

Todos los cambios notables en este proyecto se documentarán en este archivo.

El formato se basa en [Keep a Changelog](http://keepachangelog.com/) y este proyecto se adhiere al [Semantic Versioning](http://semver.org/).


## 1.1

* Base de datos:
    * Se agrego a la tabla **Devices** un nuevo campo llamado **intensity** para poder manejar la intensidad de los dispositivos
* Backend:
    * Se actualizaron los metodos para que se pueda manejar esta nueva caracteristica.
* Frontend:
    * Se hicieron las modificaciones pertinentes para que se pueda manejar la intensidad, esto se va a poder manejar desde el range.

## 1.0

* Backend:
    * Funcionalidad para borrar un dispositivo.
    * Funcionalidad para agregar un nuevo dispositivo.
    * Tener la posibilidad desde el backend de no solo actualizar el valor del estado, sino de actualizar cualquier valor.
* Frontend:
    * Edición de dispositivos existentes. Nombre, descripción, tipo.
    * Posibilidad de agregar o quitar dispositivos.
    * Posibilidad de indicar qué valores de estado puede asumir el dispositivo.
    * También se implemento un range pero no tiene ningun efecto, solo estetico.