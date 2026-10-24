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

// Import new images
import newImg1 from "../../images/new images/853280273_1477895707718992_6910074365978851342_n.jpg";
import newImg2 from "../../images/new images/853563532_1477895957718967_8205803527118142151_n.jpg";
import newImg3 from "../../images/new images/853563562_1477886487719914_7217450837252617041_n.jpg";
import newImg4 from "../../images/new images/853925820_1477890504386179_7662571056102376943_n.jpg";
import newImg5 from "../../images/new images/854389699_1477894587719104_8158661491604704005_n.jpg";
import newImg6 from "../../images/new images/854817873_1477894337719129_8351940271592616570_n.jpg";
import newImg7 from "../../images/new images/854852862_1477897177718845_1000203641603275912_n.jpg";
import newImg8 from "../../images/new images/854852870_1477885597720003_8788152580172446074_n.jpg";
import newImg9 from "../../images/new images/854976172_1477886304386599_6598410374551236050_n.jpg";
import newImg10 from "../../images/new images/855201373_1477885891053307_845880890088216152_n.jpg";
import newImg11 from "../../images/new images/855508550_1481345684040661_609140145890538939_n.jpg";
import newImg12 from "../../images/new images/855662941_1477886757719887_574490438770833851_n.jpg";
import newImg13 from "../../images/new images/855986706_1481345600707336_430888274158616297_n.jpg";
import newImg14 from "../../images/new images/857438989_1481345767373986_6023499599295967035_n.jpg";
import newImg15 from "../../images/new images/857609521_1481345720707324_2977276004567707559_n.jpg";
import newImg16 from "../../images/new images/857644335_1481345404040689_6465124265899741730_n.jpg";
import newImg17 from "../../images/new images/857681084_1481345457374017_4138694435499571034_n.jpg";
import newImg18 from "../../images/new images/859396191_1481345340707362_9172409115784531310_n.jpg";
import newImg19 from "../../images/new images/860042628_1481345544040675_8226994732449800657_n.jpg";

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
  { id: 1, src: img1 },
  { id: 2, src: img2 },
  { id: 3, src: img3 },
  { id: 4, src: img4 },
  { id: 5, src: img5 },
  { id: 6, src: img6 },
  { id: 7, src: img7 },
  { id: 8, src: img8 },
  { id: 9, src: newImg1 },
  { id: 10, src: newImg2 },
  { id: 11, src: newImg3 },
  { id: 12, src: newImg4 },
  { id: 13, src: newImg5 },
  { id: 14, src: newImg6 },
  { id: 15, src: newImg7 },
  { id: 16, src: newImg8 },
  { id: 17, src: newImg9 },
  { id: 18, src: newImg10 },
  { id: 19, src: newImg11 },
  { id: 20, src: newImg12 },
  { id: 21, src: newImg13 },
  { id: 22, src: newImg14 },
  { id: 23, src: newImg15 },
  { id: 24, src: newImg16 },
  { id: 25, src: newImg17 },
  { id: 26, src: newImg18 },
  { id: 27, src: newImg19 },
];

const videos = [
  { id: 1, src: video1 },
  { id: 2, src: video2 },
  { id: 3, src: video3 },
  { id: 4, src: video4 },
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-cyan-600 via-cyan-700 to-teal-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-teal-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
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
                {images.map((image, index) => (
                  <motion.div
                    key={image.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }}
                    className="group cursor-pointer"
                    onClick={() => {
                      setSelectedMedia(image);
                      setCurrentIndex(images.indexOf(image));
                    }}
                  >
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border-4 border-transparent hover:border-cyan-400">
                      <div className="aspect-square overflow-hidden relative">
                        <img
                          src={image.src}
                          alt={`Gallery image ${image.id}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 text-center">
                            <p className="text-cyan-900 font-bold text-sm">View Full Size</p>
                          </div>
                        </div>
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
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {videos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.03 }}
                    className="group cursor-pointer"
                    onClick={() => {
                      setSelectedMedia(video);
                      setCurrentIndex(videos.indexOf(video));
                    }}
                  >
                    <div className="bg-gradient-to-br from-cyan-900 to-teal-900 rounded-2xl shadow-2xl overflow-hidden hover:shadow-cyan-500/50 transition-all duration-500 border-4 border-cyan-400/20">
                      <div className="aspect-video relative bg-gray-900">
                        <video
                          src={video.src}
                          className="w-full h-full object-cover"
                          muted
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/30 transition-all">
                          <motion.div 
                            whileHover={{ scale: 1.2, rotate: 90 }}
                            className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full flex items-center justify-center shadow-2xl"
                          >
                            <Play className="w-10 h-10 text-cyan-900 ml-2" />
                          </motion.div>
                        </div>
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
                    className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border-2 border-cyan-200 hover:border-cyan-400"
                  >
                    <div className="flex items-center gap-4">
                      <Button
                        variant="default"
                        size="lg"
                        onClick={() => handlePlaySong(song)}
                        className="flex-shrink-0 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600"
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
                              className="w-1 bg-cyan-500 rounded-full"
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
            className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-cyan-600 to-teal-500 text-white p-4 z-50 shadow-2xl"
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
                    alt={`Gallery image ${selectedMedia.id}`}
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
