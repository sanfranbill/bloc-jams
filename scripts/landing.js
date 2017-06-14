var animatePoints = function() {
    var revealPoint = function() {
        // #7
        $(this).css({
            opacity: 1,
            transform: 'scale(1) translateY(0)'
        });
    
    };
    // #6
    $.each($('.point'), revealPoint);
};

$(window).load(function() {
    // Automatically animate the points on a tall screen where scrolling can't trigger the animation
    if ($(window).height() > 950) {
         animatePoints();
    }
    
    // this will trigger the animation when the user scrolls at least 200 pixels into the 'selling points' element
    var scrollDistance = $('.selling-points').offset().top - $(window).height() + 200;
    
    $(window).scroll(function(event) {
        if ($(window).scrollTop() >= scrollDistance) {
            animatePoints();   
        }
    });
});