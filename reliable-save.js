(function(root,factory){
  var api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.ReliableSave=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  function remoteContainsTask(remoteTasks,taskId){
    return Array.isArray(remoteTasks)&&remoteTasks.some(function(task){return task&&task.id===taskId});
  }

  function createSingleFlightSaver(saveOperation){
    var inFlight=null;
    return function(task){
      if(inFlight)return inFlight;
      inFlight=Promise.resolve(saveOperation(task)).finally(function(){inFlight=null});
      return inFlight;
    };
  }

  async function saveAndVerifyTask(task,push,fetchRemote,wait,attempts){
    if(!await push())return false;
    for(var attempt=0;attempt<attempts;attempt++){
      var remoteTasks=await fetchRemote();
      if(remoteContainsTask(remoteTasks,task.id))return true;
      if(attempt<attempts-1)await wait();
    }
    return false;
  }

  return {
    remoteContainsTask:remoteContainsTask,
    createSingleFlightSaver:createSingleFlightSaver,
    saveAndVerifyTask:saveAndVerifyTask
  };
});
