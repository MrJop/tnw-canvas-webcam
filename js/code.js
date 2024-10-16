var $ = jQuery.noConflict();

$(document).ready(function(e) {
    CanvasExample.init();
    //JopMadness.init();
});

var CanvasExample = {
    DRAW_TIKTOK_VERTICAL:'draw tik tok vertical',
    DRAW_TIKTOK_HORIZONTAL:'draw tik tok horizontal',
    DRAW_NORMAL:'draw normal',

    myContainer:$('.js-example-one'),
    myCanvas: null,
    myContext: null,
    nCanvasWidth:0,
    nCanvasHeight:0,
    myExportButton: $('.js-export'),
    myHiddenDownloadButton: $('.js-hidden-download-button'),
    nDrawY:0,
    nDrawBarHeight:1,
    nDrawX:0,
    nDrawBarWidth:1,
    sDrawStyle:null,

    init: function () {
        this.sDrawStyle = this.DRAW_TIKTOK_VERTICAL;
        //
        this.myContainer.addClass('--show');
        //
        this.myCanvas = $('.js-example-one .js-canvas');
        this.myContext = this.myCanvas[0].getContext('2d');
        //
        this.setCanvasSize(400, 300);
        this.drawBaseFrame();
        this.loadImage('img/dogs.png');
        //
        this.myExportButton.on('click', this.onExportButtonClicked.bind(this));

        WebcamFeed.init(this);
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
        switch(this.sDrawStyle) {
            case this.DRAW_TIKTOK_VERTICAL:
                this.myContext.drawImage(_cameraFeed, 0, this.nDrawY, WebcamFeed.nVideoWidth, this.nDrawBarHeight, 0, this.nDrawY, this.nCanvasWidth, this.nDrawBarHeight);
                this.nDrawY += this.nDrawBarHeight;
                //
                if (this.nDrawY > this.nCanvasHeight) {
                    this.nDrawY = 0;
                }
                break;

            case this.DRAW_TIKTOK_HORIZONTAL:
                this.myContext.drawImage(_cameraFeed, this.nDrawX, 0, this.nDrawBarWidth, WebcamFeed.nVideoHeight, this.nDrawX, 0, this.nDrawBarWidth, this.nCanvasHeight);
                this.nDrawX += this.nDrawBarWidth;
                //
                if (this.nDrawX > this.nCanvasWidth) {
                    this.nDrawX = 0;
                }
                break;

            case this.DRAW_NORMAL:
                this.myContext.drawImage(_cameraFeed, 0, 0);
                break;
        }

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
    myController:null,

    init: function (_controller) {
        this.myController = _controller;
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
        this.myController.setCanvasSize(this.nVideoWidth, this.nVideoHeight);
    },

    renderCameraToCanvas: function () {
        if(this.nVideoWidth != this.video.width()){
            //during start up it may be 0 for a short moment
            this.setCanvasAndVideoSize();
        }

        this.myController.drawWebcamFeed(this.video[0]);

        window.requestAnimationFrame(this.renderCameraToCanvas.bind(this));
    }
};

var JopMadness = {
    DRAW_SCALE:0.1,
    DRAW_EVERY_X_FRAMES:2,

    myContainer:$('.js-jop-madness'),
    myCanvas: null,
    myContext: null,
    nCanvasWidth:0,
    nCanvasHeight:0,
    nDrawCount:0,
    nDrawX:0,
    nDrawY:0,

    init: function () {
        this.myContainer.addClass('--show');

        this.myCanvas = $('.js-jop-madness .js-canvas');
        this.myContext = this.myCanvas[0].getContext('2d');

        WebcamFeed.init(this);
    },

    setCanvasSize: function (_width, _height) {
        this.myCanvas[0].setAttribute('width', _width);
        this.myCanvas[0].setAttribute('height', _height);
        //
        this.nCanvasWidth = _width;
        this.nCanvasHeight = _height;
    },

    drawWebcamFeed: function (_cameraFeed) {
        if(this.nDrawCount % this.DRAW_EVERY_X_FRAMES == 0){
            this.myContext.drawImage(_cameraFeed, 0, 0, WebcamFeed.nVideoWidth, WebcamFeed.nVideoHeight, this.nDrawX, this.nDrawY, WebcamFeed.nVideoWidth * this.DRAW_SCALE, WebcamFeed.nVideoHeight * this.DRAW_SCALE);
            this.nDrawX+=WebcamFeed.nVideoWidth * this.DRAW_SCALE;

            if(this.nDrawX > this.nCanvasWidth){
                this.nDrawX = 0;
                this.nDrawY += WebcamFeed.nVideoHeight * this.DRAW_SCALE;
            }

            if(this.nDrawY > this.nCanvasHeight){
                this.nDrawX = 0;
                this.nDrawY = 0;
            }
        }

        this.nDrawCount++;
    }
};