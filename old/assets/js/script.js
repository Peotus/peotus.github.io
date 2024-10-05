$(document).ready(function() {
    $('.nav .box').css('right', $('.nav').width()/2-3);
});

var position = $(".nav").offset();

$(".nav").on('mousemove', function(e){
    $('.nav-follower').delay(250).css({
       left:  e.pageX - 2500 ,
       top:   e.pageY -  2500
    });
});

$('.nav').hover(function(){
	$('.nav-follower').addClass('hover');

}, function(){
    $('.nav-follower').addClass('ending');
    setTimeout(function(){
        $('.nav-follower').removeClass('ending');
        $('.nav-follower').removeClass('hover');
    }, 300);
})