/* Vértice Advocacia — interações do site */
document.addEventListener("DOMContentLoaded", () => {
  // Ano automático no rodapé.
  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  // Menu responsivo para telas pequenas.
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".site-nav");

  if (menuButton && navigation) {
    const closeMenu = () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Abrir menu");
      navigation.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    };

    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
      navigation.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 700) closeMenu();
    });
  }

  // Filtro da página Áreas de atuação.
  const areaFilters = document.querySelectorAll("[data-filter]");
  const areaCards = document.querySelectorAll(".area-row[data-category]");
  areaFilters.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      areaFilters.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      areaCards.forEach((card) => {
        card.hidden = filter !== "todos" && card.dataset.category !== filter;
      });
    });
  });

  // Filtro de artigos/itens do portfólio.
  const portfolioFilters = document.querySelectorAll("[data-portfolio-filter]");
  const portfolioCards = document.querySelectorAll(".portfolio-card[data-kind]");
  const emptyState = document.querySelector(".empty-state");
  portfolioFilters.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.portfolioFilter;
      portfolioFilters.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      let visibleCount = 0;
      portfolioCards.forEach((card) => {
        const visible = filter === "todos" || card.dataset.kind === filter;
        card.hidden = !visible;
        if (visible) visibleCount++;
      });
      if (emptyState) emptyState.hidden = visibleCount > 0;
    });
  });

  // Modal acessível com resumos fictícios do portfólio.
  const dialog = document.querySelector(".article-dialog");
  if (dialog) {
    const title = document.querySelector("#dialog-title");
    const body = document.querySelector("#dialog-body");
    document.querySelectorAll(".article-open").forEach((button) => {
      button.addEventListener("click", () => {
        title.textContent = button.dataset.title || "Conteúdo demonstrativo";
        body.textContent = button.dataset.body || "";
        if (typeof dialog.showModal === "function") dialog.showModal();
        else window.alert(`${title.textContent}\n\n${body.textContent}`);
      });
    });
    dialog.querySelectorAll(".dialog-close, .dialog-close-bottom").forEach((button) => {
      button.addEventListener("click", () => dialog.close());
    });
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  }

  // Pré-seleciona o assunto recebido pela URL, por exemplo:
  // contato.html?assunto=Direito%20Civil
  const subjectSelect = document.querySelector("#assunto");
  if (subjectSelect) {
    const params = new URLSearchParams(window.location.search);
    const requestedSubject = params.get("assunto");
    if (requestedSubject) {
      const option = Array.from(subjectSelect.options).find((item) => item.text === requestedSubject);
      if (option) subjectSelect.value = option.value;
      else if (requestedSubject.length > 0) {
        const otherOption = Array.from(subjectSelect.options).find((item) => item.text === "Outro assunto");
        if (otherOption) subjectSelect.value = otherOption.value;
      }
    }
  }

  // Formulário demonstrativo: valida os campos e prepara texto para copiar.
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const feedback = document.querySelector("#form-feedback");
      if (!contactForm.reportValidity()) return;

      const formData = new FormData(contactForm);
      const message = [
        "Mensagem demonstrativa — Vértice Advocacia",
        `Nome: ${formData.get("nome")}`,
        `E-mail: ${formData.get("email")}`,
        `Assunto: ${formData.get("assunto")}`,
        `Mensagem: ${formData.get("mensagem")}`
      ].join("\n");

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(message);
          feedback.textContent = "Mensagem copiada para a área de transferência. Nenhum dado foi enviado ou armazenado.";
        } else {
          const textArea = document.createElement("textarea");
          textArea.value = message;
          textArea.setAttribute("readonly", "");
          textArea.style.position = "fixed";
          textArea.style.opacity = "0";
          document.body.appendChild(textArea);
          textArea.select();
          const copied = document.execCommand("copy");
          textArea.remove();
          feedback.textContent = copied
            ? "Mensagem copiada para a área de transferência. Nenhum dado foi enviado ou armazenado."
            : "A mensagem foi validada, mas a cópia automática não está disponível neste navegador. Você pode copiar os campos manualmente.";
        }
      } catch (error) {
        feedback.textContent = "A mensagem foi validada, mas não foi possível copiar automaticamente. Nenhum dado foi enviado.";
      }
    });
  }
});
