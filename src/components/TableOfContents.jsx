import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const TableOfContents = ({ contentRef }) => {
  const [toc, setToc] = useState([]);
  const [isTocExpanded, setIsTocExpanded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (contentRef.current) {
      const headings = Array.from(contentRef.current.querySelectorAll("h2, h3, h4"));
      const tocItems = headings.map((h, i) => {
        if (!h.id) {
          // Create a clean ID from text
          const id = h.innerText
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "") + "-" + i;
          h.id = id;
        }
        return {
          id: h.id,
          text: h.innerText,
          level: parseInt(h.tagName.substring(1)),
        };
      });
      setToc(tocItems);
    }
  }, [contentRef]);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // offset for sticky headers if any
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      // Update URL hash without jumping, preserving the HashRouter path
      window.history.pushState(null, null, `#${location.pathname}${location.search}#${id}`);
    }
  };

  if (toc.length === 0) return null;

  return (
    <nav className="backdrop-blur-3xl rounded-[2rem] shadow-[0_8px_32px_rgba(251,146,60,0.15)] bg-orange-50/40 border border-orange-200/50 p-4 my-4">
      <button
        onClick={() => setIsTocExpanded(!isTocExpanded)}
        className="w-full flex items-center justify-between p-2 hover:bg-orange-100/30 rounded-xl transition-colors duration-200"
      >
        <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
          Table of Contents
        </h2>
        <motion.svg
          animate={{ rotate: isTocExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </motion.svg>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isTocExpanded ? "auto" : 0,
          opacity: isTocExpanded ? 1 : 0,
          marginTop: isTocExpanded ? 16 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <ul className="space-y-1">
          {toc.map((item) => (
            <li
              key={item.id}
              className={`${item.level === 3 ? "ml-6" : item.level === 4 ? "ml-12" : "ml-0"} group`}
            >
              <a
                href={`#${location.pathname}${location.search}#${item.id}`}
                onClick={(e) => scrollToSection(e, item.id)}
                className="text-slate-600 hover:text-blue-600 transition-colors duration-200 flex items-start gap-2 p-1 rounded-lg hover:bg-blue-50/50"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400">&rarr;</span>
                <span className="text-[15px]">{item.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </motion.div>
    </nav>
  );
};

export default TableOfContents;
