import React, { useEffect } from "react";

import Markdown from "react-markdown";

import BackButton from "@/components/BackButton/BackButton";
import instagramSyncTerms from "@/constants/instagramSyncTerms.mdx?raw";
import { ROUTES } from "@/constants/routes";

const About: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const handleLinkClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  const markdownContent = instagramSyncTerms.replace(
    /^---\n[\s\S]*?---\n\n/,
    ""
  );

  const markdownComponents = {
    h1: ({
      node: _node,
      children,
      ...props
    }: {
      node?: unknown;
      children?: React.ReactNode;
    }) => (
      <div className="mb-10 md:mb-12" {...props}>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 flex items-center gap-3">
          {children}
        </h1>
        <div className="mt-4 h-1 w-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></div>
      </div>
    ),
    h2: ({
      node: _node,
      children,
      ...props
    }: {
      node?: unknown;
      children?: React.ReactNode;
    }) => {
      // Children already contains the icon from markdown, so we just render it
      return (
        <div className="mt-12 md:mt-14 mb-6 md:mb-8 scroll-mt-20" {...props}>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700">
              {children}
            </span>
          </h2>
          <div className="mt-2 h-0.5 w-12 bg-gradient-to-r from-teal-400 to-cyan-400"></div>
        </div>
      );
    },
    p: ({
      node: _node,
      children,
      ...props
    }: {
      node?: unknown;
      children?: React.ReactNode;
    }) => (
      <p
        className="text-base md:text-lg text-slate-600 leading-relaxed mb-4 md:mb-6"
        {...props}
      >
        {children}
      </p>
    ),
    ul: ({
      node: _node,
      children,
      ...props
    }: {
      node?: unknown;
      children?: React.ReactNode;
    }) => (
      <ul
        className="list-disc pl-6 space-y-3 md:space-y-4 mb-6 md:mb-8 text-slate-700"
        {...props}
      >
        {children}
      </ul>
    ),
    ol: ({
      node: _node,
      children,
      ...props
    }: {
      node?: unknown;
      children?: React.ReactNode;
    }) => (
      <ol
        className="list-decimal pl-6 space-y-3 md:space-y-4 mb-6 md:mb-8 text-slate-700"
        {...props}
      >
        {children}
      </ol>
    ),
    li: ({
      node: _node,
      children,
      ...props
    }: {
      node?: unknown;
      children?: React.ReactNode;
    }) => (
      <li className="leading-relaxed text-base md:text-lg" {...props}>
        {children}
      </li>
    ),
    strong: ({
      node: _node,
      children,
      ...props
    }: {
      node?: unknown;
      children?: React.ReactNode;
    }) => (
      <strong
        className="font-bold text-slate-900 bg-yellow-50 px-1.5 py-0.5 rounded"
        {...props}
      >
        {children}
      </strong>
    ),
    em: ({
      node: _node,
      children,
      ...props
    }: {
      node?: unknown;
      children?: React.ReactNode;
    }) => (
      <em className="italic text-slate-700 font-medium" {...props}>
        {children}
      </em>
    ),
    hr: ({ node: _node, ...props }: { node?: unknown }) => (
      <div className="my-8 md:my-10" {...props}>
        <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
      </div>
    ),
    blockquote: ({
      node: _node,
      children,
      ...props
    }: {
      node?: unknown;
      children?: React.ReactNode;
    }) => (
      <blockquote
        className="border-l-4 border-teal-500 pl-4 md:pl-6 italic text-slate-700 my-6 md:my-8 bg-slate-50 py-4 md:py-6 rounded-r-lg"
        {...props}
      >
        {children}
      </blockquote>
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full opacity-20 blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-100 to-teal-100 rounded-full opacity-20 blur-3xl -z-10"></div>
      </div>

      <div className="relative w-full px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-screen-2xl mx-auto">
          <div className="mb-6 md:mb-8">
            <BackButton
              to={ROUTES.INSTAGRAM_SYNC}
              text="Quay lại trang đồng bộ"
              onClick={handleLinkClick}
            />
          </div>

          <article className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-slate-200 p-8 md:p-10 lg:p-12">
            <div className="prose prose-lg max-w-none">
              <Markdown components={markdownComponents}>
                {markdownContent}
              </Markdown>
            </div>

            <div className="mt-12 md:mt-14 pt-8 border-t border-slate-200">
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 md:p-8 border border-teal-200">
                <p className="text-slate-700 text-sm md:text-base mb-4">
                  Nếu có thắc mắc, liên hệ với chúng tôi:
                </p>
                <a
                  href="mailto:support@pincap.app"
                  className="inline-block bg-gradient-to-r from-teal-500 to-cyan-500 !text-white font-semibold px-6 md:px-8 py-3 md:py-4 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-base md:text-lg"
                >
                  hggnomm.dev@gmail.com
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default About;
