import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownProps {
  children: string;
  className?: string;
}

/**
 * Renders trusted Markdown content (compliance guides) with GitHub-flavored
 * markdown support and Tailwind typography styling.
 *
 * Internal cross-reference links use `(#)` as a placeholder href; we render
 * those as emphasized text rather than anchors so they don't jump the page.
 */
export function Markdown({ children, className }: MarkdownProps) {
  return (
    <div
      className={cn(
        "prose prose-sm max-w-none dark:prose-invert",
        "prose-headings:font-semibold prose-headings:tracking-tight",
        "prose-h2:text-lg prose-h2:mt-0 prose-h3:text-base",
        "prose-a:text-primary prose-table:text-sm",
        "prose-blockquote:border-l-primary prose-blockquote:not-italic",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) =>
            href === "#" ? (
              <strong className="font-medium text-foreground">
                {children}
              </strong>
            ) : (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
