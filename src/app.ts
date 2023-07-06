/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import './env';

import { handleFunctions } from 'libraries/handler.lib';
import cron from 'node-cron';
import { Logger } from 'utils/logger.util';

cron.schedule("00 1 * * *",  () => {
    handleFunctions().catch(err =>  Logger.error("Handler Error: %o", {err}));
  });   