tableau = (function(){

  var callbacks = {}
  var headers;
  var tableEl;

  function tableau(collection){
    headers = Object.keys(flattenObject(collection[0]))
    createElement(collection)
    update()
    return promise();
  }

  function createElement(collection){
    tableEl = document.createElement('table');
    tableEl.onkeydown = keydown;

  }

  function keydown(e){
    var ENTER = 13;
    var TAB = 9;
    if(e.which == ENTER) e.preventDefault()
    if(e.which == ENTER || e.which == TAB) {

      var srcEl = e.srcElement;
      if(srcEl.tagName == 'TD'){
        edited(srcEl)
      }
    }
  }

  function edited(srcEl){
    var key = headers[srcEl.cellIndex];
    var rowI = srcEl.parentElement.rowIndex-1;
    var model = collection[rowI];
    var val = srcEl.innerText;

    if(model[key] != val){
      callbacks['edited'](val,key,rowI,model)
    }
  }

  function promise(){
    return {when: when, el: tableEl, update:update}
  }

  function update(){
    tableEl.innerHTML = template()
  }

  function tag(tagName,attributes,content){
    if(!content){
      content = attributes
      attributes = []
    }

    return wrap(
      '<'+tagName+' '+attributes.join(' ')+'>',
      '</'+tagName+'>',
      content
    )
  }

  function wrap(open,close,elements){
    var content = elements.join && elements.join(close+open) || elements
    return open+content+close;
  }

  function values(model){
    return headers.map(function(key){
      return R.path(key,model)
    })
  }

  function template(){
    var th = tag('th',headers)
    var tr = tag('tr',th)
    var thead = tag('thead',tr)


    var tds = collection.map(function(model){
     return tag('td',['contenteditable'],values(model))
    })
    var tr = tag('tr',tds)
    var tbody = tag('tbody',tr);
    return tag('table',[thead,tbody])
  }

  function when(event,callback){
    callbacks[event] = callback
    return promise();
  }

  function flattenObject(ob) {
  	var toReturn = {};

  	for (var i in ob) {
  		if (!ob.hasOwnProperty(i)) continue;

  		if ((typeof ob[i]) == 'object' && !Array.isArray(ob[i])) {
  			var flatObject = flattenObject(ob[i]);
  			for (var x in flatObject) {
  				if (!flatObject.hasOwnProperty(x)) continue;

  				toReturn[i + '.' + x] = flatObject[x];
  			}
  		} else {
  			toReturn[i] = ob[i];
  		}
  	}
  	return toReturn;
  };

  return tableau;

})()

tableau.pathSet = function(path,object,value){
  pathParts = path.split('.')
  var parent = object;
  var address;
  while(pathParts.length>1){
    address = pathParts.shift()
    parent[address] = parent[address] || {}
    parent = parent[address]
  }
  address = pathParts.shift()
  parent[address] = value;
  return object;
}
