mui.init({
	gestureConfig: {
		doubletap: true
	}
});

var nameMapper = {
	"1": "弃电率",
	"2": "新能源装机",
	"3": "最大负荷",
	"4": "上备用系数",
	"5": "调峰率",
	"6": "自备电厂占比",
	"8": "中长期外送",
	"9": '短期现货',
	"10": '综合利用'
};

mui('.mui-scroll-wrapper').scroll();

var renderHistory = function() {
	if(!window.plus) {
		return;
	}

	_history = plus.storage.getItem('HISTORY_INPUT');

	if(!_history) {
		$('#resTitleText').html('');
		$('#resValue').html('--');
		$('#xnkjzyl').html('--');
		$('#xnyfdlzb').html('--');
		$('#zlwscf').html('--');
		$('#zllyxss').html('--');
		return;
	}

	$("#historyWrapper").show();
	_history = JSON.parse(_history);
	var tmpl = '<li class="mui-table-view-cell">' +
		'<div class="mui-slider-right mui-disabled">' +
		'<a class="mui-btn mui-btn-primary">重新计算</a>' +
		'<a class="mui-btn mui-btn-red">删除</a>' +
		'</div>' +
		'<div class="mui-slider-handle">' +
		'<div>' +
		'<span>{titleText}：<span>{resValue}</span></span>' +
		'<div class="time-desc">' +
		'<span>{sdate}</span> / ' +
		'<span>{edate}</span><br>' +
		'计算时间：<span>{add_time}</span>' +
		'</div>' +
		'</div>' +
		'<span class="mui-pull-right">{info}</span>' +
		'</div>' +
		'</li>';
	var infoTmpl = '<div>{text}</div>';
	var html = '';

	for(var i in _history) {
		var _h = _history[i];
		var multiple = _h['multiple'];
		var multipleType = _h['multipleType'];

		var val_1 = '';

		if(multiple && multipleType == 1) {
			val_1 = '最大' + (_h['zdfhzdValue'] / 10) + ',最小' + (_h['zdfhzxValue'] / 10) + ',间隔' + (_h['zdfhjgValue'] / 10);
		} else {

			if(_h['first_list']) {
				val_1 = (_h['first_list']['zdfhValue'] / 10) + '/' + (_h['second_list']['zdfhValue'] / 10);
			} else {
				val_1 = (_h['zdfhValue'] / 10);
			}

		}

		var info = infoTmpl.replace(/{text}/, '最大负荷(万千瓦):' + val_1);

		if(_h['first_list']) {
			info += infoTmpl.replace(/{text}/, '负荷率(%):' + (_h['first_list']['fhlValue'] * 100) + '/' + (_h['second_list']['fhlValue'] * 100));
		} else {
			info += infoTmpl.replace(/{text}/, '负荷率(%):' + (_h['fhlValue'] * 100));
		}

		if(_h['type'] == 1) {
			var val_2 = '';

			if(multiple && multipleType == 3) {
				val_2 = '最大' + (_h['xnyzjzdValue'] / 10) + ',最小' + (_h['xnyzjzxValue'] / 10) + ',间隔' + (_h['xnyzjjgValue'] / 10);
			} else {
				val_2 = (_h['xnyzjValue'] / 10);
			}

			info += infoTmpl.replace(/{text}/, '新能源装机(万千瓦):' + val_2);
		} else {

			if(_h['first_list']) {
				info += infoTmpl.replace(/{text}/, '目标弃电率(%):' + (_h['first_list']['mbqdlValue'] * 100) + '/' + (_h['second_list']['mbqdlValue'] * 100));
			} else {
				info += infoTmpl.replace(/{text}/, '目标弃电率(%):' + (_h['mbqdlValue'] * 100));
			}

		}

		if(_h['first_list']) {
			html += tmpl.replace(/{titleText}/, '弃电率')
				.replace(/{resValue}/, _h['td_qdl'] + '%')
				.replace(/{sdate}/, moment(_h['sdate']).format('YYYY-MM-DD'))
				.replace(/{edate}/, moment(_h['edate']).format('YYYY-MM-DD'))
				.replace(/{add_time}/, moment(_h['add_time']).format('YYYY-MM-DD HH:mm'))
				.replace(/{info}/, info);
		} else {
			html += tmpl.replace(/{titleText}/, nameMapper[_h['type']])
				.replace(/{resValue}/, _h['__result__'][0] + (_h['type'] == 1 ? '%' : '') + (multiple ? '...' : ''))
				.replace(/{sdate}/, moment(_h['sdate']).format('YYYY-MM-DD'))
				.replace(/{edate}/, moment(_h['edate']).format('YYYY-MM-DD'))
				.replace(/{add_time}/, moment(_h['add_time']).format('YYYY-MM-DD HH:mm'))
				.replace(/{info}/, info);
		}

	}

	$('#historyContainer').html(html);
};

$('#historyContainer').delegate('li', 'click', function() {
	var $this = $(this);
	var $li = $this.closest('li');
	mui.swipeoutClose($li[0]);
	var idx = $this.index();
	var _history = plus.storage.getItem('HISTORY_INPUT');
	_history = JSON.parse(_history);
	var _h = _history[idx];

	if(_h['multiple']) {
		mui.openWindow({
			url: 'showing-multiple.html',
			extras: {
				inputs: _h,
				openby: 'history'
			}
		});

		return;
	}

	$this.addClass('selected').siblings().removeClass('selected');

	if(_h['first_list']) {
		$('#resTitleText').html('弃电率');
		$('#resValue').html(_h['td_qdl'] + '%');
		$('#xnkjzyl').html(_h['td_zzb'] + '%');
		$('#xnyfdlzb').html(_h['td_xnkjzyl'] + '%');
		$('#zlwscf').html(_h['td_cf'] + '%');
		$('#zllyxss').html(_h['td_wsxs'].substr(0, 1));
	} else {
		$('#resTitleText').html(_h['type'] == 1 ? '弃电率' : '新能源装机(万千瓦)');
		$('#resValue').html(_h['__result__'][0] + (_h['type'] == 1 ? '%' : ''));
		$('#xnkjzyl').html(_h['__xnkjzylValue__'][0] + '%');
		$('#xnyfdlzb').html(_h['__xnyfdlzzfdlblValue__'][0] + '%');
		$('#zlwscf').html(_h['__zlwsxnycfValue__'][0] + '%');
		$('#zllyxss').html(_h['__usedHoursValue__'][0]);
	}

	//	$('#xnkjzyl').html(_h['__xnkjzylValue__'][0] + '%');
	//	$('#xnyfdlzb').html(_h['__xnyfdlzzfdlblValue__'][0] + '%');
	//	$('#zlwscf').html(_h['__zlwsxnycfValue__'][0] + '%');
	//	$('#zllyxss').html(_h['__usedHoursValue__'][0]);

	setTimeout(function() {
		mui('.mui-scroll-wrapper').scroll().scrollTo(0, 0, 300);
	}, 100);
});

//mui('#historyContainer').on('doubletap', 'li', function() {
// var idx = $(this).index();
// var _history = plus.storage.getItem('HISTORY_INPUT');
// _history = JSON.parse(_history);
// var _h = _history[idx];
//
// var launchView = plus.webview.getLaunchWebview();
// mui.fire(launchView, 'POPULATE_DATA', {inputs: _h});
//});

$('#historyContainer').delegate('.mui-btn-red', 'click', function(evt) {
	evt.stopPropagation();

	var $li = $(this).closest('li');
	mui.swipeoutClose($li[0]);
	var idx = $li.index();
	var _history = plus.storage.getItem('HISTORY_INPUT');
	_history = JSON.parse(_history);
	_history.splice(idx, 1);
	$li.remove();

	if(_history.length) {
		plus.storage.setItem('HISTORY_INPUT', JSON.stringify(_history));
	} else {
		plus.storage.removeItem('HISTORY_INPUT');
		$('#historyWrapper').hide();
	}
});

$('#historyContainer').delegate('.mui-btn-primary', 'click', function(evt) {
	evt.stopPropagation();

	var $li = $(this).closest('li');
	mui.swipeoutClose($li[0]);
	var idx = $li.index();
	var _history = plus.storage.getItem('HISTORY_INPUT');
	_history = JSON.parse(_history);
	var _h = _history[idx];
	
//	console.log(JSON.stringify(_h));

	var launchView = plus.webview.getLaunchWebview();

	if(_h['first_list']) {
		console.log("跳转");
		mui.fire(launchView, 'POPULATE_DATA_NET', {
			inputs: _h
		});
	} else {
		
		mui.fire(launchView, 'POPULATE_DATA', {
			inputs: _h
		});
	}

});

mui.plusReady(function() {
	var thisView = plus.webview.currentWebview();
	thisView.addEventListener('show', function() {
		renderHistory();
	});
});