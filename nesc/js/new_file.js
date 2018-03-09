var datefmt = 'YYYY-MM';
var timefmt = 'HH:mm';
var type = 1; // 1: 弃电率计算， 2: 新能源装机计算
var name = "";
var multiple = false; // 是否多值计算
var multipleType = 1; // 1: 最大负荷，2: 火电调峰率，3: 新能源装机
var firstList = {};
var secordList = {};
//mui.init();
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

var nameMapperWithUnit = {
	"1": "弃电率(%)",
	"2": "新能源装机(万千瓦)",
	"3": "最大负荷(万千瓦)",
	"4": "上备用系数(%)",
	"5": "调峰率(%)",
	"6": "自备电厂占比(%)",
	"8": "中长期外送",
	"9": '短期现货',
	"10": '综合利用'
};

mui('.mui-scroll-wrapper').scroll();

$(".mui-icon.mui-icon-info").on("tap", function(e) {
	e.stopPropagation();

	switch(this.id) {
		case 'fhlInfo':
			mui.alert('平均负荷占最大负荷的比例。');
			break;
		case 'sbyxsInfo':
			mui.alert('总开机容量高于最大负荷的百分比。');
			break;
		case 'hdtflInfo':
			mui.alert('总开机容量中可调节容量占其的比例。');
			break;
		case 'zbdcblInfo':
			mui.alert('总开机容量中自备电厂开机容量占比。');
			break;
		case 'fdzjbInfo':
			mui.alert('风电装机容量占新能源总装机容量的比例。');
			break;
		case 'zlzcqInfo':
			mui.alert('外送中需要长期保证的外送电力。');
			break;
		case 'zlxhInfo':
			mui.alert('外送中的现货交易部分，不需要长期保证。');
			break;
		case 'jlzcqInfo':
			mui.alert('交流外送中需要长期保证的外送电力，例如省间的年度交易。');
			break;
		case 'ksjyxhInfo':
			mui.alert('指跨省实时交易能力。');
			break;
		case 'wstdInfo':
			mui.alert('外送通道');
			break;
	}
});

var tmpl = '<div class="desc-title">' +
	'<span>{title}</span>：' +
	'<span>{value}</span>' +
	'</div>' +
	'<ul class="mui-table-view">' +
	'<li class="mui-table-view-cell">' +
	'<span>{xnyzjQdl}</span>' +
	'<span class="mui-pull-right">{xnyzjQdlValue}</span>' +
	'</li>' +
	'<li class="mui-table-view-cell">' +
	'<span>新能源发电量占总发电量比例(%)</span>' +
	'<span class="mui-pull-right">{xnyfdlzb}</span>' +
	'</li>' +
	'<li class="mui-table-view-cell mui-collapse">' +
	'<a class="mui-navigate-right">其他</a>' +
	'<div class="mui-collapse-content">' +
	'<ul class="mui-table-view">' +
	'<li class="mui-table-view-cell">' +
	'<span>消纳空间占有率(%)</span>' +
	'<span class="mui-pull-right">{xnkjzyl}</span>' +
	'</li>' +
	'<li class="mui-table-view-cell">' +
	'<span>外送中新能源成分(%)</span>' +
	'<span class="mui-pull-right">{zlwscf}</span>' +
	'</li>' +
	'<li class="mui-table-view-cell">' +
	'<span>外送通道利用小时数</span>' +
	'<span class="mui-pull-right">{zllyxss}</span>' +
	'</li>' +
	'</ul>' +
	'</div>' +
	'</li>' +
	'</ul>';

var tmpl2 = '<div class="desc-title">' +
	'<span>{title}</span>：' +
	'<span>{value}</span>' +
	'</div>' +
	'<ul class="mui-table-view">' +
	'<li class="mui-table-view-cell">' +
	'<span>{xnyzjQdl}</span>' +
	'<span class="mui-pull-right">{xnyzjQdlValue}</span>' +
	'</li>' +
	'<li class="mui-table-view-cell">' +
	'<span>外送通道利用小时数</span>' +
	'<span class="mui-pull-right">{zllyxss}</span>' +
	'</li>' +
	'<li class="mui-table-view-cell mui-collapse">' +
	'<a class="mui-navigate-right">其他</a>' +
	'<div class="mui-collapse-content">' +
	'<ul class="mui-table-view">' +
	'<li class="mui-table-view-cell">' +
	'<span>消纳空间占有率(%)</span>' +
	'<span class="mui-pull-right">{xnkjzyl}</span>' +
	'</li>' +
	'<li class="mui-table-view-cell">' +
	'<span>外送中新能源成分(%)</span>' +
	'<span class="mui-pull-right">{zlwscf}</span>' +
	'</li>' +
	'<li class="mui-table-view-cell">' +
	'<span>新能源发电量占总发电量比例(%)</span>' +
	'<span class="mui-pull-right">{xnyfdlzb}</span>' +
	'</li>' +
	'</ul>' +
	'</div>' +
	'</li>' +
	'</ul>';

$('.tab-wrapper .tab').on('tap', function() {
	$(".tab").removeClass("selected");
	$(this).addClass("selected");
	multiple = $('#multiple').hasClass('mui-active');

	if($(this).hasClass("tab-1")) {
		$("#calcPane").show();
		$("#resultPane").hide();
		$("#mulResultPane").hide();
	} else {
		$("#calcPane").hide();
		$("#resultPane").show();
		$("#mulResultPane").show();
	}
});

var itempicker = new mui.PopPicker();

$('.item-picker').on('tap', function() {
	var $this = $(this);
	$this.focus();
	var min = 0;
	var max = 100;
	var items = [];
	var selectedIndex = 0;
	var vText = $(this).find('.v-text');

	if($this.attr('min') && $this.attr('max')) {
		min = Number($this.attr('min'));
		max = Number($this.attr('max'));
	}

	var index = 0;

	for(var k = min; k <= max; k++) {
		var item = {
			text: k + '%',
			value: k + '%'
		};

		items.push(item);

		if(vText.html() == item.text) {
			selectedIndex = index;
		}

		index++;
	}

	itempicker.setData(items);

	itempicker.pickers[0].setSelectedIndex(selectedIndex);
	itempicker.show(function(res) {
		vText.html(res[0].value);
	});
});

var dates = ['sdate', 'edate'];

dates.forEach(function(id) {
	$('#' + id).on('tap', function() {
		var stimeText = $('#' + id + 'Text');

		var dtpicker = new mui.DtPicker({
			type: 'month',
			value: stimeText.html()
		});

		dtpicker.show(function(dt) {
			stimeText.html(dt.value);
		});
	});
});

var times = ['stime', 'etime', 'stime2', 'etime2'];
times.forEach(function(id) {

	$('#' + id).on('tap', function() {
		var stimeText = $('#' + id + 'Text');
		plus.nativeUI.pickTime(function(evt) {
			stimeText.html(moment(evt.date).format(timefmt));
		}, function() {

		}, {
			time: moment(stimeText.html(), timefmt).toDate()
		});
	});
});

$('.desc-title').delegate('img', 'tap', function() {
	var sdate = moment($('#sdateText').html(), datefmt).startOf('month').toDate().getTime();
	var edate = moment($('#edateText').html(), datefmt).endOf('month').toDate().getTime();
	var zdfhValue = $('#zdfhIpt').val().trim() || 0;
	var fhlValue = $('#fhlIpt').html().replace(/%/, '');
	var sbyxsValue = $('#sbyxsIpt').html().replace(/%/, '');
	var hdtflValue = $('#hdtflIpt').html().replace(/%/, '');
	var xnyzjValue = $('#xnyzjIpt').val().trim() || 0;
	var fdzjbValue = $('#fdzjbIpt').html().replace(/%/, '');
	var mbqdlValue = $('#mbqdlIpt').html().replace(/%/, '');
	var zbdcblValue = $('#zbdcblIpt').html().replace(/%/, '');
	var zlssnlValue = $('#zlssnlIpt').val().trim() || 0;
	var stime = $('#stimeText').html();
	var etime = $('#etimeText').html();
	var zlgffhValue = $('#zlgffhIpt').val().trim() || 0;
	var zlpdfhValue = $('#zlpdfhIpt').val().trim() || 0;
	var wsjsbcValue = $('#wsjsbcIpt').val().trim() || 0;
	var zlxhValue = $('#zlxhIpt').val().trim() || 0;
	var wstdValue = $('#wstdIpt').val().trim() || 0;
	var isZlxh = $('#isZlxh').hasClass('mui-active');
	var stime2 = $('#stime2Text').html();
	var etime2 = $('#etime2Text').html();
	var isJlxh = $('#isJlxh').hasClass('mui-active');
	var isJsgxl = $('#isJsgxl').hasClass('mui-active');

	var dataStore = {
		multiple: multiple,
		multipleType: multipleType,
		type: type,
		sdate: sdate,
		edate: edate,
		zdfhValue: Number(zdfhValue) * 10,
		fhlValue: Number(fhlValue) / 100,
		sbyxsValue: Number(sbyxsValue) / 100,
		hdtflValue: Number(hdtflValue) / 100,
		xnyzjValue: Number(xnyzjValue) * 10,
		fdzjbValue: Number(fdzjbValue) / 100,
		mbqdlValue: Number(mbqdlValue) / 100,
		zbdcblValue: Number(zbdcblValue) / 100,
		zlssnlValue: Number(zlssnlValue) * 10,
		stime: stime,
		etime: etime,
		zlgffhValue: Number(zlgffhValue) * 10,
		zlpdfhValue: Number(zlpdfhValue) * 10,
		wsjsbcValue: Number(wsjsbcValue) * 10,
		zlxhValue: Number(zlxhValue) * 10,
		zlxhbcValue: Number(zlxhValue) * 10,
		wstdValue: Number(wstdValue) * 10,
		isZlxh: isZlxh,
		stime2: stime2,
		etime2: etime2,
		isJlxh: isJlxh
	};

	if($('.desc-title img:eq(0)').attr('src') == 'image/change-blue.png') {
		firstList = dataStore;
		$('.secord-select').show();
		$('.first-select').hide();
	} else {
		secordList = dataStore;
		$('.first-select').show();
		$('.secord-select').hide();
	}

	$('.desc-title img').attr('src', 'image/change-grey.png');
	$('.desc-title img').css('width', '30px');
	$(this).attr('src', 'image/change-blue.png');
	$(this).css('width', '33px');
});

$('#calc').on('click', function() {
	mui('#calc').button('loading');

	setTimeout(function() {
		multiple = $('.first-select #multiple').hasClass('mui-active');
		var sdate = moment($('#sdateText').html(), datefmt).startOf('month').toDate().getTime();
		var edate = moment($('#edateText').html(), datefmt).endOf('month').toDate().getTime();
		var zdfhValue = $('.first-select #zdfhIpt').val().trim() || 0;
		var fhlValue = $('.first-select #fhlIpt').html().replace(/%/, '');
		var sbyxsValue = $('.first-select #sbyxsIpt').html().replace(/%/, '');
		var hdtflValue = $('.first-select #hdtflIpt').html().replace(/%/, '');
		var xnyzjValue = $('.first-select #xnyzjIpt').val().trim() || 0;
		var fdzjbValue = $('.first-select #fdzjbIpt').html().replace(/%/, '');
		var mbqdlValue = $('.first-select #mbqdlIpt').html().replace(/%/, '');
		var zbdcblValue = $('.first-select #zbdcblIpt').html().replace(/%/, '');
		var zlssnlValue = $('.first-select #zlssnlIpt').val().trim() || 0;
		var stime = $('.first-select #stimeText').html();
		var etime = $('.first-select #etimeText').html();
		var zlgffhValue = $('.first-select #zlgffhIpt').val().trim() || 0;
		var zlpdfhValue = $('.first-select #zlpdfhIpt').val().trim() || 0;
		var wsjsbcValue = $('.first-select #wsjsbcIpt').val().trim() || 0;
		var zlxhValue = $('.first-select #zlxhIpt').val().trim() || 0;
		var wstdValue = $('.first-select #wstdIpt').val().trim() || 0;
		var isZlxh = $('.first-select #isZlxh').hasClass('mui-active');
		var stime2 = $('.first-select #stime2Text').html();
		var etime2 = $('.first-select #etime2Text').html();
		var isJlxh = $('.first-select #isJlxh').hasClass('mui-active');
		var isJsgxl = $('.first-select #isJsgxl').hasClass('mui-active');

		firstList = {
			multiple: multiple,
			multipleType: multipleType,
			type: type,
			sdate: sdate,
			edate: edate,
			zdfhValue: Number(zdfhValue) * 10,
			fhlValue: Number(fhlValue) / 100,
			sbyxsValue: Number(sbyxsValue) / 100,
			hdtflValue: Number(hdtflValue) / 100,
			xnyzjValue: Number(xnyzjValue) * 10,
			fdzjbValue: Number(fdzjbValue) / 100,
			mbqdlValue: Number(mbqdlValue) / 100,
			zbdcblValue: Number(zbdcblValue) / 100,
			zlssnlValue: Number(zlssnlValue) * 10,
			stime: stime,
			etime: etime,
			zlgffhValue: Number(zlgffhValue) * 10,
			zlpdfhValue: Number(zlpdfhValue) * 10,
			wsjsbcValue: Number(wsjsbcValue) * 10,
			zlxhValue: Number(zlxhValue) * 10,
			zlxhbcValue: Number(zlxhValue) * 10,
			isZlxh: isZlxh,
			stime2: stime2,
			etime2: etime2,
			isJlxh: isJlxh,
			wstdValue: Number(wstdValue) * 10
		};

		multiple = $('.secord-select #multiple').hasClass('mui-active');
		sdate = moment($('#sdateText').html(), datefmt).startOf('month').toDate().getTime();
		edate = moment($('#edateText').html(), datefmt).endOf('month').toDate().getTime();
		zdfhValue = $('.secord-select #zdfhIpt').val().trim() || 0;
		fhlValue = $('.secord-select #fhlIpt').html().replace(/%/, '');
		sbyxsValue = $('.secord-select #sbyxsIpt').html().replace(/%/, '');
		hdtflValue = $('.secord-select #hdtflIpt').html().replace(/%/, '');
		xnyzjValue = $('.secord-select #xnyzjIpt').val().trim() || 0;
		fdzjbValue = $('.secord-select #fdzjbIpt').html().replace(/%/, '');
		mbqdlValue = $('.secord-select #mbqdlIpt').html().replace(/%/, '');
		zbdcblValue = $('.secord-select #zbdcblIpt').html().replace(/%/, '');
		zlssnlValue = $('.secord-select #zlssnlIpt').val().trim() || 0;
		stime = $('.secord-select #stimeText').html();
		etime = $('.secord-select #etimeText').html();
		zlgffhValue = $('.secord-select #zlgffhIpt').val().trim() || 0;
		zlpdfhValue = $('.secord-select #zlpdfhIpt').val().trim() || 0;
		wsjsbcValue = $('.secord-select #wsjsbcIpt').val().trim() || 0;
		zlxhValue = $('.secord-select #zlxhIpt').val().trim() || 0;
		isZlxh = $('.secord-select #isZlxh').hasClass('mui-active');
		stime2 = $('.secord-select #stime2Text').html();
		etime2 = $('.secord-select #etime2Text').html();
		isJlxh = $('.secord-select #isJlxh').hasClass('mui-active');
		isJsgxl = $('.secord-select #isJsgxl').hasClass('mui-active');

		secordList = {
			multiple: multiple,
			multipleType: multipleType,
			type: type,
			sdate: sdate,
			edate: edate,
			zdfhValue: Number(zdfhValue) * 10,
			fhlValue: Number(fhlValue) / 100,
			sbyxsValue: Number(sbyxsValue) / 100,
			hdtflValue: Number(hdtflValue) / 100,
			xnyzjValue: Number(xnyzjValue) * 10,
			fdzjbValue: Number(fdzjbValue) / 100,
			mbqdlValue: Number(mbqdlValue) / 100,
			zbdcblValue: Number(zbdcblValue) / 100,
			zlssnlValue: Number(zlssnlValue) * 10,
			stime: stime,
			etime: etime,
			zlgffhValue: Number(zlgffhValue) * 10,
			zlpdfhValue: Number(zlpdfhValue) * 10,
			wsjsbcValue: Number(wsjsbcValue) * 10,
			zlxhValue: Number(zlxhValue) * 10,
			zlxhbcValue: Number(zlxhValue) * 10,
			isZlxh: isZlxh,
			stime2: stime2,
			etime2: etime2,
			isJlxh: isJlxh
		};

		if(edate < sdate) {
			mui.toast('结束日期不能早于开始日期');
			mui('#calc').button('reset');
			return;
		}

		if(moment(etime, timefmt).isBefore(moment(stime, timefmt))) {
			mui.toast('结束时间不能早于开始时间');
			mui('#calc').button('reset');
			return;
		}

		if((type == 8 || type == 10) &&
			($('#zlgffhIpt').val().trim() == '' ||
				$('#zlpdfhIpt').val().trim() == '' ||
				$('#zlssnlIpt').val().trim() == '')) {
			mui.toast('外送（中长期）信息有误');
			mui('#calc').button('reset');
			return;
		}

		if(multiple) {
			if(multipleType == 1 && (!zdfhzdValue || !zdfhjgValue)) {
				mui.toast('最大负荷最大值、最小值和间隔输入有误');
				mui('#calc').button('reset');
				return;
			}

			if(multipleType == 2 && (!hdtflzdValue || !hdtfljgValue)) {
				mui.toast('调峰率最大值、最小值和间隔输入有误');
				mui('#calc').button('reset');
				return;
			}

			if(multipleType == 3 && (!xnyzjzdValue || !xnyzjjgValue)) {
				mui.toast('新能源装机最大值、最小值和间隔输入有误');
				mui('#calc').button('reset');
				return;
			}
		}

		var _multipleInput = [];
		var _resValue = [];
		var _usedHoursValue = [];
		var _xnkjzylValue = [];
		var _xnyfdlzzfdlblValue = [];
		var _zlwsxnycfValue = [];
		var gxlValues = {};

		var resCollect = function(res) {
			if(!res) {
				return;
			}

			_resValue.push(res['resValue']);
			_usedHoursValue.push(res['usedHoursValue']);
			_xnkjzylValue.push(res['xnkjzylValue']);
			_xnyfdlzzfdlblValue.push(res['xnyfdlzzfdlblValue']);
			_zlwsxnycfValue.push(res['zlwsxnycfValue']);

			return true;
		};

		var isValid = true;

		mui('#calc').button('reset');

		if(!isValid) {
			return;
		}

		if(!qyxnnxnnl(firstList, secordList)) {
			mui('#calc').button('reset');
			plus.nativeUI.alert('系统无法平衡!');
			return;
		}

		console.log(JSON.stringify(firstList));
		console.log(JSON.stringify(secordList));

		var returnVal = jszssj(firstList, secordList);

		console.log(JSON.stringify(returnVal));

		$(".tab").removeClass("selected");
		$(".tab-2").addClass("selected");
		$("#calcPane").hide();
		$("#resultPane").hide();
		$("#mulResultPane").show();
		$('.add-history').data('__history__', returnVal).removeClass('disabled');

		$('#resValue').html(returnVal.first_qdl + "/" + returnVal.secord_qdl + "/" + returnVal.td_qdl);
		$('#xnyfdlzb').text(returnVal.first_zzb + "/" + returnVal.secord_zzb + "/" + returnVal.td_zzb);
		$('#xnkjzyl').text(returnVal.first_xnkjzyl + "/" + returnVal.secord_xnkjzyl + "/" + returnVal.td_xnkjzyl);
		$('#zlwscf').text(returnVal.first_cf + "/" + returnVal.secord_cf + "/" + returnVal.td_cf);
		$('#zllyxss').text(returnVal.first_wsxs + "/" + returnVal.secord_wsxs + "/" + returnVal.td_wsxs);
	}, 500);
});

$('.add-history').on('click', function() {
	var $this = $(this);

	if($this.hasClass('disabled')) {
		return;
	}
	var inputs = $this.data('__history__');

	console.log(JSON.stringify(inputs));

	addHistory(inputs);
	$this.addClass('disabled');
});

$('input[type="number"]').focus(function(e) {
	e.stopPropagation();

	var target = this;

	if(type != 10) {
		$(this).val('');
	}

	setTimeout(function() {
		target.scrollIntoViewIfNeeded();
	}, 400);
});
/*--------------------重新计算网络约束----------------*/
var renderInput = function(d) {

	console.log("TEST:" + JSON.stringify(d));

	$('#sdateText').html(moment(d['first_list']['sdate']).format(datefmt));
	$('#edateText').html(moment(d['first_list']['edate']).format(datefmt));

	$('.first-select #zdfhIpt').val(d['first_list']['zdfhValue'] / 10);
	$('.first-select #fhlIpt').html((d['first_list']['fhlValue'] * 100) + '%');
	$('.first-select #sbyxsIpt').html((d['first_list']['sbyxsValue'] * 100) + '%');
	$('.first-select #hdtflIpt').html((d['first_list']['hdtflValue'] * 100) + '%');
	$('.first-select #zbdcblIpt').html((d['first_list']['zbdcblValue'] * 100) + '%');
	$('.first-select #xnyzjIpt').val(d['first_list']['xnyzjValue'] / 10);
	$('.first-select #fdzjbIpt').html((d['first_list']['fdzjbValue'] * 100) + '%');
	$('.first-select #mbqdlIpt').html((d['first_list']['mbqdlValue'] * 100) + '%');
	$('.first-select #zlssnlIpt').val(d['first_list']['zlssnlValue'] / 10);
	$('.first-select #stimeText').html(d['first_list']['stime']);
	$('.first-select #etimeText').html(d['first_list']['etime']);
	$('.first-select #zlgffhIpt').val(d['first_list']['zlgffhValue'] / 10);
	$('.first-select #zlpdfhIpt').val(d['first_list']['zlpdfhValue'] / 10);
	$('.first-select #zlxhIpt').val(d['first_list']['zlxhValue'] / 10);
	if(d['first_list']['isZlxh']) {
		$('.first-select #isZlxh').addClass('mui-active');
	}
	$('.first-select #wstdIpt').val(d['first_list']['wstdValue'] / 10);

	$('.secord-select #zdfhIpt').val(d['second_list']['zdfhValue'] / 10);
	$('.secord-select #fhlIpt').html((d['second_list']['fhlValue'] * 100) + '%');
	$('.secord-select #sbyxsIpt').html((d['second_list']['sbyxsValue'] * 100) + '%');
	$('.secord-select #hdtflIpt').html((d['second_list']['hdtflValue'] * 100) + '%');
	$('.secord-select #zbdcblIpt').html((d['second_list']['zbdcblValue'] * 100) + '%');
	$('.secord-select #xnyzjIpt').val(d['second_list']['xnyzjValue'] / 10);
	$('.secord-select #fdzjbIpt').html((d['second_list']['fdzjbValue'] * 100) + '%');
	$('.secord-select #mbqdlIpt').html((d['second_list']['mbqdlValue'] * 100) + '%');
	$('.secord-select #zlssnlIpt').val(d['second_list']['zlssnlValue'] / 10);
	$('.secord-select #stimeText').html(d['second_list']['stime']);
	$('.secord-select #etimeText').html(d['second_list']['etime']);
	$('.secord-select #zlgffhIpt').val(d['second_list']['zlgffhValue'] / 10);
	$('.secord-select #zlpdfhIpt').val(d['second_list']['zlpdfhValue'] / 10);
	$('.secord-select #zlxhIpt').val(d['second_list']['zlxhValue'] / 10);
	if(d['second_list']['isZlxh']) {
		$('.secord-select #isZlxh').addClass('mui-active');
	}

};

document.addEventListener('POPULATE_DATA_NET', function(evt) {
	renderInput(evt.detail.inputs);
});

$(".mui-action-back").on("tap", function() {
	mui.back();
});

mui.ready(function() {
	var sdate = moment().startOf('year');
	var edate = moment().endOf('year');
	$('#sdateText').html(sdate.format(datefmt));
	$('#edateText').html(edate.format(datefmt));
});

mui.plusReady(function() {
	plus.webview.currentWebview().setStyle({
		softinputMode: "adjustResize" // 弹出软键盘时自动改变webview的高度
	});
	// plus.navigator.setStatusBarBackground('#4990E2');
	// plus.navigator.setStatusBarStyle('light');
	// plus.navigator.closeSplashscreen();
	// plus.storage.clear();

	var webview = plus.webview.currentWebview();
	type = webview.type;
	name = nameMapper[type];

	$(".mui-title").html('计算器');
	$('.gxl-visible').toggle(type == 1);
	$('.mui-title').html('网络约束');

	if(webview.inputs) {
		renderInput(webview.inputs);
	}
});