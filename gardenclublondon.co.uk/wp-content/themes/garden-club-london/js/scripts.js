var helper = {
    
    isInViewport: function (element) {
        'use strict';
        var rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    },
    
    getElementIndex: function (node) {
        'use strict';
        var index = 0;
        while ((node = node.previousElementSibling)) {
            index++;
        }
        return index;
    }
    
};

var cookies = {
    
    getCookie: function (cname) {
        'use strict';
        var name = cname + "=",
            decodedCookie = decodeURIComponent(document.cookie),
            ca = decodedCookie.split(';'),
            i,
            c;
        
        for (i = 0; i < ca.length; i++) {
            c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },
    
    init: function () {
        'use strict';
        if (cookies.getCookie('accept-cookies') !== '') {
            var cookieContainer = document.querySelector('.cookies');
            if (cookieContainer) {
                cookieContainer.classList.add('hidden');
            }
        }
    }
    
};

var header = {
    
    interval: function () {
        'use strict';
        if (window.pageYOffset > 0) {
            header.container.classList.add('scrolled');
        } else {
            header.container.classList.remove('scrolled');
        }
    },
    
    init: function () {
        'use strict';
        header.container = document.querySelector('body > header');
        
        if (header.container) {
            setInterval(header.interval, 50);
        }
    }
    
};

var faqs = {
    
    openQuestion: function (e) {
        'use strict';
        var target = e.target,
            current,
            active;
        
        while (target.parentElement && !target.hasAttribute('href')) {
            target = target.parentElement;
            if (target.tagName === 'BODY') {
                return;
            }
        }
        
        active = document.querySelector(target.getAttribute('href'));
        
        if (active) {
            if (active.classList.contains('active')) {
                active.classList.remove('active');
            } else {
                current = document.querySelector('.question.active');
                if (current) {
                    current.classList.remove('active');
                }
                active.classList.add('active');
            }
        }
        
        e.preventDefault();
    },
    
    init: function () {
        'use strict';
        var questions = document.querySelectorAll('.question h3 a'),
            i;
        
        if (questions.length) {
            for (i = 0; i < questions.length; i++) {
                questions[i].addEventListener('click', faqs.openQuestion);
            }
        }
    }
    
};

var filters = {
    
    checkItem: function (item, checked) {
        'use strict';
        var show = false,
            cats = item.getAttribute('data-cats').split(','),
            i;
        
        for (i = 0; i < checked.length; i++) {
            if (cats.includes(checked[i].value)) {
                show = true;
                break;
            }
        }
        return show;
    },
    
    checkItems: function () {
        'use strict';
        var checked = filters.getSelectedFitlers();
        filters.items.forEach(function (item) {
            if (checked.length === 0 || filters.checkItem(item, checked)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    },
    
    getSelectedFitlers: function () {
        'use strict';
        var checked = [];
        filters.filters.forEach(function (filter) {
            if (filter.checked) {
                checked.push(filter);
            }
        });
        if (checked.length && filters.reset) {
            filters.reset.removeAttribute('disabled');
        }
        return checked;
    },
    
    resetFilters: function (e) {
        'use strict';
        filters.reset.setAttribute('disabled', 'true');
        setTimeout(function () {
            filters.checkItems();
        }, 10);
    },
    
    changeFilter: function (e) {
        'use strict';
        filters.checkItems();
    },
    
    init: function () {
        'use strict';
        filters.form = document.querySelector('.filters');
        filters.filters = document.querySelectorAll('.filters .filter input[type="checkbox"]');
        
        if (filters.filters.length) {
            filters.items = document.querySelectorAll('.gardens > li, .article-list > li');
            filters.reset = document.querySelector('.filters button[type="reset"]');
            if (filters.reset) {
                filters.form.addEventListener('reset', filters.resetFilters);
            }
            filters.filters.forEach(function (filter) {
                filter.addEventListener('change', filters.changeFilter);
            });
        }
    }
    
};

var process = {
    
    getCurrent: function () {
        'use strict';
        return process.block.querySelector('.active');
    },
    
    setActive: function (item) {
        'use strict';
        var current = process.getCurrent();
        if (current) {
            current.classList.remove('active');
        }
        item.parentElement.scroll(item.offsetLeft, 0);
        item.classList.add('active');
    },
    
    controlClick: function (e) {
        'use strict';
        var target = process.block.querySelector('#' + e.target.href.split('#')[1]);
        process.setActive(target);
        e.preventDefault();
    },
    
    nextClick: function (e) {
        'use strict';
        var current = process.getCurrent();
        if (current && current.nextElementSibling) {
            process.setActive(current.nextElementSibling);
        }
        e.preventDefault();
    },
    
    prevClick: function (e) {
        'use strict';
        var current = process.getCurrent();
        if (current && current.previousElementSibling) {
            process.setActive(current.previousElementSibling);
        }
        e.preventDefault();
    },
    
    init: function () {
        'use strict';
        process.block = document.querySelector('.process-block.slide');
        
        if (process.block) {
            process.block.classList.add('enabled');
            process.steps = process.block.querySelectorAll('.process-steps li');
            process.steps[0].classList.add('active');
            process.controls = process.block.querySelectorAll('.process-steps li div a');
            process.controls.forEach(function (control) {
                control.addEventListener('click', process.controlClick);
            });
            process.next = process.block.querySelector('.next');
            process.next.addEventListener('click', process.nextClick);
            process.prev = process.block.querySelector('.prev');
            process.prev.addEventListener('click', process.prevClick);
        }
    }
    
};

var reveal = {
    
    isElementInViewport: function (el) {
        'use strict';

        var rect = el.getBoundingClientRect(),
            winHeight = (window.innerHeight || document.documentElement.clientHeight),
            offset = Math.min((rect.height * 0.33), (winHeight * 0.25));

        return (
            rect.top <= (winHeight - offset) &&
            rect.bottom >= offset
        );
    },

    stop: function () {
        'use strict';
        clearInterval(reveal.revealInterval);
    },

    start: function (sections) {
        'use strict';
        var i;

        if (sections.length > 0) {
            for (i = 0; i < sections.length; i += 1) {
                if (reveal.isElementInViewport(sections[i])) {
                    sections[i].classList.add('inview');
                    sections.splice(i, 1);
                }
            }
        } else {
            reveal.stop();
        }
    },

    init: function (selector) {
        'use strict';

        reveal.stop();

        var sections = document.querySelectorAll(selector), i;

        //sections = Array.from(sections);
        sections = Array.prototype.slice.call(sections);

        reveal.selector = selector;

        reveal.revealInterval = setInterval(function () {
            reveal.start(sections);
        }, 50);

    }
};

var slider = {
    
    getCurrent: function (slides) {
        'use strict';
        var i;
        for (i = 0; i < slides.length; i += 1) {
            if (slides[i].checked === true) {
                return i;
            }
        }
    },
    
    /*
    change: function () {
        'use strict';
        slider.calcRatio(slider.getCurrent(slider.slides));
    },
    */
    
    stop: function (interval) {
        'use strict';
        clearInterval(interval);
    },
    
    start: function (container, slides, labels, interval) {
        'use strict';
        var i;

        if (container.classList.contains('auto-scroll')) {
            interval = setInterval(function () {
                var i = slider.getCurrent(slides);
                if (i === slides.length - 1) {
                    i = 0;
                } else {
                    i = i + 1;
                }
                slides[i].checked = true;

            }, interval);
            
            for (i = 0; i < labels.length; i += 1) {
                labels[i].addEventListener('click', function () {
                    slider.stop(interval);
                });
                //slides[i].addEventListener('change', this.change);
            }
        }
    },

    init: function () {
        'use strict';
        var containers = document.querySelectorAll('.slider'),
            slides,
            labels,
            i;
        
        if (containers.length) {
            slider.intervals = [];
            for (i = 0; i < containers.length; i += 1) {
                labels = containers[i].querySelectorAll('label');
                slides = containers[i].querySelectorAll('[name^="slider"]');

                if (slides.length) {
                    this.start(containers[i], slides, labels, 5000);
                }
            }
        }
        
    }
    
};

var modal = {
    
    close: function (e) {
        'use strict';
        var target = e.target;
        
        while (target.parentElement && !target.classList.contains('modal')) {
            if (target.tagName === 'BODY') {
                return;
            }
            target = target.parentElement;
        }
        target.classList.remove('active');
        if (target.classList.contains('mailing-list')) {
            target.classList.add('closed');
        }
        e.preventDefault();
    },
    
    init: function () {
        'use strict';
        var closeBtn = document.querySelectorAll('.modal .close, .modal .close-back');
        
        if (closeBtn.length) {
            closeBtn.forEach(function (btn) {
                btn.addEventListener('click', modal.close);
            });
        }
    }
};


window.addEventListener('load', function () {
    'use strict';
    cookies.init();
    header.init();
    faqs.init();
    filters.init();
    process.init();
    slider.init();
    modal.init();
    
    /*
    reveal.init('.reveal');
    setTimeout(function () {
        document.body.classList.add('reveal-enabled');
    }, 400);
    */
});