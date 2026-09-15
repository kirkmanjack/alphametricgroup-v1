(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  // Mobile navigation
  const menuButton = $("#menuButton");
  const mobileMenu = $("#mobileMenu");

  function closeMenu() {
    if (!mobileMenu || !menuButton) return;
    mobileMenu.classList.add("hidden");
    menuButton.setAttribute("aria-expanded", "false");
  }

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      mobileMenu.classList.toggle("hidden", open);
    });

    $$(".nav-link, #mobileMenu a").forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768) closeMenu();
    });
  }

  // Reveal-on-scroll animations
  const revealItems = $$(".fade-up");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });

    revealItems.forEach(el => observer.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add("is-visible"));
  }

  // Smooth-scroll fallback for browsers that do not support CSS behavior.
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = $(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", id);
    });
  });

  // Deal calculator
  const amountInput = $("#dealAmount");
  const earnings = $("#earnings");
  const dealFee = $("#dealFee");
  const quoteButton = $("#quoteButton");
  const quoteMessage = $("#quoteMessage");

  const money = value => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(value);

  function updateCalculator() {
    if (!amountInput || !earnings || !dealFee) return;

    const amount = Math.max(0, Number(amountInput.value) || 0);
    const partnerEarnings = amount * 0.05;
    const serviceFee = amount * 0.10;

    earnings.textContent = money(partnerEarnings);
    dealFee.textContent = money(serviceFee);
  }

  amountInput?.addEventListener("input", updateCalculator);
  updateCalculator();

  // work with us form
  // Work With Us form
  const workWithUsForm = document.getElementById("workWithUsForm");
  const idCard = document.getElementById("idCard");
  const idFileName = document.getElementById("idFileName");
  const formMessage = document.getElementById("formMessage");
  const submitButton = document.getElementById("workWithUsSubmit");


  // Show selected ID filename
  idCard?.addEventListener("change", () => {
    const file = idCard.files[0];

    if (!file) {
      idFileName.textContent = "";
      idFileName.classList.add("hidden");
      return;
    }

    // 10MB limit
    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      idCard.value = "";
      idFileName.textContent = "";
      idFileName.classList.add("hidden");

      showToast("ID file must be smaller than 10MB.");
      return;
    }

    idFileName.textContent = file.name;
    idFileName.classList.remove("hidden");
  });


  // Submit form
  workWithUsForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!workWithUsForm.checkValidity()) {
      workWithUsForm.reportValidity();
      return;
    }

    const originalButton = submitButton.innerHTML;

    submitButton.disabled = true;
    submitButton.innerHTML = `
    <span>Submitting...</span>
    <svg
      class="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      ></path>
    </svg>
  `;

    formMessage.classList.add("hidden");

    try {

      /*
       * Replace this URL with your actual backend endpoint.
       *
       * Example:
       * const response = await fetch("/api/apply", {
       *   method: "POST",
       *   body: new FormData(workWithUsForm)
       * });
       */

      const formData = new FormData(workWithUsForm);

      // TEMPORARY:
      // Remove this simulation when connecting your backend.
      await new Promise(resolve => setTimeout(resolve, 1200));

      formMessage.textContent =
        "Application received. Our team will contact you shortly.";

      formMessage.className =
        "text-center text-[10px] text-lime-300";

      workWithUsForm.reset();

      idFileName.textContent = "";
      idFileName.classList.add("hidden");

      showToast("Application submitted successfully.");

    } catch (error) {

      console.error("Application submission error:", error);

      formMessage.textContent =
        "Something went wrong. Please try again.";

      formMessage.className =
        "text-center text-[10px] text-red-400";

    } finally {

      submitButton.disabled = false;
      submitButton.innerHTML = originalButton;

    }
  });

  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove("hidden");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.add("hidden"), 3200);
  }

  quoteButton?.addEventListener("click", () => {
    const amount = Math.max(0, Number(amountInput?.value) || 0);

    if (!amount) {
      showToast("Enter a deal value first.");
      amountInput?.focus();
      return;
    }

    if (quoteMessage) {
      quoteMessage.textContent = `Estimate ready for ${money(amount)}. Connect this button to your backend/API when you're ready.`;
      quoteMessage.classList.remove("hidden");
    }

    showToast("Your estimate is ready.");
  });

  // Current year
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Active navigation link while scrolling
  const sections = $$("main section[id]");
  const navLinks = $$('header a[href^="#"]');

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          link.classList.toggle(
            "text-white",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    }, { threshold: 0.25, rootMargin: "-20% 0px -55% 0px" });

    sections.forEach(section => sectionObserver.observe(section));
  }

  // Close mobile menu when Escape is pressed
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });
})();
