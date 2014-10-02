angular.module('mogawayApp',['ngRoute'])
.config(['$routeProvider', '$locationProvider', 
    function($routeProvider, $locationProvider) {
	
    $routeProvider.
      when('/', {
        templateUrl: '/list',
        controller: 'ListCtrl'
      }).
      when('/detail/:name', {
        templateUrl: '/detail',
        controller: 'DetailCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
    
    $locationProvider.html5Mode(true);
}])
.service('ConnectorService', ['$http', function($http){
	return {
		getList: function(){
			var request = $http.get('/api/connector/list');
			return request;
		},
		getDetail: function(name){
			var request = $http.get('/api/connector/detail/' + name);
			return request;
		}
	}
}])
.controller('ListCtrl', ['$scope','ConnectorService', function($scope, ConnectorService){
	
	ConnectorService.getList().then(function(response){
		$scope.connectors = response.data.connectors;
	});
}])
.controller('DetailCtrl', ['$scope', '$routeParams', 'ConnectorService', function($scope, $routeParams, ConnectorService){
	
	ConnectorService.getDetail($routeParams.name).then(function(response){
		console.log(response.data);
		$scope.connector = response.data.connector;
	});
	
	$scope.invoke = function(name){
		alert(name);
	};
}]);