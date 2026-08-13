import React, { useEffect } from 'react';
import { MessageSquare } from 'lucide-react';

declare global {
  interface Window {
    DISQUS?: {
      reset: (options: { reload: boolean; config?: () => void }) => void;
    };
  }
}

export const DisqusComments: React.FC = () => {
  useEffect(() => {
    // Check if disqus script is already appended
    const existingScript = document.getElementById('disqus-embed-script');

    if (!existingScript) {
      const d = document;
      const s = d.createElement('script');
      s.id = 'disqus-embed-script';
      s.src = 'https://smuagentic.disqus.com/embed.js';
      s.setAttribute('data-timestamp', (+new Date()).toString());
      (d.head || d.body).appendChild(s);
    } else if (window.DISQUS) {
      window.DISQUS.reset({
        reload: true
      });
    }
  }, []);

  return (
    <section className="w-full bg-white dark:bg-[#0d1117] border-t border-gray-200 dark:border-gray-800/80 transition-colors py-8 pb-28">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-6 pb-3 border-b border-gray-200 dark:border-gray-800">
          <MessageSquare className="w-5 h-5 text-[#2962ff]" />
          <h2 className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight">
            Community Discussions & Analysis
          </h2>
        </div>

        {/* Disqus Embed Container */}
        <div id="disqus_thread" className="min-h-[200px]" />

        <noscript>
          Please enable JavaScript to view the{' '}
          <a href="https://disqus.com/?ref_noscript" target="_blank" rel="noopener noreferrer" className="text-[#2962ff] underline">
            comments powered by Disqus.
          </a>
        </noscript>
      </div>
    </section>
  );
};
