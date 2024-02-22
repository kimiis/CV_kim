const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/game/fondSakura.png'
})


const player = new Fighter({
    position: {
        x: 200,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/game/samourai/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './assets/game/samourai/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './assets/game/samourai/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './assets/game/samourai/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './assets/game/samourai/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './assets/game/samourai/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './assets/game/samourai/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './assets/game/samourai/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 160,
        height: 50
    }
})

const enemy = new Fighter({
    position: {
        x: 800,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './assets/game/Warrior/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: './assets/game/Warrior/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './assets/game/Warrior//Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './assets/game/Warrior/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './assets/game/Warrior/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './assets/game/Warrior/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './assets/game/Warrior/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './assets/game/Warrior/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    }
})

console.log(player)

const keys = {
    q: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()

    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    // player movement

    if (keys.q.pressed && player.lastKey === 'q') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    // jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    // Enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    // jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    // detect for collision & enemy gets hit
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking &&
        player.framesCurrent === 4
    ) {
        enemy.takeHit()
        player.isAttacking = false

        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
    }

    // if player misses
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }

    // this is where our player gets hit
    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking &&
        enemy.framesCurrent === 2
    ) {
        player.takeHit()
        enemy.isAttacking = false

        gsap.to('#playerHealth', {
            width: player.health + '%'
        })
    }

    // if player misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId })
    }
}

animate()

window.addEventListener('keydown', (event) => {
    if (!player.dead) {
        switch (event.key) {
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break
            case 'q':
                keys.q.pressed = true
                player.lastKey = 'q'
                break
            case 'z':
                player.velocity.y = -20
                break
            case ' ':
                player.attack()
                break
        }
    }

    if (!enemy.dead) {
        switch (event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break
            case 'ArrowUp':
                enemy.velocity.y = -20
                break
            case 'ArrowDown':
                enemy.attack()

                break
        }
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'q':
            keys.q.pressed = false
            break
    }

    // enemy keys
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})

function resetGame() {
    // si le joueur 2 gagne (kenji)
    // player = samourai

    if(!player.dead){
        // Réinitialisation du joueur
        player.position.x = 200;
        player.position.y = 0;
        player.velocity.x = 0;
        player.velocity.y = 0;
        player.health = 100;
        player.dead = false;
        player.isAttacking = false;
        player.image.src = './assets/game/samourai/Idle.png'; // Réinitialisation de l'image

        // Réinitialisation de l'ennemi
        enemy.position.x = 800;
        enemy.position.y = 0;
        enemy.velocity.x = 0;
        enemy.velocity.y = 0;
        enemy.health = 100;
        enemy.dead = false;
        enemy.isAttacking = false;
        enemy.image.src = './assets/game/Warrior/Idle.png'; // Réinitialisation de l'image


        // Réinitialisation des barres de vie
        gsap.to('#playerHealth', { width: '100%' });
        gsap.to('#enemyHealth', { width: '100%' });

        // // Réinitialisation des touches
        // keys.q.pressed = false;
        // keys.d.pressed = false;
        // keys.ArrowLeft.pressed = false;
        // keys.ArrowRight.pressed = false;

    } else {
        // Réinitialisation du joueur
        player.position.x = 0;
        player.position.y = 0;
        player.velocity.x = 0;
        player.velocity.y = 0;
        player.health = 100;
        player.dead = false;
        player.isAttacking = false;
        player.image.src = './assets/game/samourai/Idle.png'; // Réinitialisation de l'image

        // Réinitialisation de l'ennemi
        enemy.position.x = 500;
        enemy.position.y = 100;
        enemy.velocity.x = 0;
        enemy.velocity.y = 0;
        enemy.health = 100;
        enemy.dead = false;
        enemy.isAttacking = false;
        enemy.image.src = './assets/game/Warrior/Idle.png'; // Réinitialisation de l'image


        // Réinitialisation des barres de vie
        gsap.to('#playerHealth', { width: '100%' });
        gsap.to('#enemyHealth', { width: '100%' });

        // Réinitialisation des touches
        keys.q.pressed = false;
        keys.d.pressed = false;
        keys.ArrowLeft.pressed = false;
        keys.ArrowRight.pressed = false;
    }

}

window.addEventListener('keydown', (event) => {
    if (event.key === 'r') { // Par exemple, l'utilisateur peut appuyer sur la touche 'r' pour recommencer
        resetGame(); // Appelez la fonction de réinitialisation du jeu
    }
});
