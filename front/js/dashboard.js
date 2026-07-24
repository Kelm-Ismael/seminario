document.addEventListener("DOMContentLoaded", () => {


    console.log("Dashboard iniciado");



    /*
    =====================================
        SELECCIONAR HORARIOS
    =====================================
    */


    const hours = document.querySelectorAll(".hours button");


    hours.forEach(hour => {


        hour.addEventListener("click", () => {


            // quitar selección anterior

            hours.forEach(btn => {

                btn.classList.remove("selected-hour");

            });



            // seleccionar nuevo horario

            hour.classList.add("selected-hour");


            console.log(
                "Horario seleccionado:",
                hour.textContent
            );


        });


    });







    /*
    =====================================
        EMPLEADOS
    =====================================
    */


    const employees = document.querySelectorAll(
        ".employees button"
    );



    employees.forEach(employee => {


        employee.addEventListener("click",()=>{


            employees.forEach(emp=>{

                emp.classList.remove("active");

            });



            employee.classList.add("active");



            console.log(
                "Empleado:",
                employee.textContent
            );



        });



    });







    /*
    =====================================
        CALENDARIO
    =====================================
    */


    const calendarDays =
        document.querySelectorAll(
            ".calendar div"
        );



    calendarDays.forEach(day=>{


        day.addEventListener("click",()=>{


            calendarDays.forEach(d=>{

                d.classList.remove(
                    "selected-day"
                );

            });



            day.classList.add(
                "selected-day"
            );



            console.log(
                "Día seleccionado:",
                day.textContent
            );


        });


    });








    /*
    =====================================
        BUSCADOR TURNOS
    =====================================
    */


    const search =
        document.querySelector(
            ".appointments input"
        );



    const appointments =
        document.querySelectorAll(
            ".appointment"
        );



    if(search){


        search.addEventListener(
            "input",
            ()=>{


                const value =
                search.value.toLowerCase();



                appointments.forEach(item=>{


                    const text =
                    item.textContent
                    .toLowerCase();



                    if(text.includes(value)){


                        item.style.display="flex";


                    }else{


                        item.style.display="none";


                    }



                });



            }
        );


    }









    /*
    =====================================
        BOTON TODOS LOS TURNOS
    =====================================
    */


    const viewAll =
    document.querySelector(
        ".view-all"
    );



    if(viewAll){


        viewAll.addEventListener(
            "click",
            ()=>{


                alert(
                    "Cargando todos los turnos..."
                );


            }
        );


    }









    /*
    =====================================
        BOTONES METRICAS
    =====================================
    */


    const metricCards =
    document.querySelectorAll(
        ".metric-card"
    );



    metricCards.forEach(card=>{


        card.addEventListener(
            "click",
            ()=>{


                metricCards.forEach(c=>{

                    c.classList.remove(
                        "active"
                    );

                });



                card.classList.add(
                    "active"
                );



            }
        );


    });






});