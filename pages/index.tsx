import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { decode } from "punycode";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { VibeType } from "../components/DropDown";
import Footer from "../components/Footer";
import Github from "../components/GitHub";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import ResizablePanel from "../components/ResizablePanel";
import { promptSections, promptContinue } from "../prompts";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [wikipediaPage, setWikipediaPage] = useState("");
  const [vibe, setVibe] = useState<VibeType>("Classic");
  const [generatedSections, setgeneratedSections] = useState([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const continueSection = async (e: any, sectionIndex) => {
    const currentSection = generatedSections[sectionIndex];
    const prompt = promptContinue(wikipediaPage, currentSection, vibe);

    console.log("prompt", prompt);
    e.preventDefault();
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;

    if (!data) {
      return;
    }
    const reader = data.getReader();
    const decoder = new TextDecoder();

    let done = false;
    let resultData = "";
    setgeneratedSections((prev) =>
      prev.map((section, index) => {
        if (index === sectionIndex) {
          return {
            ...section,
            description: section.description + "\n\n",
          };
        }
        return section;
      })
    );
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setgeneratedSections((prev) =>
        prev.map((section, index) => {
          if (index === sectionIndex) {
            return {
              ...section,
              description: section.description + chunkValue,
            };
          }
          return section;
        })
      );
      resultData += chunkValue;

      // do differently if we want live update
    }
  };

  const generatewikipediaPage = async (e: any) => {
    const prompt = promptSections(wikipediaPage, vibe);
    e.preventDefault();

    setLoading(true);
    console.log("prompt", prompt);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      // handle this error properly

      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }
    const reader = data.getReader();
    const decoder = new TextDecoder();

    let done = false;
    let resultData = "";
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      resultData += chunkValue;

      // do differently if we want live update
    }

    // convert resultData as json object
    const result = JSON.parse(resultData);

    setgeneratedSections(result);

    setLoading(false);
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Wiki generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <a
          className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-md transition-colors hover:bg-gray-100 mb-5"
          href="https://github.com/simonManydata/gpt_wikipedia"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github />
          <p>Star on GitHub</p>
        </a>

        <h1 className="sm:text-6xl text-4xl max-w-2xl font-bold text-slate-900">
          Generate Wikipedia page
        </h1>
        <p className="text-slate-500 mt-5">
          47,118 fake articles generated so far.
        </p>
        <div className="max-w-xl w-full">
          <div className="flex mt-10 items-center space-x-3">
            <Image
              src="/1-black.png"
              width={30}
              height={30}
              alt="1 icon"
              className="mb-5 sm:mb-0"
            />

            <p className="text-left font-medium">
              Write wikipedia article{" "}
              <span className="text-slate-500">(or just a topic)</span>
            </p>
          </div>
          <textarea
            value={wikipediaPage}
            onChange={(e) => setWikipediaPage(e.target.value)}
            rows={1}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={"Discovery Antarctica"}
          />
          <div className="flex mb-5 items-center space-x-3">
            <Image src="/2-black.png" width={30} height={30} alt="1 icon" />
            <p className="text-left font-medium">Select your style.</p>
          </div>
          <div className="block">
            <DropDown vibe={vibe} setVibe={(newVibe) => setVibe(newVibe)} />
          </div>

          {!loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => generatewikipediaPage(e)}
            >
              Generate Wikipedia page &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="space-y-10 my-10">
              {generatedSections && (
                <>
                  <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                    {generatedSections.map((generatedSection, sectionIndex) => {
                      return (
                        <>
                          <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">
                            {generatedSection.header}
                          </h2>
                          <div>{/* header of the section */}</div>
                          <div
                            className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                            onClick={(e) => {
                              setCurrentSectionIndex(sectionIndex);
                              continueSection(e, sectionIndex);
                            }}
                            key={sectionIndex}
                          >
                            <p style={{ whiteSpace: "pre-line" }}>
                              {generatedSection.description}
                            </p>
                          </div>
                        </>
                      );
                    })}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
