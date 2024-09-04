$(document).ready(() => {
    let velocity = { x: 0, y: 0 };
    let lastPositions = {}; // Armazena a última posição de cada bola
    let activeBola = null; // Bola atualmente arrastada

    // Inicializar o draggable para todas as bolas
    $('.bola').draggable({
        start: function(event, ui) {
            // Marca a bola ativa e armazena a última posição ao começar o arraste
            activeBola = $(this);
            let bolaId = activeBola.attr('id');
            lastPositions[bolaId] = { x: ui.position.left, y: ui.position.top };
        },
        drag: function(event, ui) {
            // Calcular a nova velocidade com base no movimento
            let bolaId = $(this).attr('id');
            let lastPos = lastPositions[bolaId];
            velocity = { 
                x: ui.position.left - lastPos.x, 
                y: ui.position.top - lastPos.y 
            };

            // Atualizar a última posição
            lastPositions[bolaId] = { x: ui.position.left, y: ui.position.top };
        },
        stop: function(event, ui) {
            // Continua o movimento apenas para a bola que foi arrastada
            if (activeBola) {
                moveBall(activeBola);
            }
        }
    });

    function moveBall(bola) {
        // Interrompe o movimento anterior, se necessário
        clearInterval(bola.data('interval'));
        let interval = setInterval(() => {
            let offset = bola.offset();
            let newTop = offset.top + velocity.y;
            let newLeft = offset.left + velocity.x;

            // Verificar colisão com a borda da tela
            if (newLeft < 0 || newTop < 0 || 
                newLeft + bola.width() > $(window).width() || 
                newTop + bola.height() > $(window).height()) {

                // Inverter a direção da bola
                velocity.x *= -1;
                velocity.y *= -1;
            } else {
                offset.top = newTop;
                offset.left = newLeft;
                bola.offset(offset);
            }

            // Desaceleração
            velocity.x *= 0.9;
            velocity.y *= 0.9;

            // Parar o movimento quando a velocidade for baixa o suficiente
            if (Math.abs(velocity.x) < 0.1 && Math.abs(velocity.y) < 0.1) {
                clearInterval(bola.data('interval'));
            }
        }, 20);

        bola.data('interval', interval); // Armazena o intervalo para parar o movimento posteriormente
    }

    function checkCollision() {
        let bolas = $('.bola');

        for (let i = 0; i < bolas.length; i++) {
            let bola1 = $(bolas[i]);
            let offset1 = bola1.offset();

            for (let j = i + 1; j < bolas.length; j++) {
                let bola2 = $(bolas[j]);
                let offset2 = bola2.offset();

                let dx = offset1.left - offset2.left;
                let dy = offset1.top - offset2.top;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < bola1.width()/2 + bola2.width()/2) {
                    console.log(`A bola ${bola1.attr('id')} colidiu com a bola ${bola2.attr('id')}.`);
                    updatePosition(bola1);
                }
            }
        }
    }

    function updatePosition(bola) {
        let offset = bola.offset();
        let newTop = offset.top + velocity.y;
        let newLeft = offset.left + velocity.x;

        // Verificar se a nova posição ultrapassa a última posição de qualquer outra bola
        for (let id in lastPositions) {
            if (id !== bola.attr('id')) {
                let lastPos = lastPositions[id];
                if (newLeft < lastPos.x + bola.width() && newLeft + bola.width() > lastPos.x &&
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
        bola.offset(offset);

        // Armazenar a nova posição como a última posição
        storeLastPosition(bola);
    }

    setInterval(checkCollision, 20);  
});

