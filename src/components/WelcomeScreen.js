import React, { useContext, useState, useEffect } from 'react';
import "../Welcome.css";
import "../assets/fonts/Butler_Webfont/stylesheet.css"
import { useTypewriter, Cursor } from 'react-simple-typewriter';

const WelcomeScreen = (props) => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowMessage(true);
    }, 8000);

    // Clear timeout if component unmounts
    return () => clearTimeout(timeoutId);
  }, []);


  const [text] = useTypewriter({
    words: ['welcome to boxcar.', 'run away with us.'],
    loop: 1,
    onLoopDone: () => {

        if(showMessage){
          sessionStorage.setItem("showWelcomeScreen", "false");        //console.log("IN Welcome" + Boolean(l.getItem("showWelcomeScreen")));
          props.onComplete();
        }
        
    }
  });


  return (
      <div className="loop_container" >
        <h1>
          <span>{text}</span>
          <span><Cursor/></span>
        </h1>
      </div>
  );
  
};

export default WelcomeScreen;
