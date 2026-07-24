document.addEventListener("DOMContentLoaded", async () => {

    const includes = document.querySelectorAll("[data-include]");

    for (const element of includes) {

        const file = element.getAttribute("data-include");

        const response = await fetch(file);

        element.innerHTML = await response.text();

    }

});


document.addEventListener("DOMContentLoaded",()=>{


fetch("../components/sidebar/sidebar.html")

.then(res=>res.text())

.then(data=>{

document.querySelector("#sidebar").innerHTML=data;

});




fetch("../components/navbar/navbar.html")

.then(res=>res.text())

.then(data=>{

document.querySelector("#navbar").innerHTML=data;

});



});