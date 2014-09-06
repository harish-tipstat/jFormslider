/*
**************************************
******jFormsliderv 1.0.4**************
******jFormslider.js******************
******Created by Harish U Warrier*****
******Created on 08-06-2014***********
******Modified on 08-08-2014**********
******huwz1it@gmail.com***************
**************************************
*/
if("undefined"==typeof jQuery)
{	if('undefined'!==typeof console)
		console.log('%c Sorry!!There is no jquery please get jquery ','color: red');
	else
		throw new Error("Sorry!!There is no jquery please get jquery");
}
$.fn.jFormslider=function(options)
{
	var version="1.0.4";
	var $this=$(this);
	var lilength=$this.find('li').length;
	var randomid='jformslider'+new Date().valueOf();
	var ajaxprocessing=false;
	var defaults=
	{
		width:600,
		height:300,
		next_prev:true,
		submit_btn:true,
		submit_class:'',
		next_class:'',
		prev_class:'',
		nav_class:'',
		error_class:'error',
		error_element:true,
		error_position:'',
		texts:{
				next:'next',
				prev:'prev',
				submit:'submit'
			  },
		ajaxloader:true,
		ajax_repeat:false,	
		speed:400,
		bootstrap:false,
		full_navigation:true,
		validation:true,
		disabletab:true,
		submit_handler:"",
	}
	if(arguments.length>0)
	{
		var text=$.extend(defaults.texts,options.texts);
		options=$.extend(defaults,options);
		options.texts=text;
	}else
		options=defaults;
	var msgspan='<div class="'+options.error_class+'" id="'+randomid+'" style="display:none"></div>';
	var next_button='<a class="'+options.next_class+'" next style="float:right">'+options.texts.next+'</a>';
	var prev_button='<a class="'+options.prev_class+'" prev style="float:left">'+options.texts.prev+'</a>';
	var width=options.width;
	var height=options.height;
	var widthpc=width*lilength;
	var errorspan="";
	var errorclasses=splitclass($.trim(options.error_class));
	var error_selector='.'+errorclasses.join('.');
	var submit_element="";
	if(options.submit_btn)
		submit_element='<button submit type="submit" class="'+options.submit_class+'"  style="float:right">'+options.texts.submit+'</button>';
	if(options.error_element)
	{
		if(options.error_position=="inside")
			errorspan="<span class='"+options.error_class+"' style='display:none'></span>";
		else
			$(this).after(msgspan);
	}else
		errorspan="";
	var navigation_div='<div class="'+options.nav_class+'">'+prev_button+errorspan+next_button+'</div>';
	var jformslider_style="<style tag='jformslider'>.jformslider {	width:"+width+"px;height:"+height+"px;overflow:hidden;}"+
					".jformslider ul {margin:0px;padding:0px;list-style:none;width:"+widthpc+"%;}"+
					".jformslider li {display:inline;float:left;width:"+width+"px;}"+
				"</style>";
				if($('style[tag="jformslider"]').length<=0)
					$('head').append(jformslider_style);
	$(this).addClass('jformslider');
	if($(this).find('li:first').hasAttr('call-before'))
	{
		var func=$(this).find('li:first').attr('call-before');
		eval(func);		
	}
	if(options.next_prev)
	{
		$(this).find('li').each(function(index,element){
			var errspan=errorspan;
			var nav_div=navigation_div;
			if($(this).find(error_selector).length>=1)
			{
				errspan="";
				nav_div='<div class="'+options.nav_class+'">'+prev_button+next_button+'</div>';
			}			
			if(index==0 || $(this).hasAttr('no-prev'))
				$(this).append('<div class="'+options.nav_class+'">'+next_button+errspan+'</div>');
			else if(index==lilength-1 || $(this).hasAttr('no-next'))
			{
				if(index==lilength-1)
					$(this).append('<div class="'+options.nav_class+'">'+errspan+prev_button+submit_element+'</div>');
				else
					$(this).append('<div class="'+options.nav_class+'">'+errspan+prev_button+'</div>');
			}else if(!$(this).hasAttr('no-next-prev'))
				$(this).append(nav_div);
		});
	}else
	{
		$(this).find('li').each(function(index,element){
			var errspan=errorspan;
			if($(this).find(error_selector).length>=1)
				errspan="";
			$(this).append('<div class="">'+errspan+'</div>');
		});
	}
	$(this).find('li[hide]').hide();
	$(this).find('li').each(function(index,element){
		$(this).find('input,select').last().keydown(function(e) {
			if(e.which==9 )
			{	if(options.disabletab)
				return false;
			}
		});
	});	
	$(this).find('[number]').keydown(function(e){ 
		var numberarray=[96,97,98,99,100,101,102,103,104,105,109,189,8,46,48,49,50,51,52,53,54,55,56,57,9,16];
		if($.inArray(e.keyCode,numberarray)==-1)
		{	
			if(options.validation)
				e.preventDefault();
		}
		if(e.keyCode>=65 && e.keyCode<=90)
		{
			if(options.validation)
				e.preventDefault();
		}
	});
	$('[ajax-url]').each(function(index,element){
		var target="";
		target=$(this).hasAttr('ajax-target')?$(this).attr('ajax-target')!=""?$(this).attr('ajax-target'):target:target;
		if(target=="")
		{	
			if($(this).find('[next],[prev]').length!=0)
			{
				if($(this).find('.jformslider_ajax_target').length==0)
				$(this).find('[next],[prev]').parent().before("<div class='jformslider_ajax_target'></div>");
			}else
			{
				if($(this).find('.jformslider_ajax_target').length==0)
				$(this).append("<div class='jformslider_ajax_target'></div>");
			}
		}
	});	
	$("body").keydown(function(e){
		if(e.which==9 && e.shiftKey)
		{ 
			if(e.target.nodeName=="INPUT")
			{
				var id=e.target.id;
				$(e.target).parents('li').find('input').each(function(index, element) {
				    if($(this).attr('id')==id)
					{	$(e.target).parents('li').find('input:eq('+(index-1)+')').focus();
						return false;
					}
				});
			}
			return false;
		}
	});
	$('[prev]').click(function(e){
		e.preventDefault();
		$this.prevSlide();
	});
	$('[next]').click(function(e){
		e.preventDefault();
		$this.nextSlide();
	});
	$('[submit]').click(function(e){
		e.preventDefault();
		var current_slide=$this.get_current_slide();
		var slidestart=false;
		if(options.validation)
		{
			current_slide.find('input[required],select[required],input[email]').each(function(index,element){
				if($(this).hasAttr('required'))
				{	if($.trim($(this).val())=='')
					{
						var msg=$(this).hasAttr('data-msg')?$(this).attr('data-msg'):'Please fill this field';
						if(options.error_position=="inside")
							current_slide.find(error_selector).html(msg).show();
						else
							$('#'+randomid).html(msg).show();
						$(this).focus();
						
						slidestart=false;
						return false;
					}
				}
				if($(this).hasAttr('email'))
				{
					if(!emailvalid($.trim($(this).val())))
					{
						if(options.error_position=="inside")
							current_slide.find(error_selector).html('Please Enter a valid email').show();
						else
							$('#'+randomid).html('Please Enter a valid email').show();
						$(this).focus();
						slidestart=false;
						return false;
					}
				}
				if($(this).is('select'))
				{
					if($.trim($(this).val())=='-1')
					{
						var msg=$(this).hasAttr('data-msg')?$(this).attr('data-msg'):'Please fill this field';
						if(options.error_position=="inside")
							current_slide.find(error_selector).html(msg).show();
						else
							$('#'+randomid).html(msg).show();
						$(this).focus();
						slidestart=false;
						return false;
					}
				}
				if(options.error_position=="inside")
					current_slide.find(error_selector).html('').hide();
				else
					$('#'+randomid).html('').hide();
				slidestart=true;
			});
		}else
			slidestart=true;
		if(current_slide.find('input[required],select[required],input[email]').length<=0)
			slidestart=true;
		if(slidestart && options.submit_handler!="")
			options.submit_handler();
	});
	$.fn.nextSlide=function(){
		var current_slide=$(this).get_current_slide();
		var next_slide=$(this).get_next_slide();
		var slidestart=false;
		if(options.validation)
		{
			current_slide.find('input[required],select[required],input[email]').each(function(index,element){
				if($(this).hasAttr('required'))
				{
					if($.trim($(this).val())=='')
					{
						var msg=$(this).hasAttr('data-msg')?$(this).attr('data-msg'):'Please fill this field';
						if(options.error_position=="inside")
							current_slide.find(error_selector).html(msg).show();
						else
							$('#'+randomid).html(msg).show();
						
						$(this).focus();
						slidestart=false;
						return false;
					}
				}
				
				if($(this).hasAttr('email'))
				{
					if(!emailvalid($.trim($(this).val())))
					{
						if(options.error_position=="inside")
							current_slide.find(error_selector).html('Please Enter a valid email').show();
						else
							$('#'+randomid).html('Please Enter a valid email').show();
						
						$(this).focus();
						slidestart=false;
						return false;
					}
				}
				if($(this).is('select'))
				{
					if($.trim($(this).val())=='-1')
					{
						var msg=$(this).hasAttr('data-msg')?$(this).attr('data-msg'):'Please fill this field';
						if(options.error_position=="inside")
							current_slide.find(error_selector).html(msg).show();
						else
							$('#'+randomid).html(msg).show();
						
						$(this).focus();
						slidestart=false;
						return false;
					}
				}
				if(options.error_position=="inside")
					current_slide.find(error_selector).html('').hide();
				else
					$('#'+randomid).html('').hide();
				
				slidestart=true;
			});
		}else
			slidestart=true;
		if(current_slide.find('input[required],select[required],input[email]').length<=0)
			slidestart=true;
		
		if(slidestart)
		{
			if(current_slide.hasAttr('call-after'))
				{
					var func=current_slide.attr('call-after');
					if(!eval(func))
					{
						slidestart=false;
						return false;
					}else
						slidestart=true;
				}else
					slidestart=true;
		}
		next_slide=$(this).get_next_slide();
		if(slidestart)	
		{	
			if(next_slide.hasAttr('call-before'))
			{
				var func=next_slide.attr('call-before');
				if(!eval(func))
				{
					slidestart=false;
					return false;
				}else
					slidestart=true;
			}else
				slidestart=true;
		}
		if(next_slide.hasAttr('ajax-url') && slidestart && !next_slide.hasAttr('ajax-done'))
		{
			if($.trim(next_slide.attr('ajax-url'))!="")
			{
				slidestart=false;
				if(options.ajaxloader)
				$this.appBusy({status:"show",top:options.height/2,left:options.width/2});
				$.ajax({
					url:next_slide.attr('ajax-url'),
					data:next_slide.hasAttr('ajax-data')? JSON.parse(next_slide.attr('ajax-data')):{},
					type:next_slide.hasAttr('ajax-type')?next_slide.attr('ajax-type'):'POST',
					success:function(data)
						 {
							var target="";
							target=next_slide.hasAttr('ajax-target')?next_slide.attr('ajax-target')!=""?next_slide.attr('ajax-target'):target:target;
							if(target!="")
							{	
								 target.html(data);
								 if(!options.ajax_repeat)
								 next_slide.attr('ajax-done','');
							}else if(next_slide.find('[next],[prev]').length!=0)
							{
								next_slide.find('.jformslider_ajax_target').html(data);
								if(!options.ajax_repeat)
								next_slide.attr('ajax-done','');
							}else
							{
								next_slide.append(data);
								if(!options.ajax_repeat)
								next_slide.attr('ajax-done','');
							};
							ajaxprocessing=false;
							slidestart=true;
							if(options.ajaxloader)
								$this.appBusy({status:"hide"});
							var px=Number($this.find('ul').css('margin-left').replace("px",""));
							px-=width;
							$this.find('ul').animate({ marginLeft: px+'px' }, options.speed);
						 },
				  error:function(x,y,z)
				  {
					  ajaxprocessing=false;
					  if(options.ajaxloader)
					  $this.appBusy({status:"hide"});
					  console.log(x,y,z);
				  }
			  });
			}
		}
		if(slidestart)
		{
			var px=Number($(this).find('ul').css('margin-left').replace("px",""));
			px-=width;
			$(this).find('ul').animate({ marginLeft: px+'px' }, options.speed);
		}
	};
	
	$.fn.prevSlide=function(){
		var slideback=true;
		var pre_slide=$(this).get_prev_slide();
		if(pre_slide.hasAttr('call-prev'))
				{
					var func=pre_slide.attr('call-prev');
					if(!eval(func))
					{
						slideback=false;
						return false;
					}else
						slideback=true;
				}else
					slideback=true;
		if(slideback)
		{
			var px=Number($(this).find('ul').css('margin-left').replace("px",""));
			px+=width;
			$(this).find('ul').animate({ marginLeft: px+'px' }, options.speed);
		}
	};
	$.fn.gotoSlide= function(slideid){
		var count=0;
		var found=false;
		var slidethis=$(this);
		$(this).find('li').each(function(index, element) {
			count++;
			if($(this).hasAttr('data-id'))
			{	if($(this).attr('data-id')==$.trim(slideid))
				{	found=true;
					return false;
				}
			}
		});
		var go_to=(count-1)*width;	
		var px='-'+go_to+'px';
		if(found)
		{
			var gslide=$('[data-id="'+slideid+'"]');
			gslide.show();
			if(gslide.hasAttr('ajax-url'))
			{	if(gslide.attr('ajax-url')!="")
				{
					if(options.ajaxloader)
						$this.appBusy({status:"show",top:options.height/2,left:options.width/2});
					$.ajax({
						url:gslide.attr('ajax-url'),
						data:gslide.hasAttr('ajax-data')? JSON.parse(gslide.attr('ajax-data')):{},
						type:gslide.hasAttr('ajax-type')?gslide.attr('ajax-type'):'POST',
						success:function(data)
						 {
							var target=gslide.hasAttr('ajax-target')?gslide.attr('ajax-target')!=""?gslide.attr('ajax-target'):"":"";
							if(target!="")
							{	target.html(data);
								if(!options.ajax_repeat)
									gslide.attr('ajax-done','');
							}else if(gslide.find('[next],[prev]').length!=0)
							{	gslide.find('.jformslider_ajax_target').html(data);
								if(!options.ajax_repeat)
									gslide.attr('ajax-done','');
							}else
							{	gslide.append(data);
								if(!options.ajax_repeat)
									gslide.attr('ajax-done','');
							};
							ajaxprocessing=false;
							slidestart=true;
							if(options.ajaxloader)
								$this.appBusy({status:"hide"});
							var px=Number($this.find('ul').css('margin-left').replace("px",""));
							px-=width;
							slidethis.find('ul').animate({ marginLeft:px }, options.speed);
						 },
						 error:function(x,y,z)
						 {	  ajaxprocessing=false;
							  if(options.ajaxloader)
									$this.appBusy({status:"hide"});
							  console.log(x,y,z);
							  slidethis.find('ul').animate({ marginLeft:px }, options.speed);	
						  }
					  });
				}
			}else
				slidethis.find('ul').animate({ marginLeft:px }, options.speed);
		}else
			message('nodataid');
	};
	message('startup');
	$.fn.get_current_slide= function(){
		var px=Number($this.find('ul').css('margin-left').replace("px",""));
		var slide=-px/width;
		var slcount=-1;
		var current='';
		$this.find('li').filter(':visible').each(function(index, element) {
			slcount++;
			if(slcount==slide)
			{
				current=$(this);
				return false;
			}
		});
		if(current=="")
			message('no_cs');
		else
			return current;		
	}
	$.fn.get_next_slide= function(){
		var px=Number($this.find('ul').css('margin-left').replace("px",""));
		var slide=-px/width;
		var slcount=-2;
		var current='';
		$this.find('li').filter(':visible').each(function(index, element) {
			slcount++;
			if(slcount==slide)
			{
				current=$(this);
				return false;
			}
		});
		if(current=="")
			message('no_ns');
		else
			return current;		
	}
	$.fn.get_prev_slide= function(){
		var px=Number($this.find('ul').css('margin-left').replace("px",""));
		var slide=-px/width;
		var slcount=0;
		var current='';
		$this.find('li').filter(':visible').each(function(index, element) {
			slcount++;
			if(slcount==slide)
			{
				current=$(this);
				return false;
			}
		});
		if(current=="")
			message('no_ps');
		else
			return current;		
	}
	$.fn.get_slide_details=function()
	{
		var px=Number($this.css('margin-left').replace("px",""));
		var slide_nos=(-px/790)+1;
		var count=1;
		var did='';
		count=lilength;
		var pages={current:slide_nos,total:count};
		return pages;
	}
	function message(type)
	{
		var msg='';
		var style=""
		switch(type)
		{
			case 'startup':msg='%c Congratulations!!!  You are using %cjFormslider '+version;
						  style='color: green';
						  if('undefined'!==typeof console)
							{
								console.log(msg,style,'font-style:italic;font-size:15px;font-weight:bold;'+style);
							}
						  break;
			case 'nodataid':msg='%c No %c"data-id" %cdefined; Please define a %c"data-id" %cin a li to use function %c"gotoSlide()" ';
						  style='color: red';
						  style1=style+';font-style:italic;font-size:15px;font-weight:bold;';
						  if('undefined'!==typeof console)
							{
								console.log(msg,style,style1,style,style1,style,style1);
							}
						  break;
			case "nojquery":
						  msg='%c Sorry!!There is no jquery please get jquery ';
						  style='color: red';
						    if('undefined'!==typeof console)
							{
								console.log(msg,style);
							}else
							{
								throw new Error("Sorry!!There is no jquery please get jquery");
							}
			
						break;
			case 'no_cs':msg='%c Sorry!! There is no current slide Some Unknown Error Occured.Please try again ';
						  style='color: red';
						  style1=style+';font-style:italic;font-size:15px;font-weight:bold;';
						  if('undefined'!==typeof console)
							{
								console.log(msg,style);
							}
						  break;
			case 'no_ns':msg='%c Sorry!! There is no next slide ';
						  style='color: red';
						  style1=style+';font-style:italic;font-size:15px;font-weight:bold;';
						  if('undefined'!==typeof console)
							{
								console.log(msg,style);
							}
						  break;
			case 'no_ps':msg='%c Sorry!! There is no previous slide';
						  style='color: red';
						  style1=style+';font-style:italic;font-size:15px;font-weight:bold;';
						  if('undefined'!==typeof console)
							{
								console.log(msg,style);
							}
						  break;			  
						  
			case 'unknown':msg='%c Sorry!! Some Unknown Error Occured.Please try again ';
						  style='color: red';
						  style1=style+';font-style:italic;font-size:15px;font-weight:bold;';
						  if('undefined'!==typeof console)
							{
								console.log(msg,style);
							}
						  break;					
		}
	}
	function emailvalid(email) 
	{
		var rexp = /\S+@\S+\.\S+/;
		return rexp.test(email);
	}
	function splitclass(str)
	{
		return str.split(/\s+/);
	}
	$.fn.appBusy=function(aboptions)
	{
		var img="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";
		var pos=$(this).offset();
		var defaults=
		{
			status:"show",
			top:0,
			left:0,
		}
		aboptions=$.extend(defaults,aboptions);
		var div="<div id='jformslider_busy' style='background-image: url(data:image/gif;base64,"+img+");background-repeat: no-repeat;background-position: center;position: absolute;z-index: 9999;display: none;width: 130px;height: 20px;'></div";
		if($('#jformslider_busy').length==0)
			$('body').append(div);
		var busylength=Number($('#jformslider_busy').css('width').replace('px',''))/2;
		aboptions.top=(pos.top+aboptions.top)+"px";
		aboptions.left=(pos.left+aboptions.left-busylength)+"px";
		if(aboptions.status=="show")
			$('#jformslider_busy').css({ 'top' :aboptions.top,'left':aboptions.left }).show();
		else if(aboptions.status=="hide")
			$('#jformslider_busy').hide();
		else
			$('#jformslider_busy').hide();
	}
};
$.fn.hasAttr = function(name) 
{  
   	return this.attr(name) !== undefined;
};