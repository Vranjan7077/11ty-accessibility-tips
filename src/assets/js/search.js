(function () {
    var trigger = document.getElementById('search-trigger');
    var dialog = document.getElementById('search-dialog');
    if (!trigger || !dialog || typeof dialog.showModal !== 'function') return;

    var input = document.getElementById('search-input');
    var resultsList = document.getElementById('search-results');
    var status = document.getElementById('search-status');
    var closeBtn = document.getElementById('search-close');
    var indexPromise = null;
    var lastFocused = null;
    var EMPTY_HINT = 'Type to search tips, topics, technologies, and WCAG criteria.';

    function loadIndex() {
        if (!indexPromise) {
            indexPromise = fetch('/search-index.json')
                .then(function (res) {
                    return res.json();
                })
                .catch(function () {
                    return [];
                });
        }
        return indexPromise;
    }

    function openDialog() {
        lastFocused = document.activeElement;
        dialog.showModal();
        input.value = '';
        resultsList.innerHTML = '';
        status.textContent = EMPTY_HINT;
        input.focus();
    }

    function closeDialog() {
        dialog.close();
    }

    dialog.addEventListener('close', function () {
        if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    });

    dialog.addEventListener('click', function (event) {
        if (event.target === dialog) closeDialog();
    });

    dialog.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            event.preventDefault();
            closeDialog();
        }
    });

    trigger.hidden = false;
    trigger.addEventListener('click', openDialog);
    closeBtn.addEventListener('click', closeDialog);

    document.addEventListener('keydown', function (event) {
        var isShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
        if (!isShortcut) return;
        event.preventDefault();
        if (dialog.open) {
            closeDialog();
        } else {
            openDialog();
        }
    });

    function matches(item, query) {
        var haystack = [item.title, item.description, item.type]
            .concat(item.topics || [], item.technologies || [], item.wcag || [])
            .join(' ')
            .toLowerCase();
        return haystack.indexOf(query) !== -1;
    }

    function render(items, query) {
        resultsList.innerHTML = '';

        if (!query) {
            status.textContent = EMPTY_HINT;
            return;
        }

        if (!items.length) {
            status.textContent = 'No results for "' + query + '"';
            return;
        }

        status.textContent = items.length + ' result' + (items.length === 1 ? '' : 's') + ' for "' + query + '"';

        items.slice(0, 8).forEach(function (item) {
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = item.url;
            a.className = 'search-dialog__result';

            var title = document.createElement('span');
            title.className = 'search-dialog__result-title';
            title.textContent = item.title;

            var meta = document.createElement('span');
            meta.className = 'search-dialog__result-meta';
            meta.textContent = [item.type, (item.topics || []).join(', ')].filter(Boolean).join(' · ');

            a.appendChild(title);
            a.appendChild(meta);
            li.appendChild(a);
            resultsList.appendChild(li);
        });
    }

    input.addEventListener('input', function () {
        var query = input.value.trim().toLowerCase();
        loadIndex().then(function (items) {
            if (input.value.trim().toLowerCase() !== query) return;
            var filtered = query
                ? items.filter(function (item) {
                      return matches(item, query);
                  })
                : [];
            render(filtered, input.value.trim());
        });
    });
})();
