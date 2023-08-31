import React ,{useState}from "react";
import "./controler.css"


const Control = ({setKey}) => {
    
    const handleClick = (e,key) => {
        e.preventDefault();
        setKey(key)
    }

 return (
    <div>
    <div>
        <p>Keypad</p>
    </div>
    <div className="keypad">
        <div onClick={(e) => handleClick(e,'Digit1')} className="key">1</div>
        <div onClick={(e) => handleClick(e,'Digit2')} className="key">2</div>
        <div onClick={(e) => handleClick(e,'Digit3')} className="key">3</div>
        <div onClick={(e) => handleClick(e,'Digit4')} className="key">4</div>
        <div onClick={(e) => handleClick(e,'KeyQ')} className="key">Q</div>
        <div onClick={(e) => handleClick(e,'KeyW')} className="key">W</div>
        <div onClick={(e) => handleClick(e,'KeyE')} className="key">E</div>
        <div onClick={(e) => handleClick(e,'KeyR')} className="key">R</div>
        <div onClick={(e) => handleClick(e,'KeyA')} className="key">A</div>
        <div onClick={(e) => handleClick(e,'KeyS')} className="key">S</div>
        <div onClick={(e) => handleClick(e,'KeyD')} className="key">D</div>
        <div onClick={(e) => handleClick(e,'KeyF')} className="key">F</div>
        <div onClick={(e) => handleClick(e,'KeyZ')} className="key">Z</div>
        <div onClick={(e) => handleClick(e,'KeyX')} className="key">X</div>
        <div onClick={(e) => handleClick(e,'KeyC')} className="key">C</div>
        <div onClick={(e) => handleClick(e,'KeyV')} className="key">V</div>
    </div>
    </div>
 )

}

export default Control