'use strict';

var React = require('react/addons');


// CSS
require('normalize.css');
require('../styles/main.scss');

//获取图片数据
var imageDatas = require('../data/imageDatas.json');
//将图片数据转成图片路径
imageDatas = (function getImageURL(imageDataArr) {
    for (var i = 0, j = imageDataArr.length; i < j; i++) {
        var singleImageData = imageDataArr[i];

        singleImageData.imageURL = require('../images/' + singleImageData.fileName);
        imageDataArr[i] = singleImageData;
    }
    return imageDataArr;
})(imageDatas);

//获取区间内的随机值
function getRangeRandom(low, high) {
    return Math.ceil(Math.random() * (high - low) + low);
}

//获取角度
function get30DegRandom() {
    return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}


// imgfigure组件
var ImgFigure = React.createClass({

    handleClick: function(e) {

        if (this.props.arrange.isCenter) {
            this.props.inverse();
        } else {
            this.props.center();
        }
        e.stopPropagation();
        e.preventDefault();
    },

    render: function() {
        var styleObj = {};
        //如果props属性中指定了位置，则使用
        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        }

        //如果有不为0的旋转角度，则添加
        if (this.props.arrange.rotate) {
            styleObj.transform = 'rotate(' + this.props.arrange.rotate + 'deg)';
        }

        if (this.props.arrange.isCenter) {
            styleObj.zIndex = 11;
        }

        var imgFigureClassName = 'img-figure';
            imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

        return (
            <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
                <img src = {this.props.data.imageURL}
                     alt = {this.props.data.title}
                />
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className="img-back" onClick={this.handleClick}>
                        <p>
                            {this.props.data.desc}
                        </p>
                    </div>
                </figcaption>
            </figure>
        );
    }

});

//控制组件
var ControllerUnit = React.createClass({
    handleClick: function () {

        if (this.props.arrange.isCenter) {
            this.props.inverse();
        } else {
            this.props.center();
        }

        e.stopPropagation();
        e.preventDefault();
    },

    render: function() {
        var conerolelrUnitClassName = 'controller-unit';
        if (this.props.arrange.isCenter) {

            conerolelrUnitClassName += " is-center";

            if (this.props.arrange.isInverse) {

                conerolelrUnitClassName += " is-inverse";
            }
        }

        return (
            <span className={conerolelrUnitClassName} onClick={this.handleClick}></span>
        );
    }

});

//大管家
var GalleryByReactApp = React.createClass({
    Constant: {
        centerPos: {
            left: 0,
            right: 0
        },
        //左右分区范围
        hPosRange: {
            leftSecX: [0, 0],
            rightSecX: [0, 0],
            y: [0, 0]
        },
        //中间分区范围
        vPosRange: {
            x: [0, 0],
            topY: [0, 0]
        }
    },

    //翻转图片
    inverse: function(index) {
        return function() {
            var imgsArrangeArr = this.state.imgsArrangeArr;
            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

            this.setState({
                imgsArrangeArr: imgsArrangeArr
            });
        }.bind(this);
    },

    //重新布局所有图片
    rearrange: function(centerIndex) {
        var imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        imgsArrangeTopArr = [],
        topImgNum = Math.floor(Math.random() * 2),//取一个或不取
        topImgSpoliceIndex = 0,

        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

        //居中 centerIndex 的图片
        imgsArrangeCenterArr[0] = {
            pos: centerPos,
            rotate: 0,
            isCenter: true
        };


        //取出要布局上侧图片的状态信息
        topImgSpoliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpoliceIndex, topImgNum);

        //布局位于上侧的图片
        imgsArrangeTopArr.forEach(function (value, index) {
            imgsArrangeTopArr[index] = {
                pos: {
                    top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                    left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                },
                rotate: get30DegRandom(),
                isCenter: false
            };
        });

        //布局两侧图片
        for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
            var hPosRangeLORX = null;

            //前半部分布局左边，右半部分布局右边
            if (i < k) {
                hPosRangeLORX = hPosRangeLeftSecX;
            } else {
                hPosRangeLORX = hPosRangeRightSecX;
            }

            imgsArrangeArr[i] = {
                pos: {
                    top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                    left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                },
                rotate: get30DegRandom(),
                isCenter: false
            };
        }

            if (imgsArrangeArr && imgsArrangeTopArr[0]) {
                imgsArrangeArr.splice(topImgSpoliceIndex, 0, imgsArrangeTopArr[0]);
            }

            imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

            this.setState({
                imgsArrangeArr: imgsArrangeArr
            });
    },

    //传入index，居中对应的图片
    center: function(index) {
        return function() {
           this.rearrange(index);
        }.bind(this);
    },


    getInitialState: function() {
        return {
            imgsArrangeArr: [
                // {
                //     pos: {
                //         left: '0',
                //         top: '0'
                //     },
                //      rotate: 0 , //旋转角度
                //      isInverse: false //图片正反面
                //      isCenter: false //图片是否居中
                // }
            ]
        };
    },
    // 组件加载之后为每张图片计算位置范围
    componentDidMount: function () {
        //获取真实舞台大小
        var stageDom = React.findDOMNode(this.refs.stage),
            stageW = stageDom.scrollWidth,
            stageH = stageDom.scrollHeight,
            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);

        //imageFigured的大小
        var imgFigureDOM = React.findDOMNode(this.refs.imgFigure0),
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
            halfImgW = Math.ceil(imgW / 2),
            halfImgH = Math.ceil(imgH / 2);

        //计算位置范围
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        };

        this.Constant.hPosRange.leftSecX[0] = -halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        this.Constant.hPosRange.y[0] = -halfImgH;
        this.Constant.hPosRange.y[1] = stageH - halfImgH;


        this.Constant.vPosRange.topY[0] = -halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
        this.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.Constant.vPosRange.x[1] = halfStageW;

        this.rearrange(0);

    },

    render: function() {

        var controllerUnits = [],
            imgFigures = [];

        imageDatas.forEach(function(value, index) {
            if (!this.state.imgsArrangeArr[index]) {
                this.state.imgsArrangeArr[index] = {
                    pos: {
                        left: 0,
                        top: 0
                    },
                    rotate: 0,
                    isInverse: false,
                    isCenter: false
                };
            }
            imgFigures.push(<ImgFigure key={index} data = {value} ref={'imgFigure' + index} arrange= {this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);

            controllerUnits.push(<ControllerUnit key={index} arrange= {this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
        }.bind(this));


        return (
            <section className="stage" ref="stage">
                <section className="img-sec">
                    {imgFigures}
                </section>
                <nav className="controller-nav">
                    {controllerUnits}
                </nav>
            </section>
        );
    }
});
React.render( <GalleryByReactApp/>, document.getElementById('content')); // jshint ignore:line

module.exports = GalleryByReactApp;
