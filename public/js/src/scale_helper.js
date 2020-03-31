(function() {

    var MoveDiv = function ($el) {
        var Mover = {
            $toMove: {},
            init: function($el) {
                var me = this;
                this.$toMove = $el;
                $(document).ready(function() {
                    me.execute();
                })
            },
            execute: function() {
                this._bindMoveMenu(this.$toMove);
            },
            _bindMoveMenu: function ($toMove) {
                $toMove.mousedown(function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("e", e);
                    var downE = e;
                    let $body = $('body');
                    // $body.unbind('mouseup');
                    $body.mouseup(function(e) {
                        console.log("e", e);
                        var upE = e;
                        // debugger;
                        let $scaleMenu = $('.scale-menu');
                        var position = {
                            x: parseInt($scaleMenu.css('left')),
                            y: parseInt($scaleMenu.css('top')),
                        };
                        var positionAdd = {
                            x: upE.originalEvent.screenX - downE.originalEvent.screenX,
                            y: upE.originalEvent.screenY - downE.originalEvent.screenY,
                        };
                        var newPosition = {
                            x: position.x + positionAdd.x,
                            y: position.y + positionAdd.y
                        };
                        $scaleMenu.css('left', newPosition.x + 'px');
                        $scaleMenu.css('top', newPosition.y + 'px');

                        $body.unbind('mouseup');
                    })
                })
            },
        };

        var inst = Object.create(Mover);
        inst.init($el);
    };

    var ShowAllCss = function() {
        var ShowAllCss = {
            init: function() {
                var me = this;
                $(document).ready(function() {
                    me.execute();
                })
            },
            execute: function() {
                $('body').append('<div class="all-css" style="position: absolute; top: 400px; left: 200px;"></div>');
                $allCss = $('.all-css');
                $allCss.append('<span class="move-all-css" style="float: right; margin-right: 20px; cursor: pointer">dummy text</span>');
                $allCss.append('<textarea>dummy text</textarea>');
                MoveDiv($allCss.find('.move-all-css'));
                var text = 'one line';
                text += "\r\n";
                text += "second line";
                $allCss.find('textarea').val(text);
            }
        };

        var inst = Object.create(ShowAllCss);
        inst.init();
    };

    ShowAllCss();


    var me;

    var AutoScaleHelper = {
        divs: [],
        divsLookup: {},
        labelToIdentifiers : {
            fontSize: {
                class: 'font-size',
                type: 'number',
                label: 'font size:',
                attr: 'data-fontsize',
                css: 'font-size'
            },
            font: {
                class: 'font-family',
                type: 'text',
                label: 'font family:',
                attr: 'data-fontfamily',
                css: 'font-family'
            },
            fontWeight: {
                class: 'font-weight',
                type: 'text',
                label: 'font weight:',
                attr: 'data-fontweight',
                css: 'font-weight'
            },
            letterSpacing: {
                class: 'letter-spacing',
                type: 'number',
                label: 'letter spacing:',
                attr: 'data-letterspacing',
                css: 'letter-spacing'
            }
        },
        init: function() {
            me = this;
            $(document).ready(function() {
                me.execute();
            })
        },
        execute: function() {
            $autoscale = $('.autoscale');
            var count = 0;
            $autoscale.each(function() {
                var $el = $(this);
                var uId = me.uId($el);
                me.divsLookup[uId] = $el;
                me.divs.push($el);
                count++;
            });
            me.divs.forEach(function($el) {
                $el.click(function() {
                    var $el = $(this);
                    // alert($el.offset().top);
                    me.displayMenu($el);
                    $autoscale.css('border', 'none');
                    $el.css('border', '1px solid yellow');
                    var fontSize = $el.attr('data-fontsize');
                    $el.css('font-size', fontSize +  'px');
                });
            });
        },
        uId: function($el) {
            return $el.offset().top;
        },
        displayMenu: function($el) {
            var $menu = $('.scale-menu');
            if (0 === $menu.length) {
                $menu = $('<div class="scale-menu" style="position: fixed; top:200px; left:10px; border: 1px solid blue"></div>');
                $('body').append($menu);
                $menu = $('.scale-menu');
                $menu.append();
            }
            var uId = me.uId($el);
            if (0 === $('.' + uId).length) {
                var html = '<span class="move-menu" style="float: right; margin-right: 20px; cursor: pointer">move</span>';
                html += '<div class="' + uId + '" style="margin: 20px;">';
                Object.keys(this.labelToIdentifiers).forEach(function(key) {
                    var label = me.labelToIdentifiers[key].label;
                    var cls = me.labelToIdentifiers[key].class;
                    var type = me.labelToIdentifiers[key].type;
                    html += '<label style="float: left">' + label + '<label/>';
                    html += '<input style="float: right" class="' + cls + '" type="' + type + '"/><br/>';
                });
                // html += '<input class="number" type="number"/><br/>';
                // html += '<input class="text" type="text"/><br/>';
                // html += '<input class="weight" type="text"/>';
                html += '</div>';
                $menu.html(html);
                // me._bindMoveMenu($menu.find('.move-menu'));
                MoveDiv($menu.find('.move-menu'));
                $menu.show();
            }
            Object.keys(this.labelToIdentifiers).forEach(function(key) {
                var cls = '.' + me.labelToIdentifiers[key].class;
                var type = '.' + me.labelToIdentifiers[key].type;
                var attr = me.labelToIdentifiers[key].attr;
                var css = me.labelToIdentifiers[key].css;
                var $manipulator = $('.' + uId + ' ' + cls);
                $manipulator.val($el.attr(attr));
                $manipulator.change(function() {
                    $el.attr(attr, $manipulator.val());
                    if ('number' === type) {
                        $el.css(css, $manipulator.val() +  'px');
                    } else {
                        $el.css(css, $manipulator.val());
                    }

                    // $el.addClass('autoscale');
                });
            });
        },
        _bindMoveMenu: function ($moveMenu) {
            $moveMenu.mousedown(function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log("e", e);
                var downE = e;
                let $body = $('body');
                // $body.unbind('mouseup');
                $body.mouseup(function(e) {
                    console.log("e", e);
                    var upE = e;
                    // debugger;
                    let $scaleMenu = $('.scale-menu');
                    var position = {
                        x: parseInt($scaleMenu.css('left')),
                        y: parseInt($scaleMenu.css('top')),
                    };
                    var positionAdd = {
                        x: upE.originalEvent.screenX - downE.originalEvent.screenX,
                        y: upE.originalEvent.screenY - downE.originalEvent.screenY,
                    };
                    var newPosition = {
                        x: position.x + positionAdd.x,
                        y: position.y + positionAdd.y
                    };
                    $scaleMenu.css('left', newPosition.x + 'px');
                    $scaleMenu.css('top', newPosition.y + 'px');

                    $body.unbind('mouseup');
                })
            })
        },
    };
    
    var autoScaleHelper = Object.create(AutoScaleHelper);
    autoScaleHelper.init();
}());