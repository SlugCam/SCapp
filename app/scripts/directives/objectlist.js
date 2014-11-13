/* global $ */
'use strict';

angular.module('myApp')
    .directive('myObjectList', function() {
        return {
            replace: true,
            transclude: false,
            scope: {
                data: '=data'
            },
            template: '<span></span>',
            link: function(scope, element, attrs) {
                var htmlString = '';
                Object.keys(scope.data).forEach(function(key) {
                    htmlString += '<strong>' + key + '</strong>:' + scope.data[key] + '; ';

                });
                element.html(htmlString);
            }
        };

    })
    .directive('myVideoPlayer', function() {
        return {
            restrict: 'E',
            replace: true,
            transclude: false,
            scope: {
                src: '&mySrc'
            },
            template: '<div class="sc-video-player"><div class="scvp-video-content"><div class="scvp-video-wrapper"><video poster="/images/video_poster.png" width="100%" /></div><div class="scvp-alarm-layer"></div></div><div class="scvp-toolbar"><button class="scvp-set-button">Choose Alarm</button></div></div>',
            link: function(scope, element, attrs) {
                console.log('Building...');

                var state = 'video'; // 's1 - waiting for first click, s2 waiting for second' 

                element.find('.scvp-set-button').click(function() {
                    element.find('.scvp-alarm-layer').css('visibility', 'hidden');
                    element.find('video').removeAttr('controls');
                    state = 's1';
                    console.log('set clicked');
                });


                scope.$watch('src()', function(newSrc) {
                    var vid = $('<video controls autoplay/>').attr({
                        'width': '100%',
                        'poster': '/images/video_poster.png'
                    });

                    var vidWrapper = element.find('.scvp-video-wrapper');
                    vidWrapper.empty();
                    vid.appendTo(vidWrapper);

                    if (newSrc !== '') {
                        var src = $('<source />').attr({
                            type: 'video/mp4',
                            src: newSrc
                        });
                        vid.append(src);
                    }

                    // Setup alarm setting
                    vid.click(function(e) {
                        if (state === 's1') {
                            element.find('.scvp-alarm-layer').css({
                                'left': e.offsetX,
                                'top': e.offsetY
                            });
                            state = 's2';
                        } else if (state === 's2') {
                            element.find('.scvp-alarm-layer').css({
                                'right': vid.outerWidth() - e.offsetX,
                                'bottom': vid.outerHeight() - e.offsetY
                            });
                            state = 'video';
                            element.find('.scvp-alarm-layer').css('visibility', 'visible');
                            element.find('video').attr('controls', '');
                        }

                        console.dir(e);
                    });
                    state = 'video';
                });
            }
        };

    });
