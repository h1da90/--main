
document.addEventListener('DOMContentLoaded', () => {
    
    // Находим кнопку по её классу
    const myButton = document.querySelector('.button1');

if (myButton) {
    myButton.addEventListener('click', () => {
        console.log('Кнопка нажата, перехожу на event.html...');
        
        // Автоматически берем адрес текущей папки и добавляем к нему имя файла
        const currentPath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
        
        // Меняем страницу с учетом правильного пути репозитория гитхаба
        window.location.href = window.location.origin + currentPath + 'event.html';
    });
}

});