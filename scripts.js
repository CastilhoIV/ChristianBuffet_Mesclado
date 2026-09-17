/* =========================================================
   CHRISTIAN BUFFET & EVENTOS
   Interações da página
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     MENU MOBILE
     ========================================================= */

  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  const closeMenu = () => {
    if (!mainNav) return;

    mainNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Abrir menu");
  };

  menuToggle?.addEventListener("click", () => {
    if (!mainNav) return;

    const isOpen = mainNav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Fechar menu" : "Abrir menu"
    );
  });

  mainNav?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", event => {
    if (
      mainNav?.classList.contains("open") &&
      !mainNav.contains(event.target) &&
      !menuToggle?.contains(event.target)
    ) {
      closeMenu();
    }
  });

  /* =========================================================
     SIMULADOR DE ORÇAMENTO
     ========================================================= */

  const form = document.getElementById("budgetForm");
  const estimate = document.getElementById("estimate");

  form?.addEventListener("submit", event => {
    event.preventDefault();

    const type = document.getElementById("eventType")?.value.trim();
    const guests = Number(document.getElementById("guests")?.value);
    const style = document.getElementById("serviceStyle")?.value.trim();
    const date = document.getElementById("eventDate")?.value;

    if (!type || !guests || !style || !date) return;

    /*
      Valores de exemplo do projeto.
      Altere estes números quando os preços reais do buffet
      forem definidos.
    */
    const basePrices = {
      "Casamento": 155,
      "Corporativo": 105,
      "Formatura": 120,
      "Aniversário": 95,
      "Evento especial": 110
    };

    const serviceMultipliers = {
      "Buffet completo": 1.18,
      "Coquetel": 0.82,
      "Jantar empratado": 1.28,
      "Café e brunch": 0.64
    };

    const base = basePrices[type] ?? 100;
    const multiplier = serviceMultipliers[style] ?? 1;

    const total = guests * base * multiplier;
    const rangeLow = Math.round(total * 0.88);
    const rangeHigh = Math.round(total * 1.12);

    const money = value =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0
      }).format(value);

    const readableDate = new Date(`${date}T12:00:00`)
      .toLocaleDateString("pt-BR");

    const whatsappText = encodeURIComponent(
      `Olá! Gostaria de saber mais sobre um orçamento para ${type}, ` +
      `com aproximadamente ${guests} convidados, serviço ${style}, ` +
      `para o dia ${readableDate}.`
    );

    if (!estimate) return;

    estimate.innerHTML = `
      <strong>Estimativa:</strong>
      ${money(rangeLow)} a ${money(rangeHigh)}
      &nbsp;•&nbsp;
      ${guests} convidados
      &nbsp;•&nbsp;
      ${type}
      &nbsp;•&nbsp;
      ${readableDate}

      <br>

      <span>
        Esta simulação é apenas uma referência.
        O valor final depende do cardápio, estrutura e detalhes do evento.
      </span>

      <br>

      <a
        class="estimate-cta"
        href="https://wa.me/553398154856?text=${whatsappText}"
        target="_blank"
        rel="noopener noreferrer"
      >
        Continuar pelo WhatsApp →
      </a>
    `;

    estimate.classList.add("show");
  });

  /* Impede a escolha de uma data passada. */
  const eventDate = document.getElementById("eventDate");

  if (eventDate) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");

    eventDate.min = `${yyyy}-${mm}-${dd}`;
  }

  /* =========================================================
     MODAL DA GALERIA
     ========================================================= */

  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const modalCaption = document.getElementById("modalCaption");
  const modalClose = document.querySelector(".modal-close");

  const closeModal = () => {
    if (!modal) return;

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (modalImage) {
      modalImage.style.backgroundImage = "";
    }
  };

  document.querySelectorAll(".gallery-item").forEach(item => {
    item.addEventListener("click", () => {
      if (!modal || !modalImage) return;

      const background = getComputedStyle(item).backgroundImage;

      modalImage.style.backgroundImage = background;

      if (modalCaption) {
        modalCaption.textContent = item.dataset.caption || "";
      }

      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
    });
  });

  modalClose?.addEventListener("click", closeModal);

  modal?.addEventListener("click", event => {
    if (event.target === modal) {
      closeModal();
    }
  });

  /* =========================================================
     CARROSSEL DE DEPOIMENTOS
     ========================================================= */

  const cards = [...document.querySelectorAll(".testimonial-card")];
  const dots = [...document.querySelectorAll("#dots button")];
  const prev = document.querySelector(".prev");
  const next = document.querySelector(".next");

  let current = 0;

  function showTestimonial(index) {
    if (!cards.length) return;

    current = (index + cards.length) % cards.length;

    const isMobile = window.innerWidth <= 860;

    cards.forEach((card, i) => {
      card.style.display = !isMobile || i === current ? "block" : "none";
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === current);
      dot.setAttribute("aria-current", i === current ? "true" : "false");
    });
  }

  prev?.addEventListener("click", () => {
    showTestimonial(current - 1);
  });

  next?.addEventListener("click", () => {
    showTestimonial(current + 1);
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showTestimonial(index);
    });
  });

  const updateSliderVisibility = () => {
    showTestimonial(current);
  };

  window.addEventListener("resize", updateSliderVisibility);
  updateSliderVisibility();

  /* =========================================================
     LINKS "#"
     ========================================================= */

  document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
    });
  });

  /* ESC fecha modal e menu */
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeModal();
      closeMenu();
    }
  });
});
