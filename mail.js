
document.addEventListener('DOMContentLoaded', () => {
    
    // Находим кнопку по её классу
    const myButton = document.querySelector('.button1');

    // Проверяем, что кнопка нашлась на странице, чтобы не было ошибок
    if (myButton) {
        // Слушаем клик по кнопке
        myButton.addEventListener('click', () => {
            
            // Перенаправляем пользователя на новый HTML-файл
            window.location.href = '/event.html'; 
            
        });
    }

});