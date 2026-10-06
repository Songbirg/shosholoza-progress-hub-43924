import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ChevronLeft, ChevronRight, Image as ImageIcon, Video, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import campaign images
import img1 from "../../images/Campaign images/Make_this_image_high_quality_202605131039.jpeg";
import img2 from "../../images/Campaign images/Make_this_image_high_quality_202605131039 (1).jpeg";
import img3 from "../../images/Campaign images/Make_this_image_high_quality_202605131039 (2).jpeg";
import img4 from "../../images/Campaign images/Make_this_image_high_quality_202605131039 (3).jpeg";
import img5 from "../../images/Campaign images/Make_this_image_high_quality_202605131040.jpeg";
import img6 from "../../images/Campaign images/Make_this_image_high_quality_202605131040 (1).jpeg";
import img7 from "../../images/Campaign images/Make_this_image_high_quality_202605131040 (2).jpeg";
import img8 from "../../images/Campaign images/WhatsApp Image 2026-05-13 at 10.22.47 AM (1).jpeg";

// Import videos
import video1 from "../../images/Videos/WhatsApp Video 2026-05-13 at 10.21.56 AM.mp4";
import video2 from "../../images/Videos/WhatsApp Video 2026-05-13 at 10.22.12 AM.mp4";
import video3 from "../../images/Videos/WhatsApp Video 2026-05-13 at 10.22.45 AM.mp4";
import video4 from "../../images/Videos/WhatsApp Video 2026-05-13 at 10.22.46 AM.mp4";

// Import songs
import song1 from "../../images/Songs/AI-Song_Shosholoza, Shosh!_v1_2026-04-07.mp3";
import song2 from "../../images/Songs/AI-Song_Shosholoza, Sisindise Manje_v1_2026-04-07.mp3";
import song3 from "../../images/Songs/AI-Song_Shosholoza, Sisindise Manje_v1_2026-04-07 (1).mp3";
import song4 from "../../images/Songs/AI-Song_Ubuntu Ngumuntu Ngabantu_v1_2026-04-07.mp3";
import song5 from "../../images/Songs/AI-Song_Viva Shosholoza_v1_2026-04-07.mp3";
import song6 from "../../images/Songs/AI-Song_Viva Shosholoza_v1_2026-04-07 (1).mp3";
import song7 from "../../images/Songs/IShosholoza Ngeyethu_2026-04-06.mp3";
import song8 from "../../images/Songs/Shhh Shosholoza Progressive Party_v1_2026-04-07.mp3";
import song9 from "../../images/Songs/Talk Less, Do More_v1_2026-04-07.mp3";

const images = [
  { id: 1, src: img1, title: "Campaign Moment 1" },
  { id: 2, src: img2, title: "Campaign Moment 2" },
  { id: 3, src: img3, title: "Campaign Moment 3" },
  { id: 4, src: img4, title: "Campaign Moment 4" },
  { id: 5, src: img5, title: "Campaign Moment 5" },
  { id: 6, src: img6, title: "Campaign Moment 6" },
  { id: 7, src: img7, title: "Campaign Moment 7" },
  { id: 8, src: img8, title: "Campaign Moment 8" },
];

const videos = [
  { id: 1, src: video1, title: "Campaign Video 1" },
  { id: 2, src: video2, title: "Campaign Video 2" },
  { id: 3, src: video3, title: "Campaign Video 3" },
  { id: 4, src: video4, title: "Campaign Video 4" },
];

const songs = [
  { id: 1, src: song1, title: "Shosholoza, Shosh!" },
  { id: 2, src: song2, title: "Sisindise Manje" },
  { id: 3, src: song3, title: "Sisindise Manje (Remix)" },
  { id: 4, src: song4, title: "Ubuntu Ngumuntu Ngabantu" },
  { id: 5, src: song5, title: "Viva Shosholoza" },
  { id: 6, src: song6, title: "Viva Shosholoza (Remix)" },
  { id: 7, src: song7, title: "IShosholoza Ngeyethu" },
  { id: 8, src: song8, title: "Shhh Shosholoza Progressive Party" },
  { id: 9, src: song9, title: "Talk Less, Do More" },
];

const Gallery = () => {
  const [activeTab, setActiveTab] = useState<"images" | "videos" | "music">("images");
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const getCurrentMedia = () => {
    if (activeTab === "images") return images;
    if (activeTab === "videos") return videos;
    return songs;
  };

  const handleNext = () => {
    const media = getCurrentMedia();
    setCurrentIndex((prev) => (prev + 1) % media.length);
    setSelectedMedia(media[(currentIndex + 1) % media.length]);
  };

  const handlePrev = () => {
    const media = getCurrentMedia();
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
    setSelectedMedia(media[(currentIndex - 1 + media.length) % media.length]);
  };

  const handlePlaySong = (song: any) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-green-600 via-green-700 to-yellow-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-yellow-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
                Media Gallery
              </h1>
              <p className="text-white/90 text-lg max-w-2xl mx-auto">
                Explore our campaign moments, videos, and music
              </p>
            </motion.div>
          </div>
        </section>

        {/* Tabs */}
        <section className="py-8 bg-white/80 backdrop-blur-sm sticky top-16 z-40 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex gap-4 justify-center">
              <Button
                variant={activeTab === "images" ? "hero" : "outline"}
                onClick={() => setActiveTab("images")}
                className="flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                Images
              </Button>
              <Button
                variant={activeTab === "videos" ? "hero" : "outline"}
                onClick={() => setActiveTab("videos")}
                className="flex items-center gap-2"
              >
                <Video className="w-4 h-4" />
                Videos
              </Button>
              <Button
                variant={activeTab === "music" ? "hero" : "outline"}
                onClick={() => setActiveTab("music")}
                className="flex items-center gap-2"
              >
                <Music className="w-4 h-4" />
                Music
              </Button>
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {activeTab === "images" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                {images.map((image) => (
                  <motion.div
                    key={image.id}
                    variants={itemVariants}
                    className="group cursor-pointer"
                    onClick={() => {
                      setSelectedMedia(image);
                      setCurrentIndex(images.indexOf(image));
                    }}
                  >
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={image.src}
                          alt={image.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900">{image.title}</h3>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === "videos" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {videos.map((video) => (
                  <motion.div
                    key={video.id}
                    variants={itemVariants}
                    className="group cursor-pointer"
                    onClick={() => {
                      setSelectedMedia(video);
                      setCurrentIndex(videos.indexOf(video));
                    }}
                  >
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                      <div className="aspect-video relative bg-gray-900">
                        <video
                          src={video.src}
                          className="w-full h-full object-cover"
                          muted
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/30 transition-all">
                          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="w-8 h-8 text-green-600 ml-1" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900">{video.title}</h3>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === "music" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {songs.map((song) => (
                  <motion.div
                    key={song.id}
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    <div className="flex items-center gap-4">
                      <Button
                        variant="hero"
                        size="lg"
                        onClick={() => handlePlaySong(song)}
                        className="flex-shrink-0"
                      >
                        <Play className="w-5 h-5" />
                      </Button>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{song.title}</h3>
                        <p className="text-gray-500 text-sm">Shosholoza Progressive Party</p>
                      </div>
                      {currentSong?.id === song.id && isPlaying && (
                        <div className="flex items-center gap-1">
                          {[...Array(8)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-1 bg-green-500 rounded-full"
                              animate={{
                                height: [8, 24, 8],
                              }}
                              transition={{
                                duration: 0.5,
                                repeat: Infinity,
                                delay: i * 0.1,
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* Audio Player */}
        {currentSong && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-green-600 to-yellow-500 text-white p-4 z-50 shadow-2xl"
          >
            <div className="container mx-auto px-4 flex items-center gap-4">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <span className="text-2xl">⏸</span>
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </Button>
              <div className="flex-1">
                <h3 className="font-bold">{currentSong.title}</h3>
                <p className="text-white/80 text-sm">Shosholoza Progressive Party</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setCurrentSong(null);
                  setIsPlaying(false);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
              <audio
                src={currentSong.src}
                autoPlay={isPlaying}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            </div>
          </motion.div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {selectedMedia && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedMedia(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-5xl max-h-[90vh] w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-4 right-4 z-10"
                  onClick={() => setSelectedMedia(null)}
                >
                  <X className="w-6 h-6" />
                </Button>

                {activeTab === "images" && (
                  <img
                    src={selectedMedia.src}
                    alt={selectedMedia.title}
                    className="w-full h-full object-contain rounded-lg"
                  />
                )}

                {activeTab === "videos" && (
                  <video
                    src={selectedMedia.src}
                    controls
                    autoPlay
                    className="w-full h-full rounded-lg"
                  />
                )}

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handlePrev}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleNext}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default Gallery;
