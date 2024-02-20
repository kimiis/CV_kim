document.addEventListener('DOMContentLoaded', function () {
    // ------------------------------------------------ partie machine à écrire de la card dans l'accueil---------------------------------------------------
    const intro = document.querySelector('.intro');
    const paragraphs = intro.querySelectorAll('p');

    // Appel récursif pour chaque paragraphe
    function typeParagraphs(index) {
        if (index < paragraphs.length) {
            const paragraph = paragraphs[index];
            const text = paragraph.textContent.trim();
            const originalHTML = paragraph.innerHTML;

            paragraph.innerHTML = '';

            let currentIndex = 0;
            let timer = setInterval(function () {
                if (currentIndex < text.length) {
                    paragraph.innerHTML += text.charAt(currentIndex); // Ajoute une lettre à la fois
                    currentIndex++;
                } else {
                    clearInterval(timer);
                    // Rétablit le HTML original après que tout le texte a été écrit
                    paragraph.innerHTML = originalHTML;
                    // Passe au paragraphe suivant
                    typeParagraphs(index + 1);
                }
            }, 50);
        }
    }

    // Démarre la fonction de dactylographie pour le premier paragraphe
    typeParagraphs(0);


// ------------------------------------------------ Fin partie machine à écrire de la card dans l'accueil---------------------------------------------------

//------------------------------------------------partie skills---------------------------------------------------
    const track = document.getElementById("image-track");

    window.addEventListener('mousedown', e => {
        track.dataset.mouseDownAt = e.clientX;
    });

    window.addEventListener('mouseup', () => {
        track.dataset.mouseDownAt = "0";
        track.dataset.prevPercentage = track.dataset.percentage;
    });

    window.addEventListener('mousemove', e => {
        if (track.dataset.mouseDownAt === "0") return;
        const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
            maxDelta = window.innerWidth / 2;

        const percentage = (mouseDelta / maxDelta) * -100,
            nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage,
            nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, -15), -100);

        track.dataset.percentage = nextPercentage;

        track.style.transform = `translate(${nextPercentage}%, -50%)`;

        let children = track.childElementCount;

        for (const image of track.querySelectorAll(".image")) {
            image.style.objectPosition = `${nextPercentage / children + (50 + 50 / children)}% center`;
        }
    });

    // ------------------------------------------------ Fin partie  skill ---------------------------------------------------
// Quand l'utilisateur fait défiler la page, afficher ou masquer la flèche en fonction de la position
    window.onscroll = function() {scrollFunction()};

    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            document.getElementById("scrollToTopButton").style.display = "block";
        } else {
            document.getElementById("scrollToTopButton").style.display = "none";
        }
    }

// Quand l'utilisateur clique sur la flèche, faire défiler la page vers le haut
    document.getElementById("scrollToTopButton").onclick = function() {
        document.body.scrollTop = 0; // Pour les navigateurs qui supportent document.body
        document.documentElement.scrollTop = 0; // Pour les navigateurs qui supportent document.documentElement
    }


});




