/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import './env';

import { handleFunctions } from 'libraries/handler.lib';
import cron from 'node-cron';

cron.schedule("59 23 * * *",  () => {
    handleFunctions();
  });   