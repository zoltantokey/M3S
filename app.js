(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', foundItemsDirective);

NarrowItDownController.$inject = ['MenuSearchService','$scope'];
function NarrowItDownController(MenuSearchService,$scope) {
  var menu = this;



menu.getMatchedMenuItems = function(){
  menu.showerror = false;
   menu.found = [];
if(!$scope.searchTerm || $scope.searchTerm.length === 0 ) {menu.showerror = true;}
else {


  var promise = MenuSearchService.getMatchedMenuItems($scope.searchTerm);

  promise.then(function (response) {
    menu.found = response.data;
    if( menu.found.length === 0 ) menu.showerror = true;
    // console.log(menu.found);
    // console.log(menu.showerror);
  })
  .catch(function (error) {
    console.log(error);
  });
}
}

menu.removeItem = function (itemIndex) {
  menu.found.splice(itemIndex, 1);
};

}

function foundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      items: '<',
      onRemove: '&'
    },
    // bindToController: true
  };

  return ddo;
}

MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;


  service.getMatchedMenuItems = function (searchTerm) {
    return  $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json"),
      // params: {
      //   category: shortName
      // }
    })
    .then(function(result){


    var list = {
      data:[]
    };
        // console.log(result.data.menu_items.length);
if (searchTerm.length > 0){
    for (var i = 0; i < result.data.menu_items.length; i++) {
      var name = result.data.menu_items[i].description;
      // console.log(name);

      if (name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1)
       {
        list.data.push(result.data.menu_items[i]);
      }
    }
}
// console.log(list);
return list;
}
)
    .catch(function (error) {
      console.log(error);
    });
//

}

}

})();
