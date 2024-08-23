import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: 'https://4354529da90d55fc97a00d074008cca6@o4507809827258368.ingest.us.sentry.io/4507809835646976',
  enableInExpoDevelopment: true,
  debug: __DEV__,
});

export default Sentry;