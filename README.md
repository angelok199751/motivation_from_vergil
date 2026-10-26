# Какой Вергилий ты сегодня?

## Запуск
    npm install
    npm run dev          # сайт для проверки
    npm run build        # сборка в dist/

## Замена контента
Всё в `src/data/memes.ts`: путь к картинке, подпись, путь к музыке карточки.
Картинки и музыку кладёшь в `public/assets/memes/` и `public/assets/audio/`.
Мелодия стартового экрана — константа `START_AUDIO` в том же файле.
Сейчас стоят заглушки (SVG «Место для мема N») и пустые пути к музыке (звука нет).

## APK (нужны Android Studio и JDK 17)
    npm run build
    npx cap add android      # один раз
    npm run android:sync
    npx cap open android     # Build > Build APK(s)
# motivation_from_vergil
