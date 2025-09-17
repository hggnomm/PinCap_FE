import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Sparkles, ImageIcon, Video, Zap } from "lucide-react"
import { useRef } from "react"
import videoPinCapAI from "../../assets/videos/VideoPinCapAI.mp4"
import { ROUTES } from "../../constants/routes"
import { useNavigate } from "react-router-dom"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const floatingAnimation = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
}

export default function Home() {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <div ref={containerRef} className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <motion.div className="absolute inset-0 z-0" style={{ y, opacity }}>
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source
              src={videoPinCapAI}
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-black/80" />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          className="relative z-20 text-center px-4 max-w-4xl gap-10 mx-auto flex flex-col items-center justify-center h-full"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={floatingAnimation} animate="animate" className="mb-6">
            <Sparkles className="w-16 h-16 mx-auto text-pink-400 mb-4" />
          </motion.div>

          <motion.h1 variants={fadeInUp} className="w-[1000px] text-3xl md:text-4xl lg:text-6xl font-bold mb-6 text-balance">
            <span className="text-white">Khám phá những nội dung đa dạng và độc đáo tại PinCap</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-gray-100 mb-8 text-pretty max-w-2xl mx-auto"
          >
            Khả năng chỉnh sửa linh hoạt, công cụ AI diệu kỳ
          </motion.p>

          <motion.div variants={fadeInUp}>
            <button onClick={() => navigate(ROUTES.LOGIN)} className="!bg-rose-600 hover:!bg-rose-700 !text-white !px-8 !py-4 !text-lg !rounded-full !transition-all !duration-300 hover:!scale-105 hover:!shadow-lg !inline-flex !items-center !cursor-pointer">
              Khám phá ngay
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Image Discovery Section */}
      <section className="!py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid lg:grid-cols-2 gap-12 items-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="order-2 lg:order-1">
              <div className="relative flex justify-center items-center">
                <img
                  src="/beautiful-pinterest-style-image-collage-with-creat.jpg"
                  alt="Image Discovery"
                  className="rounded-2xl shadow-2xl w-full mx-auto lg:mx-0"
                />
                <motion.div
                  className="absolute -top-4 -right-4 bg-rose-100 text-rose-600 !p-3 rounded-full shadow-lg"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <ImageIcon className="size-10" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="order-1 lg:order-2 !space-y-20">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-balance">
                Tìm kiếm các ý tưởng từ những hình ảnh
              </h2>
              <p className="text-lg text-gray-600 text-pretty leading-relaxed">
                Khám phá và khơi nguồn cảm hứng từ thế giới xung quanh thông qua việc tìm kiếm ý tưởng từ những hình ảnh
                tuyệt vời.
              </p>
              <button className="!border-2 !border-rose-600 !text-rose-600 hover:!bg-rose-600 hover:!text-white hover:!font-semibold !transition-all !duration-300 !rounded-full !px-8 !py-3 !bg-transparent !inline-flex !items-center">
                Khám phá
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Video Discovery Section */}
      <section className="!py-20 bg-gradient-to-br from-rose-600 to-pink-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="!grid lg:grid-cols-2 !h-full !gap-12 items-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="!space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance">
                Tìm kiếm các ý tưởng từ những video
              </h2>
              <p className="text-lg text-white/90 text-pretty leading-relaxed">
                Khám phá nguồn cảm hứng không giới hạn từ các video đa dạng trên mạng, để tạo ra những ý tưởng mới và
                sáng tạo.
              </p>
              <button className="!bg-white !text-rose-600 hover:!font-semibold hover:!bg-white/90 !transition-all !duration-300 !rounded-full !px-8 !py-3 !inline-flex !items-center">
                Khám phá
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </motion.div>

             <motion.div variants={fadeInUp} className="relative flex justify-center items-center">
               <div className="grid grid-cols-2 !gap-6 max-w-lg mx-auto">
                <motion.div className="relative" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="rounded-lg shadow-md w-full aspect-square object-cover"
                  >
                    <source
                      src={videoPinCapAI}
                      type="video/mp4"
                    />
                  </video>
                </motion.div>
                <motion.div className="relative mt-4" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="rounded-lg size-fit shadow-md w-full aspect-square object-cover"
                  >
                    <source
                      src={videoPinCapAI}
                      type="video/mp4"
                    />
                  </video>
                </motion.div>
              </div>
              <motion.div
                className="absolute -bottom-4 left-18 bg-white text-rose-600 !p-3 rounded-full shadow-lg"
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Video className="size-8" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container flex flex-col items-center justify-center gap-20 mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance">
              Công cụ AI{" "}
              <span className="bg-gradient-to-r from-rose-700 via-pink-500 to-rose-700 bg-clip-text text-transparent">
                diệu kỳ
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
              Trải nghiệm sức mạnh của trí tuệ nhân tạo trong việc chỉnh sửa và tạo nội dung
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                icon: Sparkles,
                title: "AI Chỉnh sửa thông minh",
                description: "Tự động cải thiện chất lượng hình ảnh và video với công nghệ AI tiên tiến",
              },
              {
                icon: ImageIcon,
                title: "Tìm kiếm trực quan",
                description: "Khám phá nội dung thông qua tìm kiếm bằng hình ảnh và nhận diện thông minh",
              },
              {
                icon: Zap,
                title: "Xử lý nhanh chóng",
                description: "Tốc độ xử lý siêu nhanh giúp bạn tiết kiệm thời gian và nâng cao hiệu suất",
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <div className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border border-gray-200 rounded-lg bg-white">
                  <div className="!p-8 text-center">
                    <motion.div className="mb-6" whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.3 }}>
                      <feature.icon className="w-12 h-12 mx-auto text-rose-600" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-rose-600 text-white">
        <div className="container mx-auto !px-4 text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto flex flex-col items-center justify-center gap-10"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white text-balance"
            >
              Sẵn sàng khám phá thế giới sáng tạo?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-white mb-8 text-pretty">
              Tham gia cùng hàng triệu người dùng đang tìm kiếm cảm hứng mỗi ngày
            </motion.p>
            <motion.div variants={fadeInUp}>
              <button className="!bg-white !text-rose-600 hover:!bg-white/90 !px-12 !py-4 !text-lg !rounded-full !transition-all !duration-300 hover:!scale-105 hover:!shadow-xl !inline-flex !items-center">
                Bắt đầu miễn phí
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
