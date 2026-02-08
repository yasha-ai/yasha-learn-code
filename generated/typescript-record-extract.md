## TypeScript: Броня. Урок 32: Record и Extract

`Record` и `Extract` - это мощные встроенные utility types для создания объектных типов и извлечения подтипов из union. Они особенно полезны при работе с динамическими ключами, маппингами и discriminated unions.

### Record<K, T>

`Record<K, T>` создаёт объектный тип с ключами типа `K` и значениями типа `T`:

```typescript
// Определение Record (встроенное)
type Record<K extends keyof any, T> = {
  [P in K]: T;
};

// Простой пример
type UserRoles = Record<string, boolean>;

const roles: UserRoles = {
  admin: true,
  moderator: false,
  user: true,
};

// С конкретными ключами
type HttpStatusCodes = Record<200 | 404 | 500, string>;

const statusMessages: HttpStatusCodes = {
  200: 'OK',
  404: 'Not Found',
  500: 'Internal Server Error',
};

// С enum ключами
enum Permission {
  Read = 'read',
  Write = 'write',
  Delete = 'delete',
}

type PermissionMap = Record<Permission, boolean>;

const userPermissions: PermissionMap = {
  [Permission.Read]: true,
  [Permission.Write]: true,
  [Permission.Delete]: false,
};
```

### Record vs Interface

```typescript
// Record - для динамических ключей
type DynamicConfig = Record<string, number | string | boolean>;

const config: DynamicConfig = {
  port: 3000,
  host: 'localhost',
  ssl: true,
  timeout: 5000,
};

// Interface - для известных ключей
interface StaticConfig {
  port: number;
  host: string;
  ssl: boolean;
}

const staticConfig: StaticConfig = {
  port: 3000,
  host: 'localhost',
  ssl: true,
};

// Когда использовать Record:
// - Ключи известны заранее и их немного (union)
// - Все значения одного типа или union типов
// - Нужна краткость

// Когда использовать interface:
// - Ключи известны и их много
// - Разные типы для разных ключей
// - Нужна расширяемость
```

### Практический пример: Translations

```typescript
// Type-safe система переводов
type Locale = 'en' | 'ru' | 'es' | 'fr';

type TranslationKeys =
  | 'common.welcome'
  | 'common.goodbye'
  | 'errors.notFound'
  | 'errors.unauthorized'
  | 'forms.submit'
  | 'forms.cancel';

type Translations = Record<TranslationKeys, string>;

// Словарь для каждой локали
type LocaleTranslations = Record<Locale, Translations>;

const translations: LocaleTranslations = {
  en: {
    'common.welcome': 'Welcome',
    'common.goodbye': 'Goodbye',
    'errors.notFound': 'Not found',
    'errors.unauthorized': 'Unauthorized',
    'forms.submit': 'Submit',
    'forms.cancel': 'Cancel',
  },
  ru: {
    'common.welcome': 'Добро пожаловать',
    'common.goodbye': 'До свидания',
    'errors.notFound': 'Не найдено',
    'errors.unauthorized': 'Не авторизован',
    'forms.submit': 'Отправить',
    'forms.cancel': 'Отмена',
  },
  es: {
    'common.welcome': 'Bienvenido',
    'common.goodbye': 'Adiós',
    'errors.notFound': 'No encontrado',
    'errors.unauthorized': 'No autorizado',
    'forms.submit': 'Enviar',
    'forms.cancel': 'Cancelar',
  },
  fr: {
    'common.welcome': 'Bienvenue',
    'common.goodbye': 'Au revoir',
    'errors.notFound': 'Pas trouvé',
    'errors.unauthorized': 'Non autorisé',
    'forms.submit': 'Soumettre',
    'forms.cancel': 'Annuler',
  },
};

// Type-safe функция перевода
function t(locale: Locale, key: TranslationKeys): string {
  return translations[locale][key];
}

console.log(t('en', 'common.welcome')); // "Welcome"
console.log(t('ru', 'errors.notFound')); // "Не найдено"
```

### Extract<T, U>

`Extract<T, U>` извлекает из union `T` только те типы, которые присваиваемы к `U`:

```typescript
// Определение Extract (встроенное)
type Extract<T, U> = T extends U ? T : never;

// С примитивами
type Mixed = string | number | boolean | null;

type StringOrNumber = Extract<Mixed, string | number>;
// string | number

type OnlyString = Extract<Mixed, string>;
// string

// С литералами
type Status = 'pending' | 'approved' | 'rejected' | 'cancelled';

type ActiveStatuses = Extract<Status, 'pending' | 'approved'>;
// 'pending' | 'approved'

// С discriminated unions
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; size: number }
  | { kind: 'rectangle'; width: number; height: number };

// Извлекаем только circle
type CircleShape = Extract<Shape, { kind: 'circle' }>;
// { kind: 'circle'; radius: number }

// Извлекаем shapes с полем 'size'
type ShapesWithSize = Extract<Shape, { size: number }>;
// { kind: 'square'; size: number }
```

### Record + Extract Pattern

```typescript
// Комбинирование Record и Extract для type-safe state management

// Определение всех возможных действий
type Action =
  | { type: 'USER_LOGIN'; payload: { userId: string; token: string } }
  | { type: 'USER_LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string };

// Извлекаем типы действий
type ActionType = Action['type'];
// 'USER_LOGIN' | 'USER_LOGOUT' | 'SET_LOADING' | 'SET_ERROR'

// Создаём Record для handlers
type ActionHandlers<S> = Record<
  ActionType,
  (state: S, action: Extract<Action, { type: ActionType }>) => S
>;

// Но правильнее - для каждого типа свой handler
type ActionHandler<S, T extends ActionType> = (
  state: S,
  action: Extract<Action, { type: T }>
) => S;

interface AppState {
  userId: string | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Type-safe handlers
const handlers: {
  [K in ActionType]: ActionHandler<AppState, K>;
} = {
  USER_LOGIN: (state, action) => ({
    ...state,
    userId: action.payload.userId,
    token: action.payload.token,
  }),
  
  USER_LOGOUT: (state, action) => ({
    ...state,
    userId: null,
    token: null,
  }),
  
  SET_LOADING: (state, action) => ({
    ...state,
    loading: action.payload,
  }),
  
  SET_ERROR: (state, action) => ({
    ...state,
    error: action.payload,
  }),
};

// Reducer
function reducer(state: AppState, action: Action): AppState {
  const handler = handlers[action.type];
  return handler(state, action as any);
}
```

### Жизненный пример: Router Configuration

```typescript
// Type-safe роутер с Record и Extract
type RouteParams = Record<string, string | number>;

interface RouteConfig<P extends RouteParams = {}> {
  path: string;
  component: string;
  params: P;
  meta?: {
    requiresAuth?: boolean;
    roles?: string[];
  };
}

// Определение всех роутов
type AppRoutes = {
  home: RouteConfig;
  userProfile: RouteConfig<{ userId: string }>;
  userPosts: RouteConfig<{ userId: string; page: number }>;
  postDetail: RouteConfig<{ postId: string }>;
  settings: RouteConfig;
};

// Извлекаем роуты с параметрами
type RoutesWithParams = {
  [K in keyof AppRoutes]: AppRoutes[K] extends RouteConfig<infer P>
    ? P extends {}
      ? keyof P extends never
        ? never
        : K
      : never
    : never;
}[keyof AppRoutes];
// 'userProfile' | 'userPosts' | 'postDetail'

// Конфигурация роутов
const routes: AppRoutes = {
  home: {
    path: '/',
    component: 'HomePage',
    params: {},
  },
  userProfile: {
    path: '/users/:userId',
    component: 'UserProfilePage',
    params: { userId: '' },
    meta: { requiresAuth: true },
  },
  userPosts: {
    path: '/users/:userId/posts',
    component: 'UserPostsPage',
    params: { userId: '', page: 1 },
  },
  postDetail: {
    path: '/posts/:postId',
    component: 'PostDetailPage',
    params: { postId: '' },
  },
  settings: {
    path: '/settings',
    component: 'SettingsPage',
    params: {},
    meta: { requiresAuth: true },
  },
};

// Type-safe навигация
function navigate<K extends keyof AppRoutes>(
  route: K,
  params: AppRoutes[K]['params']
): void {
  const config = routes[route];
  let path = config.path;
  
  for (const key in params) {
    path = path.replace(`:${key}`, String(params[key]));
  }
  
  console.log(`Navigating to: ${path}`);
}

// Использование
navigate('userProfile', { userId: '123' }); // ✓
navigate('userPosts', { userId: '123', page: 2 }); // ✓
// navigate('userProfile', { userId: 123 }); // ✗ Ошибка: number не string
// navigate('userProfile', {}); // ✗ Ошибка: отсутствует userId
```

### Record с Nested Types

```typescript
// Вложенные Record типы
type NestedConfig = Record<
  string,
  Record<string, string | number | boolean>
>;

const appConfig: NestedConfig = {
  server: {
    port: 3000,
    host: 'localhost',
    ssl: true,
  },
  database: {
    url: 'postgresql://localhost',
    pool: 10,
    timeout: 5000,
  },
};

// Типизированные вложенные структуры
type ConfigSections = 'server' | 'database' | 'cache';

type ConfigValue = string | number | boolean;

type AppConfig = Record<ConfigSections, Record<string, ConfigValue>>;

const typedConfig: AppConfig = {
  server: {
    port: 3000,
    host: 'localhost',
  },
  database: {
    url: 'postgresql://localhost',
  },
  cache: {
    enabled: true,
    ttl: 3600,
  },
};
```

### Partial Record

```typescript
// Record с опциональными значениями
type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

// Кэш - не все ключи обязательны
type Cache = PartialRecord<string, any>;

const cache: Cache = {
  'user:123': { name: 'Alice' },
  'post:456': { title: 'Hello' },
};

// Можно добавлять новые ключи
cache['comment:789'] = { text: 'Great!' };

// Можно не заполнять все возможные ключи
type Features = 'darkMode' | 'notifications' | 'analytics';

type FeatureFlags = PartialRecord<Features, boolean>;

const flags: FeatureFlags = {
  darkMode: true,
  // notifications и analytics опциональны
};
```

### Advanced Extract Patterns

```typescript
// Извлечение функциональных типов
type MixedTypes = string | number | (() => void) | ((x: number) => string);

type OnlyFunctions = Extract<MixedTypes, Function>;
// (() => void) | ((x: number) => string)

// Извлечение async функций
type AsyncFunctions = Extract<MixedTypes, () => Promise<any>>;

// Извлечение по структуре
type Event =
  | { type: 'click'; x: number; y: number }
  | { type: 'keypress'; key: string }
  | { type: 'scroll'; delta: number }
  | { type: 'resize'; width: number; height: number };

// События с координатами
type EventsWithCoordinates = Extract<Event, { x: number }>;
// { type: 'click'; x: number; y: number }

// События с type начинающимся на 's'
type EventsStartingWithS = Extract<Event, { type: `s${string}` }>;
// { type: 'scroll'; delta: number }
```

### Ключевые моменты

- `Record<K, T>` создаёт объектный тип с ключами `K` и значениями `T`
- Удобен для маппингов, словарей, конфигураций
- `Extract<T, U>` извлекает из union типы, присваиваемые к `U`
- Противоположность `Exclude`
- Комбинируются для создания type-safe state management
- Record идеален для enum-to-value маппингов
- Extract полезен для работы с discriminated unions
- Можно создавать вложенные Record типы
- PartialRecord для опциональных ключей
- Широко используются в роутинге, переводах, конфигурациях
