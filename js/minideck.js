'use strict';

function MiniDeck(slides) {
    this.slides = [].slice.call(slides); // convert NodeList to Array
    this.slides.forEach(function (slide) {
        slide.classList.add('md-slide');
        slide.innerHTML = `<div class="md-wrapper">${slide.innerHTML}</div>`;
    });

    this.currentIndex = -1;
    this.showSlide(this._getIndexFromHash() || this.currentIndex);

    // listen for DOM events
    document.addEventListener('keydown', this._onKeyDown.bind(this));
    window.addEventListener('hashchange', this._onHashChange.bind(this));
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
    window.location.hash = `#${this.currentIndex + 1}`;

    // make the current slide to have class .md-current
    this.slides.forEach(function (slide, i) {
        slide.classList.remove('md-current');
        if (i === index) {
            slide.classList.add('md-current');
        }
    });
};

MiniDeck.prototype.showNextSlide = function () {
    this.showSlide(this.currentIndex + 1);
};

MiniDeck.prototype.showPreviousSlide = function () {
    this.showSlide(this.currentIndex - 1);
};

MiniDeck.prototype.showNextStep = function () {
    this.showNextSlide();
};

MiniDeck.prototype.showPreviousStep = function () {
    this.showPreviousSlide();
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
            this.showNextStep();
            break;
        case MiniDeck.KEYCODES.UP:
            this.showPreviousStep();
            break;
    }
};

MiniDeck.prototype._getIndexFromHash = function () {
    let hash = parseInt(window.location.hash.substr(1), 10);
    return hash ? hash - 1 : null;
};
