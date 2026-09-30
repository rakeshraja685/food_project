
var images = ["./food images/1.png","./food images/2.png","./food images/3.png"];
var sliderCount = 0;

document.getElementById("rightArrow").addEventListener('click', () => {
  console.log("Hello");  
  sliderCount++;
    if (sliderCount >= images.length) {
        sliderCount = 0;
    }
    document.getElementById("imgcont").src = images[sliderCount];
    console.log("Task 14 Next Image:"+images[sliderCount]);
});

document.getElementById("leftArrow").addEventListener('click', () => {
  console.log("Hello");
    sliderCount--;
    if (sliderCount < 0) {
        sliderCount = images.length - 1;
    }
    document.getElementById("imgcont").src = images[sliderCount];
    console.log("Task 14 Previous Image:", images[sliderCount]);
});

// ===================== POPULAR ITEMS SLIDER =====================
(function initPopularItemsSlider() {
  const popularRow = document.querySelector('.popular-section .row.g-4');
  const controls = document.querySelectorAll('.popular-section .section-arrows button');
  if (!popularRow || controls.length < 2) return;

  function moveCards(direction) {
    const cards = Array.from(popularRow.children);
    if (!cards.length) return;

    popularRow.classList.remove('popular-slide');
    if (direction === 'next') {
      popularRow.appendChild(cards[0]);
    } else {
      popularRow.prepend(cards[cards.length - 1]);
    }

    requestAnimationFrame(() => {
      popularRow.classList.add('popular-slide');
    });
  }

  controls[0].addEventListener('click', () => moveCards('previous'));
  controls[1].addEventListener('click', () => moveCards('next'));
})();

// ===================== MOBILE NAV TOGGLE =====================
(function initMobileNav() {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (!navToggle || !navLinks) return;

  // Assign the control directly so the same handler remains reliable on touch
  // browsers as well as mouse-driven desktop browsers.
  navToggle.onclick = (event) => {
    event.stopPropagation();
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    navToggle.innerHTML = isOpen
      ? '<i class="bi bi-x-lg"></i>'
      : '<i class="bi bi-list"></i>';
  };

  // Close nav when a link is clicked on mobile
  navLinks.querySelectorAll('.nav-link-item').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.innerHTML = '<i class="bi bi-list"></i>';
    });
  });

  // Close nav on outside click
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
      navLinks.classList.remove('open');
      navToggle.innerHTML = '<i class="bi bi-list"></i>';
    }
  });
})();

// ===================== FOOD CATEGORY FILTER =====================
(function initFoodFilter() {
  const filterBtns = Array.from(document.querySelectorAll('.all_foods_btn button'));
  const categoryButtons = Array.from(document.querySelectorAll('.foot-cat-btn[data-category]'));
  const categorySelect = document.getElementById('foodCategorySelect');
  const cards = Array.from(document.querySelectorAll('#allFoods [data-category]'));

  const normalize = (value = '') => String(value).trim().toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, ' ').trim();

  const categoryAliases = {
    all: 'all',
    coffee: 'drinks',
    drinks: 'drinks',
    pizza: 'pizza',
    burger: 'burger',
    'ice cream': 'ice cream',
    icecream: 'ice cream',
    desserts: 'ice cream',
    lunch: 'lunch',
    breakfast: 'breakfast',
    diner: 'diner',
    ramen: 'ramen',
    'fast food': 'lunch',
    fastfood: 'lunch',
  };

  const getCategoryKey = (rawValue = 'all') => {
    const normalized = normalize(rawValue);
    return categoryAliases[normalized] || normalized || 'all';
  };

  const matchesCategory = (cardCategory, selectedCategory) => {
    const normalizedCard = normalize(cardCategory);
    const normalizedSelected = getCategoryKey(selectedCategory);

    if (!normalizedSelected || normalizedSelected === 'all') return true;

    return normalizedCard === normalizedSelected;
  };

  function applyFilter(selectedCategory) {
    const normalizedSelection = getCategoryKey(selectedCategory || 'all');

    cards.forEach(card => {
      const shouldShow = matchesCategory(card.dataset.category, normalizedSelection);
      card.classList.toggle('food-card-hidden', !shouldShow);
    });

    filterBtns.forEach(button => {
      const label = normalize(button.textContent);
      const selectedButtonValue = label === 'all categories' ? 'all' : getCategoryKey(label);
      button.classList.toggle('active-filter', selectedButtonValue === normalizedSelection);
    });

    categoryButtons.forEach(button => {
      const buttonCategory = normalize(button.dataset.category);
      button.classList.toggle('active-category', getCategoryKey(buttonCategory) === normalizedSelection);
    });

    if (categorySelect) {
      const match = Array.from(categorySelect.options).find(option => {
        const optionValue = normalize(option.value);
        return getCategoryKey(optionValue) === normalizedSelection;
      });
      categorySelect.value = match ? match.value : 'All Categories';
    }

    document.dispatchEvent(new CustomEvent('category:changed', { detail: { category: normalizedSelection } }));
  }

  filterBtns.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.textContent.trim();
      applyFilter(category === 'All Categories' ? 'all' : category);
    });
  });

  categoryButtons.forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      applyFilter(button.dataset.category || 'all');
    });
  });

  if (categorySelect) {
    categorySelect.addEventListener('change', () => {
      const category = categorySelect.value;
      applyFilter(category === 'All Categories' ? 'all' : category);
    });
  }

  applyFilter('all');
})();

// ===================== DELIVERY TABS =====================
(function initDeliveryTabs() {
  const tabs = document.querySelectorAll('.delivery-tab');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active-tab'));
      tab.classList.add('active-tab');
      const name = tab.getAttribute('data-tab');
      const names = {
        coffee: 'Coffee & Beverages',
        fastfood: 'Fast Food',
        pizza: 'Fresh Pizza',
        desserts: 'Sweet Desserts',
        ramen: 'Hot Ramen',
      };
      showToast(`Showing: ${names[name] || name}`);
    });
  });
})();

// ===================== DELIVERY CATEGORY IMAGES =====================
(function initDeliveryCategories() {
  const categoryButtons = document.querySelectorAll('.foot-cat-btn[data-image]');
  const deliveryImage = document.getElementById('deliveryImage');
  const deliveryTitle = document.getElementById('deliveryTitle');
  const deliveryDescription = document.getElementById('deliveryDescription');

  if (!categoryButtons.length || !deliveryImage) return;

  categoryButtons.forEach((button, index) => {
    button.addEventListener('click', event => {
      event.preventDefault();

      deliveryImage.style.opacity = '0';
      setTimeout(() => {
        deliveryImage.src = button.dataset.image;
        deliveryImage.alt = `${button.dataset.category} delivery`;
        deliveryImage.style.opacity = '1';
      }, 160);

      if (deliveryTitle) {
        deliveryTitle.textContent = button.dataset.title;
      }
      if (deliveryDescription) {
        deliveryDescription.textContent = button.dataset.description;
      }

      categoryButtons.forEach(item => item.classList.remove('active-category'));
      button.classList.add('active-category');

      const foodCat = button.closest('.food-cat');
      const buttonRect = button.getBoundingClientRect();
      const foodCatRect = foodCat ? foodCat.getBoundingClientRect() : null;
      const buttonTop = foodCatRect
        ? buttonRect.top - foodCatRect.top + (button.offsetHeight / 2) - 20
        : button.offsetTop + (button.offsetHeight / 2) - 20;

      document.documentElement.style.setProperty('--delivery-ruler-position', `${buttonTop}px`);
    });
  });
})();

// ===================== ACTIVE NAV ON SCROLL =====================
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link-item');
  if (!sections.length || !navItems.length) return;

  function onScroll() {
    const scrollY = window.scrollY + 120;
    let current = '';
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop) {
        current = sec.getAttribute('id');
      }
    });
    navItems.forEach(item => {
      const href = item.getAttribute('href')?.replace('#', '');
      item.classList.toggle('active', href === current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();

// ===================== TESTIMONIAL SLIDER =====================
(function initTestimonials() {
  const prevBtns = document.querySelectorAll('.review-prev-btn');
  const nextBtns = document.querySelectorAll('.review-next-btn');
  const reviewCards = document.querySelectorAll('.testimonial-card');
  const reviewTexts = document.querySelectorAll('.testimonial-copy');
  const reviewerNames = document.querySelectorAll('.testimonial-name');
  const reviewerRoles = document.querySelectorAll('.testimonial-role');
  const reviewAvatars = document.querySelectorAll('.testimonial-avatar');
  const reviewRatings = document.querySelectorAll('.testimonial-stars');

  const reviewsByCategory = {
    all: [
      { text: 'Food is great and the staff were kind and welcoming. The pleasant atmosphere made our dinner a wonderful experience.', name: 'Ajoy Gonsalves', role: 'Food Blogger', rating: 5 },
      { text: '"Amazing food and outstanding service! Every dish is prepared with care and love. I highly recommend the Chicken Pizza — it\'s absolutely divine."', name: 'Priya Sharma', role: 'Regular Customer', rating: 5 },
      { text: '"The ambiance is wonderful and the delivery is super fast. The food arrived hot and perfectly packaged. Will definitely order again!"', name: 'Rahul Verma', role: 'Food Critic', rating: 4 },
    ],
    coffee: [
      { text: 'The coffee was rich, warm, and perfectly brewed. It paired wonderfully with the breakfast spread and made the whole morning feel special.', name: 'Sofia Khan', role: 'Coffee Lover', rating: 5 },
      { text: 'Fresh coffee, quick service, and a cozy vibe. The drinks are elegantly prepared and the staff always get the order right.', name: 'Daniel James', role: 'Cafe Regular', rating: 5 }
    ],
    pizza: [
      { text: 'The pizza was hot, cheesy, and loaded with flavor. It tasted fresh out of the oven and the crust had the perfect crunch.', name: 'Liam Patel', role: 'Pizza Fan', rating: 5 },
      { text: 'I ordered pizza for dinner and it arrived perfectly timed. The toppings were generous and the flavor was spot on.', name: 'Emma Lee', role: 'Foodie', rating: 5 }
    ],
    burger: [
      { text: 'This burger is juicy, savory, and packed with flavor. It feels homemade and absolutely worth ordering again.', name: 'Noah Reed', role: 'Burger Enthusiast', rating: 5 },
      { text: 'Perfect burger texture and excellent seasoning. The fries were crisp and the overall meal felt fresh and satisfying.', name: 'Mia Clark', role: 'Regular Customer', rating: 4 }
    ],
    breakfast: [
      { text: 'The breakfast menu is comforting and beautifully prepared. Everything tasted fresh, light, and full of flavor.', name: 'Olivia Brown', role: 'Breakfast Fan', rating: 5 },
      { text: 'A calm morning routine with a healthy breakfast and amazing service. The food left us feeling energized and satisfied.', name: 'Andrew Hall', role: 'Morning Customer', rating: 4 }
    ],
    'fast food': [
      { text: 'Fast, filling, and flavorful. The fast-food order arrived ready to eat and tasted better than expected.', name: 'Grace Turner', role: 'Quick Bite Fan', rating: 5 },
      { text: 'A great late-night food fix. Crispy, tasty, and delivered on time without losing quality.', name: 'Jack Moore', role: 'Night Owl', rating: 4 }
    ],
    desserts: [
      { text: 'The desserts were the perfect finish to the meal: sweet, creamy, and beautifully presented.', name: 'Sophia Davis', role: 'Dessert Lover', rating: 5 },
      { text: 'A smooth dessert experience from start to finish. The texture and flavor were excellent and not overly sweet.', name: 'Luke Green', role: 'Sweet Tooth', rating: 4 }
    ],
    ramen: [
      { text: 'Warm, savory, and deeply comforting. The ramen had a rich broth and fresh ingredients all through it.', name: 'Yuki Carter', role: 'Ramen Fan', rating: 5 },
      { text: 'Super satisfying and full of flavor. Great for a cozy meal at home on a cold day.', name: 'Harper Kim', role: 'Comfort Food Seeker', rating: 4 }
    ],
    dinner: [
      { text: 'Dinner special felt premium and indulgent. The flavors were balanced and the portion size was just right.', name: 'Ethan Ross', role: 'Dinner Guest', rating: 5 },
      { text: 'An exceptional dinner choice with rich flavor and a lovely presentation. Great for family nights.', name: 'Amelia Scott', role: 'Family Customer', rating: 5 }
    ]
  };

  let currentReview = 0;
  let activeCategory = 'all';

  function showReview(index) {
    const reviewList = reviewsByCategory[activeCategory] || reviewsByCategory.all;
    if (!reviewCards.length || !reviewTexts.length || !reviewerNames.length || !reviewerRoles.length || !reviewAvatars.length || !reviewRatings.length) return;

    reviewCards.forEach(card => card.classList.add('is-changing'));

    setTimeout(() => {
      const r = reviewList[index % reviewList.length];

      reviewTexts.forEach(element => {
        element.textContent = r.text;
      });
      reviewerNames.forEach(element => {
        element.textContent = r.name;
      });
      reviewerRoles.forEach(element => {
        element.textContent = r.role;
      });
      reviewAvatars.forEach(element => {
        element.textContent = r.name.split(' ').map(part => part[0]).join('');
      });
      reviewRatings.forEach(element => {
        element.textContent = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
        element.setAttribute('aria-label', `${r.rating} out of 5 stars`);
      });

      reviewCards.forEach(card => card.classList.remove('is-changing'));
    }, 250);
  }

  function setActiveCategory(category) {
    activeCategory = category || 'all';
    currentReview = 0;
    showReview(currentReview);
  }

  nextBtns.forEach(button => {
    button.addEventListener('click', () => {
      const reviewList = reviewsByCategory[activeCategory] || reviewsByCategory.all;
      currentReview = (currentReview + 1) % reviewList.length;
      showReview(currentReview);
    });
  });

  prevBtns.forEach(button => {
    button.addEventListener('click', () => {
      const reviewList = reviewsByCategory[activeCategory] || reviewsByCategory.all;
      currentReview = (currentReview - 1 + reviewList.length) % reviewList.length;
      showReview(currentReview);
    });
  });

  document.addEventListener('category:changed', (event) => {
    const category = event.detail?.category || 'all';
    setActiveCategory(category);
  });

  setActiveCategory('all');
})();

// ===================== ACTION BUTTONS (CART / HEART) =====================
(function initActionButtons() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.action-btn');
    if (!btn) return;

    const icon = btn.querySelector('i');
    if (!icon) return;

    if (icon.classList.contains('bi-cart-plus')) {
      // Cart animation
      btn.style.background = '#4caf50';
      btn.style.borderColor = '#4caf50';
      btn.style.color = '#fff';
      icon.className = 'bi bi-check-lg';
      showToast('✓ Added to cart!');
      setTimeout(() => {
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.color = '';
        icon.className = 'bi bi-cart-plus';
      }, 1800);

    } else if (icon.classList.contains('bi-heart')) {
      // Toggle wishlist
      const isFilled = icon.classList.contains('bi-heart-fill');
      icon.className = isFilled ? 'bi bi-heart' : 'bi bi-heart-fill';
      btn.style.color = isFilled ? '' : 'var(--red)';
      showToast(isFilled ? 'Removed from wishlist' : '♥ Added to wishlist!');
    }
  });
})();

// ===================== BOOK TABLE =====================
(function initBookTable() {
  const bookBtn = document.getElementById('bookTableBtn');
  if (!bookBtn) return;

  bookBtn.addEventListener('click', () => {
    const date = document.getElementById('bookDate')?.value;
    const time = document.getElementById('bookTime')?.value;
    const guests = document.getElementById('bookGuests')?.value;

    if (!date || !time) {
      showToast('⚠ Please select a date and time!');
      return;
    }
    showToast(`✓ Table booked for ${guests} on ${date} at ${time}`);
  });
})();

// ===================== NEWSLETTER FORM =====================
(function initNewsletter() {
  const subscribeBtn = document.getElementById('subscribeBtn');
  const newsEmail = document.getElementById('newsEmail');
  if (!subscribeBtn || !newsEmail) return;

  subscribeBtn.addEventListener('click', () => {
    const email = newsEmail.value.trim();
    if (!email || !email.includes('@')) {
      showToast('⚠ Please enter a valid email!');
      return;
    }
    showToast(`✓ Subscribed with ${email}!`);
    newsEmail.value = '';
  });
})();

// ===================== APP EMAIL =====================
(function initAppEmail() {
  const sendBtn = document.getElementById('appSendLink');
  const emailInput = document.getElementById('appEmail');
  if (!sendBtn || !emailInput) return;

  sendBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    if (!email || !email.includes('@')) {
      showToast('⚠ Please enter a valid email!');
      return;
    }
    showToast(`✓ Download link sent to ${email}!`);
    emailInput.value = '';
  });
})();

// ===================== INJECT FADE-IN ANIMATION CSS =====================
(function addAnimations() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
})();


document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".foot-cat-btn");
  const leftContainer = document.querySelector(".left");

  // Optional: Set initial position to the first active button
  const initialActive = document.querySelector(".foot-cat-btn.active-category");
  if (initialActive) {
    updateRulerPosition(initialActive);
  }

  buttons.forEach(button => {
    button.addEventListener("click", function(e) {
      e.preventDefault();
      
      // Remove active class from all buttons and add to the clicked one
      buttons.forEach(btn => btn.classList.remove("active-category"));
      this.classList.add("active-category");

      // Update the ruler position
      updateRulerPosition(this);

      // (Add your existing logic here to update the right-side content/images)
    });
  });

  function updateRulerPosition(activeButton) {
    // Get the button's distance from the top of the .left container
    const buttonTop = activeButton.offsetTop;
    
    // Calculate the center point: 
    // Button top + (Half of button height) - (Half of ruler height [20px])
    const centerAlign = buttonTop + (activeButton.offsetHeight / 2) - 20;

    // Apply the exact pixel value to the CSS variable
    leftContainer.style.setProperty("--delivery-ruler-position", `${centerAlign}px`);
  }
});