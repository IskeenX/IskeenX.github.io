function loadSection(section) {
    fetch(`Pages/${section}.html`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('content').innerHTML = data;
            document.querySelectorAll("nav a").forEach(a => a.classList.remove("active"));
            document.querySelector(`nav a[onclick="loadSection('${section}')"]`).classList.add("active");
        });
}
