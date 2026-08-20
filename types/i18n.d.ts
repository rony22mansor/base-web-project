import { routing } from '../src/core/i18n/routing';
import messages from '../src/shared/messages/en.json';
 
declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}