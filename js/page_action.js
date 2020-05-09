//var sw = screen.width;
//$('body').css('width', sw - sw/1.41803398875);
$('body').css('width', 370);
var current_term;
var ac_stay;
var language;

chrome.extension.sendMessage({method: 'getOption',}, function (resp) {
language = resp.language;

$(document).on('click', '.ui-autocomplete a', function () {
	$('#search-form').submit();
});

$('#q').autocomplete({
	delay: false,
	source: 'https://app.dictionarist.com/ext-autocomplete.asp?lang=english-spanish', 
	open: function() {
		$('#title').addClass('ac');
		$('#usage-tip').hide();
		$('.ui-menu li a').each(function(){
			var that = this;
			var re = new RegExp('^(' + $('#q').val() + ')(.*)$',"g");
			var str = $(this).text();
			$(that).html(str.replace(re, "$1<b>$2</b>"));
		});
	
		var menu  = $('.ui-autocomplete');
		var menu_top = parseInt(menu.css('top'));
		menu.css('top', menu_top -1);
		$('#press_enter').css('top', menu.height() + 8).show();
	},
	change: function ()
	{
		$('#search-form').submit();
	},
	close: function ()
	{
		$('#press_enter').hide();
		$('#title').removeClass('ac');
	},
	focus: function()
	{
		//ac_stay = true;
		//setTimeout(function (){$('#search-form').submit()}, 50);
	},
	select: function ()
	{
		$('#search-form').submit();
	}
}).focus();

$('#meaning').scroll(function () {
	$('#title').addClass('box-fix');
	
	if ($(this).scrollTop() == 0)
	{
		$('#title').removeClass('box-fix');
	}
});

$('#search-form').submit(function (e) {

	e.preventDefault();
	var $_term = $('#q').val();
	$term = $.trim($_term).replace(/\s/g, '+');
	
	if (!ac_stay)
	{
		$('#q').autocomplete( "close" );
	}
	
	if (!$term || current_term == $term)
	{
		return;
	}
	
	if (!ac_stay)
	{
		$('#q').autocomplete( "disable" );
	}

	$('title').removeClass('box-fix');
	$('#lookup-status').text('Searching...').show();
	$('#usage-tip').hide();

	$.ajax({
		url: 'https://www.spanishdict.com/translate/' + encodeURIComponent($term),
		success: function (data)
		{
			current_term = $term;
			$('#press_enter').remove();
			$('#meaning').scrollTop(0);

			var el = document.createElement( 'html' );
            el.innerHTML = data;
			var te1 = el.getElementsByClassName('CMxOwuaP')[0].innerText;
			var te3 = el.getElementsByClassName('CMxOwuaP')[1].innerText;
			//var te1 = el.getElementById('dictionary-neodict-es').outerHTML;
			var te2 = el.getElementsByClassName('_2TSMt8mh');
			
			var te4 = el.getElementsByClassName('_2TU5DCs3');
		    var $obj = $(te4); // Create jQuery object
		    $obj.find(".PHgM6Tpn ._159CTRwV").remove();
            $obj.find(".IaWcWZOn").remove(); // Remove .del items
		    $obj.find("._1TNZVHD7").remove();
			$obj.find("._6AhgG5IT").remove();
			$obj.find("._3QFIA64h").remove();
			$obj.find("._1BlHwrKt").remove();

			if (te1){
				$('#title').html('<a href="https://www.spanishdict.com/translate/'+te1+'" target="_blank">'+te1+'</a>').show();
				$('#meaning').html(te3).show();
			}else{
				$('#title').html("<h3>No records found for: <i>" + $_term + "</i>.</h3>").show();
				$('#meaning').html(" ").hide();
			}
			

			if(te2){
				$('#example').html(te4[0].outerHTML).show();
			}else{
				$('#example').html(" ").hide();
			}
			
			var con = el.getElementsByClassName('_3HY3Mi1E')[1].innerText;
			if(con  ==  'Conjugation'){
				$.ajax({
					url: 'https://www.spanishdict.com/conjugate/' + encodeURIComponent($term),
					success: function (data){
						var cl = document.createElement( 'html' );
						cl.innerHTML = data;
						var conju = cl.getElementsByClassName('_3AKO-pN7')[0].outerHTML;
						$('#dict').show();
						$('#conj').show();
						$('#conjugate').html(conju ).show();
					}
				})
			}
			
		},
		error: function ()
		{
			$('#title').html("<h3>No results found for: <i>" + $_term + "</i>.</h3>").show();
			$('#meaning').html(" ").hide();
			$('#example').html(" ").hide();
		},
		complete: function ()
		{
			x$('#lookup-status').hide();
			ac_stay = false;
			$('#q').autocomplete( "enable" );
		}
	});
});

function defaultSearch (obj)
{
	var txt = $.trim(obj.text);

	if (txt)
	{
		$('#q').val(txt);
		$('#search-form').submit();
	}
}

function playaudio() {
	document.getElementById("snd").play();
}
	
chrome.tabs.query({
    active: true,    
    lastFocusedWindow: true
}, function(array_of_Tabs) {
    var tab = array_of_Tabs[0];
	chrome.tabs.sendMessage(tab.id,  {from:'page_action', subject: "getSelection"}, defaultSearch);
});

});