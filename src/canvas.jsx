import React,{useRef, useEffect, useState } from "react";

const Canvas = props => {
    const canvasRef = useRef(null)
    const [ch, setCh] = useState();


    useEffect(()=>{
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        let frameCount = 0
        let animationFrameId
        

        const render =() => {
            frameCount++
            context.clearRect (0,0, context.canvas.width,context.canvas.height)
            context.fillStyle = '#000000'
            context.beginPath()
            context.arc(50,100, 20*Math.sin(frameCount*0.05)**2,0,2*Math.PI)
            context.fill()
            animationFrameId =window.requestAnimationFrame(render)
        }
        render()

        return () =>{
            window.cancelAnimationFrame(animationFrameId)
        }
    },[])
    return <canvas ref={canvasRef}{...props}/>
}

export default Canvas