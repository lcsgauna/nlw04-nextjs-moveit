import {createContext, useState, ReactNode, useEffect} from 'react';
import challenges from '../../challenges.json';
import Cookies from 'js-cookie';
import { LevelUpModal } from '../components/LevelUpModal';

interface challenge{
    type:'body'|'eye';
    description:string;
    amount: number;
} 

interface ChallengesContextData{
    level:number;
    currentExperience: number;
    experienceToNextLevel:number;
    challengesCompleted: number;
    activeChallenge: challenge;
    levelUp: ()=>void;
    startNewChallenge: ()=> void;
    resetChallenge: ()=> void;
    completeChallenge: ()=>void;
    closeLevelUpModal: ()=>void;
}

interface ChallengesProviderProps {
        children:ReactNode;
        level:number;
        currentExperience:number;
        challengeCompleted:number;
}


export const ChallengeContext  = createContext({} as ChallengesContextData);

export function ChallengesProvider({children,...rest}:ChallengesProviderProps){
   const [level, setLevel] = useState(rest.level ?? 1);
   const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0);
   const [challengesCompleted, setChallengesCompleted] = useState(rest.challengeCompleted ?? 0);

   const [activeChallenge, setActiveChallenge] = useState(null);
   const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);


   const experienceToNextLevel = Math.pow((level+1)* 4, 2);

    useEffect(()=>{
        Notification.requestPermission();
    },[]);

    useEffect(()=>{
        Cookies.set('level',String(level));
        Cookies.set('currentExperience',String(currentExperience));
        Cookies.set('challengesCompleted',String(challengesCompleted));
    },[level, currentExperience, challengesCompleted]);


   function levelUp(){
       setLevel(level+1);
       setIsLevelModalOpen(true);
   }

   function closeLevelUpModal(){
       setIsLevelModalOpen(false);
   }

   function startNewChallenge(){
        const randomChallengeIndex = Math.floor(Math.random()*challenges.length);
        const challenge = challenges[randomChallengeIndex];

        setActiveChallenge(challenge);

        new Audio('/notification.mp3').play();

        if(Notification.permission==='granted'){
            new Notification('Novo Desafio 🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉',{
                body: `Valendo ${challenge.amount}xp`
            })
        }
    }

    function resetChallenge(){
        setActiveChallenge(null);
    }


    function completeChallenge(){
        if(!activeChallenge){
            return;
        }

        const {amount} = activeChallenge;

        let finalExperience = currentExperience + amount;

        if(finalExperience>= experienceToNextLevel){
            finalExperience = finalExperience - experienceToNextLevel;
            levelUp();
        }

        setCurrentExperience(finalExperience);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted+1);

    }


    return (
        <ChallengeContext.Provider value={{level,
        currentExperience,
        challengesCompleted,
        experienceToNextLevel, 
        levelUp,
        startNewChallenge,
        activeChallenge,
        resetChallenge,
        completeChallenge,
        closeLevelUpModal,
        }}>
            {children}

        {isLevelModalOpen && <LevelUpModal/>}
        </ChallengeContext.Provider>
    );
}
