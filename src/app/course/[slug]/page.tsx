import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import styles from './page.module.css'

interface Props {
  params: Promise<{ slug: string }>
}

export const dynamic = 'force-dynamic'

export default async function CoursePage({ params }: Props) {
  const { slug } = await params
  
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

  return (
    <main className={styles.main}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.back}>
          ← Все курсы
        </Link>
      </nav>

      <header className={styles.header}>
        <span className={styles.icon}>{course.icon}</span>
        <h1>{course.title}</h1>
        <p>{course.description}</p>
      </header>

      <section className={styles.lessons}>
        <h2>Уроки</h2>
        <div className={styles.lessonList}>
          {course.lessons.map((lesson, index) => (
            <Link
              key={lesson.id}
              href={`/course/${slug}/${lesson.slug}`}
              className={styles.lessonCard}
            >
              <span className={styles.lessonNumber}>{index + 1}</span>
              <span className={styles.lessonTitle}>{lesson.title}</span>
              <span className={styles.arrow}>→</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

/*
export async function generateStaticParams() {
  const courses = await prisma.course.findMany({
    select: { slug: true }
  })
  
  return courses.map((course) => ({
    slug: course.slug,
  }))
}
*/
