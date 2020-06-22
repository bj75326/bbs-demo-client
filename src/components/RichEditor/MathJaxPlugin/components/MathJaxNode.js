import React, {Component} from 'react';
import processTeX from '../mathjax/processTeX';

class MathJaxNode extends Component {
  constructor(props){
    super(props);
    this.timeout = props.timeout;
    this.state = {
      ready: window.MathJax && window.MathJax.isReady, 
    };
  }

  static defaultProps = {
    timeout: 10000,
    inline: false,
    onRender: () => {},
    check: 50,  
  }

  componentDidMount(){
    if(this.state.ready){
      this.typeset();    
    } else {
      const {check} = this.props;
      this.annul = setInterval(() => {
        if(window.MathJax && window.MathJax.isReady){
          this.setState({
            ready: true,
          });  
          clearInterval(this.annul);
        } else {
          if(this.timeout < 0){
            clearInterval(this.annul);  
          }    
          this.timeout -= check;
        }
      }, check);
    }  
  }

  shouldComponentUpdate(nextProps, nextState){
    return (
      nextProps.children !== this.props.children
      || nextProps.inline !== this.props.inline
      || nextState.ready !== this.state.ready
    );
  }

  componentDidUpdate(prevProps){
    const forceUpdate = prevProps.inline !== this.props.inline;
    this.typeset(forceUpdate);  
  }

  componentWillUnmount(){
    clearInterval(this.annul);
    this.clear();  
  }

  clear(){
    const MathJax = window.MathJax;
    if(!this.script || !MathJax || !MathJax.isReady){
      return;  
    }    
    const jax = MathJax.Hub.getJaxFor(this.script);
    if(jax){
      jax.Remove();  
    }
  }

  setScriptText(text){
    const {inline} = this.props;
    if(!this.script){
      this.script = document.createElement('script');
      this.script.type = `math/tex; ${inline ? '' : 'mode=display'}`
      this.node.appendChild(this.script);  
    }

    if('text' in this.script){
      this.script.text = text;  
    }else {
      this.script.textContent = text;
    }

    return this.script;
  }

  typeset(forceUpdate){
    const MathJax = window.MathJax;
    const {children, onRender} = this.props;
    
    const text = children;

    if(forceUpdate){
      this.clear();
    }

    if(!forceUpdate && this.script){
      MathJax.Hub.Queue(() => {
        const jax = MathJax.Hub.getJaxFor(this.script);
        
        if(jax) jax.Text(text, onRender);
        else {
          const script = this.setScriptText(text);
          processTeX(MathJax, script, onRender);
        }
      });  
    }else {
      const script = this.setScriptText(text);
      MathJax.Hub.Queue(() => {
        processTeX(MathJax, script, onRender);
      });  
    }
  }

  render(){
    const {ready} = this.state;
    if(ready){
      return <span ref={node => {this.node = node}}/>    
    }    
    return <span style={{color: 'red'}}>{this.props.children}</span>
  }
}

export default MathJaxNode;