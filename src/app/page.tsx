import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import styles from './page.module.css'
import * as LucideIcons from 'lucide-react'

// Helper component to render dynamic icons
const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  const Icon = (LucideIcons as any)[name]
  return Icon ? <Icon className={className} /> : null
}

export const dynamic = 'force-dynamic'

export default async function Home() {
  const courses = await prisma.course.findMany({
    orderBy: { order: 'asc' },
    include: {
      _count: {
        select: { lessons: true }
      }
    }
  })

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <LucideIcons.Zap className={styles.logo} />
          Learn Code
        </h1>
        <p className={styles.subtitle}>
          Изучай программирование. От нуля до про.
        </p>
      </header>

      <section className={styles.courses}>
        {courses.map((course) => (
          <Link 
            key={course.id} 
            href={`/course/${course.slug}`}
            className={styles.card}
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.95)), url('/assets/courses/${course.slug}.webp')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className={styles.iconWrapper}>
              <DynamicIcon name={course.icon || 'Code2'} className={styles.icon} />
            </div>
            <div className={styles.cardContent}>
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <span className={styles.lessonCount}>
                <LucideIcons.BookOpen size={16} style={{marginRight: '6px'}} />
                {course._count.lessons} урок{course._count.lessons === 1 ? '' : course._count.lessons < 5 ? 'а' : 'ов'}
              </span>
            </div>
          </Link>
        ))}
      </section>

      <footer className={styles.footer}>
        <p>
          Создано с 💜 от <a href="https://github.com/yasha-ai" target="_blank" rel="noopener">Яши</a>
        </p>
      </footer>
    </main>
  )
}
