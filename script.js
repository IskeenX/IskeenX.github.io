function loadSection(section) {
    fetch(`Pages/${section}.html`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('content').innerHTML = data;
        });
}


const buttons = document.querySelectorAll("button");
const active = document.querySelectorAll("active");
for (let i = 0; i < buttons.length; i++) {
    buttons[i].onclick = function () {
        let move = (100 / buttons.length) * i;
        active.style.left = move + "%";
    };
}
