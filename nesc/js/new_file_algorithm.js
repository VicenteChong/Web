//var _avg_and_max_load = {};
//var _zlqx = {};
//var _zldl = 0;
//var _jlqx = {};
//var _time_points = {};
//var _xny_qx = {};
//var _xnyxnnl = {};
//var _actual_load_every_day = {};
//var _xnyxnnldl = 0;
//var _xnyfdlqx_sj = {};
//var _xnyfdl_sj = 0;
//var _time_points = {};
//var init = function(d) {
// _avg_and_max_load = avg_and_max_load();
// _zlqx = zlqx(d);
// _zldl = zldl(d);
// _jlqx = jlqx(d);
// _time_points = get_time_points(d);
// _xny_qx = xny_qx(d);
// _xnyxnnl = xnyxnnl_every_day(d);
// _actual_load_every_day = actual_load_every_day(d);
// _xnyxnnldl = xnyxnnldl(d);
// _xnyfdlqx_sj = xnyfdlqx_sj(d);
// _xnyfdl_sj = xnyfdl_sj(d);
//}

/**
 * 一天的平均负荷、最大负荷
 */
var avg_and_max_load = function() {
   var sum = 0;
   var max = 0;

   for(var key in load) {
      var d = load[key];

      if(d > max) {
         max = d;
      }

      sum += d;
   }

   return {
      avg: sum / 96,
      max: max
   };
};

/**
 * 负荷偏移量
 */
var load_pyl = function(d) {
   var fhlValue = d['fhlValue'];
   var _avg_and_max_load = avg_and_max_load();

   if(fhlValue == 1) {
      return false;
   }

   return(fhlValue * _avg_and_max_load.max - _avg_and_max_load.avg) / (1 - fhlValue);
};

/**
 * 实际负荷曲线（一天）
 */
var actual_load = function(d) {
   var _actual_load = {};
   var _load_pyl = load_pyl(d);
   var _avg_and_max_load = avg_and_max_load();
   var _zlqx = zlqx(d);

   if(_load_pyl === false) {
      return false;
   }

   var max = _avg_and_max_load.max + _load_pyl;
   var zdfhValue = Number(d['zdfhValue']);
   var ratio = zdfhValue / max;

   for(var key in load) {
      _actual_load[key] = (load[key] + _load_pyl) * ratio + _zlqx[key];
   }

   return _actual_load;
};

/**
 * 根据选择的日期，生产每一天的96点的key。结果如: {'2017/01/01': ['0:00', '0:15', ..., '23:45']}
 */
var get_time_points = function(d) {
   var sdate = new Date(2017, 1, 1); //d['sdate'];
   var edate = new Date(2017, 12, 31); //d['edate'];
   var days = moment(edate).diff(moment(sdate), 'days') + 1;
   var _time_points = {};

   for(var i = 0; i < days; i++) {
      var key = moment(sdate).add(i, 'days').format('YYYY/M/D');
      var times = [];
      var _d = new Date();
      _d.setHours(0, 0, 0, 0);

      for(var j = 0; j < 96; j++) {
         var _nd = new Date(_d.getTime());
         _nd.setMinutes(j * 15);
         times.push(moment(_nd).format('H:mm'));
      }

      _time_points[key] = times;
   }

   return _time_points;
};

/**
 * 风电曲线(计划)
 */
var fd_load_qx = function(d) {
   // 风电最大装机
   var fdzdzj = d['xnyzjValue'] * d['fdzjbValue'];
   var _time_points = get_time_points(d);
   var fd_load = {};

   for(var key in _time_points) {
      var _times = _time_points[key];
      var win_key = moment(key, 'YYYY/M/D').year(2014).format('YYYY/M/D');
      var _day_loads = wind[win_key];

      for(var i in _times) {
         var _inner_key = _times[i];
         var _time_load = _day_loads[_inner_key];
         fd_load[key + ' ' + _inner_key] = _time_load * fdzdzj;
      }
   }

   return fd_load;
};

/**
 * 光伏曲线(计划)
 */
var gf_load_qx = function(d) {
   var gf_load = {};
   var _time_points = get_time_points(d);
   // 光伏最大装机
   var fdzdzj = d['xnyzjValue'] * (1 - d['fdzjbValue']);

   for(var key in _time_points) {
      var _times = _time_points[key];
      var pv_key = moment(key, 'YYYY/M/D').year(2014).format('YYYY/M/D');
      var _day_loads = photovoltaic[pv_key];;
      for(var i in _times) {
         var _inner_key = _times[i];
         var _time_load = _day_loads[_inner_key];

         gf_load[key + ' ' + _inner_key] = _time_load * fdzdzj;
      }

   }
   return gf_load;
};

/**
 * 直流曲线（一天）
 */
var zlqx = function(d) {
   var stime = d['stime'];
   var etime = d['etime'];
   var nd = new Date();
   nd.setHours(0, 0, 0, 0);
   stime = moment(stime, 'HH:mm');
   etime = moment(etime, 'HH:mm')
   var qx = {};

   for(var i = 0; i < 96; i++) {
      var _d = new Date(nd.getTime());
      _d.setMinutes(i * 15);
      var val = 0;

      if(moment(_d).isBetween(stime, etime, null, '[]')) {
         val = d['zlgffhValue'];
      } else {
         val = d['zlpdfhValue'];
      }

      qx[moment(_d).format('H:mm')] = val;
   }

   return qx;
}

/**
 * 转换直流曲线到每一天
 */
var zlqx_every_day = function(d) {
   var _zlqx_every_day = {};
   var _zlqx = zlqx(d);
   var _zlqx_dl = zlqx_dl(d);
   var _time_points = get_time_points(d);
   var _zlqx_every_day_dl = 0;
   var zlssnlValue_d = d.zlssnlValue;

   for(var key in _time_points) {
      var _times = _time_points[key];

      _zlqx_every_day_dl += _zlqx_dl;

      for(var i in _times) {
         var _inner_key = _times[i];
         var _time_load = _zlqx[_inner_key];
         _zlqx_every_day[key + ' ' + _inner_key] = _time_load;
      }
   }

   return {
      _zlqx_every_day: _zlqx_every_day, //曲线
      _zlqx_every_day_dl: _zlqx_every_day_dl //面积,
   };
};

/**
 * 转换直流曲线一天电量
 */
var zlqx_dl = function(d) {
   var _zlqx = zlqx(d);
   var _zlqx_all = 0;
   for(var key in _zlqx) {
      _zlqx_all += _zlqx[key];
   }
   return _zlqx_all / 4;
}
/**
 * 直流现货曲线（一天）
 */
var zlxhqx = function(d) {
   var zlssnlValue = d['zlssnlValue'];
   var _zlxhqx = {};
   var zlxhValue = d['zlxhValue'];
   var isZlxh = d['isZlxh'];
   var _zlqx = zlqx(d);

   if(isZlxh) {
      for(var key in _zlqx) {
         _zlxhqx[key] = zlssnlValue - _zlqx[key];
      }
   } else {
      for(var key in _zlqx) {
         _zlxhqx[key] = (zlssnlValue - _zlqx[key]) > zlxhValue ? zlxhValue : (zlssnlValue - _zlqx[key]);
      }
   }

   return _zlxhqx;
};

/*
 * 直流现货曲线转换到每一天
 */
var zlxhqx_every_day = function(d) {
   var _zlxhqx_every_day = {};
   var _zlxhqx = zlxhqx(d);
   var _time_points = get_time_points(d);

   for(var key in _time_points) {
      var _times = _time_points[key];

      for(var i in _times) {
         var _inner_key = _times[i];
         var _time_load = _zlxhqx[_inner_key];
         _zlxhqx_every_day[key + ' ' + _inner_key] = _time_load;
      }
   }

   return _zlxhqx_every_day;
}

/**
 * 火电最小技术出力
 */
var hdzxjscl = function(d, _actual_load) {
   var zdfh = 0;

   for(var key in _actual_load) {
      var _temp = _actual_load[key];

      if(_temp > zdfh) {
         zdfh = _temp;
      }
   }

   return zdfh * (1 + d['sbyxsValue']) * (1 - d['hdtflValue']) * (1 - d['zbdcblValue']) +
      zdfh * (1 + d['sbyxsValue']) * (d['zbdcblValue']);
};

/**
 * 新能源消纳能力
 */
var xnyxnnl = function(d) {
   var _actual_load = actual_load(d);
   var _zlxhqx = zlxhqx(d);

   if(_actual_load === false) {
      return false;
   }

   var _hdzxjscl = hdzxjscl(d, _actual_load);

   var _xnyxnnl = {};
   var _fhfdl = 0;

   for(var key in _actual_load) {
      var _val = _actual_load[key] - _hdzxjscl + _zlxhqx[key];

      _fhfdl += _actual_load[key];
      //    if(_val < 0) {
      //       return false;
      //    }
      _xnyxnnl[key] = _val;
   }

   return {
      _zxhd_value: _hdzxjscl,
      _xnyxnnl: _xnyxnnl,
      _zlxhqx: _zlxhqx
   };
};

/*
 * 判断两个区域系统是否平衡
 */

var qyxnnxnnl = function(d1, d2) {
   var xnyxnnl_first = xnyxnnl(d1)._xnyxnnl;
   var xnyxnnl_secord = xnyxnnl(d2)._xnyxnnl;
   var first_td = d1['wstdValue'];

   for(key in xnyxnnl_first) {
      xnyxnnl_first_value = xnyxnnl_first[key];
      xnyxnnl_secord_value = xnyxnnl_secord[key];

      if(xnyxnnl_first_value < 0 && xnyxnnl_secord_value < 0) {
         return false;
      }

      if((xnyxnnl_first_value * xnyxnnl_secord_value) < 0) {
         if(xnyxnnl_first_value < 0 && 
            (Math.abs(xnyxnnl_first_value) > first_td 
            || Math.abs(xnyxnnl_first_value) > Math.abs(xnyxnnl_secord_value))) {
            return false;
         }
         else if(xnyxnnl_secord_value < 0 &&
            (Math.abs(xnyxnnl_secord_value) > first_td 
            || Math.abs(xnyxnnl_secord_value) > Math.abs(xnyxnnl_first_value))) {
            return false;
         }
      }
   }

   return true;
}

/**
 * 新能源曲线(计划)
 */
var xny_qx = function(d) {
   var _fd_load_qx = fd_load_qx(d);
   var _gf_load_qx = gf_load_qx(d);
   var _xny_qx = {};

   for(var key in _fd_load_qx) {
      _xny_qx[key] = _fd_load_qx[key] + _gf_load_qx[key];
   }

   return _xny_qx;
};

/*
 *新   负荷曲线
 * */
var newfhqx = function(d) {
   var _xnyxnnl = xnyxnnl(d)._xnyxnnl;
   var _zxhd_value = xnyxnnl(d)._zxhd_value;
   var _zlqx = zlqx(d);
   var new_fhqx = {};

   for(var key in _xnyxnnl) {
      new_fhqx[key] = _xnyxnnl[key] - _zlqx[key] - d.zlxhValue + _zxhd_value; //变小
   }

   return new_fhqx;
}

/*
 *新 最小火电
 */

var new_hdzxjscl = function(d) {
   var new_fhqx = newfhqx(d);
   var new_hdzxjscl = hdzxjscl(d, new_fhqx);

   return {
      new_hdzxjscl: new_hdzxjscl,
      new_fhqx: new_fhqx
   };
}

/*
 *新  新能源消纳曲线
 * */
var new_xnyxnnl = function(d) {
   var new_qx = new_hdzxjscl(d);
   var _new_hdzxjscl = new_qx.new_hdzxjscl;
   var _new_fhqx = new_qx.new_fhqx;
   var _zlxhqx = zlxhqx(d);
   var _xnyxnnl = {};
   if(_new_fhqx === false) {
      return false;
   }

   for(var key in _new_fhqx) {
      var _val = _new_fhqx[key] - _new_hdzxjscl;

      if(_val < 0) {
         return false;
      }

      _xnyxnnl[key] = _val;
   }

   return _xnyxnnl;
}

/*
 *新  新能源消纳每一天
 * */
var new_xnyxnnl_every_day = function(d) {
   var _new_xnyxnnl = new_xnyxnnl(d);
   var _time_points = get_time_points(d);
   var xny_load = {};

   for(var key in _time_points) {
      var _times = _time_points[key];

      for(var i in _times) {
         var _inner_key = _times[i];
         var _time_load = _new_xnyxnnl[_inner_key];
         xny_load[key + ' ' + _inner_key] = _time_load;
      }
   }

   return xny_load;
};
/**
 * 新能源弃电量
 */
//var xnyqdl = function(d) {
// var sum = 0;
// var xnyqd_point = {};
// var _xny_qx = xny_qx(d);
// var _xnyxnnl_every_day = xnyxnnl_every_day(d).xny_load;
//
// for(var key in _xny_qx) {
//    var _diff = _xny_qx[key] - _xnyxnnl_every_day[key];
//    xnyqd_point[key] =  _diff;
//
//    if(_diff > 0) {
//       sum += _diff;
//    }
// }
//
// return {
//    sum : sum / 4,
//    xnyqd_point : xnyqd_point,
//    _xny_qx : _xny_qx,
//    _xnyxnnl_every_day : _xnyxnnl_every_day
// };
//}

/*
 *新能源发电量
 * */
var xnyfdl = function(d) {
   var _xny_qx = xny_qx(d);
   var sum = 0;

   for(var key in _xny_qx) {
      sum += _xny_qx[key];
   }

   return sum / 4;
};

///*
// *新能源弃电率
// * */
//var xny_qdl = function(d) {
// var _xnyfdl = xnyfdl(d);
// var _xnyqdl = xnyqdl(d);
//
// return {
//    qdl : (_xnyqdl.sum) / _xnyfdl,
//    _xnysydl : (_xnyfdl - _xnyqdl.sum)
// };
//}
//
///*
// * 通道消纳电量
// * */
//var tdqdl = function(d1, d2) {
// var first = xnyqdl(d1).xnyqd_point;
// var secord = xnyqdl(d2).xnyqd_point;
// var sum = 0;
//
// for(var key in first) {
//    var _first = Number(first[key]);
//    var _secord = Number(secord[key]);
//
//    if((_first * _secord) < 0) {
//       var qdl_point = Math.abs(_first) > Math.abs(_record) ? Math.abs(_record) : Math.abs(_first);
//       sum += qdl_point < d1['wstdValue'] ? Math.abs(qdl_point) : Math.abs(d1['wstdValue']);
//    }
// }
//
// return sum / 4;
//}
///*
// * 通道弃电率
// */
//var td_qdl = function(d1, d2) {
// var _tdqdl = tdqdl(d1, d2);
// var _xnyqdl_first = xnyqdl(d1).sum;
// var _xnyqdl_secord = xnyqdl(d2).sum;
// var _xnyfdl_first = xnyfdl(d1);
// var _xnyfdl_secord = xnyfdl(d2);
//
// return {
//    _td_qdl : (_xnyqdl_first + _xnyqdl_secord - _tdqdl) / (_xnyfdl_first + _xnyfdl_secord),
//    _xnyqdl_first : _xnyqdl_first,
//    _xnyqdl_secord : _xnyqdl_secord,
//    _xnyfdl_first : _xnyfdl_first,
//    _xnyfdl_secord : _xnyfdl_secord
// }
//}
//
/**
 * 转换新能源消纳能力到每一天
 */
var xnyxnnl_every_day = function(d) {
   var _xnyxnnl = xnyxnnl(d)._xnyxnnl;
   var _zxhd_value = xnyxnnl(d)._zxhd_value;
   var _xny_qx = xny_qx(d);
   var xnyxn_load = {};
   var _time_points = get_time_points(d);

   for(var key in _time_points) {
      var _times = _time_points[key];

      for(var i in _times) {
         var _inner_key = _times[i];
         var _time_load = _xnyxnnl[_inner_key];

         xnyxn_load[key + ' ' + _inner_key] = _time_load;
      }
   }

   return {
      _xny_every_day: _xny_qx,
      _xnyxn_every_day: xnyxn_load,
      _zxhd_value: _zxhd_value
   };
};

var _sjcl = function(d1, d2) {
   var first_td = d1['wstdValue'];
   var _zlqx_every_day_fun_first = zlqx_every_day(d1);
   var _zlqx_every_day_first = _zlqx_every_day_fun_first._zlqx_every_day; //直流曲线每一天
   var _zlqx_every_day_dl_first = _zlqx_every_day_fun_first._zlqx_every_day_dl; //直流曲线面积
   var _xnyxnnl_every_day_first = xnyxnnl_every_day(d1)._xnyxn_every_day; //新能源消纳每一天
   var _xny_every_day_first = xnyxnnl_every_day(d1)._xny_every_day; //新能源每一天
   var _zxhd_value_first = xnyxnnl_every_day(d1)._zxhd_value; //最小火电每一天总值；
   var _new_xnyxnnl_first = new_xnyxnnl_every_day(d1); //新  新能源消纳曲线
   var _zlqx_every_day_fun_secord = zlqx_every_day(d2);
   var _zlqx_every_day_secord = _zlqx_every_day_fun_secord._zlqx_every_day; //直流曲线每一天
   var _zlqx_every_day_dl_secord = _zlqx_every_day_fun_secord._zlqx_every_day_dl; //直流曲线面积
   var _xnyxnnl_every_day_secord = xnyxnnl_every_day(d2)._xnyxn_every_day; //新能源消纳每一天
   var _xny_every_day_secord = xnyxnnl_every_day(d2)._xny_every_day; //新能源每一天
   var _zxhd_value_secord = xnyxnnl_every_day(d2)._zxhd_value; //最小火电每一天总值
   var _new_xnyxnnl_secord = new_xnyxnnl_every_day(d2); //新  新能源消纳曲线

   var qdl_first_one = 0; //弃电量
   var qdl_first_two = 0;
   var qdl_first_three = 0;
   var qdl_secord_one = 0;
   var qdl_secord_two = 0;
   var qdl_secord_three = 0;
   var tddl_one = 0; //通道消纳电量
   var tddl_one_first = 0;
   var tddl_one_secord = 0;
   var tddl_two = 0;
   var tddl_two_first = 0;
   var tddl_two_secord = 0;
   var tddl_three = 0;
   var tddl_three_first = 0;
   var tddl_three_secord = 0;
   var qdl_td_one = 0;
   var qdl_td_two = 0;
   var qdl_td_three = 0;
   var sum_first = 0;
   var sum_secord = 0;
   var result_one = {};
   var result_two = {};
   var result_three = {};
   var xnyfdl_first = 0;
   var xnyfdl_secord = 0;
   var first_dqxh = 0;
   var secord_dqxh = 0;
   var xnyxnnl_first_all = 0;
   var xnyxnnl_secord_all = 0;
   var xnyxnnl_first_f_all = 0;
   var xnyxnnl_secord_f_all = 0;
   var zxhd_first_all = 0;
   var zxhd_secord_all = 0;

   var logValue = {};

   for(var key in _zlqx_every_day_first) {
      zxhd_first_all += _zxhd_value_first;
      zxhd_secord_all += _zxhd_value_secord;
      xnyfdl_first += _xny_every_day_first[key];
      xnyfdl_secord += _xny_every_day_secord[key];
      first_dqxh += d1.zlxhValue;
      secord_dqxh += d2.zlxhValue;
      xnyxnnl_first_all += _xnyxnnl_every_day_first[key] < 0 ? 0 : _xnyxnnl_every_day_first[key];
      xnyxnnl_secord_all += _xnyxnnl_every_day_secord[key] < 0 ? 0 : _xnyxnnl_every_day_secord[key];
      xnyxnnl_first_f_all += _xnyxnnl_every_day_first[key] > 0 ? 0 : _xnyxnnl_every_day_first[key];
      xnyxnnl_secord_f_all += _xnyxnnl_every_day_secord[key] > 0 ? 0 : _xnyxnnl_every_day_secord[key];
      //三类弃电量
      sum_first = _xny_every_day_first[key] - _xnyxnnl_every_day_first[key];
      sum_secord = _xny_every_day_secord[key] - _xnyxnnl_every_day_secord[key];
      result_one = qdl_js(sum_first, sum_secord, first_td);
      qdl_first_one += result_one.qdl_first;
      qdl_secord_one += result_one.qdl_secord;
      tddl_one += result_one.tddl;
      tddl_one_first += result_one.tddl_first;
      tddl_one_secord += result_one.tddl_secord;

      sum_first = sum_first + d1.zlxhValue;
      sum_secord = sum_secord + d2.zlxhValue;

      result_two = qdl_js(sum_first, sum_secord, first_td);
      qdl_first_two += result_two.qdl_first;
      qdl_secord_two += result_two.qdl_secord;
      tddl_two += result_two.tddl;
      tddl_two_first += result_two.tddl_first;
      tddl_two_secord += result_two.tddl_secord;

      sum_first = _xny_every_day_first[key] - _new_xnyxnnl_first[key];
      sum_secord = _xny_every_day_secord[key] - _new_xnyxnnl_secord[key];
      result_three = qdl_js(sum_first, sum_secord, first_td);
      qdl_first_three += result_three.qdl_first;
      qdl_secord_three += result_three.qdl_secord;
      tddl_three += result_three.tddl;
      tddl_three_first += result_three.tddl_first;
      tddl_three_secord += result_three.tddl_secord;
   }

   return {
      qdl_first_one: qdl_first_one / 4,
      qdl_secord_one: qdl_secord_one / 4,
      tddl_one: tddl_one / 4,
      tddl_one_first: tddl_one_first / 4,
      tddl_one_secord: tddl_one_secord / 4,
      qdl_first_two: qdl_first_two / 4,
      qdl_secord_two: qdl_secord_two / 4,
      tddl_two: tddl_two / 4,
      tddl_two_first: tddl_two_first / 4,
      tddl_two_secord: tddl_two_secord / 4,
      qdl_first_three: qdl_first_three / 4,
      qdl_secord_three: qdl_secord_three / 4,
      tddl_three: tddl_three / 4,
      tddl_three_first: tddl_three_first / 4,
      tddl_three_secord: tddl_three_secord / 4,
      _zlqx_every_day_dl_first: _zlqx_every_day_dl_first, //直流曲线面积
      _zlqx_every_day_dl_secord: _zlqx_every_day_dl_secord, //直流曲线面积
      xnyfdl_first: xnyfdl_first / 4,
      xnyfdl_secord: xnyfdl_secord / 4,
      first_dqxh: first_dqxh / 4,
      secord_dqxh: secord_dqxh / 4,
      xnyxnnl_first_all: xnyxnnl_first_all / 4,
      xnyxnnl_secord_all: xnyxnnl_secord_all / 4,
      xnyxnnl_first_f_all: Math.abs(xnyxnnl_first_f_all) / 4,
      xnyxnnl_secord_f_all: Math.abs(xnyxnnl_secord_f_all) / 4,
      zxhd_first_all: zxhd_first_all / 4,
      zxhd_secord_all: zxhd_secord_all / 4
   }
}

var jszssj = function(d1, d2) {
   var hdsj = _sjcl(d1, d2);
   var qdl_first_one = hdsj.qdl_first_one;
   var qdl_secord_one = hdsj.qdl_secord_one;
   var tddl_one = hdsj.tddl_one;
   var tddl_one_first = hdsj.tddl_one_first;
   var tddl_one_secord = hdsj.tddl_one_secord;
   var qdl_first_two = hdsj.qdl_first_two;
   var qdl_secord_two = hdsj.qdl_secord_two;
   var tddl_two = hdsj.tddl_two;
   var tddl_two_first = hdsj.tddl_two_first;
   var tddl_two_secord = hdsj.tddl_two_secord;
   var qdl_first_three = hdsj.qdl_first_three;
   var qdl_secord_three = hdsj.qdl_secord_three;
   var tddl_three = hdsj.tddl_three;
   var tddl_three_first = hdsj.tddl_three_first;
   var tddl_three_secord = hdsj.tddl_three_secord;
   var _zlqx_every_day_dl_first = hdsj._zlqx_every_day_dl_first;
   var _zlqx_every_day_dl_secord = hdsj._zlqx_every_day_dl_secord;
   var xnyfdl_first = hdsj.xnyfdl_first;
   var xnyfdl_secord = hdsj.xnyfdl_secord;
   var first_dqxh = hdsj.first_dqxh;
   var secord_dqxh = hdsj.secord_dqxh;
   var xnyxnnl_first_all = hdsj.xnyxnnl_first_all;
   var xnyxnnl_secord_all = hdsj.xnyxnnl_secord_all;
   var xnyxnnl_first_f_all = hdsj.xnyxnnl_first_f_all;
   var xnyxnnl_secord_f_all = hdsj.xnyxnnl_secord_f_all;
   var zxhd_first_all = hdsj.zxhd_first_all;
   var zxhd_secord_all = hdsj.zxhd_secord_all;

   //弃电率
   var first_qdl = (qdl_first_one - tddl_one_secord) / xnyfdl_first;
   var secord_qdl = (qdl_secord_one - tddl_one_first) / xnyfdl_secord;
   var td_qdl = (qdl_first_one + qdl_secord_one - tddl_one) / (xnyfdl_first + xnyfdl_secord);

   //新能源发电量占总发电量比例
   var first_zzb = (xnyfdl_first - qdl_first_one + tddl_one_first + xnyxnnl_first_f_all) / (xnyxnnl_first_all - first_dqxh + qdl_first_two - qdl_first_one + zxhd_first_all);
// first_zzb = first_zzb < 0 ? 0 : first_zzb;
   var secord_zzb = (xnyfdl_secord - qdl_secord_one + tddl_one_secord + xnyxnnl_secord_f_all) / (xnyxnnl_secord_all - secord_dqxh + qdl_secord_two - qdl_secord_one + zxhd_secord_all);
// secord_zzb = secord_zzb < 0 ? 0 : secord_zzb;
   var td_zzb = (xnyfdl_first + xnyfdl_secord - (qdl_first_one + qdl_secord_one - tddl_one)) / (xnyxnnl_first_all - first_dqxh + qdl_first_two - qdl_first_one + zxhd_first_all + xnyxnnl_secord_all - secord_dqxh + qdl_secord_two - qdl_secord_one + zxhd_secord_all);
// td_zzb = td_zzb < 0 ? 0 : td_zzb;

   //消纳空间占有率
   var first_xnkjzyl = (xnyfdl_first - qdl_first_one + tddl_one_first + xnyxnnl_first_f_all) / (xnyxnnl_first_all);
   var secord_xnkjzyl = (xnyfdl_secord - qdl_secord_one + tddl_one_secord + xnyxnnl_secord_f_all) / (xnyxnnl_secord_all);
   var td_xnkjzyl = (xnyfdl_first + xnyfdl_secord - (qdl_first_one + qdl_secord_one - tddl_one)) / (xnyxnnl_secord_all + xnyxnnl_first_all);

   // var   = qdl_first_two + qdl_secord_two - tddl_two - qdl_first_one - qdl_secord_one + tddl_one;
   //外送通道利用小时数
   var first_wsxs = (qdl_first_two - qdl_first_one + tddl_one_first - tddl_two_first + _zlqx_every_day_dl_first) / (d1.zlssnlValue);
   first_wsxs = d1.zlssnlValue == 0 ? 0 : first_wsxs;
   var secord_wsxs = (qdl_secord_two - qdl_secord_one + tddl_one_secord - tddl_two_secord + _zlqx_every_day_dl_secord) / (d2.zlssnlValue);
   secord_wsxs = d2.zlssnlValue == 0 ? 0 : secord_wsxs;
   var td_wsxs = (qdl_first_two + qdl_secord_two - tddl_two - qdl_first_one - qdl_secord_one + tddl_one + _zlqx_every_day_dl_first + _zlqx_every_day_dl_secord) / (d1.zlssnlValue + d2.zlssnlValue);
   td_wsxs = (d1.zlssnlValue + d2.zlssnlValue) == 0 ? 0 : td_wsxs;

   //外送中新能源成分
   var first_cf = (qdl_first_three - qdl_first_one + tddl_one_first - tddl_three_first) / (qdl_first_two - qdl_first_one + _zlqx_every_day_dl_first);
   first_cf = (qdl_first_two - qdl_first_one + _zlqx_every_day_dl_first) == 0 ? 0 : first_cf;
   var secord_cf = (qdl_secord_three - qdl_secord_one + tddl_one_secord - tddl_three_secord) / (qdl_secord_two - qdl_secord_one + _zlqx_every_day_dl_secord);
   secord_cf = (qdl_secord_two - qdl_secord_one + _zlqx_every_day_dl_secord)==0 ? 0 : secord_cf
   var td_cf = (qdl_first_three + qdl_secord_three - tddl_three - (qdl_first_one + qdl_secord_one - tddl_one)) / (qdl_first_two + qdl_secord_two - tddl_two - qdl_first_one - qdl_secord_one + tddl_one + _zlqx_every_day_dl_first + _zlqx_every_day_dl_secord);
   td_cf = (qdl_first_two + qdl_secord_two - tddl_two - qdl_first_one - qdl_secord_one + tddl_one + _zlqx_every_day_dl_first + _zlqx_every_day_dl_secord) == 0 ? 0 : td_cf;

   return {
      first_qdl: isNaN((first_qdl * 100).toFixed(2)) ? 0.00 : (first_qdl * 100).toFixed(2),
      secord_qdl: isNaN((secord_qdl * 100).toFixed(2)) ? "0.00" : (secord_qdl * 100).toFixed(2),
      td_qdl: isNaN((td_qdl * 100).toFixed(2)) ? "0.00" : (td_qdl * 100).toFixed(2),
      first_zzb: isNaN((first_zzb * 100).toFixed(2)) ? "0.00" : (first_zzb * 100).toFixed(2),
      secord_zzb: isNaN((secord_zzb * 100).toFixed(2)) ? "0.00" : (secord_zzb * 100).toFixed(2),
      td_zzb: isNaN((td_zzb * 100).toFixed(2)) ? "0.00" : (td_zzb * 100).toFixed(2),
      first_xnkjzyl: isNaN((first_xnkjzyl * 100).toFixed(2)) ? "0.00" : (first_xnkjzyl * 100).toFixed(2),
      secord_xnkjzyl: isNaN((secord_xnkjzyl * 100).toFixed(2)) ? "0.00" : (secord_xnkjzyl * 100).toFixed(2),
      td_xnkjzyl: isNaN((td_xnkjzyl * 100).toFixed(2)) ? "0.00" : (td_xnkjzyl * 100).toFixed(2),
      first_wsxs: isNaN(first_wsxs.toFixed(2)) ? "0.00" : first_wsxs.toFixed(2),
      secord_wsxs: isNaN(secord_wsxs.toFixed(2)) ? "0.00" : secord_wsxs.toFixed(2),
      td_wsxs: isNaN(td_wsxs.toFixed(2)) ? "0.00" : td_wsxs.toFixed(2),
      first_cf: isNaN((first_cf * 100).toFixed(2)) ? "0.00" : (first_cf * 100).toFixed(2),
      secord_cf: isNaN((secord_cf * 100).toFixed(2)) ? "0.00" : (secord_cf * 100).toFixed(2),
      td_cf: isNaN((td_cf * 100).toFixed(2)) ? "0.00" : (td_cf * 100).toFixed(2)
   };
}
/*
 *弃电量计算
 * */

var qdl_js = function(sum_first, sum_secord, first_td) {
   //first
   var qdl_first = sum_first > 0 ? sum_first : 0;

   //secord
   var qdl_secord = sum_secord > 0 ? sum_secord : 0;
   var tddl = 0;
   var tddl_first = 0;
   var tddl_secord = 0;
   //通道
   if(sum_first * sum_secord < 0) {
      var abs_first = Math.abs(sum_first);
      var abs_secord = Math.abs(sum_secord);
      tddl = Math.min(abs_first, abs_secord, first_td);

      if(sum_first > 0) {
         tddl_secord = tddl;
      } else if(sum_secord > 0) {
         tddl_first = tddl;
      }
   }

   return {
      qdl_first: qdl_first,
      qdl_secord: qdl_secord,
      tddl: tddl,
      tddl_first: tddl_first,
      tddl_secord: tddl_secord
   }
}