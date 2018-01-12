$(function(){
  scrollWheel.contentSet();
  //header.initial();
  svg.initial();
  organ.initial();
  selectBarSwitch.initial();
  $(window).resize(function(){
    scrollWheel.contentSet();
    scrollWheel.initial();
    svg.initial();
  })

  $(window).scroll(function(){
    scrollWheel.initial();
    //header.initial();
  })
})

/*header = {
  $block       : '',
  _scrollTop   : 0,
  initial : function(){
    alert();
    header.$block     = $('header.ts-header');
    header._scrollTop = $(window).scrollTop();

    if( header._scrollTop>10 ){
      header.$block.addClass('notStickToTheTop');
    }else{
      header.$block.removeClass('notStickToTheTop');
    }
  },
}*/

scrollWheel = {
  $block       : '',
  _setMapArray : [],
  _blockLength : 0,
  _scrollTop   : 0,
  _nowMapSet   : 0,

  contentSet   : function(){
    scrollWheel.$block  = $('.tsContent');
    scrollWheel._blockLength = scrollWheel.$block.length;
    for(var i=0 ; i<scrollWheel._blockLength ; i++){
      scrollWheel._setMapArray[i] = scrollWheel.$block.eq(i).offset().top;
    }
  },

  initial : function(){
    scrollWheel._scrollTop = $(window).scrollTop()+($(window).height()/2);
    for(var i=0 ; i<scrollWheel._blockLength ; i++){
      if( scrollWheel.returnSet(i)!=undefined ){
        scrollWheel._nowMapSet = scrollWheel.returnSet(i);
      }
    }
    scrollWheel.addClassName();
  },

  returnSet : function(i){
    if( scrollWheel._scrollTop >= scrollWheel._setMapArray[i] ){
      return i;
    }
  },

  addClassName : function(){
    scrollWheel.$block.eq(scrollWheel._nowMapSet).addClass('active');
  }
}

svg = {
  $block       : '',
  $dataBlock   : '',
  $circle      : '',
  _blockLength : 0,

  initial : function(){
    svg.$block       = $('main svg');
    svg.$circle      = svg.$block.find('circle');
    svg._blockLength = svg.$block.length;
    var time;
    clearTimeout(time);
    time = setTimeout(function(){
      for(var i=0 ; i<svg._blockLength ; i++){
        var svg_w = svg.$block.eq(i).width();
        var svg_h = svg.$block.eq(i).height();
        svg.$block.eq(i).find('polyline').attr('points','0,45 0,0 '+svg_w+',0 '+svg_w+','+svg_h+' 0,'+svg_h+' 0,'+(svg_h-45))
      }
    },400);

    svg.circle();
  },

  circle : function(){
    var $circle = '';
    for( var i=0 ; i<svg.$block.length ; i++ ){
      $circle = svg.$block.eq(i).find('circle');
      if( $circle.length >0 ){
        var _size = new circleSize( $circle );
        var r     = (_size.circle_w/2);
        var _circleStrokeWidth = parseInt($circle.css('stroke-width'));
        var _circumference     = ((_size.circle_w/2)-(_circleStrokeWidth/2))*2*3.1417;
        var _set               = new use( $circle,_circumference )._set;
        $circle.attr({
          'cx' : _size.circle_w/2,
          'cy' : _size.circle_w/2,
          'r'  : (_size.circle_w/2)-(_circleStrokeWidth/2)
        }).css({
          'stroke-dasharray' : _circumference,
          'stroke-dashoffset': _set,
        })
      }
    }

    function circleSize( $circle ){
      var circle_w = $circle.parent().width();
      var circle_h = $circle.parent().height();
      return {
        circle_w : circle_w,
        circle_h : circle_h
      }
    }

    function use( $circle,_circumference ){
      var _dataTotal      = $circle.attr('data-total');
      var _dataUse        = $circle.attr('data-use');
      var _set            = _circumference - (_circumference*(_dataUse/_dataTotal));
      return {_set:_set};
    }
  }
}

organ = {
  $block       : '',
  initial : function(){
    var nextClass     = '',
        sleepTime     = 100;
    organ.$block      = $('.organSwitch');
    organ.$block.on({
      click : function(){
        if( $(window).width()<=767 ){
          organ.$block.next().slideUp(sleepTime);

          if( $(this).next().css('display')=='block' ){
            organ.$block.next().slideUp(sleepTime);
          }else{
            $(this).next().slideDown(sleepTime);
          }
        }
      }
    })
  }
}

selectBarSwitch = {
  $block       : '',
  initial : function(){
    selectBarSwitch.$block = $('.selectBarSwitch');
    selectBarSwitch.$block.on({
      click : function(){
        var optionCssStatus = $(this).find('>.option').css('display');
        if( optionCssStatus=='block' ){
          $(this).find('>.option').css({'display':'none'})
        }else{
          $(this).find('>.option').css({'display':'block'})
        }
      }
    })
  }
}
