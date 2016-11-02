'use strict';

var reclameApp = angular.module('workshopApp',
                              ['ngRoute', 'ngAnimate', 'ui.bootstrap',
                              'ui.bootstrap.modal'] );

reclameApp.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/inicio', {
		            templateUrl: 'templates/inicio.html',
		            controller:  'AppCtrl'
	    }).when('/confirmacao', {
  		            templateUrl: 'templates/confirmacao.html',
  		            controller:  'ConfirmacaoCtrl'
      }).when('/list', {
  		            templateUrl: 'templates/list.html',
  		            controller:  'ListCtrl'
      }).otherwise({
		            redirectTo: '/inicio'
        });

      $locationProvider.html5Mode(true);
  }]);

reclameApp.controller('AppCtrl', function ($scope, $uibModal, $log, $http) {
    $scope.openLoad = function (size) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'ModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        resolve: {}
      });
    };
});

reclameApp.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, $http, $location, $timeout) {
  $scope.alerts = [];
  $scope.send = function () {
    var req = {
     method: 'POST',
     url: '/api/participants/add',
     data: { nome: $scope.nome,
            email: $scope.email,
            telefone: $scope.telefone,
            empresa: $scope.empresa,
            expectativa: $scope.expectativa?$scope.expectativa:'nao informado'
          }
    }
    $http(req).then(function(){
        //sucesso
        $scope.alerts.push({ type: 'success', msg: 'Dados enviados com sucesso!' });
        var wait = function() { //espera um pouco antes de prosseguir
          $location.path('/confirmacao');
          $uibModalInstance.close();
        }
        $timeout(wait, 3000);
    }, function(response){
        //falha
        $scope.alerts.push({ type: 'danger', msg: 'Erro ao processar inscrição: ' + response.statusText  });

    });
  };
  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

reclameApp.controller('ConfirmacaoCtrl', function($scope, $http, $location) {
    $scope.alerts = [];
});

reclameApp.controller('ListCtrl', function($scope, $http, $location) {

    $scope.alerts = [];
    $scope.isNotChrome = !(/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor));
      if ($scope.isNotChrome) {
        $scope.alerts.push({ type: 'warning', msg: 'Por favor utilizar o Google Chrome' });
      }
    $scope.download = function () {
      var req = {
       method: 'POST',
       url: '/api/participants/list',
       data: { token: $scope.token }
      }
      $http(req).
        success(function(data, status, headers, config) {
          var anchor = angular.element('<a/>');
              anchor.attr({
                  href: 'data:attachment/csv;charset=utf-8,' + encodeURI(data),
                  target: '_blank',
                  download: 'participants.csv'
              })[0].click();
            $scope.alerts.push({ type: 'success', msg: 'Token validado com sucesso!' });
        }).
        catch(function(data, status, headers, config) {
          // handle error
          $scope.alerts.push({ type: 'danger', msg: 'Erro: ' + data.statusText });
        });
    };
    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
});
