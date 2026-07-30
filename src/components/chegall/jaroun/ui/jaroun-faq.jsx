"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { useDirection } from "@/utils/hooks/useDirection";

const FAQ = ({ questions }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="mx-auto lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-2">
      {questions.map((question, index) => (
        <motion.div
          key={index}
          className="mb-4"
          initial={false}
          animate={{ borderRadius: activeIndex === index ? "16px" : "32px" }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          <motion.div
            className="lg:hover:bg-jarounSuperLight bg-jarounGray1/50 cursor-pointer rounded-3xl px-0.5 py-3 text-sm/6 font-semibold transition-colors"
            onClick={() => toggleAnswer(index)}
          >
            <div className="relative ps-9">
              <dt className="font-base text-jarounBlack inline">
                {activeIndex === index ? (
                  <ChevronUpIcon className="text-jarounBlack absolute top-1 right-3 h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="text-jarounBlack absolute top-1 right-3 h-4 w-4" />
                )}

                {question.question}
              </dt>
            </div>
          </motion.div>

          <AnimatePresence>
            {activeIndex === index && (
              <motion.div
                className="bg-jarounVeryLight/50 mt-4 overflow-hidden rounded-3xl px-4 py-4 pb-4"
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-jarounGray6">{question.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

export default FAQ;
