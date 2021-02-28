import { useContext } from 'react';
import { ChallengeContext } from '../contexts/ChallengesContext';
import { CountdownContext } from '../contexts/CountdownContext';
import styles from '../styles/components/ChallengeBox.module.css';

export function ChallengeBox(){
    const {activeChallenge, resetChallenge, completeChallenge} = useContext(ChallengeContext);
    const {resetCountdown} = useContext(CountdownContext);


    function handleChallengeSucceeded(){
        completeChallenge();
        resetCountdown();
    }

    function handleChallengeFailed(){
        resetChallenge();
        resetCountdown();
    }


    return(
        <div className={styles.challengeBoxContainer}>
            {activeChallenge?(
                <div className={styles.challengeActive}>
                    <header>Ganhe {activeChallenge.amount}</header>
                    <main>
                        <img src={`icons/${activeChallenge.type}.svg`} alt="icon challenges"/>
                        <strong>Novo Desafio</strong>
                        <p>{activeChallenge.description}</p>
                    </main>
                    <footer>
                        <button type="button" 
                        className={styles.challengeFailedButton} 
                        onClick={handleChallengeFailed}
                        >Falhei</button>
                        <button type="button"
                         className={styles.challengeSucceedButton}
                         onClick={handleChallengeSucceeded}
                         >Completei</button>
                    </footer>
                </div>
            ):(
                <div className={styles.challengeNotActive}>
                <strong>Inicie um ciclo para receber desafios a serem completados</strong>
                <p>
                    <img src="icons/level-up.svg" alt="level up"/>
                    Avance de level completando desafios
                </p>
            </div>
            )}
        </div>
    );
}