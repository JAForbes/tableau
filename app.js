

t = tableau(collection)
  .when('edited',whenEdited)

document.getElementsByTagName('body')[0].appendChild(t.el)

function whenEdited(val,key,index,model){
  var prevWasArray = Array.isArray(R.path(key,model))
  //console.log(val,key,index,model,prevWasArray)
  if(prevWasArray){
    val = R.map(Number,val.split(','))
  }
  tableau.pathSet(key,model,val)
}
