function Slider(id, settings) {

    var el = document.getElementById(id);
    var sliderWrapper = null;
    el.className += 'innerSlider';

    var defaultSettings = {
        speed: 100,
        direction: 'left',
        loop: true,
        autoStart: false,
        move: ''
    };

    var finalSetting = defaultSettings;

    for (var key in settings) {
        if (finalSetting.hasOwnProperty(key)) {
            if (settings[key] !== undefined) {
                finalSetting[key] = settings[key];
            }
        }
    }

    var controlsTemplate = '' +
        '<div class="left"></div>' +
        '<div class="right"></div>' +
        '<div class="bullets"></div>';

    function createWrapper() {
        var wrapper = document.createElement('div');
        wrapper.className = 'sliderWrapper'

        return wrapper;
    }

    function createControlsTemplate() {
        var controls = document.createElement('div');
        controls.className = 'controls'
        controls.innerHTML = controlsTemplate;

        return controls;
    }

    function createDOM() {
        sliderWrapper = createWrapper();
        var controls = createControlsTemplate();

        el.parentNode.insertBefore(sliderWrapper, el);
        sliderWrapper.appendChild(el);

        sliderWrapper.appendChild(controls);
    };


    function setWrapperWidth() {
        var totalWidth = 0;
        var slides = el.getElementsByTagName("li");

        for (var i = 0; i < slides.length; i++) {
            totalWidth += slides[i].offsetWidth;
        }

        sliderWrapper.style.width = totalWidth + 'px';
    }


    return {
        initialize: function () {
            createDOM();

            setWrapperWidth();
        }

    };
}
