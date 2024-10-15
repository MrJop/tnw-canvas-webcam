var $ = jQuery.noConflict();

$(document).ready(function(e) {
    CanvasExample.init();
});

var CanvasExample = {
    myCanvas: null,
    myContext: null,
    nCanvasWidth:0,
    nCanvasHeight:0,

    init: function () {
        this.myCanvas = $('.js-canvas');
        this.myContext = this.myCanvas[0].getContext('2d');
        //
        this.setCanvasSize(400, 300);
        this.drawBaseFrame();
        this.loadImage('img/dogs.png');
    },

    setCanvasSize: function (_width, _height) {
        this.myCanvas[0].setAttribute('width', _width);
        this.myCanvas[0].setAttribute('height', _height);
        //
        this.nCanvasWidth = _width;
        this.nCanvasHeight = _height;
    },

    drawBaseFrame: function () {
        this.myContext.fillStyle = "#3f3f3f";
        this.myContext.fillRect(0, 0, this.nCanvasWidth, this.nCanvasHeight);
        //
        this.myContext.fillStyle = "#fcfcfc";
        this.myContext.fillRect(5, 5, this.nCanvasWidth-10, this.nCanvasHeight-10);
    },

    loadImage: function (_image) {
        //Loading of the home test image - img1
        var img1 = new Image();

        //drawing of the test image - img1
        img1.onload = function () {
            CanvasExample.onImageLoaded(this);
        };

        img1.src = _image;
    },

    onImageLoaded: function (_image) {
        //draw background image
        //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage

        //which parameters do we have?
        //console.log(_image, _image.width, _image.height);

        //regular draw
        //this.myContext.drawImage(_image, 0, 0);

        //taking a part of the image and drawing it in a specific location
        this.myContext.drawImage(_image, 385, 0, 440, 460, 20, 20, 220, 230);
        this.myContext.drawImage(_image, 385, 0, 440, 460, 260, 50, 110, 115);
    }
}