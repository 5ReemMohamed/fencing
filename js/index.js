
"use strict";

const PHONE_NUMBER = "+966538088943";

const navLinks = [
  { id: "home", label: "الرئيسية" },
  { id: "about", label: "من نحن" },
  { id: "services", label: "خدماتنا" },
  { id: "projects", label: "أعمالنا" },
  { id: "contact", label: "تواصل معنا" }
];

const projects = Array.from({ length: 15 }, (_, index) => {
  const number = index + 1;

  return {
    id: number,
    image: `../images/${number}.jpg`,
    alt: `صورة من أعمال توريد وتركيب الشبوك رقم ${number}`,
    title: `أعمالنا - ${number}`
  };
});

const processSteps = [
  {
    number: "01",
    title: "التواصل والاستشارة",
    description: "نتعرف على احتياجاتك ونحدد نوع الشبوك المناسب لمشروعك."
  },
  {
    number: "02",
    title: "المعاينة وقياس الموقع",
    description: "نحدد المقاسات والتفاصيل المطلوبة لضمان دقة التنفيذ."
  },
  {
    number: "03",
    title: "التوريد والتركيب",
    description: "نوفر المواد المناسبة وننفذ أعمال التركيب باحترافية."
  },
  {
    number: "04",
    title: "التسليم النهائي",
    description: "نراجع العمل بعد الانتهاء ونتأكد من مطابقته للمتطلبات."
  }
];

const faqItems = [
  {
    question: "ما أنواع الشبك التي توفرونها؟",
    answer: "نوفر مجموعة متنوعة من أنواع الشبك، تشمل شبك المزارع والملاعب والأسوار والشبك المعدني، وفقًا لاحتياجات المشروع."
  },
  {
    question: "هل تقدمون خدمة التركيب؟",
    answer: "نعم، نقدم خدمات توريد وتركيب الشبوك والأسوار مع الحرص على جودة التنفيذ ومناسبة الحل لاحتياجات العميل."
  },
  {
    question: "هل يمكن تنفيذ المقاسات حسب الطلب؟",
    answer: "نعم، يمكن تحديد المقاسات والمواصفات حسب طبيعة الموقع ومتطلبات المشروع."
  },
  {
    question: "كيف يمكنني طلب عرض سعر؟",
    answer: "اتصل بنا وحدد نوع الشبك والمقاسات المطلوبة وموقع المشروع للحصول على عرض سعر مناسب."
  },
  {
    question: "هل تخدمون المشاريع الكبيرة والصغيرة؟",
    answer: "نعم، نوفر حلول الشبوك لمختلف أحجام المشاريع السكنية والتجارية والزراعية والرياضية."
  }
];

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) =>
  Array.from(parent.querySelectorAll(selector));

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function initializePhoneLinks() {
  $$("[data-phone], [data-whatsapp]").forEach(link => {
    if (link.tagName === "A") {
      link.href = `tel:${PHONE_NUMBER}`;
      link.removeAttribute("target");
      link.removeAttribute("rel");
    }
  });

  const lightboxCall = $("#lightboxCall");

  if (lightboxCall) {
    lightboxCall.href = `tel:${PHONE_NUMBER}`;
  }
}

function initializeNavigation() {
  const header = $("#siteHeader");
  const navContainer = $("#navLinks");
  const menuToggle = $("#menuToggle");
  const navbarContent = $("#navbarContent");

  if (navContainer) {
    navContainer.innerHTML = navLinks.map(link => `
      <li class="nav-item">
        <a class="nav-link" href="#${link.id}">
          ${link.label}
        </a>
      </li>
    `).join("");
  }

  function updateHeader() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 40);
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  let bsCollapse = null;

  if (
    navbarContent &&
    window.bootstrap &&
    window.bootstrap.Collapse
  ) {
    bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarContent, {
      toggle: false
    });
  }

  function setMenuIcon(isOpen) {
    if (!menuToggle) return;

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "إغلاق القائمة" : "فتح القائمة"
    );

    const icon = $(".toggle-icon", menuToggle);

    if (icon) {
      icon.classList.toggle("fa-bars", !isOpen);
      icon.classList.toggle("fa-xmark", isOpen);
    }
  }

  if (menuToggle && navbarContent && bsCollapse) {
    menuToggle.addEventListener("click", () => {
      if (navbarContent.classList.contains("show")) {
        bsCollapse.hide();
      } else {
        bsCollapse.show();
      }
    });

    navbarContent.addEventListener("shown.bs.collapse", () => {
      setMenuIcon(true);
    });

    navbarContent.addEventListener("hidden.bs.collapse", () => {
      setMenuIcon(false);
    });

    navbarContent.addEventListener("click", event => {
      const link = event.target.closest('a[href^="#"]');

      if (link && window.innerWidth < 992) {
        bsCollapse.hide();
      }
    });

    document.addEventListener("keydown", event => {
      if (
        event.key === "Escape" &&
        navbarContent.classList.contains("show")
      ) {
        bsCollapse.hide();
        menuToggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 992) {
        bsCollapse.hide();
      }
    });
  }

  const sections = navLinks
    .map(link => document.getElementById(link.id))
    .filter(Boolean);

  if (!navContainer || !sections.length) return;

  const navItems = $$(".nav-link", navContainer);

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      entries => {
        const visibleEntries = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (!visibleEntries.length) return;

        const activeId = visibleEntries[0].target.id;

        navItems.forEach(link => {
          const isActive = link.getAttribute("href") === `#${activeId}`;

          link.classList.toggle("active", isActive);

          if (isActive) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.1, 0.25, 0.5]
      }
    );

    sections.forEach(section => sectionObserver.observe(section));
  }
}

function initializeRevealAnimations() {
  const elements = $$(".reveal");

  if (!elements.length) return;

  if (!("IntersectionObserver" in window)) {
    elements.forEach(element => {
      element.classList.add("is-visible");
    });
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  elements.forEach(element => revealObserver.observe(element));
}

function initializeProjects() {
  const projectsGrid = $("#projectsGrid");
  const projectsEmpty = $("#projectsEmpty");
  const lightbox = $("#projectLightbox");
  const lightboxImage = $("#lightboxImage");
  const lightboxTitle = $("#lightboxTitle");
  const lightboxCounter = $("#lightboxCounter");
  const lightboxCall = $("#lightboxCall");
  const lightboxClose = $("#lightboxClose");
  const lightboxNext = $("#lightboxNext");
  const lightboxPrev = $("#lightboxPrev");

  let lightboxIndex = null;
  let lastFocusedElement = null;
  let closeTimer = null;

  if (!projectsGrid) return;

  if (projectsEmpty) {
    projectsEmpty.style.display = projects.length ? "none" : "block";
  }

  projectsGrid.innerHTML = projects.map((project, index) => `
    <article class="project-card" style="animation-delay:${Math.min(index * 0.05, 0.3)}s">
      <div class="project-image-wrap">
        <img
          class="project-image"
          src="${escapeHTML(project.image)}"
          alt="${escapeHTML(project.alt)}"
          loading="lazy"
          decoding="async"
        >

        <button
          type="button"
          class="project-expand"
          data-view-index="${index}"
          aria-label="عرض الصورة بحجم أكبر"
        >
          <i class="fa-solid fa-expand" aria-hidden="true"></i>
        </button>

        <div class="project-overlay">
          <h3>${escapeHTML(project.title)}</h3>

          <div class="project-actions">
            <button
              type="button"
              class="project-action action-view"
              data-view-index="${index}"
              aria-label="عرض ${escapeHTML(project.title)}"
            >
              <i class="fa-regular fa-image" aria-hidden="true"></i>
              عرض الصورة
            </button>

            <a
              href="tel:${PHONE_NUMBER}"
              class="project-action action-call"
            >
              <i class="fa-solid fa-phone" aria-hidden="true"></i>
              اتصل بنا
            </a>
          </div>
        </div>
      </div>
    </article>
  `).join("");

  if (!lightbox || !lightboxImage) return;

  function updateLightbox() {
    const project = projects[lightboxIndex];

    if (!project) return;

    lightboxImage.src = project.image;
    lightboxImage.alt = project.alt;

    if (lightboxTitle) {
      lightboxTitle.textContent = project.title;
    }

    if (lightboxCounter) {
      lightboxCounter.textContent =
        `الصورة ${lightboxIndex + 1} من ${projects.length}`;
    }

    if (lightboxCall) {
      lightboxCall.href = `tel:${PHONE_NUMBER}`;
    }
  }

  function openLightbox(index) {
    if (!projects[index]) return;

    if (closeTimer) {
      window.clearTimeout(closeTimer);
      closeTimer = null;
    }

    lastFocusedElement = document.activeElement;
    lightboxIndex = index;

    updateLightbox();

    lightbox.style.display = "flex";
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    requestAnimationFrame(() => {
      lightbox.classList.add("open");
      lightboxClose?.focus();
    });
  }

  function closeLightbox() {
    if (lightboxIndex === null) return;

    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    lightboxIndex = null;

    if (closeTimer) {
      window.clearTimeout(closeTimer);
    }

    closeTimer = window.setTimeout(() => {
      if (lightboxIndex === null) {
        lightbox.style.display = "none";
      }

      closeTimer = null;
    }, 250);

    if (lastFocusedElement && lastFocusedElement.isConnected) {
      lastFocusedElement.focus();
    }
  }

  function nextImage() {
    if (lightboxIndex === null || !projects.length) return;

    lightboxIndex = (lightboxIndex + 1) % projects.length;
    updateLightbox();
  }

  function previousImage() {
    if (lightboxIndex === null || !projects.length) return;

    lightboxIndex =
      (lightboxIndex - 1 + projects.length) % projects.length;

    updateLightbox();
  }

  projectsGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-view-index]");

    if (!button || !projectsGrid.contains(button)) return;

    openLightbox(Number(button.dataset.viewIndex));
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightboxNext?.addEventListener("click", nextImage);
  lightboxPrev?.addEventListener("click", previousImage);

  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", event => {
    if (lightboxIndex === null) return;

    if (event.key === "Escape") {
      closeLightbox();
    } else if (event.key === "ArrowLeft") {
      nextImage();
    } else if (event.key === "ArrowRight") {
      previousImage();
    }
  });
}

function initializeProcessSteps() {
  const desktopContainer = $("#processStepsDesktop");
  const mobileContainer = $("#processStepsMobile");

  if (desktopContainer) {
    desktopContainer.innerHTML = processSteps.map(step => `
      <div class="col-lg-3">
        <article class="process-step-desktop">
          <div class="process-number">${step.number}</div>
          <h3 class="process-step-title">${step.title}</h3>
          <p class="process-step-description">${step.description}</p>
        </article>
      </div>
    `).join("");
  }

  if (mobileContainer) {
    mobileContainer.innerHTML = processSteps.map(step => `
      <article class="process-step-mobile">
        <div class="process-number">${step.number}</div>
        <div class="process-step-content">
          <h3 class="process-step-title">${step.title}</h3>
          <p class="process-step-description">${step.description}</p>
        </div>
      </article>
    `).join("");
  }
}

function initializeFAQ() {
  const faqList = $("#faqList");

  if (!faqList) return;

  faqList.innerHTML = faqItems.map((item, index) => `
    <div class="faq-item ${index === 0 ? "active" : ""}">
      <button
        class="faq-question"
        type="button"
        aria-expanded="${index === 0}"
        aria-controls="faq-answer-${index}"
      >
        <span>${escapeHTML(item.question)}</span>
        <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
      </button>

      <div
        class="faq-answer-wrapper"
        id="faq-answer-${index}"
      >
        <div class="faq-answer-inner">
          <p class="faq-answer">${escapeHTML(item.answer)}</p>
        </div>
      </div>
    </div>
  `).join("");

  faqList.addEventListener("click", event => {
    const button = event.target.closest(".faq-question");

    if (!button || !faqList.contains(button)) return;

    const currentItem = button.closest(".faq-item");
    const shouldOpen = !currentItem.classList.contains("active");

    $$(".faq-item", faqList).forEach(item => {
      item.classList.remove("active");

      const question = $(".faq-question", item);

      if (question) {
        question.setAttribute("aria-expanded", "false");
      }
    });

    if (shouldOpen) {
      currentItem.classList.add("active");
      button.setAttribute("aria-expanded", "true");
    }
  });
}

function initializeFloatingPhone() {
  const floatingPhone = $("#floatingPhone");

  if (floatingPhone) {
    floatingPhone.href = `tel:${PHONE_NUMBER}`;
  }
}

function initializeSite() {
  initializePhoneLinks();
  initializeNavigation();
  initializeRevealAnimations();
  initializeProjects();
  initializeProcessSteps();
  initializeFAQ();
  initializeFloatingPhone();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeSite, { once: true });
} else {
  initializeSite();
}