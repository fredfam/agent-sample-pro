import React, { useEffect, useState } from 'react';
import { MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';

declare global {
  interface Window {
    disqus_config?: (this: { page: { url: string; identifier: string } }) => void;
    DISQUS?: {
      reset: (options: { reload: boolean; config?: (this: { page: { url: string; identifier: string } }) => void }) => void;
    };
  }
}

export const DisqusComments: React.FC = () => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadDisqus = () => {
    setHasError(false);
    setIsLoading(true);

    // Set global disqus_config before script invocation
    window.disqus_config = function (this: { page: { url: string; identifier: string } }) {
      this.page.url = window.location.href;
      this.page.identifier = 'smu-agentic-precision-markets-landing';
    };

    const container = document.getElementById('disqus_thread');
    if (!container) return;

    const existingEmbedScript = document.getElementById('disqus-embed-script');

    if (!existingEmbedScript) {
      const s = document.createElement('script');
      s.id = 'disqus-embed-script';
      s.src = 'https://smuagentic.disqus.com/embed.js';
      s.setAttribute('data-timestamp', (+new Date()).toString());
      s.async = true;

      s.onload = () => {
        setIsLoading(false);
      };

      s.onerror = () => {
        setIsLoading(false);
        setHasError(true);
      };

      (document.head || document.body).appendChild(s);
    } else if (window.DISQUS) {
      try {
        window.DISQUS.reset({
          reload: true,
          config: function (this: { page: { url: string; identifier: string } }) {
            this.page.url = window.location.href;
            this.page.identifier = 'smu-agentic-precision-markets-landing';
          }
        });
        setIsLoading(false);
      } catch (err) {
        console.warn('Disqus reset warning:', err);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }

    // Ensure count script is loaded
    const existingCountScript = document.getElementById('dsq-count-scr');
    if (!existingCountScript) {
      const cs = document.createElement('script');
      cs.id = 'dsq-count-scr';
      cs.src = 'https://smuagentic.disqus.com/count.js';
      cs.async = true;
      (document.head || document.body).appendChild(cs);
    }
  };

  useEffect(() => {
    loadDisqus();
  }, []);

  return (
    <section className="w-full bg-white dark:bg-[#0d1117] border-t border-gray-200 dark:border-gray-800/80 transition-colors py-8 pb-28 mt-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#2962ff]" />
            <h2 className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight">
              Community Discussions & Forum
            </h2>
          </div>
          <a
            href="#disqus_thread"
            className="disqus-comment-count text-xs font-bold bg-[#2962ff]/10 text-[#2962ff] px-2.5 py-1 rounded-full border border-[#2962ff]/20 hover:bg-[#2962ff]/20 transition-colors"
          >
            Comments
          </a>
        </div>

        {/* Disqus Embed Container */}
        <div id="disqus_thread" className="min-h-[220px] relative">
          {isLoading && (
            <div className="flex items-center justify-center gap-2 py-10 text-xs font-semibold text-gray-500 dark:text-gray-400">
              <RefreshCw className="w-4 h-4 animate-spin text-[#2962ff]" />
              <span>Loading Disqus community forum...</span>
            </div>
          )}

          {hasError && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 text-center my-4">
              <AlertCircle className="w-6 h-6 text-amber-500 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Unable to load Disqus forum directly
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-3">
                This can happen if browser tracking protection or an ad-blocker is active in your preview environment.
              </p>
              <button
                onClick={loadDisqus}
                className="inline-flex items-center gap-1.5 bg-[#2962ff] hover:bg-blue-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs transition-all shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Loading Forum</span>
              </button>
            </div>
          )}
        </div>

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
