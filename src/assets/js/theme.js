(function () {
    var group = document.querySelector('.theme-toggle');
    if (!group) return;

    var options = Array.prototype.slice.call(group.querySelectorAll('.theme-toggle__option'));
    if (!options.length) return;

    var stored = null;
    try {
        stored = localStorage.getItem('theme');
    } catch (e) {}
    var current = stored === 'light' || stored === 'dark' ? stored : 'system';

    function applyState(value, focus) {
        options.forEach(function (btn) {
            var isSelected = btn.dataset.themeValue === value;
            btn.setAttribute('aria-checked', isSelected ? 'true' : 'false');
            btn.tabIndex = isSelected ? 0 : -1;
            if (isSelected && focus) btn.focus();
        });
    }

    function setTheme(value, focus) {
        current = value;
        try {
            if (value === 'system') {
                localStorage.removeItem('theme');
                document.documentElement.removeAttribute('data-theme');
            } else {
                localStorage.setItem('theme', value);
                document.documentElement.setAttribute('data-theme', value);
            }
        } catch (e) {}
        applyState(value, focus);
    }

    applyState(current, false);

    options.forEach(function (btn, index) {
        btn.addEventListener('click', function () {
            setTheme(btn.dataset.themeValue, false);
        });

        btn.addEventListener('keydown', function (event) {
            var nextIndex = null;
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                nextIndex = (index + 1) % options.length;
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                nextIndex = (index - 1 + options.length) % options.length;
            } else if (event.key === 'Home') {
                nextIndex = 0;
            } else if (event.key === 'End') {
                nextIndex = options.length - 1;
            }

            if (nextIndex !== null) {
                event.preventDefault();
                setTheme(options[nextIndex].dataset.themeValue, true);
            }
        });
    });
})();
