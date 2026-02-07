import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import styles from './page.module.css'
import * as LucideIcons from 'lucide-react'

// Helper component to render dynamic icons
const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  const Icon = (LucideIcons as any)[name]
  return Icon ? <Icon className={className} /> : null
}

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
          <LucideIcons.ArrowLeft size={18} />
          Все курсы
        </Link>
      </nav>

      <header 
        className={styles.header}
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.95)), url('/assets/courses/${course.slug}.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className={styles.iconWrapper}>
          <DynamicIcon name={course.icon || 'Code2'} className={styles.icon} />
        </div>
        <h1>{course.title}</h1>
        <p>{course.description}</p>
      </header>

      <section className={styles.lessons}>
        <h2>
          <LucideIcons.List size={24} />
          Уроки
        </h2>
        <div className={styles.lessonList}>
          {course.lessons.map((lesson, index) => (
            <Link
              key={lesson.id}
              href={`/course/${slug}/${lesson.slug}`}
              className={styles.lessonCard}
            >
              <span className={styles.lessonNumber}>{index + 1}</span>
              <span className={styles.lessonTitle}>{lesson.title}</span>
              <LucideIcons.ArrowRight className={styles.arrow} size={20} />
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
