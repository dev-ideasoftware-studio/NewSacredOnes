/* Sacred Ones — Material 3 helpers: ripple, dialog open/close motion, snackbar, app-bar scroll state */
(function () {
    'use strict';
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Ripple on any .md-state element */
    document.addEventListener('pointerdown', function (e) {
        if (reduce || e.button > 0) return;
        var host = e.target.closest && e.target.closest('.md-state');
        if (!host || host.disabled) return;
        var r = host.getBoundingClientRect();
        var size = Math.max(r.width, r.height) * 2.2;
        var s = document.createElement('span');
        s.className = 'md-ripple';
        s.style.width = s.style.height = size + 'px';
        s.style.left = (e.clientX - r.left - size / 2) + 'px';
        s.style.top = (e.clientY - r.top - size / 2) + 'px';
        host.appendChild(s);
        setTimeout(function () { s.remove(); }, 650);
    }, { passive: true });

    /* Dialog with exit motion */
    function closeDialog(dlg) {
        if (!dlg.open) return;
        if (reduce) { dlg.close(); return; }
        dlg.classList.add('closing');
        setTimeout(function () { dlg.classList.remove('closing'); dlg.close(); }, 190);
    }
    document.addEventListener('cancel', function (e) {
        if (e.target.classList && e.target.classList.contains('md-dialog')) { e.preventDefault(); closeDialog(e.target); }
    }, true);
    document.addEventListener('click', function (e) {
        var d = e.target;
        if (d && d.classList && d.classList.contains('md-dialog')) closeDialog(d); // scrim click
    });

    /* Snackbar */
    var snack, snackTimer;
    function snackbar(text, actionLabel, action) {
        if (!snack) {
            snack = document.createElement('div');
            snack.className = 'md-snackbar'; snack.setAttribute('role', 'status'); snack.setAttribute('aria-live', 'polite');
            document.body.appendChild(snack);
        }
        snack.innerHTML = '';
        var t = document.createElement('span'); t.textContent = text; snack.appendChild(t);
        if (actionLabel) {
            var b = document.createElement('button'); b.type = 'button'; b.textContent = actionLabel;
            b.addEventListener('click', function () { snack.classList.remove('show'); if (action) action(); });
            snack.appendChild(b);
        }
        requestAnimationFrame(function () { snack.classList.add('show'); });
        clearTimeout(snackTimer);
        snackTimer = setTimeout(function () { snack.classList.remove('show'); }, 5000);
    }

    /* App bar elevation on scroll */
    function bindAppBar(bar) {
        function on() { bar.classList.toggle('scrolled', window.scrollY > 8); }
        window.addEventListener('scroll', on, { passive: true }); on();
    }

    window.md = { closeDialog: closeDialog, snackbar: snackbar, bindAppBar: bindAppBar };
})();
