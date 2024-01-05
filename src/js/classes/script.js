document.addEventListener('DOMContentLoaded', (event) => {
    let year = document.querySelector("#year");
    let date = new Date();
    year.value = date.getFullYear();
    
})