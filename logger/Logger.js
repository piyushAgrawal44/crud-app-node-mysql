import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf } = format;

const myFormat = printf(({ message, timestamp }) => {
  return `${message} --> ${timestamp}`;
});

export const AppLogger = () => {
  return createLogger({
    level: 'info',
    format: combine(
      timestamp({
        format: () => {
          const date = new Date().toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour12: false,
          });
          return date;
        },
      }),
      myFormat
    ),
    transports: [
      new transports.File({ filename: 'app.log' }),
    ],
  });
};
