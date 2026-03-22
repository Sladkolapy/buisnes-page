# Настройка окружения — beauty-platform

## Состояние PostgreSQL (локально в WSL)

PostgreSQL **16** установлен и запущен на `localhost:5432`.

Существующие базы данных:

| Имя                | Владелец | Когда создана       |
|--------------------|----------|---------------------|
| `business_platform`| `bpuser` | ранее (другой проект)|
| `postgres`         | `postgres`| системная           |
| `beauty_platform`  | —        | **ещё не создана**  |

Существующие роли PostgreSQL:

| Роль       | Права                |
|------------|----------------------|
| `bpuser`   | суперпользователь    |
| `postgres` | суперпользователь    |

---

## Шаг 1 — Создать БД `beauty_platform`

```bash
sudo -u postgres psql -c "CREATE DATABASE beauty_platform OWNER bpuser;"
```

Или можно использовать уже существующую `business_platform`, если проекты одни — тогда просто укажи её в `DATABASE_URL`.

---

## Шаг 2 — Создать файл `.env`

Создай файл `.env` в корне `beauty-platform/` (рядом с `package.json`):

```env
# Подключение к БД
DATABASE_URL="postgresql://bpuser:ТВОЙ_ПАРОЛЬ@localhost:5432/beauty_platform"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="сюда_вставь_случайную_строку_минимум_32_символа"

# Google OAuth (можно оставить пустым, если не используешь)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Seed: email администратора
ADMIN_EMAIL="admin@beauty-platform.com"
```

### Как узнать пароль bpuser

```bash
sudo -u postgres psql -c "ALTER USER bpuser WITH PASSWORD 'новый_пароль';"
```

### Как сгенерировать NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

---

## Шаг 3 — Установить недостающие зависимости

`tsx` нужен для запуска `prisma/seed.ts` (TypeScript-скрипт):

```bash
npm install --save-dev tsx dotenv
```

После установки добавь в `package.json` в секцию `"scripts"`:

```json
"db:migrate": "prisma migrate dev",
"db:seed": "tsx prisma/seed.ts",
"db:reset": "prisma migrate reset"
```

И добавь секцию `"prisma"` в `package.json` для автозапуска сида:

```json
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```

---

## Шаг 4 — Запустить миграцию и сид

Все команды выполнять через WSL:

```bash
# Войти в WSL
wsl -d Ubuntu-24.04

# Перейти в проект
cd /home/ubuntu/prob/buisnes-page/beauty-platform

# Применить миграцию (создаст таблицы в БД)
npx prisma migrate dev --name init

# Заполнить тестовыми данными
npx tsx prisma/seed.ts
```

---

## Что сейчас не хватает (чек-лист)

- [ ] Создать БД `beauty_platform` (см. шаг 1)
- [ ] Создать `.env` с правильными значениями (см. шаг 2)
- [ ] Установить `tsx` и `dotenv` (см. шаг 3)
- [ ] Добавить скрипты в `package.json` (см. шаг 3)
- [ ] Запустить `prisma migrate dev --name init` (см. шаг 4)
- [ ] Запустить `tsx prisma/seed.ts` (см. шаг 4)

---

## Справка по структуре проекта

```
beauty-platform/
├── core/                          # Доменная логика (без фреймворков)
│   ├── entities/user.ts           # User entity: UserRole, UserStatus
│   ├── ports/repositories.ts      # Интерфейс UserRepository
│   └── shared/
│       ├── errors.ts              # BusinessRuleException и др.
│       └── value-objects.ts       # Email, Phone, UserId
│
├── adapters/
│   └── repositories/
│       ├── prismaClient.ts        # Singleton PrismaClient
│       ├── index.ts               # Реэкспорт
│       └── prisma/
│           └── user-repository.ts # PrismaUserRepository implements UserRepository
│
├── prisma/
│   ├── schema.prisma              # Схема БД (User, Account, Session, VerificationToken)
│   ├── seed.ts                    # Тестовые данные (нужен tsx + ADMIN_EMAIL в .env)
│   └── migrations/                # Генерируется автоматически
│
├── prisma.config.ts               # Prisma 7: DATABASE_URL берётся отсюда
├── .env                           # Переменные окружения (в .gitignore)
└── .env.example                   # Шаблон .env
```

---

## Важное про Prisma 7

В Prisma 7 **`url` убран из `schema.prisma`**. URL подключения живёт только в:

- **`prisma.config.ts`** — берёт `process.env.DATABASE_URL`
- **`.env`** — сам файл переменных

Если `DATABASE_URL` выглядит как `prisma+postgres://...` — это облачный Prisma Postgres, не локальный.
Для локальной разработки формат должен быть `postgresql://...`.
