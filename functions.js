var fullHeight = window.innerHeight + "px";
window.addEventListener('resize', change);

function change(){
    fullHeight = window.innerHeight + "px";
    document.getElementById('HERO').style.height = fullHeight;
    document.getElementById('IMPRINT').style.height = fullHeight;
    document.getElementById('PARTNER').style.height = fullHeight;
}

change();
