const createStore = initialState => {
  let state = initialState || {};
  const listener = {};

  const subscribeToItem = (key, callback) => {
    listener[key] = listener[key] || [];
    listener[key].push(callback);       
  };

  const unsubscribeFromItem = (key, callback) => {
    listener[key] = listener[key].filter(listener => listener !== callback);  
  };

  const updateItem = (key, item) => {
    state = {
      ...state,
      [key]: item,
    };
    if(listener[key]){
      listener[key].forEach(listener => listener(state[key]));    
    }  
  };

  const getItem = key => state[key];

  return {
    subscribeToItem,
    unsubscribeFromItem,
    updateItem,
    getItem,
  };
};

export default createStore;