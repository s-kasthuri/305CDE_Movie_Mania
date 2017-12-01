/*global angular  */

/* we 'inject' the ngRoute module into our app. This makes the routing functionality to be available to our app. */
var myApp = angular.module('myApp', ['ngRoute'])	//NB: ngRoute module for routing and deeplinking services and directives

/* the config function takes an array. */
myApp.config( ['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/search', {
		  templateUrl: 'templates/search.html',
      controller: 'searchController'
		})
    .when('/detail/:id', {
      templateUrl: 'templates/detail.html',
      controller: 'detailController'
    })
    .when('/favourites', {
		  templateUrl: 'templates/favourites.html',
      controller: 'favouritesController'
		})
    .when('/places', {
		  templateUrl: 'templates/places.html',
      controller: 'placesController'
		})
		.otherwise({
		  redirectTo: 'search'
		})
	}])

    
myApp.controller('searchController', function($scope, $http) {
   $scope.$watch('search', function() {
      fetch(); //watches the search input which refreshes every 800ms
    });

//function called every 800ms to perform AJAX call
 function fetch(){

  //the results only return a partial img path so this is added to provide the full url to display the poster... those tricksters!
    var imgPath = "https://image.tmdb.org/t/p/w185/"    

    //defining the search value from the input
    var search = $("#search").val();
    console.log(search)
    //this query allows users to search by title which is input by the user
    $http.get('https://api.themoviedb.org/3/search/movie?api_key=d0abc081dd01101d8fbb9e70185a22bf&query='+ search)
      .then(function(response){ 
        console.log(response)

        //title of first movie in results array
        $scope.title = response.data.results[0].original_title; 
        console.log($scope.title)

        //synopsis of the movie
        $scope.overview = response.data.results[0].overview;

        //img path for poster
        $scope.poster = imgPath + response.data.results[0].poster_path;
        console.log($scope.poster);

        //the voter average for the movie returned
        $scope.rating = 'Rating: '+ response.data.results[0].vote_average;
        
        
        //the voter average for the movie returned
        $scope.release = 'Release Date: '+ response.data.results[0].release_date;
        
        //the voter average for the movie returned
        $scope.status = 'Status: '+ response.data.results[0].status;
        
        
        
      
      });
 }
})
 







myApp.controller('detailController', function($scope, $routeParams, $http, $window) {
  $scope.id = $routeParams.id

  var url = 'https://newproject-kasthurishan.c9users.io/books/' +  $scope.id
  //var url = 'https://www.googleapis.com/books/v1/volumes/' + $scope.id
  $http.get(url).success(function(rspBook) {
  	if (rspBook.code == 200){
	    console.log(rspBook.message + $scope.id)
	    $scope.message = rspBook.message
	    $scope.book = {}
	    $scope.book.title = rspBook.data.title						//volumeInfo.title
	    $scope.book.description = rspBook.data.description//volumeInfo.description
	    $scope.book.stars = rspBook.data.rating						//volumeInfo.averageRating
	    $scope.book.cover = rspBook.data.cover						//volumeInfo.imageLinks.small || rspBook.volumeInfo.imageLinks.smallThumbnail
	    $scope.book.isbn = rspBook.data.isbn
  	}
  	else
  		$window.alert(rspBook.message)
  })

	$scope.postLike = function(like) {
		if (like===1 || like===-1) {
			var data = {}
			data.like = like
			$http.post(url, data).success((resp) => {
					$window.alert(resp.message + '\n Likes:' + resp.like + '  Dislikes:' + resp.dislike)
			})
		}
	}

  $scope.addToFavourites = function(id, title) {
    console.log('adding: '+id+' to favourites.')
    localStorage.setItem(id, title)
  }
})

myApp.controller('favouritesController', function($scope) {
  console.log('fav controller')
  $scope.message = 'This is the favourites screen'
  var init = function() {
    console.log('getting books')
    var items = new Array();		//alt: = []; for blank array obj
    //for (var key in localStorage) {	//for-in will include key, getItem, setItem, removeItem, clear & length
    for(var i = 0; i < localStorage.length; i++) {
    	var key = localStorage.key(i);	//native methods are ignored
    	var obj = {};
    	//items.push( {key: localStorage.getItem(key)} )  //TRY1 {key: ...} forced to hardcode key
    	//items.push(obj[key] = localStorage.getItem(key))	//TRY2 {dym-key: ...} hard to code in <ng-repeat>
    	items.push({id: key, title:localStorage.getItem(key)})  //TRY3 OK
      //alt: items[key] = localStorage[key]
    }
    console.log(items)
    $scope.books = items
  }
  init()

  $scope.delete = function(id) {
  	localStorage.clear()
    console.log('deleting id '+id)
  }
  $scope.deleteAll = function(){ localStorage.clear(); init();}
})



myApp.controller('placesController', function($scope) {
	console.log('fav controller')
	$scope.message = 'example'
})



