import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'yasha-ai';
const REPO_NAME = 'yasha-learn-code';

export async function POST(req: NextRequest) {
  try {
    const { type, description, url, userAgent } = await req.json();

    if (!description || description.trim().length < 10) {
      return NextResponse.json(
        { error: 'Описание должно быть не менее 10 символов' },
        { status: 400 }
      );
    }

    // Build issue body
    const issueBody = `
**Тип проблемы:** ${type || 'Не указан'}

**Описание:**
${description}

---
**Метаданные:**
- URL: ${url || 'Не указан'}
- User Agent: ${userAgent || 'Неизвестен'}
- Создано: ${new Date().toISOString()}
`;

    // Determine labels
    const labels = ['feedback'];
    if (type === 'Битый плейграунд') labels.push('bug', 'playground');
    else if (type === 'Опечатка') labels.push('documentation');
    else if (type === 'Неясное объяснение') labels.push('enhancement', 'content');

    // Create GitHub issue
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `[Feedback] ${type || 'Проблема'} - ${url?.split('/').pop() || 'Урок'}`,
          body: issueBody,
          labels,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('GitHub API error:', error);
      return NextResponse.json(
        { error: 'Не удалось создать issue на GitHub' },
        { status: 500 }
      );
    }

    const issue = await response.json();

    return NextResponse.json({
      success: true,
      issueUrl: issue.html_url,
      issueNumber: issue.number,
    });
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
