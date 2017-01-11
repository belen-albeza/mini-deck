'use strict';

function MiniDeck(slides) {
    this.slides = [].slice.call(slides); // convert NodeList to Array
    this.slides.forEach(function (slide) {
        slide.classList.add('md-slide');
        slide.innerHTML = `<div class="md-wrapper">${slide.innerHTML}</div>`;
    });

    // listen for DOM events
    document.addEventListener('keydown', this._onKeyDown.bind(this));
    window.addEventListener('hashchange', this._onHashChange.bind(this));

    Object.defineProperties(this, {
        currentSlide: {
            get: function () { return this.slides[this.currentIndex]; }
        },
        currentStep: {
            get: function () {
                return this.slides[this.currentIndex]
                    .steps[this.currentStepIndex];
            }
        }
    });

    this.currentStepIndex = -1;
    this.currentIndex = -1;
    this.showSlide(this._getIndexFromHash() || this.currentIndex);
}

MiniDeck.KEYCODES = {
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    DOWN: 40,
    SPACE: 32
};

// NOTE: slides are indexed from 0 to length
MiniDeck.prototype.showSlide = function (index) {
    // clamp index so it stays within bounds
    index = Math.min(Math.max(0, index), this.slides.length - 1);

    // exit if we are not really changing the slide
    // NOTE: this happens when we update the hash from this very function
    if (index === this.currentIndex) { return; }

    this.currentIndex = index;
    this.currentStepIndex = -1;
    window.location.hash = `#${this.currentIndex + 1}`;

    // remove the 'current' class marker from any other slide
    this.slides.forEach(function (slide) {
        slide.classList.remove('md-current');
    });

    // restore current slide
    this.currentSlide.classList.add('md-current');
    this.currentSlide.steps = this._getStepsForSlide(this.currentSlide);
    this.currentSlide.steps.forEach(function (step) {
        step.classList.remove('md-step-active');
    });
};

MiniDeck.prototype.showNextSlide = function () {
    if (this.currentIndex + 1 < this.slides.length) {
        this.showSlide(this.currentIndex + 1);
    }
};

MiniDeck.prototype.showPreviousSlide = function () {
    if (this.currentIndex > 0) {
        this.showSlide(this.currentIndex - 1);
    }
};

MiniDeck.prototype.advanceStep = function () {
    if (this.currentStepIndex + 1 < this.currentSlide.steps.length) {
        this.currentStepIndex += 1;
        this.currentStep.classList.add('md-step-active');
    }
    else { // all steps are done, go to the next slide
        this.showNextSlide();
    }
};

MiniDeck.prototype.goBackStep = function () {
    if (this.currentStepIndex >= 0) {
        this.currentStep.classList.remove('md-step-active');
        this.currentStepIndex -= 1;
    }
};

MiniDeck.prototype._getIndexFromHash = function () {
    let hash = parseInt(window.location.hash.substr(1), 10);
    return hash ? hash - 1 : null;
};

// returns the steps within the current slide
MiniDeck.prototype._getStepsForSlide = function (slide) {
    return [].slice.call(slide.querySelectorAll('.md-step'));
};

MiniDeck.prototype._onHashChange = function (evt) {
    evt.preventDefault();
    this.showSlide(this._getIndexFromHash());
};

MiniDeck.prototype._onKeyDown = function (evt) {
    // guard against modifier keys
    if (evt.metaKey || evt.shiftKey || evt.ctrlKey || evt.altKey) { return; }

    switch(evt.keyCode) {
        case MiniDeck.KEYCODES.LEFT:
            this.showPreviousSlide();
            break;
        case MiniDeck.KEYCODES.RIGHT:
            this.showNextSlide();
            break;
        case MiniDeck.KEYCODES.SPACE:
        case MiniDeck.KEYCODES.DOWN:
            this.advanceStep();
            break;
        case MiniDeck.KEYCODES.UP:
            this.goBackStep();
            break;
    }
};
