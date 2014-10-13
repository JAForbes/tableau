collection = [
  {id: 1, name: 'James', age: '26'},
  {id: 1, name: 'James', age: '26'},
  {id: 1, name: 'James', age: '26'},
  {id: 1, name: 'James', age: '26'},
]

t = tableau(collection)
  .when('selected',whenSelected)
  .when('edited',whenEdited)

document.getElementsByTagName('body')[0].appendChild(t.el)

function whenEdited(val,key,index,model){
  console.log(val,key,index,model)
  model[key] = val;
}

function whenSelected(){
}