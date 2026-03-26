import React from "react";

/* ================================================= */
/* DATA FOR TESTIMONIALS & BLOGS                     */
/* ================================================= */

const testimonials = [
  {
    name: "Sarah Jenkins",
    quote: "Absolutely breathtaking experience in the Masai Mara! The guides were incredibly knowledgeable and made us feel safe the entire time.",
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    name: "The Miller Family",
    quote: "Afribide tailored our trip perfectly. The luxury lodges and the wildlife viewing exceeded all our expectations.",
    avatar: "https://i.pravatar.cc/150?img=11",
  },
  {
    name: "David & Emma",
    quote: "A seamless and unforgettable honeymoon in the Serengeti. From the hot air balloon ride to the sunset drives, highly recommend!",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
];

const blogs = [
  {
    title: "What to Pack for Your First Safari",
    excerpt: "Essential gear, clothing tips, and camera equipment to make your African adventure comfortable and memorable.",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=400&h=250",
  },
  {
    title: "The Great Migration Explained",
    excerpt: "Everything you need to know about the greatest wildlife spectacle on earth, including the best times and places to visit.",
    image: "https://images.unsplash.com/photo-1547471080-7fc2caa7df36?auto=format&fit=crop&q=80&w=400&h=250",
  },
  {
    title: "Top 5 Luxury Lodges in Kenya",
    excerpt: "Experience the untamed wild without sacrificing an ounce of comfort at these stunning, eco-friendly luxury locations.",
    image: "https://images.unsplash.com/photo-1518182170546-076616fd4625?auto=format&fit=crop&q=80&w=400&h=250",
  },
];

/* ================================================= */
/* MAIN COMPONENT                                    */
/* ================================================= */

const TestimonialsBlogs = () => {
  return (
    <section className="min-h-screen bg-[#dadada] py-20 font-sans text-black">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Centered Bordered Header */}
        <div className="flex justify-center mb-20">
          <h1 className="border-[3px] border-black px-6 py-2 text-3xl md:text-4xl font-bold tracking-widest bg-transparent text-center uppercase">
            Testimonials & Blogs
          </h1>
        </div>

        {/* ------------------------------------------- */}
        {/* TESTIMONIALS SECTION                        */}
        {/* ------------------------------------------- */}
        <div className="mb-24">
          <h2 className="text-xl md:text-2xl font-bold mb-10 tracking-wide uppercase text-center md:text-left">
            What Our Guests Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center text-center bg-white/40 p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="w-20 h-20 mb-6 rounded-full overflow-hidden border-2 border-black">
                  <img 
                    src={testimonial.avatar} 
                    alt={`${testimonial.name}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="italic text-gray-800 mb-6 flex-grow">
                  "{testimonial.quote}"
                </p>
                <span className="text-sm font-bold uppercase tracking-wider">
                  - {testimonial.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ------------------------------------------- */}
        {/* BLOGS SECTION                               */}
        {/* ------------------------------------------- */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-10 tracking-wide uppercase text-center md:text-left">
            Travel Guides & Stories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <div 
                key={index} 
                className="flex flex-col group cursor-pointer hover:-translate-y-2 transition-transform duration-300 bg-white/40 rounded-2xl overflow-hidden"
              >
                <div className="w-full h-48 overflow-hidden">
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold mb-3 leading-tight">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-700 mb-6 flex-grow">
                    {blog.excerpt}
                  </p>
                  <span className="text-sm font-bold border-b-2 border-black self-start pb-1">
                    Read More
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default TestimonialsBlogs;