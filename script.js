$(document).ready(() => {
    let isDrag = false; // Variável para verificar se o usuário está arrastando a bola
    let activeBola = null;
    let velocity = { x: 0, y: 0 };
    let lastPos = { x: 0, y: 0 };


    $('.bola').mousedown((event) => {
        isDrag = true;
        activeBola = '#' + event.target.id; // Pega o Id da bola que está sendo arrastada
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
            let newTop = offset.top + velocity.y;
            let newLeft = offset.left + velocity.x;
    
            // Verificar colisão com a borda da tela
            if(newLeft < 0 || newTop < 0 || 
               newLeft + $(activeBola).width() > $(window).width() || 
               newTop + $(activeBola).height() > $(window).height()) {

                // Inverter a direção da bola
                velocity.x *= -1;
                velocity.y *= -1;
            } else {
                offset.top = newTop;
                offset.left = newLeft;
                $(activeBola).offset(offset);
            }
    
            // Desaceleração
            velocity.x *= 0.9;
            velocity.y *= 0.9;
        }
    }, 20);

    function checkCollision() {
        let bolas = $('.bola');
    
        for(let i = 0; i < bolas.length; i++) {
            let bola1 = $(bolas[i]);
            let offset1 = bola1.offset();
    
            // Verificar colisão com outras bolas
            for(let j = i + 1; j < bolas.length; j++) {
                let bola2 = $(bolas[j]);
                let offset2 = bola2.offset();
    
                let dx = offset1.left - offset2.left;
                let dy = offset1.top - offset2.top;
                let distance = Math.sqrt(dx * dx + dy * dy);
    
                if(distance < bola1.width()/2 + bola2.width()/2) {
                    console.log(`A bola ${bola1.attr('id')} colidiu com a bola ${bola2.attr('id')}.`);
                    updatePosition(bola1);
                }

                
            }
        }
    }

    let lastPositions = {}; // Objeto para armazenar a última posição de cada bola

    function storeLastPosition(bola) {
        let offset = $(bola).offset(); // Obter a posição atual da bola
        lastPositions[bola.attr('id')] = { x: offset.left, y: offset.top }; // Armazenar a posição atual como a última posição
    }
    
    $('.bola').mouseup(() => {
        isDrag = false;
        storeLastPosition($(activeBola)); // Armazenar a última posição quando o mouse é solto
    });
    
    function updatePosition(bola) {
        let offset = $(bola).offset();
        let newTop = offset.top + velocity.y;
        let newLeft = offset.left + velocity.x;

        // Verificar se a nova posição ultrapassa a última posição de qualquer outra bola
        for(let id in lastPositions) {
            if(id !== bola.attr('id')) {
                let lastPos = lastPositions[id];
                if(newLeft < lastPos.x + bola.width() && newLeft + bola.width() > lastPos.x &&
                newTop < lastPos.y + bola.height() && newTop + bola.height() > lastPos.y) {
                    // Inverter a direção da bola
                    velocity.x *= -1;
                    velocity.y *= -1;
                    return;
                }
            }
        }

        // Atualizar a posição da bola
        offset.top = newTop;
        offset.left = newLeft;
        $(bola).offset(offset);

        // Armazenar a nova posição como a última posição
        storeLastPosition(bola);
    }


    // Chamar a função checkCollision a cada intervalo de tempo
    setInterval(checkCollision, 20);  



});
