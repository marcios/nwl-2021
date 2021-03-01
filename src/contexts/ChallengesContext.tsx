import { createContext, ReactNode, useEffect, useState } from 'react'
import challenges from '../../challenge.json'
import Cookies from 'js-cookie'
import { LevelUpModal } from '../components/LevalUpModal'



interface Challenge {
    type: string
    description: string
    amount: number
}
interface ChallengesContextData {
    level: number
    currentExperience: number
    challengesCompleted: number
    experienceToNextLevel: number
    activeChallenge: Challenge
    startNewChallenge: () => void
    levelUp: () => void
    resetChallenge: () => void
    completeChallenge: () => void
    closeLevelUpModal: ()=> void
}

interface Challengesproviderprops {
    children: ReactNode,
    currentExperience: number
    level: number
    challengeCompleted: number

}


export const ChallengesContext = createContext({} as ChallengesContextData)

export function Challengesprovider({ children, ...rest }: Challengesproviderprops) {

    const [level, setLevel] = useState(rest.level ?? 1)
    const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0)
    const [challengesCompleted, setChallengesCompleted] = useState(rest.challengeCompleted ?? 0)
    const [activeChallenge, setActiveChallenge] = useState(null)

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2)
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false)

    function levelUp() {
        setLevel(level + 1);
        setIsLevelUpModalOpen(true)
    }

    function closeLevelUpModal(){
        setIsLevelUpModalOpen(false)
    }

    useEffect(() => {
        Notification.requestPermission()
    }, [])

    useEffect(() => {
        Cookies.set('level', String(level))
        Cookies.set('currentExperience', String(currentExperience))
        Cookies.set('challengesCompleted', String(challengesCompleted))

    }, [level, currentExperience, challengesCompleted])

    function startNewChallenge() {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randomChallengeIndex]
        setActiveChallenge(challenge)


        new Audio('/notification.mp3').play()
        if (Notification.permission === 'granted') {
            const noty = new Notification('Novo desafio', {
                body: `Valendo ${challenge.amount} xp`
            })

            console.log(noty)


        }
    }

    function resetChallenge() {
        setActiveChallenge(null)
    }

    function completeChallenge() {
        if (!activeChallenge) {
            return;
        }

        const { amount } = activeChallenge;
        let finalExperience = currentExperience + amount;

        if (finalExperience >= experienceToNextLevel) {
            levelUp()
            finalExperience = finalExperience - experienceToNextLevel

        }

        setCurrentExperience(finalExperience);
        setActiveChallenge(null)
        setChallengesCompleted(challengesCompleted + 1)

    }

    return (
        <ChallengesContext.Provider value={{
            level,
            currentExperience,
            challengesCompleted,
            activeChallenge,
            experienceToNextLevel,
            completeChallenge,
            resetChallenge,
            startNewChallenge,
            levelUp,
            closeLevelUpModal
        }}>
            {children}
            {isLevelUpModalOpen &&   <LevelUpModal />}
            
        </ChallengesContext.Provider>
    )
}