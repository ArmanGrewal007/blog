import { Link } from "react-router-dom";
import { useState } from "react";

function BlogCard({ title, date, to, image }) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Construct iframe URL correctly considering the base URL and HashRouter
  const baseUrl = import.meta.env.BASE_URL || "/";
  const cleanTo = to.startsWith("/") ? to.slice(1) : to;
  const iframeSrc = `${baseUrl}#/${cleanTo}`;

  // Format date correctly
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
    : "";

  return (
    <div
      className="group relative flex flex-col aspect-square rounded-[2rem] overflow-hidden bg-white/50 backdrop-blur-xl border border-gray-200/50 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ease-out cursor-pointer"
    >
      <Link to={to} className="flex-1 block h-full relative">
        {/* Full Card Media Section */}
        <div className="absolute inset-0 w-full h-full bg-[#FCF8EE]">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            // Direct Iframe Preview carefully scaled
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">

              {/* Skeleton Loader */}
              <div
                className={`absolute inset-0 bg-gray-100 flex flex-col p-8 transition-opacity duration-500 ${iframeLoaded ? 'opacity-0 z-0' : 'opacity-100 z-10'} animate-pulse`}
              >
                <h3 className="text-2xl font-bold text-gray-400 mb-6 w-5/6 leading-tight">{title}</h3>
                <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>

              <iframe
                src={iframeSrc}
                title={`Preview of ${title}`}
                onLoad={() => setIframeLoaded(true)}
                className={`absolute top-0 left-0 transition-opacity duration-700 ${iframeLoaded ? 'opacity-90 group-hover:opacity-100' : 'opacity-0'}`}
                style={{
                  width: "250%",
                  height: "250%",
                  transformOrigin: "top left",
                  transform: "scale(0.4)", // 1 / 2.5 = 0.4, perfectly fits the container
                  border: "none",
                }}
                tabIndex={-1}
              />
            </div>
          )}

          {/* Overlay gradient to ensure button readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
        </div>

        {/* Floating Date Badge */}
        {formattedDate && (
          <div className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-gray-800 shadow-sm border border-gray-100/50 transition-transform duration-500 group-hover:scale-105">
            {formattedDate}
          </div>
        )}

        {/* Bottom Read Article Button Area */}
        <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col items-start justify-end z-20">
          <span className="sr-only">{title}</span>

          <div className="w-full flex justify-between items-center">
            <div className="text-white bg-black/40 backdrop-blur-md px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase flex items-center border border-white/20 transition-all duration-500 group-hover:bg-blue-600 group-hover:border-blue-500 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              Read Article
              <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default BlogCard;
