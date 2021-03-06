'use strict';

/**
 * @ngdoc function
 * @name sweetappApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the sweetappApp
 */
angular.module('myApp')
    .controller('CamCtrl', ['$scope', 'apiService',
        function($scope, apiService) {
            $scope.update = function() {
                apiService.getAllCameras(function(data) {
                    $scope.cameras = data;
                });
            };
            $scope.update();
        }
    ])
    .controller('CamConfigCtrl', ['$scope', 'apiService', '$routeParams',
        function($scope, apiService, $routeParams) {
            $scope.markers = {};
            $scope.center = {};

            apiService.getCamera($routeParams.name, function(data) {
                $scope.camera = data;

                if (!data.lat || !data.lng) {
                    data.lat = 36.991386;
                    data.lng = -122.060872;
                    $scope.locationNotSet = true;
                }

                $scope.markers = {
                    cam: {
                        lat: data.lat,
                        lng: data.lng,
                        message: 'Camera: ' + data.name,
                        focus: true,
                        draggable: true
                    },
                };

                $scope.center = {
                    lat: data.lat,
                    lng: data.lng,
                    zoom: 15
                };

            });

            $scope.saveLocation = function() {
                apiService.saveCameraLocation($scope.camera.name, {
                    lat: $scope.markers.cam.lat,
                    lng: $scope.markers.cam.lng
                });
                // TODO should check for success
                $scope.locationNotSet = false;
            };

            $scope.getHTML5Location = function() {
                navigator.geolocation.getCurrentPosition(
                    function(p) {
                        $scope.markers.cam.lat = p.coords.latitude;
                        $scope.markers.cam.lng = p.coords.longitude;
                        $scope.center = {
                            lat: p.coords.latitude,
                            lng: p.coords.longitude,
                            zoom: 15
                        };

                    }, function(error) {
                        alert('Geolocation error')
                    }, {
                        enableHighAccuracy: true
                    });

            };

        }
    ]);
