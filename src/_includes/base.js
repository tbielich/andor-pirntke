function openThumbnail(path) {
  window.location.assign(path);
}
document.querySelectorAll('picture').forEach(thumb => {
  thumb.addEventListener('click', event => {
    const path = thumb.getAttribute("data-fullscreen");
    openThumbnail(path);
    //console.log(path)
  })
})
