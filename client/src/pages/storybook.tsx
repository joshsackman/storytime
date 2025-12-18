import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

import coverImage from "@assets/1_1766072350731.png";
import musicImage from "@assets/2_1766072350732.png";
import finalImage from "@assets/3_1766072350732.png";

type PageType = "cover" | "music" | "final";

export default function Storybook() {
  const [currentPage, setCurrentPage] = useState<PageType>("cover");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setAudioLoaded(true);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (currentPage === "music" && audioRef.current && audioLoaded) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    } else if (currentPage !== "music" && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [currentPage, audioLoaded]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const goToPage = (page: PageType) => {
    setCurrentPage(page);
  };

  const pageVariants = {
    initial: { opacity: 0, x: 100, scale: 0.95 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -100, scale: 0.95 },
  };

  const pageTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
    duration: 0.5,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-950 font-fredoka flex flex-col items-center justify-center px-4 py-8">
      <audio ref={audioRef} src="/api/assets/chickery-chick_1766071315044.mp3" preload="auto" />
      
      <AnimatePresence mode="wait">
        {currentPage === "cover" && (
          <motion.div
            key="cover"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="w-full max-w-2xl flex flex-col items-center gap-6"
          >
            <div 
              className="relative w-full cursor-pointer group"
              onClick={() => goToPage("music")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && goToPage("music")}
              aria-label="Start reading the story"
              data-testid="button-start-reading"
            >
              <img
                src={coverImage}
                alt="Chickery Chick book cover showing colorful dancing chickens on a farm"
                className="w-full rounded-2xl shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-black/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-white/90 dark:bg-black/80 rounded-full p-4 shadow-lg">
                  <Play className="w-12 h-12 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </div>
            
            <Button
              onClick={() => goToPage("music")}
              className="px-12 py-6 text-xl font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-lg"
              data-testid="button-start-story"
            >
              <Play className="w-6 h-6 mr-2" />
              Start Reading
            </Button>
            
            <div className="fixed bottom-6 right-6 bg-white/80 dark:bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
              <span className="text-lg font-medium text-amber-800 dark:text-amber-200" data-testid="text-page-indicator-cover">
                Page 1 of 3
              </span>
            </div>
          </motion.div>
        )}

        {currentPage === "music" && (
          <motion.div
            key="music"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="w-full max-w-2xl flex flex-col items-center gap-6"
          >
            <div className="relative w-full">
              <img
                src={musicImage}
                alt="Musical chickens singing and dancing with music notes floating around"
                className="w-full rounded-2xl shadow-2xl"
              />
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent rounded-b-2xl p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={togglePlay}
                      className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm"
                      aria-label={isPlaying ? "Pause" : "Play"}
                      data-testid="button-play-pause"
                    >
                      {isPlaying ? (
                        <Pause className="w-8 h-8 text-white" />
                      ) : (
                        <Play className="w-8 h-8 text-white ml-1" />
                      )}
                    </Button>
                    
                    <div className="flex-1">
                      <Slider
                        value={[currentTime]}
                        max={duration || 100}
                        step={0.1}
                        onValueChange={handleSeek}
                        className="cursor-pointer"
                        aria-label="Seek audio"
                        data-testid="slider-audio-progress"
                      />
                      <div className="flex justify-between text-sm text-white/80 mt-1">
                        <span data-testid="text-current-time">{formatTime(currentTime)}</span>
                        <span data-testid="text-duration">{formatTime(duration)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setIsMuted(!isMuted)}
                        className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm"
                        aria-label={isMuted ? "Unmute" : "Mute"}
                        data-testid="button-mute-toggle"
                      >
                        {isMuted ? (
                          <VolumeX className="w-5 h-5 text-white" />
                        ) : (
                          <Volume2 className="w-5 h-5 text-white" />
                        )}
                      </Button>
                      <div className="w-24 hidden md:block">
                        <Slider
                          value={[isMuted ? 0 : volume * 100]}
                          max={100}
                          step={1}
                          onValueChange={(value) => {
                            setVolume(value[0] / 100);
                            if (value[0] > 0) setIsMuted(false);
                          }}
                          className="cursor-pointer"
                          aria-label="Volume control"
                          data-testid="slider-volume"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Button
              onClick={() => goToPage("final")}
              className="px-8 py-4 text-lg font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-lg"
              data-testid="button-next-page"
            >
              Next Page
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            
            <div className="fixed bottom-6 right-6 bg-white/80 dark:bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
              <span className="text-lg font-medium text-amber-800 dark:text-amber-200" data-testid="text-page-indicator-music">
                Page 2 of 3
              </span>
            </div>
          </motion.div>
        )}

        {currentPage === "final" && (
          <motion.div
            key="final"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="w-full max-w-2xl flex flex-col items-center gap-6"
          >
            <div className="relative w-full">
              <img
                src={finalImage}
                alt="Happy chickens resting together after their dance, with story credits"
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
            
            <div className="bg-white/80 dark:bg-black/60 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg max-w-md">
              <h2 className="text-2xl font-bold text-amber-800 dark:text-amber-200 mb-3 font-bubblegum">
                The End!
              </h2>
              <p className="text-amber-700 dark:text-amber-300" data-testid="text-story-credits">
                Thank you for reading "Chickery Chick" - A Silly Sounds Adventure by Bert Sackman.
                Written in 1945 by Sid Lippman and Sylvia Dee, this playful tune remains a favorite!
              </p>
            </div>
            
            <Button
              onClick={() => goToPage("cover")}
              className="px-8 py-4 text-lg font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-lg"
              data-testid="button-read-again"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Read Again
            </Button>
            
            <div className="fixed bottom-6 right-6 bg-white/80 dark:bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
              <span className="text-lg font-medium text-amber-800 dark:text-amber-200" data-testid="text-page-indicator-final">
                Page 3 of 3
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
