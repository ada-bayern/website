(function () {
    function updateInputClass() {
        const mqTouchOnly = window.matchMedia('(hover: none) and (pointer: coarse)');
        const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
        const touchPoints = navigator.maxTouchPoints || (('ontouchstart' in window) ? 1 : 0);

        // consider touch-only when UA reports coarse/no-hover OR touch points exist but no fine pointer
        const isTouchOnly = mqTouchOnly.matches || (touchPoints > 0 && !hasFinePointer);

        // set one of two classes: 'touch-only' or 'pointer'
        document.documentElement.classList.toggle('touch-only', !!isTouchOnly);
        document.documentElement.classList.toggle('pointer', !isTouchOnly);
    }

    // run on load/resize and when media queries change
    window.addEventListener('load', updateInputClass);
    window.addEventListener('resize', updateInputClass);

    const mq = window.matchMedia('(hover: none) and (pointer: coarse)');
    if (mq.addEventListener) mq.addEventListener('change', updateInputClass);
    else if (mq.addListener) mq.addListener(updateInputClass);

    // run once immediately
    updateInputClass();
})();
function updateScrollIndicator() {
    const bar = document.querySelector('.scroll-indicator-bar');
    if (!bar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = scrollPercent + '%';
}

function fadeLogo() {
    const logos = document.querySelectorAll('.logo-text');
    if (!logos || logos.length === 0) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const fadeStart = 0;
    const fadeEnd = 100;
    const fadeRange = fadeEnd - fadeStart;
    const opacity = 1 - Math.max(0, Math.min(1, (scrollTop - fadeStart) / fadeRange));
    logos.forEach(logo => { logo.style.opacity = opacity; });
}

function imageLoad() {
    document.querySelectorAll('.lazy:not(.loaded)').forEach(function (element) {
        if (isVisible(element)) {
            if (element.dataset.src) element.setAttribute('src', element.dataset.src);
            if (element.dataset.srcset) element.setAttribute('srcset', element.dataset.srcset);
            element.classList.add('loaded');
        }
    });
}

function isVisible(elm) {
    var rect = elm.getBoundingClientRect();
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

function debounce(fn, wait) {
    let t;
    return function (...args) {
        const ctx = this;
        clearTimeout(t);
        t = setTimeout(function () { fn.apply(ctx, args); }, wait);
    };
}



document.addEventListener('DOMContentLoaded', function () {
    window.addEventListener('scroll', updateScrollIndicator);
    window.addEventListener('scroll', fadeLogo);
    window.addEventListener('scroll', imageLoad);
    updateScrollIndicator();
    fadeLogo();
    imageLoad();

    // Menu toggle
    const menuToggle = document.querySelector('.open-menu');
    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            document.body.classList.toggle('menu-opened');
        });
    }

    document.querySelector(".search").addEventListener('click', function (e) {
        e.preventDefault();
       
        document.body.classList.toggle('search-open');
    });
    document.querySelector(".close-search").addEventListener('click', function (e) {
        e.preventDefault();

        document.body.classList.remove('search-open');
        document.body.classList.remove('menu-opened');
    });

    // Prepare tables inside .right for stacked mobile layout
    function prepareStackTables() {
        document.querySelectorAll('.right table').forEach(function (table) {
            if (table.classList.contains('table--stack-processed')) return;
            table.classList.add('table--stack');

            let headers = [];
            const thead = table.querySelector('thead');
            let skipFirstRow = false;
            if (thead && thead.querySelectorAll('th').length) {
                headers = Array.from(thead.querySelectorAll('th')).map(th => th.textContent.trim());
            } else {
                const firstRow = table.querySelector('tbody tr');
                if (firstRow) {
                    headers = Array.from(firstRow.querySelectorAll('td, th')).map(cell => cell.textContent.trim());
                    skipFirstRow = true;
                }
            }

            const rows = Array.from(table.querySelectorAll('tbody tr'));
            rows.forEach(function (tr, rowIndex) {
                if (skipFirstRow && rowIndex === 0) return;
                const tds = Array.from(tr.querySelectorAll('td'));
                tds.forEach(function (td, i) {
                    if (headers[i]) td.setAttribute('data-label', headers[i]);
                    else if (!td.hasAttribute('data-label')) td.setAttribute('data-label', 'Column ' + (i + 1));

                    if (!td.querySelector('.table-value')) {
                        const span = document.createElement('span');
                        span.className = 'table-value';
                        while (td.firstChild) span.appendChild(td.firstChild);
                        td.appendChild(span);
                    }
                });
            });

            table.classList.add('table--stack-processed');
        });
    }

    prepareStackTables();
    // Recalculate table markup and project-link heights on resize
    window.addEventListener('resize', debounce(function () {
        prepareStackTables();
        updateProjectLinkHeights();
    }, 150));

    // Fixed .card.serie.active behavior
    const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 82;
    let lastScroll = window.scrollY || window.pageYOffset;
    let ticking = false;

    function fixCard(card) {
        if (card.dataset.fixed) return;
        const rect = card.getBoundingClientRect();
        const docTop = rect.top + window.scrollY;
        card.dataset.originalTop = docTop;

        const placeholder = document.createElement('div');
        placeholder.className = 'serie-placeholder';
        placeholder.style.height = card.offsetHeight + 'px';
        card.parentNode.insertBefore(placeholder, card.nextSibling);
        card.dataset.placeholderId = 'true';

        card.style.position = 'fixed';
        card.style.top = headerHeight + 'px';
        card.style.left = rect.left + 'px';
        card.style.width = rect.width + 'px';
        card.style.zIndex = 999;
        card.classList.add('serie--fixed');
        card.dataset.fixed = 'true';
    }

    function unfixCard(card) {
        if (!card.dataset.fixed) return;
        const placeholder = card.parentNode.querySelector('.serie-placeholder');
        if (placeholder) placeholder.parentNode.removeChild(placeholder);

        card.style.position = '';
        card.style.top = '';
        card.style.left = '';
        card.style.width = '';
        card.style.zIndex = '';
        card.classList.remove('serie--fixed');
        card.classList.remove('serie--collapsed');
        if (card.classList.contains('retracted')) card.classList.remove('retracted');
        delete card.dataset.fixed;
        delete card.dataset.originalTop;
        delete card.dataset.placeholderId;
    }

    function updateFixedCardsOnResize() {
        document.querySelectorAll('.card.serie.serie--fixed').forEach(function (card) {
            const placeholder = card.parentNode.querySelector('.serie-placeholder');
            const rect = placeholder ? placeholder.getBoundingClientRect() : card.getBoundingClientRect();
            card.style.left = rect.left + 'px';
            card.style.width = rect.width + 'px';
            card.style.top = headerHeight + 'px';
        });
    }
    function handleParagraphsFix(st) {
        const windowH = window.innerHeight || document.documentElement.clientHeight;
        const paras = document.getElementsByClassName('to-fix');
       // console.log('handleParagraphsFix', paras);
        Array.prototype.forEach.call(paras, function (el) {
            if (!el.id) return;
            const selector = '.' + CSS.escape(el.id);
            const reps = document.querySelectorAll(selector);
          
            if (!reps || reps.length === 0) return;

            // use first rep for offsets (matches jQuery behavior)
            const rep0 = reps[0];
            const repRect = rep0.getBoundingClientRect();
            const repTop = repRect.top  + (window.pageYOffset || document.documentElement.scrollTop);
            const pBottom = repTop + el.offsetHeight;
         //   console.log(el.offsetHeight, windowH, st, repTop, pBottom);
            if (el.offsetHeight < windowH && st >= repTop && st < pBottom) {
               // console.log('fixing', el, repTop, pBottom);
                // paragraph fits in viewport and is inside the rep span -> fix it
                reps.forEach(r => { r.style.height = el.offsetHeight + 'px'; });
                el.classList.add('got-fixed');
                el.style.top = '0px';
            } else if (el.offsetHeight > windowH && st >= (pBottom - windowH) && st < pBottom) {
                // paragraph taller than viewport, stick last part into view
             
                reps.forEach(r => { r.style.height = el.offsetHeight + 'px'; });
                el.classList.add('got-fixed');
                el.style.top = (windowH - el.offsetHeight ) + 'px';
            } else {
                // reset
             
                reps.forEach(r => { r.style.height = '0px'; });
                el.classList.remove('got-fixed');
                el.style.top = '0px';
            }
        });
    }

    // Measure actual height of .card-content .project-link so we can animate height to 0 when retracted.
    function updateProjectLinkHeights() {
        // Measure each .project-link individually and store its height as a CSS variable
        document.querySelectorAll('.card.serie').forEach(function (card) {
            const links = card.querySelectorAll('.card-content .project-link');
            if (!links || links.length === 0) return;

            links.forEach(function (link) {
                // Temporarily disable transition and measure natural height
                const prevTransition = link.style.transition || '';
                link.style.transition = 'none';
                const prevHeight = link.style.height || '';
                link.style.height = 'auto';
                const height = link.offsetHeight || link.scrollHeight || 0;
                // Restore previous inline height/transition
                link.style.height = prevHeight;
                link.style.transition = prevTransition;

                // store measured height on the individual link and set CSS variable on the element
                link.dataset.projectLinkHeight = String(height);
                link.style.setProperty('--project-link-height', height + 'px');
            });
        });
    }

    function handleScroll() {
        const currentScroll = window.scrollY || window.pageYOffset;
        const directionDown = currentScroll > lastScroll;

        document.querySelectorAll('.card.serie.active').forEach(function (card) {
            const rect = card.getBoundingClientRect();

            if (!card.dataset.fixed && rect.top <= headerHeight) {
                fixCard(card);
            }

            if (card.dataset.fixed) {
                // Toggle the retracted class only; heights are controlled via CSS variable set on init/resize
                if (directionDown) {
                    if (!card.classList.contains('retracted')) card.classList.add('retracted');
                } else {
                    if (card.classList.contains('retracted')) card.classList.remove('retracted');
                }

                const originalTop = Number(card.dataset.originalTop || 0);
                if (window.scrollY + headerHeight < originalTop - 1) {
                    unfixCard(card);
                }
            }
        });

        lastScroll = currentScroll;
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(handleScroll);
            ticking = true;
        }
        const st = window.pageYOffset || document.documentElement.scrollTop;
        handleParagraphsFix(st);
    });

    window.addEventListener('resize', debounce(updateFixedCardsOnResize, 120));

    // ensure project link heights are computed initially and after resize
    updateProjectLinkHeights();

    // initial check
    handleScroll();
});


