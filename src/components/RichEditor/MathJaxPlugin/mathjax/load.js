
const load = (src, cb) => {
  const head = document.head || document.getElementsByTagName('head')[0]; 
  const script = document.createElement('script');

  script.type = 'text/javascript';
  script.async = true;
  script.src = src;

  if(cb){
    script.onload = () => {
      script.onload = undefined;
      script.onerror = undefined;
      cb(null, script);
    }
    script.onerror = () => {
      script.onload = undefined;
      script.onerror = undefined;
      cb(new Error(`Failed to load ${src}`), script);
    }
  }

  head.appendChild(script);
};

export default load;