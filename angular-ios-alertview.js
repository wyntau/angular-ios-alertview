/*!
 * angular-ios-alertview 1.4.2
 * iOS7+ style alertview service for angular
 * License: MIT
 * Author: Treri
 * build: Thu Feb 04 2016 14:20:21 GMT+0100 (CET)
 **/
angular.module('angular-ios-alertview', [])
.directive('iosAlertView', function(){
  return {
    restrict: 'AE',
    replace: true,
    template: [
      '<div class="ios-alertview-overlay" ng-cloak>',
        '<div class="ios-alertview">',
          '<div class="ios-alertview-inner" ng-class="{\'ios-alertview-inner-remind\': !buttons || !buttons.length}">',
            '<div class="ios-alertview-title" ng-if="title">{{ title }}</div>',
            '<div class="ios-alertview-text" ng-bind-html="renderHtml(text)" ng-if="text"></div>',
            '<input autofocus class="ios-alertview-text-input" type="{{ inputType }}" placeholder="{{ inputPlaceholder }}" ng-model="form.inputValue" ng-if="input" />',
          '</div>',
          '<div class="ios-alertview-buttons" ng-if="buttons.length" ng-class="{\'ios-alertview-buttons-horizontal\': buttons.length <= 2}">',
            '<span class="ios-alertview-button" ng-class="{\'ios-alertview-button-bold\': button.bold}" ng-repeat="button in buttons" ng-click="onClick($event, button, $index)">{{ button.text }}</span>',
          '</div>',
        '</div>',
      '</div>'
    ].join(''),
    controller: ['$scope', '$sce',  function($scope, $sce){
      $scope.renderHtml = function(html_code){
        return $sce.trustAsHtml(html_code);
      }
    }]
  };
})
.provider('iosAlertView', function (){
  var defaults = {
    title: null,
    text: null,
    input: false,
    inputType: 'text',
    inputPlaceholder: '',
    cancelText: 'Cancel',
    okText: 'OK',
    remindTime: 250,
    defaultOption: 'text'
  };
  var keys = Object.keys(defaults);
  var self = this;
  self.set = function(key, value){
    if(angular.isObject(key)){
      for(var name in key){
        self.set(name, key[name]);
      }
    }else{
      if(key && (keys.indexOf(key) > -1)){
        if(value){
          defaults[key] = value;
        }
      }
    }
  };

  this.$get = [
    '$rootScope',
    '$compile',
    '$animate',
    '$q',
    '$document',
    '$timeout',
    '$log',
    function($rootScope, $compile, $animate, $q, $document, $timeout, $log){

      function iosAlertView(option){

        // expect option is object
        if(!angular.isObject(option)){
          $log.error('iosAlertView expect object option');
          return $q.when();
        }

        var deferred = $q.defer();
        var $scope = $rootScope.$new(true);
        angular.extend($scope, defaults, option, {form: {}});
        var $element = $compile('<div ios-alert-view></div>')($scope);

        $scope.onClick = function($event, button, $index){

          $event.preventDefault();
          $event.stopPropagation();

          var inputValue = $scope.form.inputValue;
          var cbkData = {
            index: $index,
            button: button,
            inputValue: inputValue
          };

          if(angular.isFunction(button.onClick)){
            button.onClick(cbkData);
          }

          $animate.leave($element).then(function(){
            deferred.resolve(cbkData);
          });
        };

        $animate.enter($element, $document[0].body, $document[0].body.lastChild);

        if(!$scope.buttons || !$scope.buttons.length){
          // if no buttons, remove modal in 650ms
          $timeout(function(){
            $animate.leave($element).then(function(){
              deferred.resolve();
            });
          }, 450 + 1 * $scope.remindTime);
        }

        return deferred.promise;
      }

      function objectify(option){

        if(angular.isObject(option)){
          return option;
        }

        var opt = {};
        if(angular.isString(option)){
          opt[defaults.defaultOption] = option;
        }else{
          $log.error('expect a string or an object');
        }
        return opt;
      }

      function alert(option){
        var deferred = $q.defer();
        option = objectify(option);
        option = angular.extend({}, defaults, option);
        option = angular.extend(option, {
          buttons: [{
            text: option.okText,
            onClick: deferred.resolve,
            bold: true
          }]
        });
        iosAlertView(option).then(deferred.resolve, deferred.reject);
        return deferred.promise;
      }

      function confirm(option){
        var deferred = $q.defer();
        option = objectify(option);
        option = angular.extend({}, defaults, option);
        option = angular.extend(option, {
          buttons: [
            {
              text: option.cancelText,
              onClick: deferred.reject
            },
            {
              text: option.okText,
              onClick: deferred.resolve,
              bold: true
            }
          ]
        });
        iosAlertView(option).then(deferred.resolve, deferred.reject);
        return deferred.promise;
      }

      function prompt(option){
        var deferred = $q.defer();
        option = objectify(option);
        option = angular.extend({}, defaults, option);
        option = angular.extend(option, {
          input: true,
          buttons: [
            {
              text: option.cancelText,
              onClick: deferred.reject
            },
            {
              text: option.okText,
              onClick: function(data){
                deferred.resolve(data.inputValue);
              },
              bold: true
            }
          ]
        });
        iosAlertView(option).then(function(data){
          deferred.resolve(data.inputValue);
        }, deferred.reject);
        return deferred.promise;
      }

      function remind(option){
        var deferred = $q.defer();
        option = objectify(option);
        option = angular.extend({}, defaults, option);
        iosAlertView(option).then(deferred.resolve, deferred.reject);
        return deferred.promise;
      }

      iosAlertView.alert = alert;
      iosAlertView.confirm = confirm;
      iosAlertView.prompt = prompt;
      iosAlertView.remind = remind;

      return iosAlertView;
    }
  ];
});
