
let pendingScripts = [];
let pendingCallbacks = [];
let needsProcess = false;

const doProcess = MathJax => {
  MathJax.Hub.Queue(() => {
    const oldElementScripts = MathJax.Hub.elementScripts;
    MathJax.Hub.elementScripts = () => pendingScripts;

    try{
      return MathJax.Hub.Process(null, () => {
        pendingCallbacks.forEach(cb => cb());

        pendingScripts = [];
        pendingCallbacks = [];
        needsProcess = false;
      });  
    }catch(e){
      throw e;  
    }finally{
      MathJax.Hub.elementScripts = oldElementScripts;
    }
  });  
};

const processTeX = (MathJax, script, callback) => {
  pendingScripts.push(script);
  pendingCallbacks.push(callback);
  if(!needsProcess){
    needsProcess = true;
    setTimeout(() => doProcess(MathJax), 0);  
  }
};

export default processTeX;