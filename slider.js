function Slider(id, userSettings) {

    var innerSlider = document.getElementById(id);
    var slides = innerSlider.getElementsByTagName("li");

    var sliderWrapper = null;
    var bulletsWrapper = null;
    var controls = null;

    innerSlider.className = innerSlider.className == '' ? 'innerSlider' : innerSlider.className + ' innerSlider';

    var currentIndex = 0;
    var slidesCount = slides.length;

    var defaultSettings = {
        speed: 100,
        direction: 'left',
        loop: true,
        autoStart: false,
        move: ''
    };

    var settings = defaultSettings;

    for (var key in userSettings) {
        if (settings.hasOwnProperty(key)) {
            if (userSettings[key] !== undefined) {
                settings[key] = userSettings[key];
            }
        }
    }

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
        controls.className = 'sliderControls'
        controls.innerHTML = controlsTemplate;

        return controls;
    }

    function createBullet(index) {
        var bullet = document.createElement('li');
        bullet.setAttribute('data-index', index);
        if (index == 0) {
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

        bulletsWrapper = sliderWrapper.getElementsByClassName('bullets')[0];
    };

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
        var next = controls.getElementsByClassName('next')[0];
        var prev = controls.getElementsByClassName('prev')[0];
        if (settings.loop == false) {
            if (currentIndex + 1 == slidesCount) {
                next.className += ' disabled';
            } else {
                next.className = 'next';
            }
            if (currentIndex == 0) {
                prev.className += ' disabled';
            } else {
                prev.className = 'prev'
            }
        }
    }

    function goTo(ind) {
        setCurrentBullet();
        innerSlider.style.left = (-(100 * ind)) + '%';
    }

    function navigateByBullets(e) {
        if (e.target && e.target.nodeName == "LI") {
            currentIndex = Number(e.target.getAttribute('data-index'));

            setCurrentBullet()
            goTo(currentIndex);
            controlsController();
        }
    }

    function setCurrentBullet() {
        var bullets = controls.getElementsByClassName('bullets')[0].getElementsByTagName('li');
        for (var i = 0; i < bullets.length; i++) {
            bullets[i].className = '';
        }
        bullets[currentIndex].className = 'current';
    }

    function next() {
        if (!controls.getElementsByClassName('next')[0].classList.contains('disabled')) {
            currentIndex++;
            goTo(currentIndex);
        }
        controlsController();
    }

    function previous() {
        if (!controls.getElementsByClassName('prev')[0].classList.contains('disabled')) {
            currentIndex--;
            goTo(currentIndex);
        }
        controlsController();
    }

    function setEvents() {
        controls.getElementsByClassName('prev')[0].addEventListener('click', previous);
        controls.getElementsByClassName('next')[0].addEventListener('click', next);

        controls.getElementsByClassName('bullets')[0].addEventListener("click", navigateByBullets);
    }


    return {
        initialize: function () {
            createDOM();

            setWrapperWidth();

            setEvents();
        }

    };
}
