document.addEventListener('DOMContentLoaded', function () {
    // ...existing code...

    // store scroll position in hash when clicking tabs inside .top-tabs (except .list)
    (function () {
        const selector = '.top-tabs:not(.list) .tab a,.serie.active .card-content a';
    

        document.querySelectorAll(selector).forEach(tab => {
            tab.addEventListener('click', function (e) {
                e.preventDefault();
               
                const y = window.pageYOffset || document.documentElement.scrollTop || 0;
                maxScroll = document.querySelector(".hero").clientHeight + document.querySelector(".top-tabs").clientHeight ;
                console.log(y) ;
                if (y < document.querySelector(".hero").clientHeight) {
                window.location.href = e.target.href + `#scroll=${Math.round(y)}`;
                } else {
                    window.location.href = e.target.href + `#scroll=${Math.round(maxScroll)}`;
                }
                //writeScrollHash(y);
            });
        });

        // on load: if hash contains a scroll position, jump to it
        const m = (location.hash || '').match(/^#scroll=(\d+)$/);
        console.log(m);
        if (m) {
            const target = Number(m[1]) || 0;
            window.scrollTo({ top: target, left: 0, behavior: 'auto' })
            // ensure this runs after layout; use requestAnimationFrame for safety
            //requestAnimationFrame(() => window.scrollTo({ top: target, left: 0, behavior: 'auto' }));
            // remove hash replace to avoid default anchor behavior on back/forward if desired:
             history.replaceState(null, '', location.pathname + location.search );
        }




    })();

    // ...existing code...
});