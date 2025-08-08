function openMenu() {
    document.querySelector('.side-menu').classList.add('active');
    document.querySelector('.menu-overlay').classList.add('active');
}

function closeMenu() {
    document.querySelector('.side-menu').classList.remove('active');
    document.querySelector('.menu-overlay').classList.remove('active');
}
