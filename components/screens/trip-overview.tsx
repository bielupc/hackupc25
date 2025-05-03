'use client'
import React, { useState } from 'react';
import { motion } from "motion/react";
import { HeroHighlight, Highlight } from "../ui/hero-highlight";



interface TripOverviewProps {
}


export function TripOverview({ }: TripOverviewProps) {
  const [showTitle, setShowTitle] = useState(true);

  return (
    <div className='h-[400rem] overflow-scroll'>
      {showTitle ? (
        <HeroHighlight>
          <motion.h1
            initial={{
              opacity: 0,
              y: 100,
              scale: 0.5,
              rotate: -15,
            }}
            animate={{
              opacity: 1,
              y: [100, -20, 10, 0],
              scale: [0.5, 1.2, 0.9, 1],
              rotate: [-15, 10, -5, 0],
            }}
            transition={{
              duration: 1.2,
              ease: [0.42, 0, 0.58, 1], // Smoother easing curve
            }}
            exit={{
              opacity: 0,
              transition: { duration: 1 },
            }}
            onAnimationComplete={() => setTimeout(() => setShowTitle(false), 3000)}
            className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
          >
            You're all set for your trip to... <br />
            <Highlight className="text-black dark:text-white mt-2">
              Lisboa, Portugal
            </Highlight>
          </motion.h1>
        </HeroHighlight>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <h1 className="text-3xl font-semibold text-neutral-700 dark:text-white px-6 pt-2">
            Welcome to your trip overview
          </h1>
          <div className="mt-4">
            {/* Additional content can be added here */}

          </div>
        </motion.div>
      )}
    </div>
  );
}






