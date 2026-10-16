/* Shared behaviour for index.html, qa-journey.html and CS-journey.html */
(function () {
    'use strict';

    /* ---- Mobile nav ---- */
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    function closeNav() {
        if (!links || !toggle) return;
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
    }
    if (toggle && links) {
        toggle.addEventListener('click', function () {
            var open = links.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(open));
        });
        links.addEventListener('click', function (e) {
            if (e.target.closest('a')) closeNav();
        });
    }

    /* ---- Smooth in-page anchors (offset handled by CSS scroll-padding) ---- */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var id = a.getAttribute('href');
            if (id.length < 2) return;
            var target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
                history.replaceState(null, '', id);
            }
        });
    });

    /* ---- Reveal on scroll ---- */
    var revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) {
                    en.target.classList.add('in');
                    io.unobserve(en.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('in'); });
    }

    /* ---- Active section highlight in the nav (home page) ---- */
    var sectionLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
    if (sectionLinks.length && 'IntersectionObserver' in window) {
        var map = {};
        sectionLinks.forEach(function (a) {
            var sec = document.querySelector(a.getAttribute('href'));
            if (sec) map[sec.id] = a;
        });
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting && map[en.target.id]) {
                    sectionLinks.forEach(function (l) { l.classList.remove('active'); });
                    map[en.target.id].classList.add('active');
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        Object.keys(map).forEach(function (id) { spy.observe(document.getElementById(id)); });
    }

    /* ---- Experience tabs (home page) ---- */
    var tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var id = btn.getAttribute('data-tab');
            tabBtns.forEach(function (b) {
                var on = b === btn;
                b.classList.toggle('active', on);
                b.setAttribute('aria-selected', String(on));
            });
            document.querySelectorAll('.tab-panel').forEach(function (p) {
                p.classList.toggle('active', p.id === id);
            });
        });
    });

    /* ---- Gallery arrows ---- */
    window.scrollGallery = function (galleryId, direction) {
        var g = document.getElementById(galleryId);
        if (g) g.scrollBy({ left: direction * 320, behavior: 'smooth' });
    };

    /* ---- Lightbox for gallery images ---- */
    var box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Image preview');
    box.innerHTML = '<img alt="">';
    document.body.appendChild(box);
    var boxImg = box.querySelector('img');
    document.addEventListener('click', function (e) {
        var img = e.target.closest('.gallery img');
        if (img) {
            boxImg.src = img.currentSrc || img.src;
            boxImg.alt = img.alt;
            box.classList.add('open');
        } else if (box.classList.contains('open')) {
            box.classList.remove('open');
        }
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { box.classList.remove('open'); closeNav(); }
    });
})();
