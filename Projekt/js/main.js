let currentSlide = 1;  // Startujemy od pierwszego "prawdziwego" obrazu
const slides = document.querySelector('.carousel-slides');
const totalSlides = document.querySelectorAll('.carousel-slides img').length;
const slideWidth = 100;  // Każdy slajd zajmuje 100% szerokości kontenera

// Ustawienie początkowego położenia na pierwszym prawdziwym obrazie
slides.style.transform = `translateX(-${currentSlide * slideWidth}%)`;

function showSlide(index) {
    currentSlide = index;
    slides.style.transition = 'transform 0.5s ease-in-out';
    slides.style.transform = `translateX(-${currentSlide * slideWidth}%)`;

    // Po zakończeniu animacji sprawdzamy, czy jesteśmy na duplikacie
    slides.addEventListener('transitionend', handleLoop);
}

function handleLoop() {
    // Jeśli jesteśmy na duplikacie pierwszego obrazu (po prawej)
    if (currentSlide === totalSlides - 1) {
        slides.style.transition = 'none';  // Wyłączamy animację
        currentSlide = 1;  // Przeskakujemy na prawdziwy pierwszy slajd
        slides.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
    }

    // Jeśli jesteśmy na duplikacie ostatniego obrazu (po lewej)
    if (currentSlide === 0) {
        slides.style.transition = 'none';  // Wyłączamy animację
        currentSlide = totalSlides - 2;  // Przeskakujemy na prawdziwy ostatni slajd
        slides.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
    }
}

// Funkcje do przesuwania slajdów
function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

// Automatyczne przewijanie co 5 sekund
setInterval(() => {
    nextSlide();
}, 5000);





// MENU
// Obsługa kliknięcia menu rozwijanego na urządzeniach mobilnych
document.querySelectorAll('.dropdown > a').forEach(menu => {
  menu.addEventListener('click', (e) => {
      e.preventDefault();
      const dropdownContent = menu.nextElementSibling;
      dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
  });
});



// Obsługa formularza kontaktowego
function handleSubmit(event) {
  event.preventDefault(); // Zapobiega przeładowaniu strony

  // Pobieranie danych z formularza
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  // Wyświetlanie danych na stronie
  const formResponse = document.getElementById("formResponse");
  formResponse.innerHTML = `<p>Dziękujemy, ${name}! Otrzymaliśmy Twoją wiadomość.</p>
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Temat:</strong> ${subject}</p>
                            <p><strong>Wiadomość:</strong> ${message}</p>`;

  // Czyszczenie formularza
  document.getElementById("contactForm").reset();
}