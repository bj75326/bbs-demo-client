import load from './load';

const DEFAULT_SCRIPT = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js";

const DEFAULT_OPTIONS = {
  jax: ['input/TeX', 'output/CommonHTML'],
  TeX: {
    extensions: ['autoload-all.js'],
  },
  messageStyles: 'none',
  showProcessingMessages: false,
  showMathMenu: false,
  showMathMenuMSIE: false,
  preview: 'none',
  delayStartupTypeset: true,
};

const loadMathJax = ({macros: Macros, script, mathjaxConfig}) => {
  const config = {};
  config.script = script || DEFAULT_SCRIPT;
  config.options = mathjaxConfig || DEFAULT_OPTIONS;
  if(config.options.TeX === undefined){
    config.options.TeX = {};  
  }

  const TeX = Object.assign(config.options.TeX, {Macros});
  config.options = Object.assign(config.options, TeX);

  if(window.MathJax){
    window.MathJax.Hub.Config(config.options);
    window.MathJax.Hub.processSectionDelay = 0;
    return;
  }

  load(config.script, (err) => {
    console.log('!!!!!!!!!!!!!!!!!!!!!mathjax load callback run');
    if(!err){
      window.MathJax.Hub.Config(config.options);
      window.MathJax.Hub.processSectionDelay = 0;  
    }
  });
};

export default loadMathJax;