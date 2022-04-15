function openThumbnail(path) {
  window.location.assign(path);
}
document.querySelectorAll('.thumb').forEach(thumb => {
  thumb.addEventListener('click', event => {
    const path = thumb.getAttribute("data-fullscreen");
    openThumbnail(path);
    //console.log(path)
  })
})
