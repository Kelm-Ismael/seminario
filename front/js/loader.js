document.addEventListener("DOMContentLoaded", async () => {

    const includes = document.querySelectorAll("[data-include]");

    for (const element of includes) {

        const file = element.getAttribute("data-include");

        const response = await fetch(file);

        element.innerHTML = await response.text();

    }

});