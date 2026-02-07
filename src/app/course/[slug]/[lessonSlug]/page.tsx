import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import { prisma } from '@/lib/prisma'
import styles from './page.module.css'

interface Props {
  params: Promise<{ slug: string; lessonSlug: string }>
}

export const dynamic = 'force-dynamic'

export default async function LessonPage({ params }: Props) {
  const { slug, lessonSlug } = await params
  
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      lessons: {
        orderBy: { order: 'asc' }
      }
    }
  })

  if (!course) {
    notFound()
  }

  const currentIndex = course.lessons.findIndex(l => l.slug === lessonSlug)
  const lesson = course.lessons[currentIndex]
  
  if (!lesson) {
    notFound()
  }

  const prevLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null

  return (
    <main className={styles.main}>
      <nav className={styles.nav}>
        <Link href={`/course/${slug}`} className={styles.back}>
          ← {course.title}
        </Link>
        <span className={styles.progress}>
          {currentIndex + 1} / {course.lessons.length}
        </span>
      </nav>

      <article className={styles.content}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({node, inline, className, children, ...props}: any) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }
          }}
        >
          {lesson.content}
        </ReactMarkdown>
      </article>

      <nav className={styles.pagination}>
        {prevLesson ? (
          <Link href={`/course/${slug}/${prevLesson.slug}`} className={styles.prevBtn}>
            ← {prevLesson.title}
          </Link>
        ) : (
          <span />
        )}
        
        {nextLesson ? (
          <Link href={`/course/${slug}/${nextLesson.slug}`} className={styles.nextBtn}>
            {nextLesson.title} →
          </Link>
        ) : (
          <Link href={`/course/${slug}`} className={styles.nextBtn}>
            Завершить курс ✓
          </Link>
        )}
      </nav>
    </main>
  )
}
