tableau = (function(){

  var callbacks = {}
  var headers;
  var tableEl;

  function createElement(collection){
    tableEl = document.createElement('table');
    tableEl.onkeydown = function(e){
      var ENTER = 13;
      var TAB = 9;
      if(e.which == ENTER) e.preventDefault()
      if(e.which == ENTER || e.which == TAB) {

        var srcEl = e.srcElement;
        if(srcEl.tagName == 'TD'){
          var key = headers[srcEl.cellIndex];
          var rowI = srcEl.parentElement.rowIndex;
          var model = collection[rowI];
          var val = srcEl.innerText;

          if(model[key] != val){
            callbacks['edited'](val,key,rowI,model)
          }
        }
      }
    }
  }

  function tableau(collection){
    headers = Object.keys(collection[0])
    createElement(collection)
    update()
    return promise();
  }

  function promise(){
    return {when: when, el: tableEl}
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
      return model[key]
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

  return tableau;

})()