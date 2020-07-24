(function($){
    var startPlay = true;
    var startImagePreloader = true;

    var app = {
        vars: {},

        breakpoint: {
            sm: 576,
            md: 768,
            lg: 992,
            xl: 1200
        },

        get clientWidth() {
            return Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
        },

        get clientHeight() {
            return Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
        },

        set backgroundIndex(index) {
            document.body.className = 'bg' + index;
        },

        menu: {
            get visible() {
                return app.dom.body.hasClass('menu');
            },
            set visible(visibility) {
                visibility === true
                    ? app.dom.body.addClass('menu')
                    : app.dom.body.removeClass('menu');
            },
            get currentCaption() {
                return app.menu.currentItem.text() || false;
            },
            get currentItem() {
                return app.dom.menu.find('li.active');
            },
            get currentIndex() {
                return app.menu.currentItem.length ? app.menu.currentItem.index() + 1 : false;
            },
            set currentIndex(index) {
                // Ignore duplicate action
                if (index === app.menu.currentIndex)
                    return false;

                // Removes one or more 'class' attributes
                app.menu.currentItem.removeAttr('class')

                if (index !== false)
                    app.menu.item(index).addClass('active');
            },
            item: function(index) {
                return app.dom.menu.find('li:nth-of-type('+ index +')');
            },
            show: function(e) {
                app.menu.visible = true;
                e.preventDefault();
            },
            hide: function(e) {
                app.menu.visible = false;
                e.preventDefault();
            },
            open: function(e) {
                if (!app.services.visible && app.menu.currentIndex == 2) {
                    app.menu.openItem(e, 'services');
                } else {
                    app.services.visible = false;
                    app.dom.body.toggleClass('menu');
                }

                e.preventDefault();
            },
            openItem: function(e, _scenario_) {
                var scenario = _scenario_ || e.target.getAttribute('href').substr(1);
                var index = $(e.target.parentNode).index() + 1;

                app.menu.visible = false;

                if (scenario == 'services') {
                    app.info.visible = false;
                    app.contacts.visible = false;
                    setTimeout(app.services.show, 100, e);
                } else {
                    app.menu.currentIndex = index;
                    app.services.currentIndex = false;
                    app.services.visible = false;
                }

                if (scenario == 'about') {
                    // Set pause to 'false' for faster animate info block
                    app.info.currentIndex = {index:1, pause:false};
                    app.info.visible = true;
                    app.contacts.visible = false;
                    app.backgroundIndex = 1;
                }

                if (scenario == 'work') {
                    app.info.visible = false;
                    app.contacts.visible = false;
                }

                if (scenario == 'contacts') {
                    app.info.visible = false;
                    app.contacts.visible = true;
                }

                e.preventDefault();
            }
        },

        services: {
            get visible() {
                return app.dom.servicesWrapper.hasClass('show');
            },
            set visible(visibility) {
                visibility === true
                    ? app.dom.body.addClass('services')
                    : app.dom.body.removeClass('services');
                visibility === true
                    ? app.dom.servicesWrapper.addClass('show')
                    : app.dom.servicesWrapper.removeClass('show');
            },
            get currentCaption() {
                return app.services.currentItem.text() || false
            },
            get currentItem() {
                return app.dom.services.find('li.active')
            },
            get currentIndex() {
                return app.services.currentItem.length ? app.services.currentItem.index()+1 : false;
            },
            set currentIndex(index) {
                // Ignore duplicate action
                if (index === app.services.currentIndex)
                    return false;

                // Removes one or more 'class' attributes
                app.services.currentItem.removeAttr('class')

                if (index != false)
                    app.services.item(index).addClass('active')
            },
            item: function(index) {
                return app.dom.services.find('li:nth-of-type('+ index +')');
            },
            show: function(e) {
                app.services.visible = true;
                e.preventDefault();
            },
            hide: function(e) {
                app.services.visible = false;
                e.preventDefault();
            },
            openItem: function(e)
            {
                var index = $(this).data('item');

                if (index == 'x') {
                    app.dom.body.toggleClass('menu');
                } else {
                    app.menu.currentIndex = 2;
                    app.services.visible = false;
                    app.services.currentIndex = index-1;
                    app.info.currentIndex = index;
                    app.backgroundIndex = index;
                    setTimeout(app.info.show, 400, e);
                }

                e.preventDefault();
            }
        },

        info: {
            get visible() {
                return app.dom.info.hasClass('show');
            },
            set visible(visibility) {
                visibility === true
                    ? app.dom.info.addClass('show')
                    : app.dom.info.removeClass('show');
            },
            get currentTitle() {
                return app.info.currentItem.find('h2').text() || false;
            },
            get currentItem() {
                return app.dom.info.find('article.active');
            },
            get firstItem() {
                return app.dom.info.find('article:first-of-type');
            },
            get lastItem() {
                return app.dom.info.find('article:last-of-type');
            },
            get prevItem() {
                return app.info.currentIndex === app.info.firstIndex
                    ? app.info.lastItem
                    : app.info.currentItem.prev();
            },
            get nextItem() {
                return app.info.currentIndex === app.info.lastIndex
                    ? app.info.firstItem
                    : app.info.currentItem.next();
            },
            get firstIndex() {
                return app.info.firstItem.index();
            },
            get lastIndex() {
                return app.info.lastItem.index();
            },
            get prevIndex() {
                return app.info.prevItem.index();
            },
            get nextIndex() {
                return app.info.nextItem.index();
            },
            get currentIndex() {
                return app.info.currentItem.index();
            },
            set currentIndex(data) {
                var isObject = typeof(data)=='object'
                var index = isObject ? data.index : data;
                var pause = isObject ? data.pause : 300;

                // Ignore duplicate action
                if (index === app.info.currentIndex)
                    return false;

                app.services.currentIndex = index===1 ? false : index-1;
                app.menu.currentIndex = index===1 ?1 :2;
                app.backgroundIndex = index;

                pause === false
                    ? app.info.setActiveItem(index)
                    : setTimeout(app.info.setActiveItem, pause, index);
            },
            setActiveItem: function(index) {
                app.info.currentItem.removeAttr('class');
                if (index !== false)
                    app.info.item(index).addClass('active');
            },
            item: function(index) {
                return app.dom.info.find('article:nth-of-type('+ index +')');
            },
            show: function(e) {
                app.info.visible = true;
                e.preventDefault();
            },
            hide: function(e) {
                app.info.visible = false;
                e.preventDefault();
            },
            prev: function (e) {
                app.info.currentIndex = app.info.prevIndex;
                e.preventDefault();
            },
            next: function (e) {
                app.info.currentIndex = app.info.nextIndex;
                e.preventDefault();
            }
        },

        contacts: {
            get visible() {
                return app.dom.footer.hasClass('show');
            },
            set visible(visibility) {
                visibility === true
                    ? app.dom.body.addClass('contacts')
                    : app.dom.body.removeClass('contacts');
                visibility === true
                    ? app.dom.footer.addClass('show')
                    : app.dom.footer.removeClass('show');
            },
            show: function(e) {
                app.contacts.visible = true;
                e.preventDefault();
            },
            hide: function(e) {
                app.contacts.visible = false;
                e.preventDefault();
            }
        },

        btnPlay: {
            amtSectors: 16,
            delay: 1000,

            get ev() {
                if (! app.btnPlay._ev) {
                    app.btnPlay._ev = new CustomEvent(
                        'progressBarStep',
                        {
                            detail: {
                                message: 'Progress Bar Timer Step',
                                time: new Date(),
                            },
                            // target: app.dom.playButtonNext
                            // bubbles: true,
                            // cancelable: true
                        }
                    )
                }

                return app.btnPlay._ev;
            },

            get progressBar() {
                return app.dom.playButtonNext.find('use:nth-of-type(2)')
            },

            get radius() {
                if (!app.btnPlay._radius) {
                    var id = app.btnPlay.progressBar.attr('xlink:href');
                    app.btnPlay._radius = Number($(id).find('[r]').attr('r'));
                }
                return app.btnPlay._radius;
            },

            get angle() {
                var circumference = Math.PI * (app.btnPlay.radius * 2);
                return ((100 - app.btnPlay.stepInPercent) / 100) * circumference;
            },

            get stepPositive() {
                return app.btnPlay.step < 0 ? app.btnPlay.step * -1 : app.btnPlay.step;
            },

            get stepInPercent() {
                return (app.btnPlay.stepPositive * 100) / app.btnPlay.amtSectors;
            },

            get atFirstStep() {
                return app.btnPlay.counter == 1
            },

            get atFinish() {
                return app.btnPlay.counter == app.btnPlay.amtSectors
            },

            set position(step) {
                app.btnPlay.step = step;
                app.btnPlay.counter = (app.btnPlay.counter < app.btnPlay.amtSectors)
                    ? app.btnPlay.counter + 1 : 1;

                app.btnPlay.progressBar.css({
                    opacity: app.btnPlay.stepPositive / app.btnPlay.amtSectors,
                    strokeDashoffset: app.btnPlay.angle
                });
            },

            lifeCycle: function(e) {
                app.btnPlay.position = (app.btnPlay.step < app.btnPlay.amtSectors)
                    ? app.btnPlay.step + 1 : (app.btnPlay.step-1) * -1;

                if (app.btnPlay.step == (app.btnPlay.amtSectors-1) * -1)
                    app.btnPlay.progressBar.addClass('inverse');

                if (app.btnPlay.step == 1)
                    app.btnPlay.progressBar.removeClass('inverse');

                if (app.btnPlay.atFinish) {
                    app.btnPlay.lapsPassed += 1;
                    app.btnPlay.lapDone = true;
                }

                if (app.btnPlay.lapDone && app.btnPlay.atFirstStep) {
                    app.btnPlay.lapDone = false;
                    app.info.next(e);
                }
            },

            stop: function(e) {
                if (app.btnPlay.started) {
                    app.btnPlay.started = false;
                    clearInterval(app.btnPlay.timerId);
                }
                if (e.type=='click' || e.type=='resize') {
                    app.btnPlay.reset(e);
                }
            },

            start: function(e) {
                if (app.clientWidth < app.breakpoint.md)
                    return false;

                if ('undefined' == typeof(app.btnPlay.lapDone))
                    app.btnPlay.lapDone = false;

                if ('undefined' == typeof(app.btnPlay.lapsPassed))
                    app.btnPlay.lapsPassed = 0;

                if ('undefined' == typeof(app.btnPlay.step))
                    app.btnPlay.step = 0;

                if ('undefined' == typeof(app.btnPlay.counter))
                    app.btnPlay.counter = 0;

                if (!app.btnPlay.started) {
                    app.btnPlay.started = true;
                    app.btnPlay.timerId = setInterval.call(window,
                        app.btnPlay.lifeCycle, app.btnPlay.delay, app.btnPlay.ev);
                }
            },

            reset: function(e) {
                app.btnPlay.position = (app.btnPlay.stepInPercent < 50) ? 0 : app.btnPlay.amtSectors;
                app.btnPlay.counter = app.btnPlay.amtSectors;
                app.btnPlay.lapDone = false;
            },

            click: function(e) {
                app.btnPlay.stop(e);
                app.info.next(e);
                setTimeout(app.btnPlay.play, 500, e);
                e.preventDefault();
            }
        },

        touch: {
            xDown: null,
            yDown: null,

            Start: function (e) {
                app.touch.xDown = e.touches[0].clientX;
                app.touch.yDown = e.touches[0].clientY;
            },
            End: function(e) {
                // console.log('touch end')
            },
            Cancel: function(e) {
                // console.log('touch cancel')
            },
            Move: function(e) {
                if (! app.touch.xDown || ! app.touch.yDown ) {
                    return;
                }

                var xDiff = app.touch.xDown - e.touches[0].clientX;
                var yDiff = app.touch.yDown - e.touches[0].clientY;

                if (Math.abs(xDiff) > Math.abs(yDiff)) {
                    if ( xDiff > 0 ) {
                        // left swipe
                        // app.menu.openItem(e, 'contacts');

                        if (app.services.visible) {
                            app.services.visible = false;
                            app.dom.body.toggleClass('menu');
                        }

                        if (app.info.visible) {
                            app.info.next(e)
                        }

                    } else {
                        // right swipe
                        // app.menu.openItem(e, 'work');

                        if (app.info.visible) {
                            app.info.prev(e)
                        }

                    }

                } else {
                    if ( yDiff > 0 ) {
                        // up swipe
                        // app.menu.openItem(e, 'about');

                        if (app.menu.visible)
                            app.menu.visible = false;
                    } else {
                        // down swipe
                        // app.menu.openItem(e, 'services');

                        if (app.menu.visible)
                            app.menu.visible = false;
                    }
                }

                // reset values
                app.touch.xDown = null;
                app.touch.yDown = null;
            }
        },

        preload: {
            breakpoint: 1024,
            images: [
                '01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg',
                '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg'
            ],

            get wrapper() {
                if (!('preloadWrapper' in app.vars)) {
                    var wrapper = document.createElement('div');
                    wrapper.className = 'preload-wrapper';
                    document.body.appendChild(wrapper);
                    app.vars.preloadWrapper = document.querySelector('.preload-wrapper');
                }

                return app.vars.preloadWrapper;
            },

            get destination() {
                return 'assets/img/bg/';
            },

            get done() {
                return app.vars.preload || false;
            },

            set done(val) {
                return app.vars.preload = val;
            },

            loadImages: function(images)
            {
                if (images.length > 0)
                {
                    var img = new Image();
                    img.onload = function() {
                        var suffix = app.clientWidth <= app.preload.breakpoint ? 'sm' : 'lg';
                        var div = document.createElement('div');
                        div.style.backgroundImage = 'url(' + img.src + ')';
                        app.preload.wrapper.appendChild(div);

                        console.log('load image %s - %s', suffix, /\d+\.\w+/.exec(img.src)[0]);

                        if (images.length > 0) {
                            setTimeout(app.preload.loadImages, 100, images);
                        } else {
                            app.preload.done = true;
                            console.log('Finish preloading');
                        }
                    };

                    img.src = app.preload.destination + images.shift();
                } else {
                    app.preload.done = true;
                }
            }
        },

        dom: {
            get body() {
                return app.getJQueryWrapper('body')
            },
            get header() {
                return app.getJQueryWrapper('#header')
            },
            get footer() {
                return app.getJQueryWrapper('#footer')
            },
            get menu() {
                return app.getJQueryWrapper('#main-menu')
            },
            get menuButtonMain() {
                return app.getJQueryWrapper('#btn-menu')
            },
            get services() {
                return app.getJQueryWrapper('#services')
            },
            get servicesWrapper() {
                return app.vars.$servicesWrapper || (app.vars.$servicesWrapper = app.dom.services.parent())
            },
            get info() {
                return app.getJQueryWrapper('#info')
            },
            get infoButtonPrev() {
                return app.getJQueryWrapper('#info-control-prev')
            },
            get infoButtonNext() {
                return app.getJQueryWrapper('#info-control-next')
            },
            get playButtonNext() {
                return app.getJQueryWrapper('#btn-play')
            }
        },

        getJQueryWrapper: function(querySelector) {
            return app.vars['$'+querySelector] || (app.vars['$'+querySelector] = $(querySelector));
        },

        gag: function (e) {
            e.preventDefault();
        },

        windowResized: function(e) {
            var action = (app.clientWidth >= app.breakpoint.md) ? 'start' : 'stop';
            startPlay && app.btnPlay[action].call(app, e);
        },

        run: function(e) {
            console.log('Device viewport = %s:%s', app.clientWidth, app.clientHeight);

            startImagePreloader && setTimeout(app.preload.loadImages, 400, app.preload.images.slice(0));

            app.dom.menu.on('click', 'a', app.menu.openItem);
            app.dom.services.on('click', 'a', app.services.openItem);

            app.dom.menuButtonMain.click(app.menu.open);
            app.dom.infoButtonPrev.click(app.info.prev);
            app.dom.infoButtonNext.click(app.info.next);
            app.dom.playButtonNext.click(app.btnPlay.click);

            $(window).resize(app.windowResized);

            document.addEventListener('touchstart', app.touch.Start, false);
            document.addEventListener('touchmove', app.touch.Move, false);

            startPlay && app.dom.playButtonNext.mouseleave(app.btnPlay.start);
            startPlay && app.dom.playButtonNext.mouseenter(app.btnPlay.stop);
            startPlay && app.btnPlay.start(e);
        }
    };

    document.addEventListener('DOMContentLoaded', app.run);

})(window.jQuery);
