$(document).ready(function(){
	var $container = $('html,body,div#main-wrapper');

	$('.scroll-to-attack-request').click(function () {
		console.log('scrolling to attack request');
		$container.animate({
			scrollTop: 33
			}, 'slow');
		});
	$('.scroll-to-attack-payload').click(function () {
		console.log('scrolling to attack payload');
		$container.animate({scrollTop:
			$('.attack-request-payload-title').offset().top
			}, 'slow');
		});
	$('.scroll-to-attack-response').click(function () {
		console.log('scrolling to attack response');
		$container.animate({
			scrollTop: $('.attack-response-headers-title')
			}, 'slow');
		});
	$('.scroll-to-attack-content').click(function(){
		console.log('scrolling to attack content');
		$container.animate({
			scrollTop: $(document).height()
			}, 'slow');
		});
});

