const PEN_COLOR = "#fff";
const SKETCHPAD_CELLSPACING = 0;
const SKETCHPAD_CELLPADDING = 0;
const SKETCHPAD_SIZE_NUM = 540;
const SKETCHPAD_SIZE_PX = SKETCHPAD_SIZE_NUM + 'px'; //No inconsistencies with quotation mark selection, twat!
const SKETCHPAD_DEFAULT_DIM = 20;
const ETCHXEL_CLASS_NAME = "etchxel";
const ETCHXEL_BORDER_ON = "1px solid rgba(0,255,0,0.1)";
const ETCHXEL_BORDER_OFF = "0px solid rgba(0,255,0,0.1)";

var pen_options = ["Constant", "Rainbow", "Gradient"];
var pen_type = pen_options[0];

var pen_paint_on = true;
var etchxel_showing_border = false;
var opacity_on = false;

function randInt(n) {
	return Math.floor(Math.random()*n);
}

function randColor() {
	return "rgb("+randInt(255)+","+randInt(255)+","+randInt(255)+")";
}

function initTable(sketchpad, dim) {
	var table = $('<table></table>');
	table.attr('cellspacing',SKETCHPAD_CELLSPACING);
	table.attr('cellpadding',SKETCHPAD_CELLPADDING);
	var tr = $('<tr></tr>');
	var td = $('<td></td>');
	var etchxel = $('<div></div>');
	etchxel.attr('class',ETCHXEL_CLASS_NAME);
	etchxel.css('width',SKETCHPAD_SIZE_NUM/dim + 'px');
	etchxel.css('height',SKETCHPAD_SIZE_NUM/dim + 'px');
	td.append(etchxel);

	for (var i = 0; i < dim; i++) {
		tr.append(td.clone());
	}
	for (var i = 0; i < dim; i++) {
		table.append(tr.clone());
	}

	sketchpad.append(table);

	initTableHover();
}

function resetSketchpad(dim) {
	var sketchpad = $('#da_sketchboard');	
	sketchpad.find('table').remove();
	sketchpad.attr('width',SKETCHPAD_SIZE_PX);
	sketchpad.attr('height',SKETCHPAD_SIZE_PX);
	initTable(sketchpad, dim);
}

function initTableHover() {
	$('.etchxel').on('mouseover', function() {
		if(!pen_paint_on) {
			return;
		}
		
		var opacity = 1;
		if(opacity_on) {
			opacity = $(this).css("opacity")-0.1;
		}
		else {
			var pen_color = getPenColor($(this));
			$(this).css('background-color', pen_color);
		}
		
		$(this).css("opacity", opacity);
		
	});
}

function getPenColor(etchxel) {
	switch(pen_type) {
		case "Rainbow":
			return randColor();
		case "Constant":
			return PEN_COLOR;
		case "Gradient":
		default:
			return undefined;
	}
}

function addHoverHighlightEffect(dom_obj) {
	dom_obj.on('mouseenter', function() {
		$(this).addClass('highlighted');
	});
	dom_obj.on('mouseleave', function() {
		$(this).removeClass('highlighted');
	});
}

$(document).ready(function() {
	addHoverHighlightEffect($('.opt_btn'));
	
	resetSketchpad(SKETCHPAD_DEFAULT_DIM);
	
	$('#reset').on('click', function() {
		var dim = Number(prompt("Please enter matrix dimension(1-100):", ""+SKETCHPAD_DEFAULT_DIM)); 
		resetSketchpad(dim);
	});

	
	var dom_pen_option = $('#pens');
	//Removing duplicates
	dom_pen_option.find('.drop_opt').remove();
	for(var i=0; i<pen_options.length; i++) {
		dom_pen_option.append('<div class="drop_opt">'+pen_options[i]+'</div>');
		addHoverHighlightEffect($('.drop_opt'));
	}
	
	dom_pen_option.on('click', 'div', function() {
		pen_type = $(this).text();
		opacity_on = (pen_type == "Gradient" ? true : false);
	});
	
	$("#btoggle").on('click', function(){
		var etchxels_dom = $("."+ETCHXEL_CLASS_NAME);
		etchxels_dom.css("border", etchxel_showing_border ? ETCHXEL_BORDER_OFF : ETCHXEL_BORDER_ON);
		etchxel_showing_border = !etchxel_showing_border;
	} );
	
	$('body').on('keypress', function(event) {
		switch(String.fromCharCode(event.which)) {
			case 'T':
			case 't':
				pen_paint_on = !pen_paint_on;
				$("#toggleind").css("background-color", pen_paint_on ? "yellow" : "#880"); 
				break;
		}
		
	});
	
});