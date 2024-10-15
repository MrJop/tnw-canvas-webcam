var $ = jQuery.noConflict();

$(document).ready(function(e) {
    CanvasExample.init();
    WebcamFeed.init();
});

var CanvasExample = {
    myCanvas: null,
    myContext: null,
    nCanvasWidth:0,
    nCanvasHeight:0,
    myExportButton: $('.js-export'),
    myHiddenDownloadButton: $('.js-hidden-download-button'),

    init: function () {
        this.myCanvas = $('.js-canvas');
        this.myContext = this.myCanvas[0].getContext('2d');
        //
        this.setCanvasSize(400, 300);
        this.drawBaseFrame();
        this.loadImage('img/dogs.png');
        //
        this.myExportButton.on('click', this.onExportButtonClicked.bind(this));
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
    },

    drawWebcamFeed: function (_cameraFeed) {
        this.myContext.drawImage(_cameraFeed, 0, 0);
    },

    onExportButtonClicked: function () {
        //https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
        this.myHiddenDownloadButton.attr('href', this.myCanvas[0].toDataURL());
        this.myHiddenDownloadButton[0].click();
    }
}

var WebcamFeed = {
    video: null,
    bCameraActivated: false,
    nVideoWidth:0,
    nVideoHeight:0,
    myActivateWebcamButton:$('.js-activate-webcam'),

    init: function () {
        this.video = $('.js-webcam-stream');
        this.myActivateWebcamButton.on('click', this.activateWebcam.bind(this));
    },

    activateWebcam() {
        if(!this.bCameraActivated) {
            this.myActivateWebcamButton.off('click');
            this.myActivateWebcamButton.hide();

            var vdo = this.video[0];
            var that = this;

            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            })
                .then(function (stream) {
                    vdo.srcObject = stream;
                    vdo.play();
                    that.setCanvasAndVideoSize();
                })
                .catch(function (err) {
                    console.log("An error occurred: " + err);
                });

            this.bCameraActivated = true;
            this.renderCameraToCanvas();
        }
    },

    setCanvasAndVideoSize: function () {
        this.nVideoWidth = this.video.width();
        this.nVideoHeight = this.video.height();
        //
        CanvasExample.setCanvasSize(this.nVideoWidth, this.nVideoHeight);
    },

    renderCameraToCanvas: function () {
        if(this.nVideoWidth != this.video.width()){
            //during start up it may be 0 for a short moment
            this.setCanvasAndVideoSize();
        }

        CanvasExample.drawWebcamFeed(this.video[0]);

        window.requestAnimationFrame(this.renderCameraToCanvas.bind(this));
    }
};