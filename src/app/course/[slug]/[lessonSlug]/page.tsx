import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { prisma } from '@/lib/prisma'
import styles from './page.module.css'

interface Props {
  params: Promise<{ slug: string; lessonSlug: string }>
}

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
        <ReactMarkdown>{lesson.content}</ReactMarkdown>
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

/*
export async function generateStaticParams() {
  const courses = await prisma.course.findMany({
    include: {
      lessons: {
        select: { slug: true }
      }
    }
  })
  
  return courses.flatMap((course) =>
    course.lessons.map((lesson) => ({
      slug: course.slug,
      lessonSlug: lesson.slug,
    }))
  )
}
*/
