$(document).ready(function(){
	$(".scroll-to-attack-request").click(function () {
			$('html,body').animate({scrollTop: 1000}, 2000);
		});
	$('.scroll-to-attack-payload').click(function () {
			$('html,body').animate({scrollTop: '+=200px'}, 2000);
		});
	$(".scroll-to-attack-response").click(function () {
			$('html,body').animate({scrollTop: '+=300px'}, 2000);
		});
	$(".scroll-to-attack-content").click(function(){
			$('html,body').animate({scrollTop: '+=1000'}, 2000);
		});
});

