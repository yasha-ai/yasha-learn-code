import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import styles from './page.module.css'

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
          <span className={styles.logo}>⚡</span>
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
          >
            <span className={styles.icon}>{course.icon}</span>
            <div className={styles.cardContent}>
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <span className={styles.lessonCount}>
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
