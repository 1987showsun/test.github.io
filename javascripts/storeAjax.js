var optionCity      = '<option value="">請選擇縣市</option>',
    optionZip       = '<option value="">請選擇地區</option>',
    googleMapKey    = 'AIzaSyAvJ7qc6sj6AwQVuPx-WD904ETE_WaQgXA', //請更換成公司 Google Map Api Key
    showMapBlockId  = 'test1',
    mapZoom         = 15,
    nowSetIcon      = 'https://www.tstartel.com/resources/s0051/images/current_location.png',
    storeIcon       = 'https://www.tstartel.com/resources/s0051/images/store.png',
    locations       = [],
    notes           = {
      "city"     : "請選擇縣市",
      "zip"      : "請選擇行政區",
      "address"  : "請填寫詳細地址"
    };

//get City Api
$.getJSON('https://www.tstartel.com/rest/zipCode/allCity',function(cityData){
  for(var i=0 ; i<cityData.length ; i++){
    optionCity += '<option value="'+cityData[i].city+'">'+cityData[i].city+'</option>'
  }
  $('select#zip').html(optionZip);
  $('select#city').html(optionCity).on({
    change : function(){
      var _city     = $(this).val(),_zip='',
          _address  = '',
          _zip      = '';
      getZip( _city,_zip );
      getZipStore(_city,_zip,_address);
    }
  });
});

//get Zip Api
function getZip(_city,_zip){
  optionZip  = '<option value="">請選擇地區</option>';
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

//Form submit get Api
$(function(){
  $('form').submit(function(e){
    e.preventDefault();
    var _city    = $(this).find('#city').val();
    var _zip     = $(this).find('#zip').val();
    var _address = $(this).find('#address').val();
    if(_city!=''){
      getZipStore(_city,_zip,_address);
    }else{
      alert(notes.city);
    }
  })
})

//get Store infor Api
function getZipStore(_city,_zip,_address){
  $.getJSON('https://www.tstartel.com/rest/serviceLocation/'+encodeURIComponent(_city+_zip+_address),function(storeData){
    renderStoreContent(_city,_zip,storeData);
  })
}

//rnder Store infor
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
                            '<a href="tel:'+storeData[i].phoneNumber+'" class="btnStyleModel6">'+
                              '<img src="https://www.tstartel.com/resources/common/mobile/css/images/icon/tel.png" alt="聯絡門市" title="" style="width:15px"/>'+
                              '聯絡門市'+
                            '</a>'+
                            '<a href="https://www.google.com/maps/dir/Current+Location/'+storeData[i].latlng+'" class="btnStyleModel6" target="_blank">'+
                              '<img src="https://www.tstartel.com/resources/common/mobile/css/images/icon/map.png" alt="規劃路線" title=""/>'+
                              '規劃路線'+
                            '</a>'+
                          '</li>'+
                        '</ul>'+
                      '</li>';
    }
  }else{
    storeContent = '<li class="tbody">查無資料</li>';
  }
  $('#tableConent').html(storeContent);
}

//Now location Set CitySelect and ZipSelect
function moveSetSelectOption(_city,_zip){
  var optionZip = '';
  $('select#city').val(_city);
  getZip( _city,_zip );
}

//Store Label Status
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

      map.setCenter(pos);
      var marker = new google.maps.Marker({
        position: map.getCenter(),
        icon    : nowSetIcon,
        map     : map
      });

      //get Now Location
      $.getJSON('https://maps.google.com/maps/api/geocode/json?latlng='+position.coords.latitude+','+position.coords.longitude+'&key='+googleMapKey,function(nowCity){
        if( nowCity.results[0]!=undefined ){
          var addressComponents        = nowCity.results[0].address_components,
              addressComponentsLength  = addressComponents.length,
              _postalCode              = addressComponents[addressComponentsLength-1].long_name, //郵遞區號
              _country                 = addressComponents[addressComponentsLength-2].long_name, //國家
              _city                    = addressComponents[addressComponentsLength-3].long_name, //城市
              _zip                     = addressComponents[addressComponentsLength-4].long_name; //行政區
              _address                 = _city+_zip,
              _searchCity              = '',
              _searchZip               = ''

          $.getJSON('https://www.tstartel.com/rest/serviceLocation/'+encodeURIComponent(_address),function(storeData){
            if( storeData.length>0 ){
              var _storeDataLength = storeData.length;
              locations = [];
              for(var i=0 ; i<_storeDataLength ; i++){
                locations.push({
                  "title"   : storeData[i].locationName,
                  "address" : storeData[i].storeAddress,
                  "tel"     : storeData[i].phoneNumber,
                  "lat"     : Number(storeData[i].latlng.split(',')[0]),
                  "lng"     : Number(storeData[i].latlng.split(',')[1])
                })
              }
              markerSet(locations);
              moveSetSelectOption(_city,_zip);
              renderStoreContent(_city,_zip,storeData);
            }
          });

          $('select#city').on({
            change : function(){
              _searchCity    = $(this).val();
              _address       = _searchCity;
              changeArea(_address);

            }
          });

          $('select#zip').on({
            change : function(){
              _searchZip      = $(this).val();
              _address        = _searchCity+_searchZip;
              changeArea(_address);
            }
          });

          function changeArea(_address){
            $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address='+_address+'&key='+googleMapKey,function(setData){
              map.setCenter( setData.results[0].geometry.location );
              $.getJSON('https://www.tstartel.com/rest/serviceLocation/'+encodeURIComponent(_address),function(storeData){
                var _storeDataLength = storeData.length;
                locations = [];
                for(var i=0 ; i<_storeDataLength ; i++){
                  locations.push({
                    "title"   : storeData[i].locationName,
                    "address" : storeData[i].storeAddress,
                    "tel"     : storeData[i].phoneNumber,
                    "lat"     : Number(storeData[i].latlng.split(',')[0]),
                    "lng"     : Number(storeData[i].latlng.split(',')[1])
                  })
                }
                markerSet(locations);
              })
            })
          }

          //Add Store Marker
          function markerSet(locations){
            var infoWindow = new google.maps.InfoWindow();
            for (var i=0; i<locations.length; i++) {
              var data   = locations[i],
                  latLng = new google.maps.LatLng(data.lat, data.lng);

              var marker = new google.maps.Marker({
                position : latLng,
                map      : map,
                icon     : storeIcon,
                title    : data.title
              });

              (function(marker, data) {
                google.maps.event.addListener(marker, "click", function(e) {
                  infoWindow.setContent('<h3 style="color: #87286E; font-size:1.3em; margin-bottom: 5px !important;">'+data.title+'</h3><span style="color:#000; font-size:1.1em;">'+data.address+'</span>');
                  infoWindow.open(map, marker);
                });
              })(marker, data);
            }
          }
          //Add Store Marker End
        }
      })
    },function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  }else {
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

//Google Map Api render Error infor
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser doesn\'t support geolocation.');
}
