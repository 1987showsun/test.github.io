/*! 1515061826637 | tstar | tstar design by blackj | blackj */
$(document).ready(function(){
    HamburgerClick();
    HeaderSearch();
    NavSlide();
    FooterSlider();
    KvSlickSlide();
    EmergenceInit();
    header.initianl();
    $(window).scroll(function(){
      header.initianl();
    });

    KvThemeSlide();
    BackToTop();
    AnchorSlide();
    CheckAnchorShow();

});

$(window).resize(function(){
    AnchorSlide();
    CheckAnchorShow();
});

header = {
  $block       : '',
  _scrollTop   : 0,
  initianl : function(){
    header.$block     = $('header.ts-header');
    header._scrollTop = $(window).scrollTop();
    if( header._scrollTop>10 ){
      header.$block.addClass('notStickToTheTop');
    }else{
      header.$block.removeClass('notStickToTheTop');
    }
  },
}

function HamburgerClick(){
    $('.hamburger').click(function(){
        $(this).toggleClass('is-active');
        if($(this).hasClass('is-active')) {
            $('.hamburger').addClass('is-active');
			NavShow(true);
			$('.ts-main, .ts-footer, .ts-adwrap, .ts-header').addClass('blur');
        }
        else {
            $('.hamburger').removeClass('is-active');
			NavShow(false);
			$('.ts-main, .ts-footer, .ts-adwrap, .ts-header').removeClass('blur');
        }
    });

    $('.ts-navcover').click(function(){
        $('.hamburger').removeClass('is-active');
        NavShow(false);
    });
}

function NavShow(p){
    if($('.ts-nav').length){
        if(p) {
            $('.ts-nav').css('right','0');
            $('.ts-navcover').fadeIn(300);
        }
        else{
            $('.ts-nav').css('right','-320px');
            $('.ts-navcover').fadeOut(300);
        }
    }

    if($('.ts-subnav').length){
        if(p) {
            $('.ts-subnav').addClass('show');
        }
        else{
            $('.ts-subnav').removeClass('show');

        }
    }

}

function NavSlide(){
    if($('.ts-nav').length){
        $('.ts-nav__list__item__title .ts-icons-plus').click(function(){
            $('.ts-nav__list__item__title .ts-icons-plus').removeClass('active');
            $('.ts-nav__list__item__content').slideUp(200);

            if($(this).parent().next('.ts-nav__list__item__content').css('display') == 'none'){
                $(this).addClass('active');
                $(this).parent().next().slideDown(200);
            }
            else{
                $(this).parent().next().slideUp(200);
                $(this).removeClass('active');
            }

        });
    }

    if($('.ts-subnav').length){
        // $('.ts-subnav__list__item__title .ts-icons-triangle-down').click(function(){
        //     $('.ts-subnav__list__item__title .ts-icons-triangle-down').removeClass('active');
        //     $('.ts-subnav__list__item__content').slideUp(200);

        //     if($(this).parent().next('.ts-subnav__list__item__content').css('display') == 'none'){
        //         $(this).addClass('active');
        //         $(this).parent().next().slideDown(200);
        //     }
        //     else{
        //         $(this).parent().next().slideUp(200);
        //         $(this).removeClass('active');
        //     }

		// });
		$('.ts-subnav__list__item__title--mobile').click(function(){
            $('.ts-subnav__list__item__title .ts-icons-triangle-down').removeClass('active');
            $('.ts-subnav__list__item__content').slideUp(200);

            if($(this).next('.ts-subnav__list__item__content').css('display') == 'none'){
                $(this).addClass('active');
                $(this).next().slideDown(200);
            }
            else{
                $(this).next().slideUp(200);
                $(this).removeClass('active');
            }

        });
    }


}

// 正確的版本
// function HeaderSearch(){
//     $('.ts-header__wrap__inner__search .ts-icons-search').click(function(){
// 		if($('.ts-header__wrap__inner__search .navbar-form').hasClass('hide')) {
// 			$('.ts-header__wrap__inner__search .navbar-form').removeClass('hide');
// 			$('.ts-header__wrap__inner__search__input').focus();
// 		}
// 		else {
// 			$('.ts-header__wrap__inner__search .navbar-form').addClass('hide');
// 		}
//     });

// 	$(document).click(function(e){
// 		var $target = $(e.target);
// 		if( !($target.hasClass('ts-header__wrap__inner__search__input') || $target.hasClass('ts-header__wrap__inner__search__btn')) ) {
// 			$('.ts-header__wrap__inner__search .navbar-form').addClass('hide');
// 		}
// 	});
// }

// // 暫時用
function HeaderSearch(){
    $('.ts-header__wrap__inner__search .ts-icons-search').click(function(){
		if($('.ts-header__wrap__inner__search .navbar-form').hasClass('hide')) {
			$('.ts-header__wrap__inner__search .navbar-form').removeClass('hide');
			$('.ts-header__wrap__inner__search .navbar-form .form-control').focus();
		}
		else {
			$('.ts-header__wrap__inner__search .navbar-form').addClass('hide');
		}
    });

	$(document).click(function(e){
		var $target = $(e.target);
		if( !($target.hasClass('form-control') || $target.hasClass('ts-icons-search')) ) {
			$('.ts-header__wrap__inner__search .navbar-form').addClass('hide');
		}
	});
}



function FooterSlider(){
    $('.ts-footer__sitemap__title').click(function(){
        $(this).next().slideToggle(200);
    });
}

function KvSlickSlide(){
    $('.ts-kv >.slick').slick({
        arrows:true,
        autoplay: true,
		autoplaySpeed: 3000,
		speed: 1000,
    });

    /* 次首頁 Slick Slide */
    // $('.ts-subkv >.slick').slick({
    //     arrows:true
    // });

    $('.ts-subsection--plan .slick').slick({
        arrows:true,
        dots:true
    });
}

function CheckAnchorShow(){
    if($('.ts-subkv__bn-anchor').length){
        if($(window).width() < 768){
            var lastScrollTop = 0;
            $(window).bind('scroll.anchorScroll',function(){
                var st = $(this).scrollTop();
                // console.log(st)
                if (st > lastScrollTop){
                    // downscroll code
                    if(st > $('.ts-subsection').eq(0).offset().top){
                        $('.ts-subkv__bn-anchor').addClass('active');
                        $('.ts-header--sub').hide();
                        $('.hamburger--sub').hide();
                    }
                } else {
                    // upscroll code
                    $('.ts-subkv__bn-anchor').removeClass('active');
                    $('.ts-header--sub').show();
                    $('.hamburger--sub').show();
                }
                lastScrollTop = st;
            });
            var dgAnchor = $('.draggable .ts-subkv__bn-anchor__wrap'),
            dgWidth = 0;
            dgAnchor.draggable({
                axis:'x',
                containment:'draggable'
            })
            dgAnchor.find('a').each(function(index) {
                dgWidth += parseInt($(this).width(), 10);
            });
            dgAnchor.on( "drag", function( event, ui ) {
                if (ui.offset.left > 0) {
                    ui.position.left = 0;
                }

                if (ui.position.left < -(dgWidth - $(window).width())) {
                    ui.position.left = -(dgWidth - $(window).width());
                }
            });
        }
        else{
            $(window).unbind('.anchorScroll');
            $('.ts-header--sub').show();
            $('.hamburger--sub').show();
        }
    }

}

function EmergenceInit(){
    emergence.init({
        reset:false,
        offsetTop: 100,
        offsetRight: 0,
        offsetBottom: 0,
        offsetLeft: 0,
    });
}

function BackToTop(){
    if($('.ts-subkv').length){
        var kvOffset=$('.ts-subkv').offset().top + $('.ts-subkv').height();
    }
    if($('.ts-kv').length){
        var kvOffset=$('.ts-kv').offset().top + $('.ts-kv').height();
    }

    var wH = $(window).height();
    $(window).scroll(function(){
        var wTop = $(window).scrollTop();
        var ftOffset= $('.ts-footer .ts-footer__bottom').offset().top;
        if(wTop > kvOffset){
            $('.ts-backcontain').fadeIn(200);
        }
        else{
            $('.ts-backcontain').fadeOut(200);
        }

        if((wTop + wH) > ftOffset){
            $('.ts-backcontain').removeClass('fixed');
        }
        else{
            $('.ts-backcontain').addClass('fixed');
        }
    });
    $('.ts-backcontain .backtotop').click(function(){
        $('html,body').stop().animate({
            scrollTop:0
        },500);
    });

}

function AnchorSlide(){
    if($('.ts-subkv__bn-anchor').length){
        var anchorHeight;
        $('.ts-subkv__bn-anchor a').click(function(){
            var elem = $('*[data-id='+ $(this).data('offset') +']');
            var place = elem.offset().top;
            $('html,body').stop().animate({
                scrollTop: place + 1
            },500);
        });
        var AnchorPosition = function(){

        }
        if($(window).width() <= 768){
            var anchorLeft = [];
            $('.ts-subkv__bn-anchor a').each(function(){
                anchorLeft.push($(this).offset().left);
            });
            // console.log(anchorLeft)
            $(window).scroll(function(){
                anchorHeight = $('.ts-subkv__bn-anchor').height();
                var winTop = $(window).scrollTop();

                $('*[data-id]').each(function(i){
                    var elem = $('.ts-subkv__bn-anchor a[data-offset='+ $(this).data('id') +']');
                    if(winTop >= $(this).offset().top && winTop < $(this).offset().top + $(this).height()){
                        if(!elem.hasClass('active')){
                            elem.addClass('active');
                            // console.log(anchorLeft[elem.index()])
                            setTimeout(function(){
                                var po = anchorLeft[elem.index()];
                                if(po > 0){
                                    if(po > $('.ts-subkv__bn-anchor__wrap').width() - $(window).width()){
                                        po = '-'+($('.ts-subkv__bn-anchor__wrap').width() - $(window).width());
                                    }
                                    else{
                                        po = '-'+po;
                                    }

                                }
                                $('.ts-subkv__bn-anchor__wrap').css('left', po + 'px');
                            },100)
                        }
                    }
                    else{
                        elem.removeClass('active');
                        // $('.ts-subkv__bn-anchor__wrap').css('left', '-'+ elem.offset().left +'px');
                    }
                });
            });
        }

    }
}

function KvThemeSlide(){
    $('.ts-subsection__skewwords .ts-icons-arrow-right').click(function(){
        $(this).parents('.ts-subsection__skewwords').next('.ts-subsection__skewslide').addClass('show');
    });
    $('.ts-subsection__skewslide .ts-icons-plus').click(function(){
        $(this).parent().removeClass('show');
    })
    $('.ts-subsection__skewslide .ts-icons-arrow-right').click(function(){
        $(this).parent().removeClass('show');
    })
}
