import { Children, createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ChallengesContext } from "./ChallengesContext";

interface CountdownContextData{
    minutes:number
    seconds:number
    hasFinished:boolean
    isActive:boolean
    startCountdown:()=>void
    resetCountdown:()=>void
}

interface CountdownProviderProps {
    children: ReactNode
}

export const CountdownContext = createContext({} as CountdownContextData)


let countdownTimeOut: NodeJS.Timeout

export function CountdownProvider({children}: CountdownProviderProps){

    const {startNewChallenge} = useContext(ChallengesContext)
    const defaultTime = 0.1 * 60;
    const [time, setTime] = useState(defaultTime)
    const [isActive, setisActive] = useState(false)
    const [hasFinished, setHasFineshed] = useState(false)
    const minutes = Math.floor(time / 60)
    const seconds = time % 60;


    function startCountdown() {
        setisActive(true);
    }

    function resetCountdown() {
        clearTimeout(countdownTimeOut);
        setisActive(false);
        setTime(defaultTime);
        setHasFineshed(false)
    }

    useEffect(() => {
        if (isActive && time > 0) {
            countdownTimeOut = setTimeout(() => {
                setTime(time - 1)
            }, 1000);
        } else if (isActive && time === 0) {            
            setHasFineshed(true)
            setisActive(false)
            startNewChallenge()
        }
    }, [isActive, time])


    return (
        <CountdownContext.Provider value={{
            minutes,
            seconds,
            hasFinished,
            isActive,
            startCountdown,
            resetCountdown
        }}>
            {children}
    </CountdownContext.Provider>
    )
}