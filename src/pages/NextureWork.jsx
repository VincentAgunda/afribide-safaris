import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
  useMemo,
} from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react"

/* ------------------ Animation ------------------ */

const spring = {
  type: "spring",
  stiffness: 260,
  damping: 28,
  mass: 0.8,
}

const easing = [0.16, 1, 0.3, 1]

/* ------------------ Card Styles ------------------ */

const cardColors = [
  { bg: "#000000", text: "text-white", button: "light" },
  { bg: "#F5F5F7", text: "text-black", button: "dark" },
  { bg: "#979797", text: "text-white", button: "light" },
  { bg: "#FAFAFA", text: "text-black", button: "dark" },
]

const portfolio = [
 {
  id: 1,
  title: "Tax Act",
  category: "FinTech",
  image: "/website1.png",
  description:
    "A smart tax management and comparison platform that simplifies filing, analyzes tax options, and helps users make informed financial decisions with clarity and confidence.",
  link: "https://tax-act.vercel.app/",
  ...cardColors[0],
},
  {
  id: 2,
  title: "MatchPass",
  category: "Sports Tech",
  image: "/football.png",
  description:
    "An online football ticketing system that enables fans to browse fixtures, select seats in real-time, and securely purchase match tickets through a seamless digital platform.",
  link: "https://ticketmasters.vercel.app/",
  ...cardColors[1],
},
  {
  id: 3,
  title: "Echelon Store",
  category: "E-Commerce",
  image: "/ecommerce.png",
  description:
    "A modern e-commerce platform designed for seamless product browsing, secure online payments, and a smooth shopping experience across all devices.",
  link: "https://echelon-ecommerce-platform.onrender.com/",
  ...cardColors[2],
},
  {
  id: 4,
  title: "Alumni Website",
  category: "Education",
  image: "/alumni.png",
  description:
    "A modern alumni engagement platform designed to connect graduates, share updates, manage events, and strengthen community networks.",
  link: "https://katcherian.com/",
  ...cardColors[3],
},
]

/* ===========================
   Modal (Shared Layout)
=========================== */

const PortfolioModal = ({ item, onClose }) => {
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
        className="absolute inset-0 bg-black/50 backdrop-blur-xl"
      />

      {/* Shared Layout Container */}
      <motion.div
        layoutId={`card-${item.id}`}
        transition={spring}
        className="relative z-10 w-full max-w-2xl rounded-[32px] overflow-hidden
                   shadow-[0_40px_120px_rgba(0,0,0,0.25)] bg-white"
      >
        <motion.button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full
                     bg-black/5 backdrop-blur-md
                     flex items-center justify-center hover:bg-black/10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <X size={18} />
        </motion.button>

        {/* Shared Image */}
        <motion.div
          layoutId={`image-${item.id}`}
          className="h-[320px] flex items-end justify-center"
          style={{ backgroundColor: item.bg }}
        >
          <img
            src={item.image}
            alt={item.title}
            className="h-full object-contain object-bottom"
          />
        </motion.div>

        <div className="p-10">
          <p className="text-sm text-gray-500 mb-2">{item.category}</p>
          <h3 className="text-3xl font-semibold mb-4 tracking-tight">
            {item.title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {item.description}
          </p>

          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 text-sm font-medium underline"
          >
            View Project →
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ===========================
   Main Component
=========================== */

const NextureWork = () => {
  const carouselRef = useRef(null)
  const [active, setActive] = useState(0)
  const [selectedItem, setSelectedItem] = useState(null)
  const cardRefs = useRef([])

  /* ---------------------------
     Precise Scroll Logic
  --------------------------- */

  const scrollToIndex = useCallback((index) => {
    const container = carouselRef.current
    const card = cardRefs.current[index]
    if (!container || !card) return

    container.scrollTo({
      left: card.offsetLeft,
      behavior: "smooth",
    })
  }, [])

  /* ---------------------------
     Active Index Detection
  --------------------------- */

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

  const handlePrev = () =>
    scrollToIndex(Math.max(0, active - 1))

  const handleNext = () =>
    scrollToIndex(Math.min(portfolio.length - 1, active + 1))

  return (
    <section className="py-24 sm:py-32 bg-[#f5f5f7]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">

        <h2 className="text-5xl font-semibold text-black text-center mb-24 tracking-tight">
          Recent Projects.
        </h2>

        <div className="relative">
          <div
            ref={carouselRef}
            className="overflow-x-auto scrollbar-none snap-x snap-mandatory
                       grid grid-flow-col
                       auto-cols-[85%] sm:auto-cols-[420px] lg:auto-cols-[380px]
                       gap-8"
          >
            {portfolio.map((item, i) => (
              <motion.div
                key={item.id}
                ref={(el) => (cardRefs.current[i] = el)}
                layoutId={`card-${item.id}`}
                whileHover={{ y: -10 }}
                transition={spring}
                onClick={() => setSelectedItem(item)}
                className="snap-start relative rounded-[28px]
                           h-[460px] group cursor-pointer
                           shadow-[0_10px_40px_rgba(0,0,0,0.08)]
                           hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)]
                           transition-shadow duration-500"
                style={{ backgroundColor: item.bg }}
              >
                <div className={`p-8 relative z-10 ${item.text}`}>
                  <p className="text-sm opacity-80 mb-2">
                    {item.category}
                  </p>
                  <h3 className="text-2xl font-semibold tracking-tight">
                    {item.title}
                  </h3>
                </div>

                <motion.div
                  layoutId={`image-${item.id}`}
                  className="absolute inset-x-0 bottom-0 h-4/5 pointer-events-none"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain object-bottom"
                  />
                </motion.div>

                <motion.button
                  className={`absolute bottom-8 right-8 w-11 h-11 rounded-full
                    flex items-center justify-center shadow-xl
                    opacity-0 group-hover:opacity-100 transition
                    ${
                      item.button === "dark"
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    }`}
                >
                  <Plus size={20} strokeWidth={3} />
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center mt-14">
            <button
              onClick={handlePrev}
              className="w-11 h-11 rounded-full bg-white shadow-md
                         flex items-center justify-center hover:shadow-lg"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex space-x-3">
              {portfolio.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === active
                      ? "w-7 bg-black"
                      : "w-2.5 bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-11 h-11 rounded-full bg-white shadow-md
                         flex items-center justify-center hover:shadow-lg"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <PortfolioModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

export default NextureWork