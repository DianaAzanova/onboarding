$(document).ready(function() {
    // Дата окончания/старта чего-то там (year, month - 1, day, hour, minute, second)
    var date = new Date(Date.UTC(2018, 6, 18, 0, 0, 0));

    // В какой момент обновлять таймер (в мс)
    // 1000 - 1 секунда
    // 60000 - 1 минута
    var update = 1000;

    var getCurrentDate = function() {
        var distance = new Date(date).getTime() - new Date().getTime();

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (distance < 0) {
            clearInterval(getTimer);
            $('.x_timer').hide();
        } else {
            // Формат возвращаемого значения
            $('#timer_days').text(days);
            $('#timer_hours').text(hours);
            $('#timer_minutes').text(minutes);
            $('#timer_seconds').text(seconds);
        }
    };

    getCurrentDate();

    var getTimer = setInterval(function() {
        getCurrentDate();
    }, update);
});
