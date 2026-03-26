import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Plus, X, ImageIcon } from "lucide-react"

/* ------------------ Animation ------------------ */

const spring = {
  type: "spring",
  stiffness: 260,
  damping: 28,
  mass: 0.8,
}

/* ------------------ Card Styles & Data ------------------ */

const cardColors = [
  { bg: "#000000", text: "text-white", button: "light" },
  { bg: "#F5F5F7", text: "text-black", button: "dark" },
  { bg: "#2C3E50", text: "text-white", button: "light" },
  { bg: "#FAFAFA", text: "text-black", button: "dark" },
]

// Helper to generate 10 placeholder images for the galleries
const generateGallery = (seed) => 
  Array.from({ length: 10 }).map((_, i) => `https://picsum.photos/seed/${seed}${i}/800/600`)

const safaris = [
  {
    id: 1,
    title: "Masai Mara Migration",
    category: "Kenya • 5 Days",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800",
    description: "Witness the greatest wildlife spectacle on earth. Our guided tours take you deep into the heart of the Masai Mara to track the great wildebeest migration.",
    gallery: generateGallery("mara"),
    ...cardColors[0],
  },
  {
    id: 2,
    title: "Serengeti Expedition",
    category: "Tanzania • 7 Days",
    image: "https://images.unsplash.com/photo-1517584400583-b54199c9c4c7?auto=format&fit=crop&q=80&w=800",
    description: "Explore the endless plains of the Serengeti. Home to the Big Five, this safari offers unparalleled opportunities for wildlife photography and luxury camping.",
    gallery: generateGallery("serengeti"),
    ...cardColors[1],
  },
  {
    id: 3,
    title: "Okavango Delta",
    category: "Botswana • 4 Days",
    image: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&q=80&w=800",
    description: "Navigate the winding waterways of the Okavango Delta by mokoro (traditional canoe). A unique wetland ecosystem teeming with birds, elephants, and hippos.",
    gallery: generateGallery("delta"),
    ...cardColors[2],
  },
  {
    id: 4,
    title: "Kruger National Park",
    category: "South Africa • 6 Days",
    image: "https://images.unsplash.com/photo-1601259974268-360341764bc5?auto=format&fit=crop&q=80&w=800",
    description: "A premier self-drive or guided safari destination. Kruger offers incredible biodiversity, excellent infrastructure, and guaranteed up-close wildlife encounters.",
    gallery: generateGallery("kruger"),
    ...cardColors[3],
  },
]

/* ===========================
   Modal (Gallery Expansion)
=========================== */

const SafariModal = ({ item, onClose }) => {
  const [showGallery, setShowGallery] = useState(false)

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => (document.body.style.overflow = "")
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div
        layoutId={`card-${item.id}`}
        transition={spring}
        className="relative z-10 w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[32px] overflow-hidden shadow-2xl bg-white"
      >
        {/* Close Button */}
        <motion.button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full
                     bg-black/20 backdrop-blur-md text-white
                     flex items-center justify-center hover:bg-black/40 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <X size={20} />
        </motion.button>

        {/* Scrollable Body */}
        <div className="overflow-y-auto w-full h-full pb-12 custom-scrollbar">
          {/* Main Cover Image */}
          <motion.div
            layoutId={`image-${item.id}`}
            className="h-[350px] sm:h-[450px] w-full relative"
            style={{ backgroundColor: item.bg }}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay for text readability if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </motion.div>

          {/* Content Area */}
          <div className="px-8 sm:px-12 pt-10">
            <p className="text-sm font-semibold tracking-wide text-gray-500 uppercase mb-2">
              {item.category}
            </p>
            <h3 className="text-4xl font-bold mb-4 tracking-tight text-gray-900">
              {item.title}
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
              {item.description}
            </p>

            {/* Toggle Gallery Button */}
            {!showGallery && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setShowGallery(true)}
                className="mt-8 flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                <ImageIcon size={18} />
                View More Images
              </motion.button>
            )}

            {/* Expanded 10-Image Gallery Grid */}
            <AnimatePresence>
              {showGallery && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-10"
                >
                  <h4 className="text-2xl font-semibold mb-6">Gallery ({item.gallery.length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {item.gallery.map((imgUrl, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="aspect-square rounded-2xl overflow-hidden bg-gray-100"
                      >
                        <img 
                          src={imgUrl} 
                          alt={`${item.title} gallery ${idx + 1}`} 
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ===========================
   Main Gallery Component
=========================== */

const SafariGalleryPage = () => {
  const carouselRef = useRef(null)
  const [active, setActive] = useState(0)
  const [selectedItem, setSelectedItem] = useState(null)
  const cardRefs = useRef([])

  /* --- Precise Scroll Logic --- */
  const scrollToIndex = useCallback((index) => {
    const container = carouselRef.current
    const card = cardRefs.current[index]
    if (!container || !card) return

    container.scrollTo({
      left: card.offsetLeft,
      behavior: "smooth",
    })
  }, [])

  /* --- Active Index Detection --- */
  useEffect(() => {
    const container = carouselRef.current
    if (!container) return

    let raf

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const scrollLeft = container.scrollLeft

        let closestIndex = 0
        let minDistance = Infinity

        cardRefs.current.forEach((card, i) => {
          if(!card) return;
          const distance = Math.abs(card.offsetLeft - scrollLeft)
          if (distance < minDistance) {
            minDistance = distance
            closestIndex = i
          }
        })

        setActive(closestIndex)
      })
    }

    container.addEventListener("scroll", onScroll, { passive: true })
    return () => container.removeEventListener("scroll", onScroll)
  }, [])

  const handlePrev = () => scrollToIndex(Math.max(0, active - 1))
  const handleNext = () => scrollToIndex(Math.min(safaris.length - 1, active + 1))

  return (
    <section className="py-24 sm:py-32 bg-[#f5f5f7] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">

        <h2 className="text-5xl font-semibold text-black text-center mb-24 tracking-tight">
          Explore Our Safaris.
        </h2>

        <div className="relative">
          <div
            ref={carouselRef}
            className="overflow-x-auto scrollbar-none snap-x snap-mandatory
                       grid grid-flow-col
                       auto-cols-[85%] sm:auto-cols-[420px] lg:auto-cols-[380px]
                       gap-8 pb-8"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {safaris.map((item, i) => (
              <motion.div
                key={item.id}
                ref={(el) => (cardRefs.current[i] = el)}
                layoutId={`card-${item.id}`}
                whileHover={{ y: -10 }}
                transition={spring}
                onClick={() => setSelectedItem(item)}
                className="snap-start relative rounded-[28px]
                           h-[500px] group cursor-pointer overflow-hidden
                           shadow-[0_10px_40px_rgba(0,0,0,0.08)]
                           hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)]
                           transition-shadow duration-500"
                style={{ backgroundColor: item.bg }}
              >
                {/* Text Content */}
                <div className={`p-8 relative z-20 ${item.text} bg-gradient-to-b from-black/60 to-transparent`}>
                  <p className="text-sm font-medium tracking-wide opacity-90 mb-2 uppercase">
                    {item.category}
                  </p>
                  <h3 className="text-3xl font-bold tracking-tight">
                    {item.title}
                  </h3>
                </div>

                {/* Main Card Image */}
                <motion.div
                  layoutId={`image-${item.id}`}
                  className="absolute inset-0 z-10 pointer-events-none"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Hover Button */}
                <motion.button
                  className={`absolute bottom-8 right-8 w-12 h-12 rounded-full z-20
                    flex items-center justify-center shadow-xl
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300
                    ${
                      item.button === "dark"
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    }`}
                >
                  <Plus size={24} strokeWidth={2.5} />
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* Carousel Controls */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full bg-white shadow-md text-black
                         flex items-center justify-center hover:shadow-lg transition-shadow"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Pagination Dots */}
            <div className="flex space-x-3">
              {safaris.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === active
                      ? "w-8 bg-black"
                      : "w-2.5 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-white shadow-md text-black
                         flex items-center justify-center hover:shadow-lg transition-shadow"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Render */}
      <AnimatePresence>
        {selectedItem && (
          <SafariModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

export default SafariGalleryPage