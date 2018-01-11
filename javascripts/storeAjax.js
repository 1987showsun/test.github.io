//get City
$.getJSON('https://www.tstartel.com/rest/zipCode/allCity',function(cityData){
  var optionCity = '<option value="">請選擇縣市</option>',
      optionZip  = '<option value="">請選擇地區</option>';

  for(var i=0 ; i<cityData.length ; i++){
    optionCity += '<option value="'+cityData[i].city+'">'+cityData[i].city+'</option>'
  }
  $('select#zip').html(optionZip);
  $('select#city').html(optionCity).on({
    change : function(){
      var _city     = $(this).val(),_zip='',
          _address  = '';
      getZip( _city );
      getZipStore(_city,_zip,_address);
    }
  });
});

function getZip(_city){
  var optionZip = '<option value="">請選擇地區</option>';
  $.getJSON('https://www.tstartel.com/rest/zipCode/'+encodeURIComponent(_city),function(zipData){
    for(var i=0 ; i<zipData.length ; i++){
      optionZip += '<option value="'+zipData[i].district+'">'+zipData[i].district+'</option>'
    }
    $('select#zip').html(optionZip).on({
      change : function(){
        var _zip      = $(this).val(),
            _address  = '';
        getZipStore(_city,_zip,_address);
      }
    });
  })
}

$(function(){
  $('form').submit(function(e){
    var _city    = $(this).find('#city').val();
    var _zip     = $(this).find('#zip').val();
    var _address = $(this).find('#address').val();
    getZipStore(_city,_zip,_address);
    e.preventDefault();
  })
})

//
function getZipStore(_city,_zip,_address){
  $.getJSON('https://www.tstartel.com/rest/serviceLocation/'+encodeURIComponent(_city+_zip+_address),function(storeData){
    renderStoreContent(_city,_zip,storeData);
  })
}

//商家 Show view
function renderStoreContent(_city,_zip,storeData){
  var storeContent = '';
  $('#tableTitle').find('.caption').html(_city+' '+_zip);

  if( storeData.length>0 ){
    for(var i=0 ; i<storeData.length ; i++){
      storeContent +='<li class="tbody">'+
                        '<ul>'+
                          '<li>'+
                            '<span class="storeTag" data-storeTag="'+ new getStoreType(storeData[i].storeType).status +'">'+ new getStoreType(storeData[i].storeType).text +'</span>'+
                            storeData[i].locationName+
                          '</li>'+
                          '<li>'+storeData[i].storeAddress+'<br/>'+storeData[i].phoneNumber+'</li>'+
                          '<li>'+storeData[i].operateTime+'</li>'+
                          '<li>'+
                            '<a href="#" style="background-image:url(https://www.tstartel.com/resources/common/mobile/css/images/icon/tel.png);">聯絡門市</a>'+
                            '<a href="#" style="background-image:url(https://www.tstartel.com/resources/common/mobile/css/images/icon/map.png);">規劃路線</a>'+
                          '</li>'+
                        '</ul>'+
                      '</li>';
    }
  }else{
    storeContent = '<li class="tbody">查無資料</li>';
  }

  $('#tableConent').html(storeContent);
}

function moveSetSelectOption(_city,_zip){
  var optionZip = '';
  $('select#city').val(_city);
  $.getJSON('https://www.tstartel.com/rest/zipCode/'+encodeURIComponent(_city),function(zipData){
    for(var i=0 ; i<zipData.length ; i++){
      optionZip += '<option value="'+zipData[i].district+'">'+zipData[i].district+'</option>'
    }
    $('select#zip').html(optionZip).val(_zip).on({
      change : function(){
        var _zip      = $(this).val(),
            _address  = '';
        getZipStore(_city,_zip,_address);
      }
    });
  })
}

//商店標籤
function getStoreType( storeType ){
  var text   = '';
      status = '';

  switch(storeType){
    case '0':
      text   = '直營';
      status = 'direct';
      break;
    case '1':
      text   = '特約';
      status = 'appointed';
      break;
  }

  return {
    text   : text,
    status : status
  }
}


//======= Google map =========
function initMap() {
  var googleMapKey    = 'AIzaSyAvJ7qc6sj6AwQVuPx-WD904ETE_WaQgXA',
      showMapBlockId  = 'test1',
      mapZoom         = 15,
      nowSetIcon      = 'https://www.tstartel.com/resources/s0051/images/current_location.png',
      storeIcon       = 'https://www.tstartel.com/resources/s0051/images/store.png',
      autocomplete,
      countryRestrict = {'country': '內湖區'};




  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    var pos;
    navigator.geolocation.getCurrentPosition(function(position) {

      var map = new google.maps.Map(document.getElementById(showMapBlockId), {
        center    : {lat: position.coords.latitude, lng: position.coords.longitude},
        zoom      : mapZoom,
        mapTypeId : 'roadmap'
      });

      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      $.getJSON('//maps.google.com/maps/api/geocode/json?latlng='+position.coords.latitude+','+position.coords.longitude+'&language=zh-TW&sensor=true',function(nowCity){
        if( nowCity.results[0]!=undefined ){
          var addressComponents        = nowCity.results[0].address_components,
              addressComponentsLength  = addressComponents.length,
              _postalCode              = addressComponents[addressComponentsLength-1].long_name, //郵遞區號
              _country                 = addressComponents[addressComponentsLength-2].long_name, //國家
              _city                    = addressComponents[addressComponentsLength-3].long_name, //城市
              _zip                     = addressComponents[addressComponentsLength-4].long_name; //行政區

          $.getJSON('https://www.tstartel.com/rest/serviceLocation/'+encodeURIComponent(_city+_zip),function(storeData){
            if( storeData.length>0 ){
              moveSetSelectOption(_city,_zip);
              renderStoreContent(_city,_zip,storeData);
            }
          });

          map.setCenter(pos);
          var marker = new google.maps.Marker({
            position: map.getCenter(),
            icon    : nowSetIcon,
            map     : map
          });

          var locations = [
            {lat: 25.0679686, lng: 121.61676590000002},
            {lat: 25.0820612, lng: 121.5921949},
            {lat: 25.0821952, lng: 121.5676168}
          ];

          ddd(locations);
          function ddd(locations){
            var markers = locations.map(function(location, i) {
              return new google.maps.Marker({
                position : location,
                icon     : storeIcon,
              });
            });

            var markerCluster = new MarkerClusterer(map, markers,{imagePath: storeIcon});
          }

          //----------------------

          var _searchSet      = [],
              _searchCity     = '',
              _searchZip      = '',
              _searchAddress  = '';

          $('select#city').on({
            change : function(){
              _searchCity    = $(this).val();
              _searchAddress = _searchCity;
              changeArea(_searchAddress);

            }
          });

          $('select#zip').on({
            change : function(){
              _searchZip      = $(this).val();
              _searchAddress  = _searchCity+_searchZip;
              changeArea(_searchAddress);
            }
          });

          function changeArea(_searchAddress){
            $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address='+_searchAddress+'&key='+googleMapKey,function(setData){
              console.log(setData);
              _searchSet = setData.results[0].geometry.location;
              map.setCenter(_searchSet);
              $.getJSON('https://www.tstartel.com/rest/serviceLocation/'+encodeURIComponent(_searchAddress),function(storeData){
                var _storeDataLength = storeData.length;
                locations = [];
                for(var i=0 ; i<_storeDataLength ; i++){
                  locations.push({
                    "lat" : Number(storeData[i].latlng.split(',')[0]),
                    "lng" : Number(storeData[i].latlng.split(',')[1])
                  })
                }

                //console.log(locations);

                ddd(locations);
              })
            })
          }

          //----------------------
        }
      })
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  }else {
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser doesn\'t support geolocation.');
}
