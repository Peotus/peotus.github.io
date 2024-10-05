const move = document.getElementById("move");

document.body.onpointermove = event => {
    const { clientX, clientY } = event;

    move.animate({
        left: `${clientX}px`,
        top: `${clientY}px`
    
    }, {duration: 500, fill: "forwards"})

};

var $cursor = jQuery('#move');
var $links = jQuery('.link, .call-to-action, a');

$links.on('mouseenter', function(e){
    $cursor.addClass('big');
 });
 
 $links.on('mouseleave', function(e){
    $cursor.removeClass('big');
 });

 var open=0;

 $("#hamburger").on('click', function(e){
    if(open==0){
        $("#navbar, #hamburger").addClass('open');
        open=1;
    }
    else{
        $("#navbar, #hamburger").removeClass('open');
        open=0;
    }
 });


