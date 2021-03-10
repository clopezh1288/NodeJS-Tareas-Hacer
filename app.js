require('colors');
const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { inquirerMenu
        ,pausa
        ,leerInput
        ,listadoTareasBorrar
        ,confirmar
        ,mostrarListadoChecklist
    } = require('./helpers/inquirer');
const Tareas = require('./models/tareas');

const main = async() => {
    console.log('Hola Mundo');

    let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if(tareasDB){
        tareas.cargarTareasFromArray(tareasDB);
    }


    do{
        opt = await inquirerMenu();
        
        switch(opt){
            case '1':
                //Crear opcion
                const desc = await leerInput('Descripcion:');
                tareas.crearTarea(desc);
                break;
            case '2':
                tareas.listadoCompletado();
                break;
            case '3': // Listar Completadas
                tareas.listarPendientesCompletadas(true);
                break;
            case '4': // Listar Pendientes
                tareas.listarPendientesCompletadas(false);
                break;
            case '5': // Compleatdo | Pendiente
                const ids = await mostrarListadoChecklist(tareas._listadArr);
                tareas.toggleCompletadas(ids);
                break;

            case '6': // Borrar
                const id = await listadoTareasBorrar(tareas._listadArr);
                if(id !== '0'){
                    const ok = await confirmar('Estas seguro?');
                    if(ok){
                        tareas.borrarTarea(id);
                        console.log('tarea borrada');
                    }
                }
                break;
        }

        guardarDB(tareas._listadArr);


        await pausa();
        
    }while(opt !== '0');
    
    //pausa();
}

main();