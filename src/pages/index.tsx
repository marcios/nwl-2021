import styles from '../styles/pages/Home.module.css'
import { GetServerSideProps } from 'next'

import { CompleteChallenges } from "../components/CompleteChallenges";
import { Countdown } from "../components/Countdown";
import { ExperienceBar } from "../components/ExperienceBar";
import { Profile } from "../components/Profile";


import Head from 'next/head'
import { ChallengeBox } from "../components/ChallengeBox";
import { CountdownProvider } from '../contexts/CountdownContext'
import { Challengesprovider } from '../contexts/ChallengesContext';


interface HomeProps {
  currentExperience:number
  level:number  
  challengeCompleted:number
}

export default function Home(props:HomeProps) {

  return (

    <Challengesprovider 
      level={props.level} 
      currentExperience={props.currentExperience}
      challengeCompleted={props.challengeCompleted}
      >
      <div className={styles.container}>
        <Head>
          <title>Inicio | move.it</title>
        </Head>
        <ExperienceBar />

        <CountdownProvider>
          <section>
            <div>
              <Profile />
              <CompleteChallenges />
              <Countdown />
            </div>
            <div>
              <ChallengeBox />
            </div>
          </section>
        </CountdownProvider>

      </div>
    </Challengesprovider>

  )
}


export const getServerSideProps: GetServerSideProps = async (ctx) => {

  const { level, currentExperience, challengesCompleted } = ctx.req.cookies
  return {
    props: {
      level: Number(level),
      currentExperience:Number(currentExperience),
      challengesCompleted:Number(challengesCompleted)
    }
  }
}