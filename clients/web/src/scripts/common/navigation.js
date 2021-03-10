export const navHandling = (e) => {
  // this handles the panel sliding feature
  e.preventDefault()
  const panelElement = document.querySelector('body > main .panelSlider')
  e.target.classList.contains('profile')
    ? panelElement.classList.add('left')
    : panelElement.classList.remove('left')
}
  