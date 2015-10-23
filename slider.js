!window.addEventListener && function (e, t, n, r, i, s, o) {
    e[r] = t[r] = n[r] = function (e, t) {
        var n = this;
        o.unshift([n, e, t, function (e) {
            e.currentTarget = n, e.preventDefault = function () {
                e.returnValue = !1;
            }, e.stopPropagation = function () {
                e.cancelBubble = !0;
            }, e.target = e.srcElement || n, t.call(n, e);
        }]), this.attachEvent("on" + e, o[0][3]);
    }, e[i] = t[i] = n[i] = function (e, t) {
        for (var n = 0, r; r = o[n]; ++n)if (r[0] == this && r[1] == e && r[2] == t)return this.detachEvent("on" + e, o.splice(n, 1)[0][3]);
    }, e[s] = t[s] = n[s] = function (e) {
        return this.fireEvent("on" + e.type, e);
    };
}(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);

function Slider(id, userSettings) {
    var innerSlider = document.getElementById(id);
    var slides = innerSlider.getElementsByTagName("li");
    var sliderWrapper = null;
    var bulletsWrapper = null;
    var controls = null;
    var paused = false;
    var isAnimated = false;

    innerSlider.className = innerSlider.className === '' ? 'innerSlider' : innerSlider.className + ' innerSlider';

    var currentIndex = 0;
    var slidesCount = slides.length;

    var settings = {
        speed: 2000,
        animationDuration: 500,
        direction: 'left',
        loop: false,
        autoPlay: false,
        easing: 'linear'
    };

    for (var key in userSettings) {
        if (settings.hasOwnProperty(key)) {
            if (userSettings[key] !== undefined) {
                settings[key] = userSettings[key];
            }
        }
    }

    var EasingFunctions = {
        linear: function (p) {
            return p;
        },
        easeInQuad: function (p) {
            return p * p;
        },
        easeOutQuad: function (p) {
            return p * (2 - p);
        },
        easeInOutQuad: function (p) {
            return p < .5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
        },
        easeInCubic: function (p) {
            return p * p * p;
        },
        easeOutCubic: function (p) {
            return (--p) * p * p + 1;
        },
        easeInOutCubic: function (p) {
            return p < .5 ? 4 * p * p * p : (p - 1) * (2 * p - 2) * (2 * p - 2) + 1;
        },
        easeInQuart: function (p) {
            return p * p * p * p;
        },
        easeOutQuart: function (p) {
            return 1 - (--p) * p * p * p;
        },
        easeInOutQuart: function (p) {
            return p < .5 ? 8 * p * p * p * p : 1 - 8 * (--p) * p * p * p;
        },
        easeInQuint: function (p) {
            return p * p * p * p * p;
        },
        easeOutQuint: function (p) {
            return 1 + (--p) * p * p * p * p;
        },
        easeInOutQuint: function (p) {
            return p < .5 ? 16 * p * p * p * p * p : 1 + 16 * (--p) * p * p * p * p;
        }
    };

    var controlsTemplate = '' +
        '<div class="prev"></div>' +
        '<div class="next"></div>' +
        '<ul class="bullets"></ul>';

    function createWrapper() {
        var wrapper = document.createElement('div');
        wrapper.className = 'sliderWrapper';

        return wrapper;
    }

    function createControlsTemplate() {
        controls = document.createElement('div');
        controls.className = 'sliderControls';
        controls.innerHTML = controlsTemplate;

        return controls;
    }

    function createBullet(index) {
        var bullet = document.createElement('li');
        bullet.setAttribute('data-index', index);
        if (index === 0) {
            bullet.className = 'current';
        }
        return bullet;
    }

    function createDOM() {
        sliderWrapper = createWrapper();
        var controls = createControlsTemplate();

        innerSlider.parentNode.insertBefore(sliderWrapper, innerSlider);
        sliderWrapper.appendChild(innerSlider);

        sliderWrapper.appendChild(controls);

        bulletsWrapper = sliderWrapper.querySelectorAll('.bullets')[0];
    }

    function setWrapperWidth() {
        var totalWidth = 0;
        for (var i = 0; i < slidesCount; i++) {
            var slideWidth = slides[i].offsetWidth;

            bulletsWrapper.appendChild(createBullet(i));

            slides[i].style.width = slideWidth + 'px';
            totalWidth += slideWidth;
        }

        innerSlider.style.width = totalWidth + 'px';
    }

    function controlsController() {
        var next = controls.querySelectorAll('.next')[0];
        var prev = controls.querySelectorAll('.prev')[0];

        if (settings.loop === false) {
            if (currentIndex + 1 === slidesCount) {
                next.className += ' disabled';
            } else {
                next.className = 'next';
            }
            if (currentIndex === 0) {
                prev.className += ' disabled';
            } else {
                prev.className = 'prev';
            }
        }
    }

    function easing(progress) {
        return EasingFunctions[settings.easing](progress);
    }


    function animate(opts) {

        var start = new Date();

        var id = setInterval(function () {
            isAnimated = true;
            var timePassed = new Date() - start;
            var progress = timePassed / opts.duration;

            if (progress > 1) progress = 1;

            var delta = opts.delta(progress);
            opts.step(delta);

            if (progress == 1) {
                isAnimated = false;
                clearInterval(id);
            }
        }, opts.delay || 10);

    }

    function move(delta, to) {
        var element = innerSlider;
        var oldLeft = Number(element.style.left.replace('%', ''));
        animate({
            delay: 10,
            duration: settings.animationDuration,
            delta: delta,
            step: function (delta) {
                element.style.left = oldLeft + to * delta + "%";
            }
        });

    }

    function goTo(ind) {
        var to = -(ind - currentIndex) * 100;
        move(easing, to);
    }

    function navigateByBullets(e) {
        if (e.target && e.target.nodeName === "LI") {
            goTo(Number(e.target.getAttribute('data-index')));
            currentIndex = Number(e.target.getAttribute('data-index'));

            setCurrentBullet();
            controlsController();
        }
    }

    function setCurrentBullet() {
        var bullets = controls.querySelectorAll('.bullets')[0].getElementsByTagName('li');
        for (var i = 0; i < bullets.length; i++) {
            bullets[i].className = '';
        }
        bullets[currentIndex].className = 'current';
    }

    function next() {
        if (controls.querySelectorAll('.next')[0].className.indexOf('disabled') === -1) {

            if (settings.loop === true && currentIndex + 1 === slidesCount) {
                goTo(0);
                currentIndex = 0;
            } else {
                goTo(currentIndex + 1);
                currentIndex++;
            }
            setCurrentBullet();
        }
        controlsController();

    }

    function previous() {
        if (controls.querySelectorAll('.prev')[0].className.indexOf('disabled') == -1) {
            if (settings.loop === true && currentIndex === 0) {
                goTo(slidesCount - 1);
                currentIndex = slidesCount - 1;
            } else {
                goTo(currentIndex - 1);
                currentIndex--;
            }
            setCurrentBullet();
        }
        controlsController();
    }

    function animationController(func, e) {
        if (!isAnimated) {
            func(e);
        }
    }

    function autoPlay() {
        if (paused === false) {
            if (settings.direction === 'right') {
                next();
            }
            if (settings.direction === 'left') {
                previous();
            }
        }
    }

    function setEvents() {
        controls.querySelectorAll('.prev')[0].addEventListener('click', function () {
            animationController(previous);
        });
        controls.querySelectorAll('.next')[0].addEventListener('click', function () {
            animationController(next);
        });

        controls.querySelectorAll('.bullets')[0].addEventListener("click", function (e) {
            animationController(navigateByBullets, e);
        });

        sliderWrapper.addEventListener('mouseover', function () {
            paused = true;
        });

        sliderWrapper.addEventListener('mouseout', function () {
            paused = false;
        });
    }


    return {
        initialize: function () {
            createDOM();
            setWrapperWidth();
            setEvents();

            if (settings.autoPlay === true) {
                setInterval(autoPlay, settings.speed);
            }
        }

    };
}
