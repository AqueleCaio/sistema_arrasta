$(document).ready(() => {
    let isDrag = false; // Variável para verificar se o usuário está arrastando a bola
    let activeBola = null;
    let velocity = { x: 0, y: 0 };
    let lastPos = { x: 0, y: 0 };


    $('.bola').mousedown((event) => {
        isDrag = true;
        activeBola = '#' + event.target.id;
        lastPos = { x: event.pageX, y: event.pageY };
    });

    $('.bola').mouseup(() => {
        isDrag = false;
    });

    $('body').mousemove((event) => {
        if(isDrag) {
            let newPos = { x: event.pageX, y: event.pageY };
            velocity = { x: newPos.x - lastPos.x, y: newPos.y - lastPos.y };
            lastPos = newPos;

            $(activeBola).offset({
                top: event.pageY - $(activeBola).width() / 2,
                left: event.pageX - $(activeBola).height() / 2
            });
        }
    });

    setInterval(() => {
        if(!isDrag && activeBola) {
            let offset = $(activeBola).offset();
            offset.top += velocity.y;
            offset.left += velocity.x;
            $(activeBola).offset(offset);

            // Desaceleração
            velocity.x *= 0.9;
            velocity.y *= 0.9;
        }
    }, 20);
});

function checkCollision() {
    let bolas = $('.bola');
    let windowWidth = $(window).width();
    let windowHeight = $(window).height();

    for(let i = 0; i < bolas.length; i++) {
        let bola1 = $(bolas[i]);
        let offset1 = bola1.offset();

        // Verificar colisão com a borda da tela
        if(offset1.left < 0 || offset1.top < 0 || 
           offset1.left + bola1.width() > windowWidth || 
           offset1.top + bola1.height() > windowHeight) {
            console.log(`A bola ${bola1.attr('id')} colidiu com a borda da tela.`);
        }

        // Verificar colisão com outras bolas
        for(let j = i + 1; j < bolas.length; j++) {
            let bola2 = $(bolas[j]);
            let offset2 = bola2.offset();

            let dx = offset1.left - offset2.left;
            let dy = offset1.top - offset2.top;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if(distance < bola1.width()/2 + bola2.width()/2) {
                console.log(`A bola ${bola1.attr('id')} colidiu com a bola ${bola2.attr('id')}.`);
            }
        }
    }
}

// Chamar a função checkCollision a cada intervalo de tempo
setInterval(checkCollision, 20);

