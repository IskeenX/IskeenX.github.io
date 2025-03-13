function loadSection(section) {
    fetch(`/Pages/${section}.html`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('content').innerHTML = data;
        });
}
