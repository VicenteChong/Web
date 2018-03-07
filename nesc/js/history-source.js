function addHistory(inputs) {
   if(!inputs) {
      return;
   }

   var _history = plus.storage.getItem('HISTORY_INPUT');

   if(_history) {
      _history = JSON.parse(_history);
   }
   else {
      _history = [];
   }

   if(_history.length >= 10) {
      _history.pop();
   }

   inputs['add_time'] = +new Date();
   _history.unshift(inputs);
   plus.storage.setItem('HISTORY_INPUT', JSON.stringify(_history));
}
